# kamalian.dev Portfolio

Personal portfolio for **Morteza Kamalian** — bilingual (EN/FA), built with Django REST Framework, Next.js, PostgreSQL, Redis, and Docker.

## Stack

| Layer | Technology |
|-------|------------|
| Backend | Django 5 + DRF |
| Frontend | Next.js 16 + next-intl |
| Database | PostgreSQL 16 |
| Cache / Queue | Redis + Celery |
| Proxy | Nginx |
| Fonts (EN) | Plus Jakarta Sans |
| Fonts (FA) | Iran Yekan (variable, licensed) |

## Quick Start

### 1. Environment

```bash
cp .env.example .env
```

### 2. Add Persian font

Copy your Iran Yekan variable font file to:

```
frontend/public/fonts/iran-yekan/IranYekanXVF.woff2
```

If your file has a different name, either rename it or update the path in:

```
frontend/src/app/globals.css
```

Until the font file is added, Persian pages fall back to Tahoma.

### 3. Run with Docker

```bash
docker compose up --build
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000/en |
| API | http://localhost:8000/api/v1/health/ |
| Django Admin | http://localhost:8000/admin/ |

Create a superuser:

```bash
docker compose exec api python manage.py createsuperuser
```

Seed sample bilingual content (profile, skills, projects, articles):

```bash
docker compose exec api python manage.py seed_data
```

### 4. Local development (without Docker)

**Backend:**

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
export DJANGO_SETTINGS_MODULE=config.settings.development
# Set POSTGRES_HOST=localhost in .env
python manage.py migrate
python manage.py runserver
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

```
GET  /api/v1/health/
GET  /api/v1/{en|fa}/profile/
GET  /api/v1/{en|fa}/skills/
GET  /api/v1/{en|fa}/projects/
GET  /api/v1/{en|fa}/projects/{slug}/
GET  /api/v1/{en|fa}/articles/
GET  /api/v1/{en|fa}/articles/{slug}/
POST /api/v1/contact/
```

Cached API responses are stored in Redis (`CACHE_TTL`, default 1 hour). Saving content in Django admin invalidates cache and triggers Next.js on-demand revalidation when `FRONTEND_REVALIDATE_URL` and `REVALIDATION_SECRET` are set.

**Docker note:** Next.js fetches the API on the server. Set `API_INTERNAL_URL=http://api:8000/api/v1` for the frontend container; keep `NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1` for the browser.

Cover images uploaded for projects/articles are auto-optimized to JPEG with a generated thumbnail (`cover_image_thumb`).

## Project Structure

```
Portfolio/
├── backend/          # Django + DRF
├── frontend/         # Next.js App Router
├── nginx/            # Reverse proxy config
├── docker-compose.yml
└── .env.example
```

## Roadmap

- [x] Phase 1: MVP pages, i18n, Docker, core models
- [x] Phase 2: Blog + Admin content + SEO metadata
- [x] Phase 3: ISR, Redis cache, image pipeline
- [ ] Phase 4: Production deploy + analytics
- [ ] Phase 5: sitemap.xml, robots.txt, hire-me page

## Domain

Production target: **https://kamalian.dev**
