"""
Este script ayuda a configurar la base de datos SQLite.
Ejecutar con: python scripts/setup_db.py
"""
import os
import subprocess
import sys
from pathlib import Path

# Agregar el directorio raíz al path de Python
ROOT_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT_DIR))

def create_database():
    # Para SQLite, solo necesitamos configurar la ruta del archivo
    db_path = os.path.join(ROOT_DIR, "notes.db")
    db_url = f"sqlite:///{db_path}"
    
    print(f"Configurando base de datos SQLite en: {db_path}")
    
    # Actualizar archivo .env
    update_env_file(db_url)
    return True

def update_env_file(db_url):
    # Buscar archivo .env
    env_path = os.path.join(ROOT_DIR, ".env")
    
    if os.path.exists(env_path):
        with open(env_path, 'r') as file:
            lines = file.readlines()
        
        updated = False
        for i, line in enumerate(lines):
            if line.startswith("DATABASE_URL="):
                lines[i] = f"DATABASE_URL={db_url}\n"
                updated = True
                break
        
        if not updated:
            lines.append(f"DATABASE_URL={db_url}\n")
        
        with open(env_path, 'w') as file:
            file.writelines(lines)
        
        print(f"Archivo .env actualizado con la URL de la base de datos SQLite.")
    else:
        # Crear el archivo .env si no existe
        with open(env_path, 'w') as file:
            file.write(f"DATABASE_URL={db_url}\n")
        print(f"Archivo .env creado con la URL de la base de datos SQLite.")

def setup_database():
    print("Iniciando configuración de la base de datos...")
    
    # Ejecutar las migraciones de Alembic
    print("Aplicando migraciones...")
    
    try:
        # Ir al directorio del backend
        os.chdir(ROOT_DIR)
        
        # Crear una revisión inicial si no existe
        try:
            subprocess.run(['alembic', 'revision', '--autogenerate', '-m', 'Initial migration'], check=True)
            print("Revisión inicial creada.")
        except subprocess.CalledProcessError:
            print("Revisión inicial ya existe o hubo un error al crearla.")
        
        # Aplicar las migraciones
        subprocess.run(['alembic', 'upgrade', 'head'], check=True)
        
        print("Migraciones aplicadas correctamente.")
    except subprocess.CalledProcessError as e:
        print(f"Error al aplicar migraciones: {e}")
        return False
    
    print("Base de datos configurada exitosamente.")
    return True

if __name__ == "__main__":
    print("=== Configuración de la base de datos SQLite ===")
    print("Este script configurará una base de datos SQLite para la aplicación.")
    
    if create_database():
        print("\n¡Configuración completada con éxito!")
        setup_database()
    else:
        print("\nLa configuración falló. Revisa los errores anteriores.")
        sys.exit(1) 