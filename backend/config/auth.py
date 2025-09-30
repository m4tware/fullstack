from passlib.context import CryptContext

from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException, status

from datetime import timedelta, datetime 
from jose import jwt, JWTError
from sqlalchemy.orm import Session

from config.models import Usuario
from config.database import get_db

SECRET = 'supersecretkey'
ALGORITHM = 'HS256'
EXPIRE_MINUTES = 5

pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')

oauth2_scheme = OAuth2PasswordBearer(tokenUrl='usuario/inicio-sesion')

def verify_contrasena(contrasena_plana, contrasena_hash):
    return pwd_context.verify(contrasena_plana, contrasena_hash)

def hash_contrasena(contrasena):
    contrasena = contrasena[:72]
    return pwd_context.hash(contrasena)

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=EXPIRE_MINUTES))
    to_encode.update({'exp': expire})
    encoded_jwt = jwt.encode(to_encode, SECRET, algorithm=ALGORITHM)
    
    return encoded_jwt

def get_current_usuario(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail='Error al validar credenciales',
        headers={'WWW-Authenticate': 'Bearer'},
    )
    
    try:
        payload = jwt.decode(token, SECRET, algorithms=[ALGORITHM])
        current_usuario: str = payload.get('sub')
        if current_usuario is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    usuario = db.query(Usuario).filter(Usuario.nombre_usuario == current_usuario).first()
    
    if usuario is None:
        raise credentials_exception
        
    return usuario