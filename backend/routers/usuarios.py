from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm

from sqlalchemy.orm import Session
from datetime import timedelta

from config import schemas, models, auth
from config.database import get_db

usuario_router = APIRouter(prefix='/usuario', tags=['Usuario'])

# Registro
@usuario_router.post('/registro', response_model=schemas.Usuario)
def registro(
    usuario_auth: schemas.UsuarioAuth, 
    db: Session = Depends(get_db)
    ):
    """
    Registrar un nuevo usuario
    
    Args:
        \n
        usuario_auth (schemas.UsuarioAuth): Validación de datos para el registro del usuario\n
        db (Session): Sesión a Base de Datos\n
        
    Returns:
        \n
        schemas.Usuario: Usuario creado\n
        
    Raises:
        \n
        HTTPException: 400 → Usuario creado previamente\n
    """
    usuario = db.query(models.Usuario).filter(models.Usuario.nombre_usuario == usuario_auth.nombre_usuario).first()
    
    if usuario:
        raise HTTPException(status_code=400, detail='Usuario Existente | Inicie Sesión o Intente otro nombre')
        
    hash_contrasena = auth.hash_contrasena(usuario_auth.contrasena)
    new_usuario = models.Usuario(
        nombre_usuario = usuario_auth.nombre_usuario,
        contrasena = hash_contrasena
    )
    
    db.add(new_usuario)
    db.commit()
    db.refresh(new_usuario)
    
    return new_usuario

# Inicio de Sesión / Login
@usuario_router.post('/inicio-sesion')
def inicio_sesion(
    form_data: OAuth2PasswordRequestForm = Depends(), 
    db: Session = Depends(get_db)
    ):
    """
    Iniciar sesión y autenticar
    
    Args:
        \n
        form_data (OAuth2PasswordRequestForm): Credenciales de usuario (username, password)\n
        db (Session): Sesión a Base de Datos\n
        
    Returns:
        \n
        dict: Token de acceso y tipo de token\n
        
    Raises:
        \n
        HTTPException: 401 → credenciales son inválidas\n
    """
    usuario = db.query(models.Usuario).filter(models.Usuario.nombre_usuario == form_data.username).first()
    correct_contrasena = auth.verify_contrasena(form_data.password, usuario.contrasena)

    print(usuario.contrasena)

    if not usuario or not correct_contrasena:
        raise HTTPException(status_code=401, detail='Credenciales inválidas user')

    access_token_expires = timedelta(minutes=auth.EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={'sub': usuario.nombre_usuario}, expires_delta=access_token_expires
    )
    
    return {'access_token': access_token, 'token_type': 'Bearer'}

# Autenticación del usuario
@usuario_router.get('/perfil', response_model=schemas.Usuario)
def obtener_mi_usuario(usuario_actual: models.Usuario = Depends(auth.get_current_usuario)):
    """
    Obtener data del usuario autenticado
    
    Args:
        \n
        usuario_actual (models.Usuario): Usuario autenticado en el momento\n
        
    Returns:
        \n
        schemas.Usuario: Información del usuario autenticado\n
    """
    return usuario_actual
