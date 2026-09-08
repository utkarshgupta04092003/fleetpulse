# Phase 01 - Requirements

## Objective

Convert the recruitment task into explicit FleetPulse requirements before implementation.

## Functional Requirements

### FR-01 Realtime telemetry
The backend continuously generates vehicle telemetry and exposes it through SSE.

### FR-02 Live metrics
The dashboard displays at least three changing numeric metrics.

FleetPulse metrics:
- Speed
- Temperature
- Fuel Level

### FR-03 Live state
Every live update includes status, event type and timestamp.

### FR-04 Periodic analytics
The frontend periodically fetches aggregated/derived data.

### FR-05 Periodic endpoints
At least two backend endpoints return aggregated or derived content.

FleetPulse provides:
- /api/dashboard/summary
- /api/dashboard/alerts
- /api/dashboard/trends

### FR-06 Authentication
Users authenticate with demo credentials. Protected routes redirect unauthenticated users to Login.

### FR-07 Session invalidation
Invalid or expired sessions clear frontend session state and redirect to Login.

### FR-08 Logout
Users can explicitly log out.

### FR-09 Pages
The application contains six meaningful pages.

### FR-10 Interactivity
The application supports search/filter/sort, live pause/resume, threshold control and detail drawers.

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

## Acceptance Criteria

The implementation can be demonstrated from a clean startup with:
- Login
- Dashboard realtime updates
- Analytics periodic updates
- Vehicles interactions
- Alerts interactions
- Settings controls
- Logout
