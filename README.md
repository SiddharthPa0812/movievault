# MovieVault – My Entertainment Archive

MovieVault is a dark, glassmorphism entertainment tracker built with React and Django REST Framework. It supports movie and anime tracking, search, filters, favorites, watchlist management, responsive dashboard views, and poster uploads.

## Project Structure

- `backend/` Django REST API, media handling, SQLite/PostgreSQL configuration
- `frontend/` React + Vite application with responsive dashboard UI

## Backend Setup

1. Create a virtual environment and install `backend/requirements.txt`.
2. Copy `backend/.env.example` to `.env` or export the same environment variables.
3. Run migrations:

```bash
python manage.py migrate
```

4. Start the API server from `backend/`:

```bash
python manage.py runserver
```

## Frontend Setup

1. Install dependencies in `frontend/`.
2. Add a `.env` file with:

```bash
VITE_API_BASE_URL=http://127.0.0.1:8000/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

3. Start the frontend:

```bash
npm run dev
```

## Key API Endpoints

- `GET /api/entries/`
- `POST /api/entries/`
- `GET /api/entries/:id/`
- `PATCH /api/entries/:id/`
- `DELETE /api/entries/:id/`
- `GET /api/entries/dashboard/`
- `GET /api/entries/categories/`

## Production Notes

- SQLite is used by default for development.
- Set `DATABASE_URL` to a PostgreSQL connection string in production.
- Configure `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`, and a strong `SECRET_KEY`.
- For Google login, create a Web OAuth client in Google Cloud and add your local origin such as `http://localhost:5173`.
- Serve `frontend/dist` through your preferred static hosting or reverse proxy.
