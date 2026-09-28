# To-Do List Application — Sudeep

A full-stack task manager: **React** frontend, **Django REST Framework** backend, **MySQL** database.

## Features
- User registration, login and logout (token authentication)
- Each user sees and edits only their own tasks
- Add, edit, delete tasks
- Mark tasks complete/incomplete
- Filter by All / Active / Completed
- Search and ordering support on the API (`?search=`, `?ordering=`)

## Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React 18, Axios |
| Backend | Django 5, Django REST Framework |
| Database | MySQL 8 |
| Auth | DRF Token Authentication |
| CORS | django-cors-headers |

## Project Structure
```
Sudeep_TodoApp/
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env.example
│   ├── todo_backend/      # project settings, urls
│   └── tasks/              # app: models, serializers, views, urls
└── frontend/
    ├── package.json
    ├── public/index.html
    └── src/
        ├── App.js
        ├── App.css
        ├── api/axios.js
        └── components/
            ├── AuthForm.js
            ├── TaskForm.js
            ├── TaskItem.js
            └── TaskList.js
```

## Backend Setup (Django + MySQL)

1. **Create a MySQL database**
   ```sql
   CREATE DATABASE todo_db CHARACTER SET utf8mb4;
   ```

2. **Set up a virtual environment and install dependencies**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate      # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # edit .env with your MySQL username/password
   ```

4. **Run migrations and start the server**
   ```bash
   python manage.py migrate
   python manage.py createsuperuser   # optional, for /admin
   python manage.py runserver
   ```
   API is now live at `http://127.0.0.1:8000/api/tasks/`

## Frontend Setup (React)

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Point the frontend at your API** (optional — defaults to `http://127.0.0.1:8000/api`)
   Create `frontend/.env`:
   ```
   REACT_APP_API_URL=http://127.0.0.1:8000/api
   ```

3. **Start the dev server**
   ```bash
   npm start
   ```
   App runs at `http://localhost:3000`

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register/` | Create account, returns token |
| POST | `/api/auth/login/` | Log in, returns token |
| POST | `/api/auth/logout/` | Log out (token required) |
| GET | `/api/tasks/` | List your tasks |
| POST | `/api/tasks/` | Create a task |
| GET | `/api/tasks/{id}/` | Retrieve a task |
| PUT/PATCH | `/api/tasks/{id}/` | Update a task |
| DELETE | `/api/tasks/{id}/` | Delete a task |
| PATCH | `/api/tasks/{id}/toggle/` | Toggle completed status |

All `/api/tasks/` endpoints require the header `Authorization: Token <token>`.

**Task fields:** `id`, `title`, `description`, `completed`, `created_at`, `updated_at`

## Deployment Notes
- Set `DJANGO_DEBUG=False` and a real `DJANGO_SECRET_KEY` in production.
- Add your deployed frontend origin to `CORS_ALLOWED_ORIGINS`.
- Build the frontend for production with `npm run build` and serve the `build/` folder via your web server or Django's static files.

## Author
Sudeep — B.Tech Cybersecurity, JNTUH
