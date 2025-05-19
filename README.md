# App de Notas

Una aplicación simple para crear, editar, archivar y eliminar notas.

## Requisitos

### Backend
- Python 3.11
- FastAPI (v0.115.12)
- SQLAlchemy (v2.0.41)
- Alembic (v1.15.2)
- Uvicorn (v0.34.2)
- SQLite

### Frontend
- Vue.js 3
- Node.js v18+
- Axios
- Vite
- Pinia

## Estructura del proyecto

- `/backend`: API REST con FastAPI
- `/frontend`: Aplicación SPA con Vue.js 3

## Instrucciones de uso

### Backend

1. Configurar entorno virtual y dependencias:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install fastapi uvicorn sqlalchemy pydantic pydantic-settings alembic python-dotenv
```

2. Configurar base de datos:
```bash
# Crear archivo .env con la URL de la base de datos
echo "DATABASE_URL=sqlite:///./notes.db" > .env
```

3. Ejecutar migraciones:
```bash
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head
```

4. Iniciar servidor:
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Frontend

1. Instalar dependencias:
```bash
cd frontend/app-notas-frontend
npm install
```

2. Iniciar servidor de desarrollo:
```bash
npm run dev
```

La aplicación estará disponible en http://localhost:5173

