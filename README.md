# 🎮 GameVault - Video Game Management API & Frontend

A full-stack web application with a RESTful Flask backend API, SQLite database, and a responsive frontend interface.

---

## 📁 Repository Structure

games-api/
├── app.py              # Flask REST API backend routes
├── database.py         # SQLite database schema and connection initialization
├── games.db            # SQLite database file
├── update_db.py        # Helper script to populate sample data
└── frontend/
    ├── index.html      # User interface layout & modal overlays
    ├── styles.css      # Dark-mode styling and animations
    └── app.js          # REST API integrations (GET, POST, PUT, DELETE)

---

## 🛠️ REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/games` | Fetch list of all games |
| `GET` | `/games/<id>` | Fetch single game details by ID |
| `POST` | `/games` | Create a new game entry |
| `PUT` | `/games/<id>` | Update an existing game entry |
| `DELETE` | `/games/<id>` | Remove a game from database |

---

## 🚀 How to Run Locally

### 1. Start the Flask Backend Server
1. Open PowerShell or Terminal in the root directory (`games-api`).
2. Run the Flask application:
   py app.py
3. The API will start running at `http://127.0.0.1:5000/`.

### 2. Launch the Frontend
1. Open `frontend/index.html` in any web browser (Chrome, Edge, Firefox).
2. Alternatively, serve `index.html` using VS Code Live Server.

---

## 🧪 Features & Functionality
- **List View (`GET /games`)**: Displays all games as dynamic cards with real-time loading state.
- **Detail View (`GET /games/<id>`)**: Click any card to perform a fetch query by ID and display game details.
- **Form Creation (`POST /games`)**: Modal form to add new titles.
- **Form Editing (`PUT /games/<id>`)**: Pre-filled edit modal to update titles and details.
- **Delete (`DELETE /games/<id>`)**: Confirmation popup before removing an entry.
- **Error Handling**: Displays API `400 Bad Request` messages and handles `404 Not Found` gracefully.