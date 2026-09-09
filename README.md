# FleetPulse

A production-style full-stack fleet and vehicle telemetry dashboard.

FleetPulse simulates a 100-vehicle delivery fleet and combines two distinct data
flows: realtime telemetry over Server-Sent Events, and periodically polled REST
endpoints returning aggregated and derived analytics.

```
Login  ->  Dashboard  ->  Analytics  ->  Vehicles  ->  Alerts  ->  Settings
```

## Quick start

Two applications, two terminals. The backend must be running first.

```bash
# terminal 1
cd backend
npm install
npm run dev          # http://localhost:4000
```

```bash
# terminal 2
cd frontend
npm install
npm run dev          # http://localhost:3000
```

Open http://localhost:3000 and sign in with:

```
Email:    demo@fleetpulse.com
Password: password123
```

Both fields are pre-filled on the login form.

Node 20 or newer (developed on Node 24 - see `.nvmrc`).

## Architecture

```
                      Next.js frontend (3000)
                               |
              +----------------+-----------------+
              |                                  |
        SSE stream                        REST polling
     raw vehicle events                every 5 / 10 / 15s
              |                                  |
              v                                  v
   GET /api/telemetry/stream        /api/dashboard/summary | alerts | trends
              |                                  |
              +----------------+-----------------+
                               |
                    Express backend (4000)
                               |
                 in-memory fleet state + generator
```

The backend generates telemetry every 2 seconds, keeps recent history in
memory, and derives aggregates and alerts from it on request. There is no
database - the assignment is about realtime and polling behaviour, and seeded
in-memory state keeps the system deterministic and dependency-free.

### Why SSE rather than WebSocket

The data flows one way, server to client. `EventSource` reconnects
automatically, needs no protocol upgrade, and sends cookies when constructed
with `withCredentials`. A WebSocket would only be justified if the client also
pushed data.

## Environment

Each application ships a committed `.env.example`. Every value has a working
default, so `npm run dev` needs no configuration.

### backend/.env

| Variable | Default | Purpose |
|---|---|---|
| `PORT` | `4000` | HTTP listen port |
| `NODE_ENV` | `development` | Environment flag |
| `CORS_ORIGIN` | `http://localhost:3000` | Allowed browser origin |
| `SESSION_TTL_MINUTES` | `30` | Demo session lifetime |
| `DEMO_EMAIL` | `demo@fleetpulse.com` | Demo account |
| `DEMO_PASSWORD` | `password123` | Demo secret |
| `TELEMETRY_INTERVAL_MS` | `2000` | Generator tick |
| `HISTORY_LIMIT` | `3000` | Retained telemetry events |

### frontend/.env.local

| Variable | Default | Purpose |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:4000` | Backend base URL |

Credentials are read from the environment rather than hardcoded, with the demo
values as fallbacks so the project runs unconfigured.

## API

| Method | Path | Auth | Returns |
|---|---|---|---|
| GET | `/health` | no | Uptime |
| POST | `/api/auth/login` | no | User, sets `fp_session` cookie |
| GET | `/api/auth/session` | yes | Current user |
| POST | `/api/auth/logout` | no | 204, destroys session |
| GET | `/api/telemetry/stream` | yes | SSE telemetry stream |
| GET | `/api/dashboard/summary` | yes | Counts, averages, trend deltas |
| GET | `/api/dashboard/alerts` | yes | Derived alerts (`?tempThreshold=60..100`) |
| GET | `/api/dashboard/trends` | yes | 20-bucket time series, status distribution |
| GET | `/api/vehicles` | yes | Full fleet |
| GET | `/api/vehicles/:id` | yes | Vehicle, recent history, its alerts |

Failures share one shape: `{ "error": CODE, "message": string }`.

## Realtime behaviour

The generator evolves 4 distinct vehicles every 2 seconds. Metrics drift from
their previous value rather than being re-rolled, and temperature is a function
of speed, so the data behaves like a fleet rather than noise:

```
speed       = previous +/- 8, clamped 0-120
temperature = 50 + speed * 0.35 +/- 3, clamped 40-110
fuel        = previous - 0.05..0.4, refuelling at a floor
```

Each event carries `vehicleId`, `speed`, `temperature`, `fuelLevel`, `status`
(`ACTIVE | IDLE | WARNING | CRITICAL`), `eventType`
(`UPDATE | SPEED_ALERT | TEMPERATURE_ALERT | LOW_FUEL | RECOVERY`) and a
timestamp.

The dashboard shows a LIVE indicator and the timestamp of the last received
update. Pause stops applying incoming events **without dropping the
connection**, so resuming continues from the next event.

History is backfilled at startup, so charts and trends have data on first load
instead of filling in over several minutes.

## Polling behaviour

The frontend polls the three dashboard endpoints on a configurable interval
(5, 10 or 15 seconds; default 10) and shows a "Last updated" timestamp.

Polled data is deliberately different from the stream:

| | SSE stream | Polled endpoints |
|---|---|---|
| Unit | one vehicle, one moment | whole fleet, a time window |
| Content | raw speed / temp / fuel | averages, counts, deltas, alerts |
| Source | generator emits it | services compute it from history |

`summary` averages the last 60 seconds and compares against the 60 seconds
before that to produce trend deltas - a number that exists nowhere in the
stream.

## Authentication

A session id is stored in an `HttpOnly`, `SameSite=Lax` cookie; the session
record itself lives server-side, so nothing can be read or forged in the
browser.

`requireAuth` protects every dashboard API. The frontend also checks the
session before rendering a protected shell, but that is user experience, not
security - the backend is the enforcement point.

On any 401 the frontend clears auth, telemetry and dashboard state, stops
polling, closes the stream and redirects to Login with a "session expired"
message, so stale protected data is never left on screen.

## Pages

| Page | Purpose |
|---|---|
| Login | Public entry, demo credentials, validation and error feedback |
| Dashboard | Live telemetry metrics, LIVE indicator, event feed, fleet summary |
| Analytics | Polled aggregates, trend deltas, speed/temperature/fuel charts, fleet health |
| Vehicles | Fleet table with search, status filter, sorting, details drawer |
| Alerts | Derived alerts with counts, search, severity and type filters, details drawer |
| Settings | Pause/resume, poll interval, temperature threshold, session info, logout |

## Interactions

| Category | Implementation |
|---|---|
| Form | Search, status/severity/type filters, sortable columns |
| Realtime | Pause/resume, poll interval, temperature threshold |
| Modal/Drawer | Vehicle details drawer, alert details drawer |
| Visual | Page transitions, metric change animation, LIVE pulse, event feed entry |

The temperature threshold is sent to the backend, which **re-derives** the
alert set - lowering it from 75C to 63C took alerts from 24 to 62 in testing.
It is not client-side filtering.

## Stack

**Frontend** - Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4,
shadcn/ui, Zustand, Recharts, Framer Motion

**Backend** - Node.js, Express, TypeScript, Server-Sent Events, Zod

## Project structure

```
fleetpulse/
├── backend/src/
│   ├── config/        env (zod-validated) + constants
│   ├── types/         domain types
│   ├── utils/         math, random, time
│   ├── data/          seed + boot backfill
│   ├── services/      status, evolution, telemetry, analytics, alerts, session
│   ├── generators/    telemetry generator
│   ├── middleware/    auth + error handling
│   └── routes/        auth, telemetry, dashboard, vehicles
├── frontend/src/
│   ├── app/           routes, (protected) group
│   ├── components/    common, layout, providers, vehicles, alerts, ui
│   ├── stores/        auth, telemetry, dashboard, settings
│   ├── hooks/         table controls, vehicles
│   ├── lib/           api client, typed endpoints, formatters
│   └── types/         mirror of backend types
└── docs/              phase-by-phase design documentation
```

Each backend folder has an `index.ts` barrel. Cross-folder imports use the
barrel; siblings import each other directly to avoid circular imports.

## Scripts

Both applications support the same commands:

```bash
npm run dev         # development server
npm run build       # production build
npm start           # run the build
npm run lint        # ESLint
npm run typecheck   # tsc --noEmit
```

A pre-commit hook runs lint, typecheck and build for every scaffolded app.
Enable it in a fresh clone with:

```bash
git config core.hooksPath .githooks
```

## Assignment mapping

| Requirement | Implementation |
|---|---|
| Realtime ingestion | SSE telemetry stream, 4 events per 2s |
| 3+ live metrics | Speed, temperature, fuel level |
| LIVE indicator | Header badge: LIVE / PAUSED / RECONNECTING |
| Last received timestamp | Header and dashboard |
| Periodic API polling | 5/10/15s, default 10s |
| 2+ aggregated endpoints | summary, alerts, trends |
| Last updated timestamp | Dashboard and Analytics |
| Periodic differs from live | Aggregates and deltas vs raw events |
| Consistent theme | Single dark palette across all pages |
| Login | Demo credentials, cookie session |
| Protected routes | All five dashboard pages, plus server-side API guard |
| Invalid/expired session | 401 clears state and redirects with a message |
| Logout | Destroys session, clears cookie, closes stream |
| 5-6 pages | Six |
| Coherent domain | Fleet telemetry throughout |
| Search/filter/sort | Vehicles and Alerts |
| Pause/resume | Dashboard header and Settings |
| Threshold control | Settings slider, server-side derivation |
| Details drawer | Vehicle and alert drawers |
| Animations | Framer Motion transitions and micro-interactions |

## Documentation

`docs/` contains the phase-by-phase design record:

1. `docs/00-project-brief.md`
2. `docs/phase-01/requirements.md` - FR-01..FR-13
3. `docs/phase-01/architecture.md` - structure and key decisions
4. `docs/phase-01/runtime.md` - ports, env vars, cookie contract
5. `docs/phase-01/traceability.md` - each requirement to its code and check

Phases 02 to 07 cover the backend, authentication, realtime, frontend,
interactions and validation.

## Known characteristics

- **Sessions are in-memory.** Restarting the backend invalidates active
  sessions; the frontend handles this as a normal expiry and redirects to
  Login. This is intentional for an assessment build.
- **Domain types are duplicated** between backend and frontend rather than
  extracted into a shared package, to avoid adding monorepo tooling the split
  structure does not otherwise need. The backend copy is canonical.
- **Dark theme only.** The assignment requires consistency; a single palette is
  applied everywhere rather than maintaining two.
