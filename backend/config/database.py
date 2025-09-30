from os import getenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DB_CONN = getenv('DATABASE_URL', 'postgresql://bloguser:blogpswd@db:5432/blogdb')

engine = create_engine(DB_CONN)

session = sessionmaker(autocommit=False, autoflush=False, bind=engine)

base = declarative_base()

def get_db():
    db = session()
    try:
        yield db
    finally:
        db.close()

""" 
-- Crear base de datos
CREATE DATABASE blogdb;

-- Crear usuario específico
CREATE USER bloguser WITH PASSWORD 'blogpswd';

-- Dar permisos al usuario sobre la base
GRANT ALL PRIVILEGES ON DATABASE blogdb TO bloguser;
 """