import os
import sys
from pathlib import Path
import shutil
import subprocess

# Añadir el directorio backend al sys.path para poder importar paquetes
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.database import Base, engine
import alembic.config

def reset_database():
    """Reinicia la base de datos y aplica las migraciones"""
    print("Reiniciando base de datos...")
    
    # Eliminar todas las tablas existentes
    Base.metadata.drop_all(bind=engine)
    
    # Recrear todas las tablas (usando el esquema desde los modelos)
    Base.metadata.create_all(bind=engine)
    
    print("Base de datos reiniciada correctamente.")
    
    # Eliminar el directorio alembic_version si existe para evitar problemas
    try:
        subprocess.run(["alembic", "stamp", "head"], cwd=str(Path(__file__).resolve().parent.parent))
        print("Version de Alembic actualizada a la última migración.")
    except Exception as e:
        print(f"Error al actualizar version de Alembic: {e}")

if __name__ == "__main__":
    reset_database() 