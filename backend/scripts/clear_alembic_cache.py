import os
import sys
from pathlib import Path
import shutil

def clear_alembic_cache():
    """Limpia la caché de Alembic eliminando los archivos __pycache__ en las carpetas de alembic"""
    backend_dir = Path(__file__).resolve().parent.parent
    
    # Ruta al directorio alembic
    alembic_dir = backend_dir / "alembic"
    
    # Eliminar __pycache__ en alembic
    alembic_cache = alembic_dir / "__pycache__"
    if alembic_cache.exists():
        print(f"Eliminando {alembic_cache}")
        shutil.rmtree(alembic_cache)
    
    # Eliminar __pycache__ en alembic/versions
    versions_cache = alembic_dir / "versions" / "__pycache__"
    if versions_cache.exists():
        print(f"Eliminando {versions_cache}")
        shutil.rmtree(versions_cache)
    
    print("Cache de Alembic limpiada correctamente")

if __name__ == "__main__":
    clear_alembic_cache() 