# تقویم تسک

Persian RTL task calendar with Pomodoro capacity planning. Greenfield app in this repo:

- `backend/` — AdonisJS 7 API (Lucid + PostgreSQL + VineJS + access-token auth)
- `frontend/` — SvelteKit + Svelte 5 + Tailwind 4 (SPA, Vazirmatn)
- `desktop/` — Tauri 2 shell around the same frontend (Windows + Linux bundles)

## Requirements

- Node.js 24+ (Adonis 7) — or Docker / Docker Compose for the web stack
- Yarn 1.22 for the backend (`yarn` classic) and Yarn 4 / Corepack for `frontend/` and `desktop/`
- PostgreSQL 16+ (skipped when using Compose)
- For desktop builds: [Rust](https://www.rust-lang.org/tools/install) + [Tauri Linux/Windows prerequisites](https://v2.tauri.app/start/prerequisites/)

## Database

Create the app and test databases (example, local Postgres):

```bash
sudo -u postgres psql -c "CREATE USER todo WITH PASSWORD 'todo';"
sudo -u postgres psql -c "CREATE DATABASE todo OWNER todo;"
sudo -u postgres psql -c "CREATE DATABASE todo_test OWNER todo;"
```

Copy env files (do not commit real secrets):

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Generate an application key, then migrate and seed:

```bash
cd backend
yarn install
node ace generate:key
node ace migration:run
node ace db:seed
```

`backend/.env.example` uses placeholder DB credentials (`todo` / `todo`). Change them for any shared or production machine.

## Docker Compose (web + API + Postgres)

Production-style multi-stage images for local use. Desktop/Tauri is not included (native). The browser on your machine talks to the **published** ports, so `PUBLIC_API_URL` must be `http://localhost:<BACKEND_PORT>/api/v1`, not the internal `backend` hostname.

```bash
cp .env.example .env
docker compose up --build
```

| Service | Host URL | Notes |
| --- | --- | --- |
| Frontend | http://localhost:5173 | nginx serving the SvelteKit static SPA |
| Backend | http://localhost:3333 | Adonis API (`/api/v1`) |
| Postgres | localhost:5432 | volume `postgres_data` |

The API waits until Postgres is healthy, then runs migrations and (by default) the demo seed.

Demo account after seed:

- email: `demo@example.com`
- password: `password123`

Skip seed with `RUN_SEED=false` in `.env`. Change host ports with `FRONTEND_PORT` / `BACKEND_PORT` / `POSTGRES_PORT`. If you change `BACKEND_PORT` or `PUBLIC_API_URL`, rebuild the frontend image so the baked-in API URL matches (`docker compose up --build`).

Stop and remove containers (keep the DB volume): `docker compose down`. Wipe the database too: `docker compose down -v`.

`docker compose config` checks the file. Compose reads `.env` in the repo root; do not commit it.

## Run the web app (without Docker)

Terminal 1 — API (http://localhost:3333):

```bash
cd backend
yarn dev
```

Terminal 2 — SvelteKit (http://localhost:5173):

```bash
cd frontend
yarn install
yarn dev
```

Open http://localhost:5173 and sign in with the demo user, or register a new account.

| Route | Screen |
| --- | --- |
| `/login` | Login |
| `/signup` | Signup |
| `/daily` | Daily calendar + capacity |
| `/weekly` | Weekly calendar |
| `/monthly` | Monthly calendar |
| `/tasks` | All tasks tree + project filter |
| `/settings` | Pomodoro and working-day settings |

Capacity defaults: **10 / day**, **50 / week**, **200 / month** (daily limit × working days in the visible range). Under/over states use green/red messaging. Pomodoro is shown with a clock (⏱), not a tomato.

## Run / build the desktop app

The Tauri window loads the same Svelte frontend. The API still runs separately.

```bash
# API must be reachable at PUBLIC_API_URL (default http://localhost:3333/api/v1)
cd backend && yarn dev

# Desktop (dev) — starts the Vite frontend and a native window
cd desktop
yarn install
yarn dev
```

### Linux bundles (Debian / AppImage)

Build on Linux with Rust + Tauri system deps installed:

```bash
cd desktop
yarn build:linux
```

Artifacts land under `desktop/src-tauri/target/release/bundle/` (`deb/`, `appimage/`).

### Windows installer (NSIS)

Build on Windows (recommended) with Rust MSVC and NSIS:

```bash
cd desktop
yarn build:windows
```

Cross-compiling the Windows NSIS target from Linux needs a Windows Rust target and extra tooling; prefer a Windows machine or CI runner for that bundle.

Before a production desktop build, set `frontend/.env` `PUBLIC_API_URL` to the API the packaged app should call, then `yarn build` in `frontend/` (Tauri `beforeBuildCommand` does this automatically).

## Tests and quality gates

```bash
# Backend
cd backend
yarn test
yarn lint
yarn format
yarn typecheck

# Frontend
cd frontend
yarn lint
yarn format
yarn check
```

Critical API coverage: auth (register/login/profile) and tasks (nested create, ownership 404, daily capacity under/over, no double-count of parent+child estimates).

## API

Base path: `/api/v1`

| Method | Path | Auth | Notes |
| --- | --- | --- | --- |
| POST | `/auth/register` | no | also available as `/auth/signup` |
| POST | `/auth/login` | no | |
| GET | `/account/profile` | yes | |
| POST | `/account/logout` | yes | |
| CRUD | `/projects` | yes | |
| CRUD | `/tasks` | yes | nested `parentId`, `assignedOn` |
| POST | `/tasks/:id/assignments` | yes | `{ date }` ISO Gregorian |
| DELETE | `/tasks/:id/assignments/:date` | yes | |
| GET/PATCH | `/settings` | yes | pomo lengths + `workingDays` |
| GET | `/calendar` | yes | `view=daily\|weekly\|monthly&date=` |

Successful responses use a `{ data }` envelope.

## Stack notes

- Backend follows Adonis layered Route → Controller → Service → Model → Transformer.
- Frontend is Svelte 5 runes only (`$state`, `$derived`, `$props`, `$bindable`), `ssr = false` for a static SPA that Tauri can wrap.
- UI is Persian RTL (`<html lang="fa" dir="rtl">`) with Vazirmatn. Calendar chrome matches the Figma frames (sidebar left, Jalali week Saturday–Friday).
- Yarn only — do not add npm/pnpm lockfiles.
