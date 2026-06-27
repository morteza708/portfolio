# Runflare Deploy Playbook

Reusable guide for deploying **Django (DRF) + Next.js + PostgreSQL + Redis** stacks on [Runflare](https://runflare.com).  
Battle-tested on **kamalian.dev** — use this doc as the single source of truth when starting a new project.

> **How to use with AI:** Share this file + your project folder structure. Mention stack type, domains, and whether you need admin/media. The agent can adapt env vars and startup commands without rediscovering Runflare quirks.

---

## Table of contents

1. [Architecture](#architecture)
2. [Before you start](#before-you-start)
3. [Panel setup (step-by-step)](#panel-setup-step-by-step)
4. [Code requirements (Django + Next.js)](#code-requirements-django--nextjs)
5. [Environment variables](#environment-variables)
6. [Initial commands](#initial-commands)
7. [Deploy with CLI](#deploy-with-cli)
8. [Post-deploy checklist](#post-deploy-checklist)
9. [Verification commands](#verification-commands)
10. [Runflare-specific gotchas](#runflare-specific-gotchas)
11. [Troubleshooting](#troubleshooting)
12. [New project adaptation](#new-project-adaptation)
13. [Maintenance](#maintenance)

---

## Architecture

```text
Browser
   │
   ├─ https://{DOMAIN}          → frontend service (Next.js, port 3000)
   └─ https://{API_DOMAIN}      → backend service  (Django/Gunicorn, port 8000)
                                        │
                         ┌──────────────┼──────────────┐
                         ▼              ▼              ▼
                   PostgreSQL        Redis         disk /app/media
                   (internal)     (internal)      (uploads only)
```

| Public URL | Runflare service | Repo folder | Runtime |
|------------|------------------|-------------|---------|
| `https://{DOMAIN}` | `frontend` | `frontend/` | Node 22 |
| `https://{API_DOMAIN}` | `backend` | `backend/` | Python 3.12 |
| — | `db-django` (or similar) | — | PostgreSQL 16 |
| — | `redis` | — | Redis 7 |

**Example (this project):**

| Placeholder | Value |
|-------------|-------|
| `{DOMAIN}` | `kamalian.dev` |
| `{API_DOMAIN}` | `api.kamalian.dev` |

---

## Before you start

### DNS (at your registrar)

| Record | Type | Value |
|--------|------|-------|
| `@` | A | Runflare IP (from panel) |
| `www` | CNAME or redirect | → `{DOMAIN}` (301, prefer non-www) |
| `api` | A or CNAME | Same Runflare IP / target |

Wait for global DNS propagation before enabling SSL.

### Secrets to generate locally (never commit)

```bash
python3 -c "import secrets; print(secrets.token_urlsafe(50))"   # SECRET_KEY
python3 -c "import secrets; print(secrets.token_urlsafe(32))"   # REVALIDATION_SECRET
```

### Recommended plan (medium portfolio)

| Service | RAM | CPU | Notes |
|---------|-----|-----|-------|
| frontend | 2 GB | 0.6 GHz | `npm run build` is memory-heavy |
| backend | 1.5 GB | 0.5 GHz | Gunicorn 2 workers |
| PostgreSQL | 1 GB | 0.5 GHz | |
| Redis | 512 MB | 0.2 GHz | API cache + optional Celery |

Adjust per traffic. Location: **DE (Hetzner)** worked well from Iran.

---

## Panel setup (step-by-step)

Follow this order to avoid common mistakes.

### 1. Create project

- Name: e.g. `portfoliotest`
- Region: DE / Hetzner (or nearest)

### 2. Add PostgreSQL service

- Version: 16.x
- Note the **internal hostname** from **Networks** tab  
  Example: `db-django-lgb-service:5432`
- Link deploy secret: `db-django-*-deploy-secret`

### 3. Add Redis service

- Version: 7.x
- Copy **full `REDIS_URL`** from Secret / Connection tab  
  Format: `redis://:PASSWORD@redis-sqd-service:6379/0`  
  ⚠️ Colon before password, **no username**
- Link deploy secret: `redis-*-deploy-secret`

### 4. Add backend service

| Setting | Value |
|---------|-------|
| Source folder | `backend/` |
| Python version | 3.12 |
| Port | 8000 |
| Domain | `{API_DOMAIN}` |
| SSL | Enable |

**Disk (required for uploads):**

| Mount path | Size | Purpose |
|------------|------|---------|
| `/app/media` | 2–5 GB | User uploads (avatar, covers, CKEditor) |

> **Do NOT** create a disk for static files. Static is baked via `collectstatic` + served from the container.

**Link secrets:** PostgreSQL + Redis deploy secrets.

**Set env vars:** see [Backend environment](#backend-environment).

**Set initial command:** see [Initial commands](#initial-commands).

### 5. Add frontend service

| Setting | Value |
|---------|-------|
| Source folder | `frontend/` |
| Node version | 22 |
| Port | 3000 |
| Domain | `{DOMAIN}` |
| SSL | Enable |

**No disk needed** for standard Next.js standalone/build output.

**Set env vars:** see [Frontend environment](#frontend-environment).

**Set initial command:** see [Initial commands](#initial-commands).

### 6. SSL for API subdomain

- If browser shows SSL warning and issuer is `cert-manager.local` (not Let's Encrypt):
  1. backend → Domains → remove `{API_DOMAIN}`
  2. Re-add domain + enable SSL
  3. Wait 5–15 minutes
  4. If still broken → **Runflare support ticket** (worked for kamalian.dev)

Verify:

```bash
echo | openssl s_client -connect {API_DOMAIN}:443 -servername {API_DOMAIN} 2>/dev/null \
  | openssl x509 -noout -issuer
# Expected: issuer contains "Let's Encrypt"
```

### 7. www redirect

In panel: `www.{DOMAIN}` → 301 redirect to `{DOMAIN}` (non-www).

---

## Code requirements (Django + Next.js)

These are **mandatory** for Runflare — not optional optimizations.

### Runflare blocks `/static/` and `/media/` at nginx

Requests to those paths never reach Django. This project works around it:

| Default Django path | Runflare-safe path | Notes |
|--------------------|--------------------|-------|
| `/static/` | `/django-static/` | `STATIC_URL` in settings |
| `/media/` | `/django-media/` | `MEDIA_URL` in settings |

**Backend (`config/settings/base.py`):**

```python
STATIC_URL = "/django-static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
MEDIA_URL = "/django-media/"
MEDIA_ROOT = BASE_DIR / "media"
```

**Backend (`config/urls.py`)** — explicit `serve()` in production for both prefixes (WhiteNoise alone is not enough on Runflare).

**Frontend (`next.config.ts`)** — proxy public `/media/*` to API `/django-media/*`:

```typescript
{
  source: "/media/:path*",
  destination: `${apiOrigin}/django-media/:path*`,
}
```

**API serializers** — return `/media/...` to the browser (frontend proxy handles the rest).

### `SECURE_SSL_REDIRECT` must stay OFF

Runflare terminates TLS at the edge. If Django forces HTTPS without a trusted `X-Forwarded-Proto`, you get **infinite 301 loops** on every API/admin URL.

```python
# config/settings/production.py
SECURE_SSL_REDIRECT = os.environ.get("SECURE_SSL_REDIRECT", "0") == "1"
# Leave env unset in Runflare
```

### Production stack checklist

| Item | backend | frontend |
|------|---------|----------|
| `DEBUG=0` / production settings | ✓ | N/A |
| `collectstatic` in startup + Dockerfile | ✓ | — |
| WhiteNoise middleware | ✓ | — |
| Gunicorn (not `runserver`) | ✓ | — |
| `npm run build && npm run start` | — | ✓ |
| CORS + CSRF origins | ✓ | — |
| Redis URL from panel secret | ✓ | — |

---

## Environment variables

Replace placeholders for your project.

### Backend environment

| Variable | Example | Notes |
|----------|---------|-------|
| `DEBUG` | `0` | |
| `DJANGO_SETTINGS_MODULE` | `config.settings.production` | |
| `ALLOWED_HOSTS` | `{API_DOMAIN}` | Comma-separated if multiple |
| `SECRET_KEY` | *(generated)* | Runflare Secret |
| `POSTGRES_HOST` | `db-django-lgb-service` | From Networks tab |
| `POSTGRES_PORT` | `5432` | |
| `POSTGRES_DB` | from DB service | |
| `POSTGRES_USER` | `postgres` | |
| `POSTGRES_PASSWORD` | Secret | Link DB deploy secret |
| `REDIS_URL` | `redis://:PASS@redis-sqd-service:6379/0` | Copy exact from Redis service |
| `CORS_ALLOWED_ORIGINS` | `https://{DOMAIN},https://www.{DOMAIN}` | |
| `CSRF_TRUSTED_ORIGINS` | `https://{API_DOMAIN}` | Required for admin |
| `CACHE_TTL` | `3600` | |
| `FRONTEND_REVALIDATE_URL` | `https://{DOMAIN}/api/revalidate` | |
| `REVALIDATION_SECRET` | *(generated)* | Same value on frontend |

### Frontend environment

| Variable | Example | Notes |
|----------|---------|-------|
| `HOST` | `0.0.0.0` | |
| `PORT` | `3000` | |
| `NEXT_PUBLIC_SITE_URL` | `https://{DOMAIN}` | |
| `NEXT_PUBLIC_API_URL` | `https://{API_DOMAIN}/api/v1` | Browser + OG |
| `API_INTERNAL_URL` | `https://{API_DOMAIN}/api/v1` | Server-side fetch |
| `REVALIDATION_SECRET` | same as backend | |

---

## Initial commands

Set in Runflare panel → each service → **دستور اولیه**.

### Backend

```bash
python manage.py migrate --noinput && python manage.py collectstatic --noinput && gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 2
```

### Frontend

```bash
npm run build && npm run start
```

> **Never run the full backend startup command inside Runflare Terminal** — Gunicorn is already running on port 8000. Use Terminal only for one-off commands (`createsuperuser`, `seed_data`, etc.).

---

## Deploy with CLI

### Install & login (once per machine)

```bash
/bin/bash -c "$(curl -fsSL https://get.runflare.com/install.sh)"
runflare login
```

### First deploy

```bash
# 1. Backend first (DB migrations)
cd backend
runflare deploy
# Select: project → backend service

# 2. Frontend
cd ../frontend
runflare deploy
# Select: project → frontend service
```

### Redeploy after code changes

```bash
cd backend && runflare deploy -y
cd ../frontend && runflare deploy -y
```

Optional: enable GitHub auto-pull per service in Runflare panel.

---

## Post-deploy checklist

- [ ] `curl https://{API_DOMAIN}/api/v1/health/` → `status: ok`, `database: ok`, `cache: ok`
- [ ] `curl -I https://{API_DOMAIN}/django-static/admin/css/base.css` → **HTTP 200**
- [ ] Admin CSS loads: `https://{API_DOMAIN}/admin/`
- [ ] Frontend locales: `https://{DOMAIN}/en`, `https://{DOMAIN}/fa`
- [ ] `createsuperuser` in backend Terminal
- [ ] Upload test image in admin → visible on site
- [ ] Edit content in admin → frontend updates (revalidation)
- [ ] `https://{DOMAIN}/sitemap.xml` and `https://{DOMAIN}/robots.txt`
- [ ] Configure DB + media backup in Runflare panel

### One-off Terminal commands (backend)

```bash
python manage.py createsuperuser
python manage.py seed_data          # optional, dev/demo only
python manage.py collectstatic --noinput   # only if CSS broken after deploy
```

---

## Verification commands

```bash
# Health
curl -s https://{API_DOMAIN}/api/v1/health/ | python3 -m json.tool

# Static files (must be 200)
curl -I https://{API_DOMAIN}/django-static/admin/css/base.css

# SSL issuer
echo | openssl s_client -connect {API_DOMAIN}:443 -servername {API_DOMAIN} 2>/dev/null \
  | openssl x509 -noout -issuer

# Redis from backend Terminal
python manage.py shell -c "from django.core.cache import cache; cache.set('ping','ok',10); print(cache.get('ping'))"
# Expected: ok

# Frontend
curl -I https://{DOMAIN}/en
curl -I https://{DOMAIN}/fa
```

---

## Runflare-specific gotchas

| # | Gotcha | Solution |
|---|--------|----------|
| 1 | `/static/` returns nginx 404 | Use `/django-static/` + `collectstatic` + url `serve()` |
| 2 | `/media/` returns nginx 404 | Use `/django-media/` + disk at `/app/media` |
| 3 | Infinite 301 on API | `SECURE_SSL_REDIRECT` off |
| 4 | SSL warning on API subdomain | Re-add domain; contact support if issuer is `cert-manager.local` |
| 5 | Redis `AuthenticationError` | Copy exact `REDIS_URL` from Redis secret (`redis://:PASS@host:6379/0`) |
| 6 | `seed_data` fails on Redis | Fix Redis URL; or disconnect cache signals during seed |
| 7 | `Address already in use :8000` | Don't start Gunicorn in Terminal; redeploy via CLI |
| 8 | Admin works but no CSS | `collectstatic` + deploy url fix; verify curl 200 on css |
| 9 | Frontend shows fallback text | API unreachable — fix SSL/redirect first |
| 10 | No static disk needed | Only `/app/media` disk for uploads |

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| SSL warning in Firefox | Self-signed / cert-manager cert | Re-issue SSL; contact support |
| 301 loop on API | `SECURE_SSL_REDIRECT=True` | Unset env; redeploy backend |
| Admin unstyled | Static 404 | See gotchas #1, #8 |
| Images 404 | Media path or missing disk | Disk `/app/media`; `/django-media/` path |
| CORS error in browser | Wrong origins | `CORS_ALLOWED_ORIGINS=https://{DOMAIN}` |
| CSRF error on admin login | Missing trusted origin | `CSRF_TRUSTED_ORIGINS=https://{API_DOMAIN}` |
| `cache: error` in health | Redis URL wrong | Fix `REDIS_URL`; restart backend |
| Frontend build OOM | Low RAM | Increase frontend RAM to 2 GB+ |
| DB connection refused | Wrong host | Use internal name from Networks tab |
| Content not updating | Revalidation | Match `REVALIDATION_SECRET`; check `FRONTEND_REVALIDATE_URL` |

### View logs

```bash
runflare logs -f -y
```

Or: Runflare panel → **مشاهده لاگ**

---

## New project adaptation

When deploying a **different** project, give this checklist to your agent:

### 1. Identify stack

| Stack | Services on Runflare |
|-------|---------------------|
| Django + Next.js (this template) | backend + frontend + PostgreSQL + Redis |
| Django only | backend + PostgreSQL (+ Redis if caching) |
| Next.js only | frontend |
| Node API + React | backend + frontend (+ DB as needed) |

### 2. Replace placeholders

```
{DOMAIN}       → yourdomain.com
{API_DOMAIN}   → api.yourdomain.com
{PROJECT_NAME} → runflare project name
```

### 3. Code audit before first deploy

- [ ] Production settings module exists
- [ ] `ALLOWED_HOSTS`, `CORS`, `CSRF_TRUSTED_ORIGINS` from env
- [ ] Static/media paths avoid `/static/` and `/media/` on Runflare
- [ ] `collectstatic` in Dockerfile + startup command
- [ ] Upload path disk mounted if admin/file uploads exist
- [ ] Secrets not in Git (`.env` gitignored)

### 4. If NOT Django

- **Static path blocking** may still apply if Runflare nginx intercepts `/static/` — test with `curl -I`
- **Node/Express:** serve static from `/assets/` or `/public/` if `/static/` fails
- **Single app:** no CORS/revalidation needed

### 5. Deploy order

```text
PostgreSQL → Redis → backend (migrate) → frontend → DNS/SSL verify
```

---

## Maintenance

### After code changes

```bash
cd backend && runflare deploy -y    # if backend changed
cd frontend && runflare deploy -y   # if frontend changed
```

### Backups

- Enable automated PostgreSQL backup in Runflare panel
- Media files live on `/app/media` disk — confirm backup/snapshot policy

### Monitoring (recommended)

- Uptime: UptimeRobot / Better Stack → `https://{DOMAIN}/en`, `https://{API_DOMAIN}/api/v1/health/`
- Analytics: Plausible / Umami (privacy-friendly)
- Search: Google Search Console + `sitemap.xml`

### Security reminders

- Strong admin password; don't share admin URL publicly
- Rotate `SECRET_KEY` / `REVALIDATION_SECRET` if leaked
- Keep `DEBUG=0` in production
- `POSTGRES_PASSWORD` and `REDIS_URL` only via Runflare Secrets

---

## Quick reference — this project

| Item | Value |
|------|-------|
| Domain | `kamalian.dev` |
| API | `api.kamalian.dev` |
| Project name | `portfoliotest` |
| Media disk | `/app/media` on backend |
| Static URL | `/django-static/` |
| Media URL (backend) | `/django-media/` |
| Media URL (browser) | `/media/` (Next.js proxy) |

---

*Last updated: June 2026 — kamalian.dev production deploy*
