import sys
import os

# Agregar directorios al path para que pueda encontrar los módulos
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.append(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "backend"))

# Importar app desde el módulo principal
from backend.app.main import app

# Función de handler para Vercel
handler = app 