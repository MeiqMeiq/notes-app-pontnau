"""
Este script ayuda a configurar la base de datos PostgreSQL.
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
    # Valores por defecto
    db_name = input("Nombre de la base de datos (default: notes_app_db): ") or "notes_app_db"
    db_user = input("Usuario de PostgreSQL (default: notes_user): ") or "notes_user"
    db_password = input("Contraseña (default: notes_password): ") or "notes_password"
    db_host = input("Host (default: localhost): ") or "localhost"
    db_port = input("Puerto (default: 5432): ") or "5432"
    
    # Comandos SQL para ejecutar
    create_user_sql = f"CREATE USER {db_user} WITH PASSWORD '{db_password}';"
    create_db_sql = f"CREATE DATABASE {db_name} OWNER {db_user};"
    
    print("\nEjecutando los siguientes comandos SQL en PostgreSQL:")
    print(f"1. {create_user_sql}")
    print(f"2. {create_db_sql}")
    
    confirm = input("\n¿Continuar? (s/n): ")
    if confirm.lower() != 's':
        print("Operación cancelada.")
        return False
    
    try:
        # Crear usuario (podría fallar si ya existe)
        try:
            subprocess.run(["psql", "-h", db_host, "-p", db_port, "-U", "postgres", "-c", create_user_sql], 
                          check=True, capture_output=True)
            print(f"Usuario {db_user} creado con éxito.")
        except subprocess.CalledProcessError:
            print(f"Nota: No se pudo crear el usuario {db_user}. Podría ya existir o necesitas privilegios.")
        
        # Crear base de datos
        try:
            subprocess.run(["psql", "-h", db_host, "-p", db_port, "-U", "postgres", "-c", create_db_sql], 
                          check=True, capture_output=True)
            print(f"Base de datos {db_name} creada con éxito.")
        except subprocess.CalledProcessError as e:
            print(f"Error al crear la base de datos: {e}")
            return False
        
        # Actualizar archivo .env
        db_url = f"postgresql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"
        update_env_file(db_url)
        
        return True
    
    except Exception as e:
        print(f"Error: {e}")
        return False

def update_env_file(db_url):
    # Buscar archivo .env
    env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env")
    
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
        
        print(f"Archivo .env actualizado con la nueva URL de la base de datos.")
    else:
        print(f"No se encontró el archivo .env. Por favor, crea un archivo .env y añade: DATABASE_URL={db_url}")

def setup_database():
    print("Iniciando configuración de la base de datos...")
    
    # Ejecutar las migraciones de Alembic
    print("Aplicando migraciones...")
    
    try:
        # Crear una revisión inicial
        subprocess.run(['alembic', 'revision', '--autogenerate', '-m', 'Initial migration'], check=True)
        
        # Aplicar las migraciones
        subprocess.run(['alembic', 'upgrade', 'head'], check=True)
        
        print("Migraciones aplicadas correctamente.")
    except subprocess.CalledProcessError as e:
        print(f"Error al aplicar migraciones: {e}")
        return False
    
    print("Base de datos configurada exitosamente.")
    return True

if __name__ == "__main__":
    print("=== Configuración de la base de datos PostgreSQL ===")
    print("Asegúrate de tener PostgreSQL instalado y el usuario 'postgres' disponible.")
    print("Este script intentará crear un usuario y base de datos para la aplicación.")
    
    if create_database():
        print("\n¡Configuración completada con éxito!")
        print("Ahora puedes ejecutar las migraciones con:")
        print("  alembic upgrade head")
    else:
        print("\nLa configuración falló. Revisa los errores anteriores.")
        sys.exit(1)

    setup_database() 