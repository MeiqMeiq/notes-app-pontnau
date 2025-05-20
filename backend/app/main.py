from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from .routers import note_router, tag_router
from .config import settings
from .database import create_tables
import os

# Crear todas las tablas en la base de datos
create_tables()

# Crear aplicación FastAPI simplificada
app = FastAPI(
    title="Notes App API",
    version="0.1.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Temporalmente permitir todos los orígenes para diagnóstico
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir routers
app.include_router(note_router.router)
app.include_router(tag_router.router)

# Ruta de bienvenida
@app.get("/")
async def root(request: Request):
    # Información de diagnóstico
    env_vars = {key: value for key, value in os.environ.items() if not key.startswith("AWS_")}
    return {
        "message": "¡Bienvenido a la API de la App de Notas!",
        "request_url": str(request.url),
        "request_headers": dict(request.headers),
        "cors_origins": settings.CORS_ORIGINS_LIST,
        "environment": env_vars
    } 