from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# Schema base para Usuario (sin publicaciones)
class UsuarioBase(BaseModel):
    id: int
    nombre_usuario: str
    
    class Config:
        from_attributes = True

# Publicacion Schemas
class PublicacionModel(BaseModel):
    titulo: str
    contenido: str

class PublicacionEdit(BaseModel):
    titulo: Optional[str] = None
    contenido: Optional[str] = None

class PublicacionFilter(PublicacionEdit):
    id: int

class Publicacion(PublicacionModel):
    id: int
    fecha_creacion: datetime
    usuario_id: int
    autor: UsuarioBase

    class Config:
        from_attributes = True

# Usuario Schemas
class UsuarioModel(BaseModel):
    nombre_usuario: str

class UsuarioAuth(UsuarioModel):
    contrasena: str

class Usuario(UsuarioModel):
    id: int
    publicaciones: List[Publicacion] = []

    class Config:
        from_attributes = True