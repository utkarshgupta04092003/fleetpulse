# Phase 01 - Architecture

## Architecture

FleetPulse uses a split frontend/backend architecture.

```text
                    +----------------------+
                    |      Next.js UI      |
                    | React + TypeScript   |
                    +----------+-----------+
                               |
             +-----------------+------------------+
             |                                    |
        SSE stream                         REST polling
             |                                    |
             v                                    v
+-------------------------+          +-------------------------+
| Express Realtime API    |          | Express REST API        |
| /api/telemetry/stream   |          | summary / alerts/trends |
+------------+------------+          +------------+------------+
             |                                    |
             +----------------+-------------------+
                              |
                              v
                    +----------------------+
                    | In-memory Fleet State|
                    | Generator + Services |
                    +----------------------+
```

## Frontend

Next.js handles:
- routes
- pages
- UI components
- client-side data ingestion
- Zustand stores
- charts
- session handling

Suggested stores:
- authStore
- telemetryStore
- dashboardStore
- settingsStore

## Backend

Express handles:
- authentication
- authorization middleware
- telemetry generator
- SSE connections
- aggregation
- alerts
- trends

Suggested structure:

```text
backend/
└── src/
    ├── server.ts
    ├── config/
    │   └── env.ts
    ├── types/
    │   └── index.ts
    ├── routes/
    │   ├── auth.routes.ts
    │   ├── telemetry.routes.ts
    │   ├── dashboard.routes.ts
    │   └── vehicle.routes.ts
    ├── services/
    │   ├── session.service.ts
    │   ├── status.ts
    │   ├── evolution.ts
    │   ├── telemetry.service.ts
    │   ├── analytics.service.ts
    │   └── alert.service.ts
    ├── generators/
    │   └── telemetry.generator.ts
    ├── middleware/
    │   ├── auth.middleware.ts
    │   └── error.middleware.ts
    └── data/
        ├── seed.ts
        └── backfill.ts
```

## Data Strategy

No external API or database is required initially.

Use seeded in-memory state because:
- the assignment focuses on realtime/polling behavior
- deterministic synthetic data is easier to debug
- setup remains simple
- no infrastructure dependency is introduced

Historical records are retained in memory for analytics.

## Realtime Choice

SSE is preferred over WebSocket because FleetPulse primarily requires one-way server-to-client updates.

SSE provides:
- persistent connection
- simple browser EventSource client
- automatic reconnection
- low implementation complexity

## API Boundaries

Health:
- GET /health

The health check sits outside `/api` and outside authentication so the server can be
probed before a session exists.

Authentication:
- POST /api/auth/login
- POST /api/auth/logout
- GET /api/auth/session

Realtime:
- GET /api/telemetry/stream

Dashboard:
- GET /api/dashboard/summary
- GET /api/dashboard/alerts
- GET /api/dashboard/trends

Vehicles:
- GET /api/vehicles
- GET /api/vehicles/:id

The Alerts page polls `/api/dashboard/alerts`. A separate `/api/alerts` was
considered and dropped - it would return identical derived data with no
distinct caller.

## Key Decisions

### Shared types are duplicated, not packaged

`Vehicle`, `TelemetryEvent` and `Alert` are needed by both applications. A shared
workspace package would avoid the duplication but introduces monorepo tooling that the
split frontend/backend structure does not otherwise need.

Decision: keep an identical `types/index.ts` in each application and treat the backend
copy as canonical. The tradeoff is documented in the README.

### Route protection is enforced server-side

Next.js middleware cannot validate the session, because session records live in the
Express process memory rather than in a signed token the edge runtime can verify.

Decision: the backend `auth.middleware.ts` is the real enforcement point. The frontend
protected layout performs a `GET /api/auth/session` check on mount purely for user
experience - it prevents a protected shell from flashing before the redirect. Frontend
guarding alone is never treated as security.

### The generator updates a batch of vehicles per tick

With roughly 100 vehicles and a 2 second tick, updating a single vehicle per tick means
any given vehicle changes about once every three minutes and the fleet appears frozen.

Decision: evolve a small batch (approximately 3-5 vehicles) per tick and emit one
telemetry event per updated vehicle.

### History is backfilled at boot

The generator updates a few vehicles per tick, so a given vehicle is touched
roughly once a minute. Starting from an empty history means vehicle detail
charts are empty and trend buckets unpopulated for the first several minutes -
the application looks broken exactly when someone first opens it.

Decision: at startup, walk every vehicle forward through the recent past using
the same evolution rules the live generator uses, and seed that as history. The
final step becomes the vehicle's current state, so nothing is inconsistent.

The evolution logic lives in `services/evolution.ts` precisely so the backfill
and the live generator cannot drift apart.

### Fuel level recovers

Fuel decreases monotonically, so an unbounded simulation drains the entire fleet to zero.

Decision: when fuel falls below a floor, refuel the vehicle and emit a `RECOVERY` event.
This keeps the dataset realistic across a long-running demo.

## Error Handling

Frontend API calls must distinguish:
- 401 session failure
- validation errors
- server errors
- network errors

A 401 clears auth state and redirects to Login.

SSE disconnects should show a non-LIVE/reconnecting state rather than silently failing.
