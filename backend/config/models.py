from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from config.database import base

class Usuario(base):
    __tablename__ = 'usuarios'

    id = Column(
        Integer, 
        primary_key=True, 
        index=True
    )
    
    nombre_usuario = Column(
        String, 
        unique=True, 
        index=True, 
        nullable=False
    )

    contrasena = Column(
        String, 
        nullable=False
    )

    publicaciones = relationship('Publicacion', back_populates='autor')

class Publicacion(base):
    __tablename__ = 'publicaciones'

    id = Column(
        Integer, 
        primary_key=True, 
        index=True
    )

    titulo = Column(
        String, 
        index=True, 
        nullable=False
    )

    contenido = Column(Text, nullable=False)

    fecha_creacion = Column(
        DateTime(timezone=True), 
        server_default=func.now(), 
        nullable=False
    )

    usuario_id = Column(
        Integer, 
        ForeignKey('usuarios.id'), 
        index=True
    )

    autor = relationship('Usuario', back_populates='publicaciones')