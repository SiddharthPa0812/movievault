# MovieVault – My Entertainment Archive

MovieVault is a dark, glassmorphism entertainment tracker built with React and Django REST Framework. It supports movie and anime tracking, search, filters, favorites, watchlist management, responsive dashboard views, poster uploads, and username/password authentication.

## Project Structure

- `backend/` Django REST API, media handling, SQLite/PostgreSQL configuration
- `frontend/` React + Vite application with responsive dashboard UI

## Backend Setup

1. Create a virtual environment and install `backend/requirements.txt`.
2. Copy `backend/.env.example` to `backend/.env`.
3. Run migrations:

```bash
cd backend
python manage.py migrate
```

4. Start the API server:

```bash
python manage.py runserver
```

## Frontend Setup

1. Install dependencies in `frontend/`.
2. Copy `frontend/.env.example` to `frontend/.env`.
3. Start the frontend:

```bash
cd frontend
npm run dev
```

## Authentication

- **Sign up:** unique username, Gmail address, password
- **Sign in:** username + password
- API requests use `Authorization: Token <token>`

### Auth API Endpoints

- `GET /api/auth/check-username/?username=`
- `POST /api/auth/register/`
- `POST /api/auth/login/`
- `GET /api/auth/me/`
- `POST /api/auth/logout/`

## Entry API Endpoints

- `GET /api/entries/`
- `POST /api/entries/`
- `GET /api/entries/:id/`
- `PATCH /api/entries/:id/`
- `DELETE /api/entries/:id/`
- `GET /api/entries/dashboard/`
- `GET /api/entries/categories/`
- `POST /api/entries/bulk-toggle/`

## Production Deployment

### Backend

1. Set environment variables:
   - `DEBUG=False`
   - `SECRET_KEY` (long random string)
   - `ALLOWED_HOSTS` (your API domain)
   - `CORS_ALLOWED_ORIGINS` and `CSRF_TRUSTED_ORIGINS` (your frontend URL)
   - `DATABASE_URL` (PostgreSQL recommended)

2. Run:

```bash
cd backend
python manage.py migrate
python manage.py collectstatic --noinput
gunicorn cinevault.wsgi:application --bind 0.0.0.0:8000
```

3. Health check: `GET /health/`

### Frontend

Build with your production API URL:

```bash
cd frontend
VITE_API_BASE_URL=https://your-api-domain.com/api npm run build
```

Serve `frontend/dist` with any static host (Vercel, Netlify, nginx). Configure SPA fallback to `index.html` for client-side routes.

### Notes

- Each user's entries are private to their account.
- Uploaded posters are stored in `backend/media/` — use persistent storage or a CDN for production.
- SQLite is fine for development; use PostgreSQL in production.
