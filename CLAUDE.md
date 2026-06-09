# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Stack

- **Backend**: Laravel 10 (PHP 8.1+), served via XAMPP
- **Frontend**: React 19 (JSX), bundled by Vite, served through Laravel's Blade template
- **Database**: MySQL (via XAMPP), accessed with Eloquent ORM
- **Auth**: Laravel Sanctum (installed but not actively used — API routes are currently unauthenticated)

## Commands

### Backend (run from project root)
```bash
php artisan serve          # dev server (alternative to XAMPP)
php artisan migrate        # run migrations
php artisan migrate:fresh  # drop and re-run all migrations
php artisan tinker         # REPL for testing Eloquent queries
php vendor/bin/phpunit     # run all tests
php vendor/bin/phpunit --filter TestName  # run a single test
```

### Frontend (run from project root)
```bash
npm run dev    # Vite dev server with HMR
npm run build  # production build into public/build/
```

The app is typically accessed via XAMPP at `http://localhost/jingjong_planner/public`.

## Architecture

### Request flow
1. All requests hit `public/index.php` (Laravel's front controller)
2. API routes (`/api/*`) are defined in `routes/api.php` and handled by controllers in `app/Http/Controllers/Api/`
3. All other routes fall through to `routes/web.php`, which serves `resources/views/app.blade.php`
4. The Blade view bootstraps the React app mounted on `<div id="app">`
5. The single React component tree lives entirely in `resources/js/components/TaskPlanner.jsx`

### Data flow
- Tasks are persisted in MySQL via `/api/tasks` (Laravel REST resource)
- The React frontend fetches tasks by date range on month navigation; results are stored in component state keyed by `YYYY-MM-DD`
- Stickers, moods, and UI settings (active view, category filter) are persisted to `localStorage` — they are **not** stored in the database
- All task mutations (add/toggle/delete) use optimistic updates: state is updated immediately, then synced to the API, with rollback on failure

### Key files
| File | Purpose |
|---|---|
| `app/Http/Controllers/Api/TaskController.php` | CRUD for tasks; supports `?date=`, `?start=&end=` query params |
| `app/Http/Controllers/Api/QuoteController.php` | Proxies to Anthropic API using `ANTHROPIC_API_KEY`; note: the frontend no longer calls this endpoint — it fetches from `quotable.io` directly |
| `app/Models/Task.php` | Eloquent model; `done` cast to boolean, `task_date` cast to `date:Y-m-d` |
| `resources/js/components/TaskPlanner.jsx` | Entire frontend (~1700 lines): calendar, weekly, daily, and split views; draggable stickers; mood-based task filtering |

### Task data shape
Database columns: `id`, `task_date` (date), `text`, `done` (bool), `category` (enum: work/personal/shopping/health), `priority` (enum: low/medium/high), `created_at`, `updated_at`.

Frontend maps `category` → `cat` and omits timestamps when storing tasks in React state.

## Environment
Copy `.env.example` to `.env` and set:
- `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` for MySQL
- `ANTHROPIC_API_KEY` if using the `/api/fetch-quote` endpoint (currently unused by the frontend)
