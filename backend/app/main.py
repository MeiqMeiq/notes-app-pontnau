from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import note_router, tag_router
from app.config import settings
from app.database import create_tables

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
    allow_origins=settings.CORS_ORIGINS_LIST,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir routers
app.include_router(note_router.router)
app.include_router(tag_router.router)

# Ruta de bienvenida
@app.get("/")
async def root():
    return {"message": "¡Bienvenido a la API de la App de Notas!"} 