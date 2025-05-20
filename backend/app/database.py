from sqlalchemy import create_engine, inspect
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from .config import settings
import logging

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

try:
    # Crear el engine con un timeout para evitar bloqueos
    engine = create_engine(
        settings.DATABASE_URL, 
        pool_pre_ping=True,
        connect_args={"connect_timeout": 15}
    )
    logger.info(f"Conexión a la base de datos establecida con URL: {settings.DATABASE_URL.split('@')[0]}@...")
except Exception as e:
    logger.error(f"Error al crear el engine de base de datos: {str(e)}")
    # Crear un engine en memoria como fallback para que la aplicación no falle completamente
    engine = create_engine("sqlite:///:memory:")
    logger.warning("Usando base de datos SQLite en memoria como fallback")

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
    try:
        inspector = inspect(engine)
        # Solamente creamos tablas si no existen
        if not inspector.has_table('notes') and not inspector.has_table('tags'):
            Base.metadata.create_all(bind=engine)
            logger.info("Tablas creadas exitosamente en la base de datos")
        else:
            logger.info("Las tablas ya existen en la base de datos, omitiendo creación")
    except Exception as e:
        logger.error(f"Error al crear tablas en la base de datos: {str(e)}")