# Continuum (Trackwolf)

A habit, task, and focus tracking app built with React, Redux Toolkit, and Vite.

## Prerequisites

- Node.js 18+
- npm

## Setup

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Copy the environment template:

```bash
cp .env.example .env
```

**Local dev (no backend):** keep `VITE_USE_MOCK_AUTH=true` in `.env` and set `VITE_MOCK_LOGIN_EMAIL` / `VITE_MOCK_LOGIN_PASSWORD` to your test credentials. Default demo login: `demo@continuum.local` / `demo123456`.

**Real backend:** set `VITE_USE_MOCK_AUTH=false` and `VITE_API_URL` to the API **base URL only** (e.g. `http://localhost:3000/api` — do not include `/auth/login`). Endpoints used:

- `POST /auth/login` — `{ email, password }` → `{ user, token, refreshToken, expiresIn }`
- `GET /auth/verify` — Bearer token → `{ user }`
- `POST /auth/refresh` — `{ refreshToken }` → `{ token, refreshToken, expiresIn }`
- `POST /auth/logout` — Bearer token

3. Start the dev server (restart after changing `.env`):

```bash
npm run dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run unit tests (Vitest) |
| `npm run test:watch` | Run tests in watch mode |

## Features

- **Today** — Daily habits and tasks with check-ins and streaks
- **Habits** — Manage habits with 7-day history and completion stats
- **Tasks** — Task list grouped by Today / Upcoming / Completed
- **Focus** — Pick a task and start a Pomodoro session
- **Timer** — Pomodoro timer with focus/break cycles
- **Categories** — Organize habits and tasks by category
- **Analytics** — Read-only productivity summaries
- **Goals** — Simple weekly/daily targets

Data for habits, tasks, timer, categories, and goals persists to `localStorage`.

## Testing

Tests cover high-risk logic: habit streaks, task recurrence, and auth reducers.

```bash
npm run test
```

## Project structure

```
src/
  components/     Shared UI (HabitCard, modals, today lists)
  features/       Redux slices and domain logic
  pages/          Route-level pages
  store/          Redux store and persistence
```
