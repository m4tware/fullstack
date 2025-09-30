from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config.database import base, engine

from routers.usuarios import usuario_router
from routers.publicaciones import publicacion_router

base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        'http://localhost:5173',
        'http://frontend:5173',
        'http://127.0.0.1:5173'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

@app.get('/',
    summary='Endpoint Raíz',
    description='Retorna URL del WebApp')
def main():
    """
    Endpoint Raíz de la API
    """
    return {'webapp': 'http://localhost:5173'}

app.include_router(usuario_router)
app.include_router(publicacion_router)