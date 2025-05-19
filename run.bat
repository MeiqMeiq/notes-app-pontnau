@echo off
echo === Iniciando App de Notas ===
echo.

REM Verificar si Python está instalado
python --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [X] Python no esta instalado. Por favor, instale Python 3.11 o superior.
    exit /b 1
)

REM Verificar si Node.js está instalado
node --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [X] Node.js no esta instalado. Por favor, instale Node.js v18 o superior.
    exit /b 1
)

echo === Configurando Backend ===
cd backend

REM Configurar entorno virtual si no existe
if not exist venv (
    echo Creando entorno virtual...
    python -m venv venv
)

REM Activar entorno virtual
call venv\Scripts\activate.bat

REM Instalar dependencias
echo Instalando dependencias de Python...
pip install fastapi uvicorn sqlalchemy pydantic pydantic-settings alembic psycopg2-binary python-dotenv

REM Configurar base de datos
if not exist .env (
    echo Creando archivo .env...
    echo DATABASE_URL=postgresql://postgres:postgres@localhost:5432/notes_db > .env
)

REM Limpiar caché de Alembic
echo Limpiando cache de Alembic...
python scripts\clear_alembic_cache.py

REM Reiniciar base de datos
echo Reiniciando base de datos...
python scripts\reset_db.py

REM Iniciar el backend en segundo plano
echo Iniciando el backend...
start cmd /c "venv\Scripts\activate.bat && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"
cd ..

echo === Configurando Frontend ===
cd frontend\app-notas-frontend

REM Instalar dependencias
echo Instalando dependencias de Node.js...
call npm install

REM Asegurarse de tener vite-plugin-vue-devtools
echo Instalando vite-plugin-vue-devtools...
call npm install --save-dev vite-plugin-vue-devtools

REM Iniciar el frontend
echo Iniciando el frontend...
start cmd /c "cd %CD% && npm run dev"
cd ..\..

echo.
echo [OK] Aplicacion iniciada!
echo [+] Backend disponible en: http://localhost:8000
echo [+] Frontend disponible en: http://localhost:5173
echo.
echo Cierre las ventanas de la terminal para detener la aplicacion

echo Presione cualquier tecla para continuar...
pause > nul