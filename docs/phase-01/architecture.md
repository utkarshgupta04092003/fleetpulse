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
    ├── routes/
    │   ├── auth.routes.ts
    │   ├── dashboard.routes.ts
    │   ├── vehicle.routes.ts
    │   └── alerts.routes.ts
    ├── services/
    │   ├── telemetry.service.ts
    │   ├── analytics.service.ts
    │   └── alert.service.ts
    ├── generators/
    │   └── telemetry.generator.ts
    ├── middleware/
    │   └── auth.middleware.ts
    └── data/
        └── vehicles.ts
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

Alerts:
- GET /api/alerts

## Error Handling

Frontend API calls must distinguish:
- 401 session failure
- validation errors
- server errors
- network errors

A 401 clears auth state and redirects to Login.

SSE disconnects should show a non-LIVE/reconnecting state rather than silently failing.
