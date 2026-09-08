# FleetPulse

A production-style full-stack fleet and vehicle telemetry dashboard built for a technical assessment.

FleetPulse simulates a delivery fleet and combines realtime telemetry with periodically fetched fleet analytics.

## Features

- Realtime vehicle telemetry using Server-Sent Events
- Live speed, temperature and fuel metrics
- LIVE/reconnecting/paused connection states
- Periodic aggregated dashboard analytics
- Derived alerts and trend data
- Session-based demo authentication
- Protected dashboard routes and APIs
- Vehicle search, filtering and sorting
- Alert search, filtering and sorting
- Vehicle details drawer
- Alert details drawer
- Configurable polling interval
- Temperature threshold control
- Responsive dark operations-dashboard UI
- Framer Motion micro-interactions
- Recharts visualizations

## Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Zustand
- Recharts
- Framer Motion

### Backend
- Node.js
- Express
- TypeScript
- Server-Sent Events

## Project Structure

```text
fleetpulse/
├── .agent/
│   └── rules.md
├── docs/
│   ├── assignment/
│   ├── phase-01/
│   ├── phase-02/
│   ├── phase-03/
│   ├── phase-04/
│   ├── phase-05/
│   ├── phase-06/
│   ├── phase-07/
│   ├── 00-project-brief.md
│   └── progress.md
├── frontend/
├── backend/
└── README.md
```

## Domain

Fleet and vehicle telemetry monitoring.

The system models:
- vehicles
- drivers
- locations
- telemetry events
- alerts
- fleet-level analytics

## Realtime Data

The backend continuously generates synthetic telemetry approximately every two seconds.

SSE endpoint:

```text
GET /api/telemetry/stream
```

Each event contains:
- vehicle ID
- speed
- temperature
- fuel level
- status
- event type
- timestamp

## Periodic Data

The frontend polls aggregated/derived APIs.

Default interval:
10 seconds

Available intervals:
5, 10, 15 seconds

Endpoints:

```text
GET /api/dashboard/summary
GET /api/dashboard/alerts
GET /api/dashboard/trends
```

Periodic responses contain aggregates, trends and derived alerts rather than raw stream events.

## Authentication

Demo credentials:

```text
Email: demo@fleetpulse.com
Password: password123
```

Protected pages:
- Dashboard
- Analytics
- Vehicles
- Alerts
- Settings

## Pages

1. Login
2. Dashboard
3. Analytics
4. Vehicles
5. Alerts
6. Settings

## Development

The project is intentionally split into frontend and backend applications.

Run each application from its respective directory once implementation is complete.

Example:

```bash
cd backend
npm install
npm run dev
```

```bash
cd frontend
npm install
npm run dev
```

Exact scripts and environment variables will be documented after project initialization.

## Documentation

Detailed implementation planning is available in `docs/`.

Start with:
1. `docs/00-project-brief.md`
2. `docs/phase-01/requirements.md`
3. `docs/phase-01/architecture.md`

Then proceed sequentially through Phase 07.

## Assignment Mapping

| Requirement | FleetPulse implementation |
|---|---|
| Realtime ingestion | SSE telemetry stream |
| 3+ live metrics | Speed, temperature, fuel |
| LIVE indicator | Dashboard connection state |
| Last received timestamp | Dashboard |
| Periodic API polling | Summary, alerts, trends |
| Aggregated/derived data | Analytics and Alerts |
| Consistent theme | Shared dark operations theme |
| Login/session | Demo session authentication |
| Protected route | All application pages |
| Logout/expiry | Auth state + 401 handling |
| 5-6 pages | Six pages |
| Coherent domain | Fleet/vehicle telemetry |
| Multiple interactions | Search/filter/sort/pause/drawer/threshold |
| Visible UI response | Drawers and live mode state |
| Animations | Framer Motion |

## Assessment Goal

The application is designed to demonstrate functional correctness, UI quality, code structure, realtime ingestion, periodic polling, session management, and a coherent multi-page dashboard architecture.
