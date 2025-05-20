import os
from typing import List
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

# Cargar variables de entorno desde el archivo .env
load_dotenv()

class Settings(BaseSettings):
    # Configuración de la base de datos
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:postresql-pass@localhost:5432/postgres-ensolvers")
    
    # Configuración del API
    API_HOST: str = os.getenv("API_HOST", "0.0.0.0")
    API_PORT: int = int(os.getenv("API_PORT", "8000"))
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"
    
    # Secret Key para JWT
    SECRET_KEY: str = os.getenv("SECRET_KEY", "default_secret_key")
    
    # Configuración de CORS
    CORS_ORIGINS_LIST: List[str] = [
        "http://localhost:5173", 
        "http://localhost:8080",
        "https://notes-app-pontnau.vercel.app"
    ]
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Asegurar que la URL de la base de datos use postgresql como dialecto en lugar de postgres
        if self.DATABASE_URL and self.DATABASE_URL.startswith("postgres:"):
            self.DATABASE_URL = self.DATABASE_URL.replace("postgres:", "postgresql:", 1)

# Crear instancia de configuración
settings = Settings() 