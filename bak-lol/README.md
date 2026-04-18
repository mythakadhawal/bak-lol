# Bak-Lol 🌿

> A clean, minimal community platform for university hostellers — connect, plan activities, and help each other out.

---

## Project Structure

```
bak-lol/
├── frontend/        React + TypeScript (Vite)
├── backend/         FastAPI
└── schema.sql       PostgreSQL reference schema
```

---

## Quick Start

### Frontend (no backend needed — uses mock data)

```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

Click **"Try demo"** on the login screen to explore without credentials.

---

### Backend

#### 1. Create & activate a virtual environment

```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS / Linux:
source venv/bin/activate
```

#### 2. Install dependencies

```bash
pip install -r requirements.txt
```

#### 3. Configure environment

Create a `.env` file inside `backend/`:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/baklol
SECRET_KEY=replace-with-a-random-secret
DEBUG=true
```

#### 4. Set up the database

```bash
# Create database
psql -U postgres -c "CREATE DATABASE baklol;"

# Run schema
psql -U postgres -d baklol -f ../schema.sql
```

#### 5. Run the API

```bash
uvicorn app.main:app --reload --port 8000
# → http://localhost:8000/docs  (Swagger UI)
```

---

## Connecting Frontend to Backend

The Vite dev server proxies `/api/*` to `http://localhost:8000` automatically.

In `frontend/src/store/authStore.ts`, replace the mock `demoLogin` calls with real API calls using:

```ts
await axios.post('/api/v1/auth/login', { identifier, password });
```

---

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register a new student |
| POST | `/api/v1/auth/login` | Login → returns JWT |
| GET | `/api/v1/students` | List students (filterable) |
| GET | `/api/v1/students/{id}` | Student profile |
| GET | `/api/v1/activities` | List activities |
| POST | `/api/v1/activities` | Create activity |
| POST | `/api/v1/activities/{id}/join` | Join activity |
| DELETE | `/api/v1/activities/{id}/leave` | Leave activity |
| GET | `/api/v1/activities/{id}/messages` | Activity chat |
| POST | `/api/v1/activities/{id}/messages` | Send chat message |
| GET | `/api/v1/help` | List help requests |
| POST | `/api/v1/help` | Post a help request |
| POST | `/api/v1/help/{id}/respond` | Respond to request |
| PATCH | `/api/v1/help/{id}/resolve` | Mark request resolved |
| GET | `/api/v1/posts` | List public posts |
| POST | `/api/v1/posts` | Create a post |

All protected endpoints require `Authorization: Bearer <token>`.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite |
| State | Zustand + TanStack Query |
| Routing | React Router v6 |
| Styling | Vanilla CSS (design tokens) |
| Backend | FastAPI (Python 3.11+) |
| ORM | SQLAlchemy 2.0 |
| Auth | JWT (python-jose) + bcrypt |
| Database | PostgreSQL 15+ |

---

## Design

Earthy color palette — warm, calm, and student-friendly.

| Token | Value |
|-------|-------|
| Background | `#FAF3E0` |
| Cards | `#EDE6DB` |
| Primary | `#8C6C4B` |
| Secondary | `#A8BDAF` |
| Text | `#3B3A36` |
| Font | DM Sans (Google Fonts) |

---

## Roadmap

- [ ] WebSocket real-time chat
- [ ] Push notifications
- [ ] Profile photo upload
- [ ] Activity reminders
- [ ] Admin dashboard
