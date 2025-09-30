from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy.orm import Session, joinedload

from config import schemas, models, auth
from config.database import get_db

publicacion_router = APIRouter(prefix='/publicaciones', tags=['Publicacion'])

@publicacion_router.post('/', response_model=schemas.PublicacionModel)
def crear_publicacion(
    publicacion: schemas.PublicacionModel,
    db: Session = Depends(get_db),
    usuario_actual: models.Usuario = Depends(auth.get_current_usuario)
    ):
    """
    Crear una nueva publicación para el usuario autenticado

    Args:
        \n
        publicacion: schemas.PublicacionModel: Validación de datos de la Publicación a crear\n
        db: Session = Depends(get_db): Sesión a la Base de Datos\n
        usuario_actual: models.Usuario = Depends(auth.get_current_usuario): Usario autenticado\n
    
    Returns:
        \n
        schemas.PublicacionModel: Publicación creada\n
    """
    nueva_publicacion = models.Publicacion(
        titulo=publicacion.titulo,
        contenido=publicacion.contenido,
        usuario_id=usuario_actual.id
    )

    db.add(nueva_publicacion)
    db.commit()
    db.refresh(nueva_publicacion)
    
    return nueva_publicacion

@publicacion_router.get('/post', response_model=list[schemas.Publicacion])
def obtener_publicacion(
    id: int,
    db: Session = Depends(get_db)
    ):
    """
    Retorna publicación por ID
    
    Args:
        \n
        id (int): ID de la publicación a obtener\n
        db (Session): Sesión a la Base de Datos\n
        
    Returns:
        \n
        list[schemas.Publicacion]: Publicación encontrada\n
    """
    query = db.query(models.Publicacion)

    if id: query = query.filter(models.Publicacion.id == id)
        
    return query.all()

@publicacion_router.get('/', response_model=list[schemas.Publicacion])
def listar_publicaciones(db: Session = Depends(get_db)):
    """
    Listar todas las publicaciones
    
    Args:
        \n
        db (Session): Sesión a la Base de Datos\n
        
    Returns:
        \n
        list[schemas.Publicacion]: Lista completa de Publicaciones\n
    """
    #publicaciones = db.query(models.Publicacion).options(joinedload(models.Publicacion.autor)).all()
    #return publicaciones
    return db.query(models.Publicacion).all()

@publicacion_router.put('/{publicacion_id}', response_model=schemas.Publicacion)
def editar_publicacion(
    publicacion_id: int,
    publicacion_edit: schemas.PublicacionEdit,
    db: Session = Depends(get_db),
    usuario_actual: models.Usuario = Depends(auth.get_current_usuario)
    ):
    """
    Editar una publicación existente (solo el usuario autor de la misma)

    Args:
        \n
        publicacion_id (int): ID de la publicación a editar\n
        publicacion_edit (schemas.PublicacionEdit): Validación de Datos de la Publicación a editar\n
        db (Session): Sesión de base de datos\n
        usuario_actual (models.Usuario): Usuario autenticado\n
        
    Returns:
        \n
        schemas.Publicacion: Publicación editada\n
        
    Raises:
        \n
        HTTPException: 404 → No existe la Publicación\n
        HTTPException: 403 → El usuario no es autor de la Publicación\n
    """
    publicacion = db.query(models.Publicacion).filter(models.Publicacion.id == publicacion_id).first()
    
    if not publicacion:
        raise HTTPException(status_code=404, detail='Publicación no encontrada')
        
    if publicacion.usuario_id != usuario_actual.id:
        raise HTTPException(status_code=403, detail='No autorizado para editar esta publicación')

    if publicacion_edit.titulo is not None:
        publicacion.titulo = publicacion_edit.titulo
        
    if publicacion_edit.contenido is not None:
        publicacion.contenido = publicacion_edit.contenido

    db.commit()
    db.refresh(publicacion)
    
    return publicacion

@publicacion_router.delete('/{publicacion_id}')
def eliminar_publicacion(
    publicacion_id: int,
    db: Session = Depends(get_db),
    usuario_actual: models.Usuario = Depends(auth.get_current_usuario)
):
    """
    Eliminar una publicación existente (solo el usuario autor de la misma)
    
    Args:
        \n
        publicacion_id (int): ID de la publicación a eliminar\n
        db (Session): Sesión a Base de Datos\n
        usuario_actual (models.Usuario): Usuario autenticado\n
        
    Returns:
        \n
        dict: Mensaje de confirmación\n
        
    Raises:
        \n
        HTTPException: 404 → No existe la Publicación\n
        HTTPException: 403 → El usuario no es autor de la Publicación\n
    """
    publicacion = db.query(models.Publicacion).filter(models.Publicacion.id == publicacion_id).first()

    if not publicacion:
        raise HTTPException(status_code=404, detail='Publicación no encontrada')
        
    if publicacion.usuario_id != usuario_actual.id:
        raise HTTPException(status_code=403, detail='No autorizado para eliminar esta publicación')

    db.delete(publicacion)
    db.commit()
    
    return {'msg': 'Publicación eliminada exitosamente'}