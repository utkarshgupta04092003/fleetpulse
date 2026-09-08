# Phase 01 - Requirements

## Objective

Convert the recruitment task into explicit FleetPulse requirements before implementation.

Source: `docs/assignment/Full-Stack Recruitment Task.pdf`. The PDF is the final authority;
this document restates it in FleetPulse terms and is the basis for the traceability
matrix in `traceability.md`.

## Functional Requirements

### FR-01 Realtime telemetry
The backend continuously generates vehicle telemetry and exposes it through SSE.
The UI updates without manual refresh.

### FR-02 Live metrics
The dashboard displays at least three changing numeric metrics.

FleetPulse metrics:
- Speed
- Temperature
- Fuel Level

### FR-03 Live state
Every live update includes status, event type and timestamp.
The dashboard shows a visible LIVE indicator and the timestamp of the last received update.

### FR-04 Periodic analytics
The frontend periodically fetches aggregated/derived data on a 5-15 second interval
(FleetPulse default: 10 seconds).
Each periodic view displays a "Last updated" timestamp.

### FR-05 Periodic endpoints
At least two backend endpoints return aggregated or derived content that is
logically different from the raw SSE payload.

FleetPulse provides:
- /api/dashboard/summary - averages/totals for a time window, plus trend deltas
  against the previous window
- /api/dashboard/alerts - alerts derived from metric thresholds
- /api/dashboard/trends - historical time-series for speed, temperature and fuel

### FR-06 Authentication
Users authenticate with demo credentials. Protected routes redirect unauthenticated
users to Login. Backend APIs required by the dashboard are protected server-side.

### FR-07 Session invalidation
Invalid or expired sessions clear frontend session state and redirect to Login.
This must hold when a session expires mid-request: an in-flight API call returning
401 transitions the app safely rather than leaving stale protected data rendered.

### FR-08 Logout
Users can explicitly log out.

### FR-09 Pages
The application contains six meaningful pages, each with domain-connected content,
reachable through consistent navigation.

### FR-10 Interactivity
The application supports at least two interaction categories. FleetPulse implements
form (search/filter/sort), realtime (pause/resume, threshold control),
modal/drawer (vehicle and alert details) and visual (animation) interactivity.

At least one control changes what is rendered.
At least one interaction triggers a visible UI response.

### FR-11 Theming consistency
A defined palette - primary, secondary/accent, background, surface, text and status
colors - is applied consistently to cards, buttons, charts, inputs and navigation.

Consistent theming is required at minimum across Login, the dashboard pages and Settings.
Contrast must remain readable.

Palette is specified in `.agent/rules.md` section 10.

### FR-12 Domain coherence
The fleet telemetry domain is visible in headings, labels, metrics, tables and API
payloads. Entity naming and metric meaning stay consistent across the application.
Live stream content and periodic API content both align with the same narrative.

### FR-13 Backend dummy data generation
The backend - not the frontend - generates the dummy data for both flows.

Live generator output must include:
- at least three numeric metrics that fluctuate over time (speed, temperature, fuel level)
- at least one status field (ACTIVE / IDLE / WARNING / CRITICAL)
- at least one event type label (UPDATE / SPEED_ALERT / TEMPERATURE_ALERT / LOW_FUEL / RECOVERY)
- a timestamp

Periodic endpoint output must include aggregates for a time window, trend deltas
against the previous window, and a threshold-derived alerts list.

## Non-Functional Requirements

- TypeScript throughout application code.
- Responsive UI.
- Consistent dark theme.
- Readable contrast.
- Reusable components.
- Typed API contracts.
- Clear backend/frontend separation.
- Graceful error handling.
- No dependency on external live APIs.

## Assignment Coverage

| PDF section | Requirements |
|---|---|
| 1) Live real-time data ingestion | FR-01, FR-02, FR-03 |
| 2) Periodic API fetching | FR-04, FR-05 |
| 3) Theming consistency | FR-11 |
| 4) Session management | FR-06, FR-07, FR-08 |
| 5) 5-6 pages | FR-09 |
| 6) Domain coherence | FR-12 |
| 7) Multi-modality interactivity | FR-10 |
| Dummy live data generator | FR-13 |
| Periodic dummy data for polling | FR-05, FR-13 |

## Acceptance Criteria

The implementation can be demonstrated from a clean startup with:
- Login
- Dashboard realtime updates
- Analytics periodic updates
- Vehicles interactions
- Alerts interactions
- Settings controls
- Logout

Per-requirement validation steps are listed in `traceability.md`.
