# Runflare Production Deploy Guide

Deploy **backend** and **frontend** as separate Runflare services inside one project.

## Architecture

| Domain | Service | Folder |
|--------|---------|--------|
| `https://kamalian.dev` | Next.js frontend | `frontend/` |
| `https://api.kamalian.dev` | Django API + admin | `backend/` |
| internal | PostgreSQL | managed DB |
| internal | Redis | managed DB |

## Runflare panel checklist

- [x] Project created (DE / Hetzner)
- [x] PostgreSQL + Redis + backend + frontend services
- [x] Domain `kamalian.dev` → frontend
- [x] Subdomain `api.kamalian.dev` → backend
- [x] SSL enabled
- [x] Backend disk: `/app/media` (persistent)
- [x] Environment variables configured
- [ ] Initial commands set (see below)
- [ ] Code deployed via CLI

## Initial commands (Runflare panel)

### Backend → دستور اولیه

```bash
python manage.py migrate --noinput && python manage.py collectstatic --noinput && gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 2
```

### Frontend → دستور اولیه

```bash
npm run build && npm run start
```

## Deploy with CLI

Install and login:

```bash
/bin/bash -c "$(curl -fsSL https://get.runflare.com/install.sh)"
runflare login
```

Deploy backend:

```bash
cd backend
runflare deploy
# select project → backend service
```

Deploy frontend:

```bash
cd frontend
runflare deploy
# select project → frontend service
```

Cached redeploy:

```bash
runflare deploy -y
```

## After first deploy

### Create admin user

Runflare panel → backend → Terminal:

```bash
python manage.py createsuperuser
```

Optional sample data (test only):

```bash
python manage.py seed_data
```

### Upload media

Upload avatar and images from Django admin. Files are stored on the persistent disk at `/app/media`.

## Verify

```bash
curl https://api.kamalian.dev/api/v1/health/
curl -I https://kamalian.dev/en
curl -I https://kamalian.dev/fa
```

Open in browser:

- https://kamalian.dev/en
- https://kamalian.dev/fa/about
- https://api.kamalian.dev/admin/

## Logs

```bash
runflare logs -f -y   # after selecting service
```

Or: Runflare panel → مشاهده لاگ

## Backend environment (reference)

| Variable | Example |
|----------|---------|
| `DEBUG` | `0` |
| `DJANGO_SETTINGS_MODULE` | `config.settings.production` |
| `ALLOWED_HOSTS` | `api.kamalian.dev` |
| `POSTGRES_HOST` | `db-django-lgb-service` |
| `POSTGRES_PORT` | `5432` |
| `POSTGRES_DB` | from DB service |
| `POSTGRES_USER` | `postgres` |
| `POSTGRES_PASSWORD` | Secret → DB secret |
| `REDIS_URL` | `redis://:PASSWORD@redis-sqd-service:6379/0` |
| `CORS_ALLOWED_ORIGINS` | `https://kamalian.dev,https://www.kamalian.dev` |
| `FRONTEND_REVALIDATE_URL` | `https://kamalian.dev/api/revalidate` |
| `SECRET_KEY` | Secret |
| `REVALIDATION_SECRET` | Secret (same on frontend) |

## Frontend environment (reference)

| Variable | Example |
|----------|---------|
| `HOST` | `0.0.0.0` |
| `PORT` | `3000` |
| `NEXT_PUBLIC_SITE_URL` | `https://kamalian.dev` |
| `NEXT_PUBLIC_API_URL` | `https://api.kamalian.dev/api/v1` |
| `API_INTERNAL_URL` | `https://api.kamalian.dev/api/v1` |
| `REVALIDATION_SECRET` | same as backend |

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Admin has no CSS | Run `collectstatic` in backend startup command |
| Images 404 | Check `/app/media` disk is attached to backend |
| CORS error | Verify `CORS_ALLOWED_ORIGINS` includes `https://kamalian.dev` |
| CSRF on admin | Add `CSRF_TRUSTED_ORIGINS=https://api.kamalian.dev` |
| Frontend build fails | Check Runflare logs; ensure Node 22 selected |
| DB connection error | Verify `POSTGRES_HOST` matches Networks tab service name |

## Redeploy after code changes

```bash
cd backend && runflare deploy -y
cd ../frontend && runflare deploy -y
```

Or connect GitHub auto-pull in Runflare panel for each service.
