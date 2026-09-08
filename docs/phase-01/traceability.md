# Phase 01 - Traceability Matrix

Maps every requirement to the artifacts that satisfy it and the step that proves it.

Update the "Built" column as implementation lands. A requirement is only complete
when its validation step passes in the running application.

## Legend

- **Backend** - route, service or module that produces the data
- **Frontend** - page, store or component that consumes and renders it
- **Validation** - the observable check performed in the running app
- **Built** - `todo` / `partial` / `done`

## Matrix

### FR-01 Realtime telemetry

| | |
|---|---|
| Backend | `generators/telemetry.generator.ts`, `routes/telemetry.routes.ts` -> `GET /api/telemetry/stream` |
| Frontend | `lib/telemetry.ts` (EventSource), `stores/telemetry.store.ts`, Dashboard |
| Validation | Open Dashboard, do not refresh, confirm values change within ~5s |
| Built | todo |

### FR-02 Live metrics

| | |
|---|---|
| Backend | `telemetry.generator.ts` metric evolution |
| Frontend | `components/dashboard/MetricCard.tsx` x3 (speed, temperature, fuel) |
| Validation | Watch all three cards change over a 30s window |
| Built | todo |

### FR-03 Live state

| | |
|---|---|
| Backend | `TelemetryEvent.status`, `.eventType`, `.timestamp` |
| Frontend | `components/dashboard/LiveIndicator.tsx`, recent-events feed |
| Validation | LIVE badge visible; last-received timestamp ticks forward; events show status and type |
| Built | todo |

### FR-04 Periodic analytics

| | |
|---|---|
| Backend | `routes/dashboard.routes.ts` |
| Frontend | polling in `components/providers/AppProviders.tsx`, `stores/dashboard.store.ts` |
| Validation | Network tab shows a request every 10s by default; "Last updated" timestamp advances |
| Built | todo |

### FR-05 Periodic endpoints

| | |
|---|---|
| Backend | `services/analytics.service.ts`, `services/alert.service.ts` -> `/summary`, `/alerts`, `/trends` |
| Frontend | Analytics page, Alerts page |
| Validation | Compare an SSE payload against a `/summary` payload - aggregates and deltas vs a single raw event |
| Built | todo |

### FR-06 Authentication

| | |
|---|---|
| Backend | `routes/auth.routes.ts`, `middleware/auth.middleware.ts` |
| Frontend | `app/login/page.tsx`, `stores/auth.store.ts`, protected layout guard |
| Validation | Visit `/dashboard` logged out -> redirected to `/login`; curl a protected API with no cookie -> 401 |
| Built | todo |

### FR-07 Session invalidation

| | |
|---|---|
| Backend | session TTL expiry -> 401 |
| Frontend | central 401 handler in `lib/api.ts` |
| Validation | Delete the session cookie mid-session, wait for the next poll -> state clears and redirects to Login |
| Built | todo |

### FR-08 Logout

| | |
|---|---|
| Backend | `POST /api/auth/logout` |
| Frontend | Settings page logout control |
| Validation | Log out -> redirected to Login; EventSource closed; back button does not show protected data |
| Built | todo |

### FR-09 Pages

| | |
|---|---|
| Backend | n/a |
| Frontend | `login`, `dashboard`, `analytics`, `vehicles`, `alerts`, `settings` |
| Validation | Navigate all six; each shows fleet-domain content, not placeholders |
| Built | todo |

### FR-10 Interactivity

| | |
|---|---|
| Backend | `?tempThreshold=` on `/api/dashboard/alerts` |
| Frontend | `useTableControls` hook, Sheet drawers, pause/resume, threshold slider |
| Validation | Search filters rows; a row click opens a drawer; pause freezes metrics; threshold changes the alert list |
| Built | todo |

### FR-11 Theming consistency

| | |
|---|---|
| Backend | n/a |
| Frontend | Tailwind theme tokens, shadcn theme config, shared layout |
| Validation | Login, Dashboard and Settings share palette; no unthemed default components; contrast readable |
| Built | todo |

### FR-12 Domain coherence

| | |
|---|---|
| Backend | seed data, `types/index.ts` |
| Frontend | all page headings and labels |
| Validation | No generic labels ("Item", "Value", "Data"); the same entity keeps the same name everywhere |
| Built | todo |

### FR-13 Backend dummy data generation

| | |
|---|---|
| Backend | `data/seed.ts`, `telemetry.generator.ts`, analytics/alert services |
| Frontend | none - the frontend must not fabricate domain data |
| Validation | Grep the frontend for hardcoded vehicle/alert arrays; the only source is the API |
| Built | todo |

## Interaction Category Coverage

The assignment requires at least two categories. FleetPulse targets four.

| Category | Implementation | Requirement |
|---|---|---|
| Form | Search, status/severity filter, column sort | FR-10 |
| Realtime | Pause/resume, polling interval, temperature threshold | FR-10 |
| Modal/Drawer | Vehicle details drawer, alert details drawer | FR-10 |
| Visual | Page transitions, metric change animation, LIVE pulse | FR-10 |

## Page Coverage

| Page | Primary requirements |
|---|---|
| Login | FR-06, FR-11 |
| Dashboard | FR-01, FR-02, FR-03, FR-10 |
| Analytics | FR-04, FR-05 |
| Vehicles | FR-09, FR-10, FR-12 |
| Alerts | FR-05, FR-10 |
| Settings | FR-04, FR-08, FR-10, FR-11 |
