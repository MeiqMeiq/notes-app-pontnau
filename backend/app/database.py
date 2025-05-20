from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from .config import settings

engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Función para obtener una sesión de BD (dependency para FastAPI)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Función para crear todas las tablas en la base de datos
def create_tables():
    Base.metadata.create_all(bind=engine)