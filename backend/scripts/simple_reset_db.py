import os
import sys
from pathlib import Path

# Añadir el directorio backend al sys.path para poder importar paquetes
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.database import Base, engine
from app.models.note_model import Note, Tag, note_tag  # Importar los modelos para que se registren

def reset_database():
    """Reinicia la base de datos según los modelos definidos"""
    print("Reiniciando base de datos...")
    
    # Eliminar todas las tablas existentes
    Base.metadata.drop_all(bind=engine)
    
    # Recrear todas las tablas (usando el esquema desde los modelos)
    Base.metadata.create_all(bind=engine)
    
    print("Base de datos reiniciada correctamente.")

if __name__ == "__main__":
    reset_database() 