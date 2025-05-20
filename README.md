# 📝 Notes App - Simple Note Management System

[![Live Demo](https://img.shields.io/badge/web-online-black?logo=vercel)](https://notes-app-pontnau.vercel.app/)
[![FastAPI](https://img.shields.io/badge/docs-FastAPI-white?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Vue.js](https://img.shields.io/badge/docs-Vue.js-blue?logo=vue.js)](https://vuejs.org/)
[![SQLAlchemy](https://img.shields.io/badge/docs-SQLAlchemy-red?logo=python)](https://www.sqlalchemy.org/)

## 📸 Demo

### Active Notes Page
![demo-active-notes](https://i.imgur.com/0UyNxnx.png)

### Archived Notes Page
![demo-archived-notes](https://i.imgur.com/2eU2UuJ.png)

### Creating a New Note
![demo-create-note](https://i.imgur.com/QOE9FBg.png)

### Editing Note with Categories
![demo-edit-note](https://i.imgur.com/yEmLhOI.png)

## Description

Notes App is a complete web application for personal note management. It allows users to create, edit, archive, and delete notes, as well as categorize and filter them. The application is designed with a modular architecture, implementing a REST API backend and a responsive frontend.

> [!TIP]
> This project was built following a clean, modular architecture to ensure easy maintenance and scalability.

---

## Main Features

- **Note Management**: Create, edit, and delete notes
- **Archiving System**: Archive and unarchive notes as needed
- **Categories**: Add multiple categories to each note
- **Filtering**: Filter notes by category
- **Responsive Design**: Works on all devices
- **Modern UI**: Clean and intuitive user interface

---

## Technologies Used

- **Backend**:
  - Python 3.11
  - FastAPI 0.109.1
  - SQLAlchemy 2.0.27
  - Alembic 1.13.1
  - Uvicorn 0.27.0
  - SQLite (Development)
  - PostgreSQL (Production)

- **Frontend**:
  - Vue.js 3
  - Vite
  - Pinia (State Management)
  - Axios (HTTP Client)
  - Node.js v18+

- **Deployment**:
  - Vercel

> [!NOTE]
> This project follows a layered architecture with clear separation of concerns between API controllers, repositories, and database models.

---

## Project Structure

```
notes-app/
│
├── backend/                # FastAPI REST API 
│   ├── alembic/            # Database migrations
│   ├── app/                # Application code
│   │   ├── models/         # Database models
│   │   ├── routers/        # API endpoints
│   │   ├── schemas/        # Pydantic models for validation
│   │   ├── repositories/   # Data access layer
│   │   ├── database.py     # Database connection setup
│   │   ├── config.py       # App configuration
│   │   └── main.py         # Application entry point
│   ├── scripts/            # Utility scripts
│   └── requirements.txt    # Python dependencies
│
├── frontend/               # Vue.js SPA frontend
│   └── app-notas-frontend/
│       ├── src/
│       │   ├── assets/     # Static assets
│       │   ├── components/ # Vue components
│       │   ├── router/     # Vue Router configuration
│       │   ├── stores/     # Pinia stores
│       │   ├── views/      # Page components
│       │   ├── services/   # API service layer
│       │   └── App.vue     # Main application component
│       ├── public/         # Public static assets
│       └── package.json    # Node.js dependencies
│
├── vercel.json             # Vercel deployment configuration
├── run.bat                 # Setup and run script
└── requirements.txt        # Root Python dependencies
```

---

## Installation and Setup

### Prerequisites

- Python 3.11 or higher
- Node.js v18 or higher
- npm (Node.js package manager)

### Setup Steps

1. **Clone the repository**

```bash
git clone <repository-url>
cd notes-app
```

2. **Run the setup script**

- On Windows:
```bash
run.bat
```

- On Linux/macOS:
```bash
chmod +x run.sh
./run.sh
```

This script will:
- Set up Python virtual environment
- Install backend dependencies
- Configure the database
- Run database migrations
- Install frontend dependencies
- Start both backend and frontend servers

3. **Access the application**

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000

### Manual Setup

#### Backend

1. **Set up Python environment**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

2. **Configure database**
```bash
echo "DATABASE_URL=sqlite:///./notes.db" > .env
```

3. **Run migrations**
```bash
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head
```

4. **Start the server**
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

#### Frontend

1. **Install dependencies**
```bash
cd frontend/app-notas-frontend
npm install
```

2. **Start development server**
```bash
npm run dev
```

---

## API Endpoints

The backend provides the following REST API endpoints:

- `GET /api/notes` - Get all active notes
- `GET /api/notes/archived` - Get all archived notes
- `GET /api/notes/{note_id}` - Get a specific note
- `POST /api/notes` - Create a new note
- `PUT /api/notes/{note_id}` - Update a note
- `DELETE /api/notes/{note_id}` - Delete a note
- `PATCH /api/notes/{note_id}/archive` - Archive/unarchive a note
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create a new category

---

## Deployment

The application is deployed on Vercel with the following configuration:

- Backend: Python FastAPI **serverless** functions
- Frontend: Static site deployment
- Database: PostgreSQL (production)

---

## 👨‍💻 Developed by

**Ing. Pontnau, Gonzalo Martín**

💼 [LinkedIn](https://www.linkedin.com/in/gonzalopontnau)
📧 [Email](mailto:gonzalopontnau@gmail.com)
🌐 [Portfolio](https://gonzalopontnau.github.io/)

---

