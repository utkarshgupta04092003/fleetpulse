# FleetPulse - Development Rules

## 1. Project Context

FleetPulse is a production-style full-stack fleet and vehicle telemetry dashboard for a technical assessment.

The application must demonstrate:
- backend-generated realtime telemetry
- SSE-based live updates
- periodic REST API polling
- frontend session management
- protected routes and APIs
- six meaningful pages
- data visualization
- search/filter/sort interactions
- drawers/modals and visible UI feedback
- consistent professional theming
- coherent dummy data and domain terminology

The assignment in `docs/assignment/Full-Stack Recruitment Task.pdf` is the final authority.

## 2. Domain

Domain: fleet and vehicle telemetry monitoring.

The product monitors a synthetic delivery fleet. Users can observe live vehicle health, inspect vehicles, review alerts, and analyze aggregated fleet performance.

Use these terms consistently:
- Fleet
- Vehicle
- Driver
- Telemetry
- Speed
- Temperature
- Fuel Level
- Status
- Alert
- Event
- Analytics

Do not introduce unrelated domain concepts.

## 3. Technology Stack

Frontend:
- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Zustand
- Recharts
- Framer Motion

Backend:
- Node.js
- Express
- TypeScript
- Server-Sent Events (SSE)

Supporting:
- Zod for validation
- native fetch or Axios
- ESLint
- Prettier

Avoid adding libraries unless they provide a clear benefit.

## 4. Architecture Rules

Keep frontend and backend separated:

frontend/
backend/

Frontend responsibilities:
- routing
- UI rendering
- client state
- session state
- SSE consumption
- periodic API polling
- interaction state

Backend responsibilities:
- authentication/session endpoints
- protected APIs
- telemetry generation
- SSE streaming
- aggregation and derived analytics
- alert generation

Do not put business logic inside React components when it belongs in a service/store.

## 5. Realtime Rules

Use SSE for backend-to-frontend telemetry.

Endpoint:
GET /api/telemetry/stream

The backend should emit an event approximately every 2 seconds.

Each telemetry event must contain:
- vehicleId
- speed
- temperature
- fuelLevel
- status
- eventType
- timestamp

The frontend must:
- connect after authentication
- ingest events into Zustand state
- update visible metrics without refresh
- show a LIVE indicator
- show the last received timestamp
- support pause/resume

Pause should stop applying incoming events to rendered live state while keeping connection handling safe. Resume should continue from newly received events.

## 6. Dummy Data Rules

Seed approximately:
- 100 vehicles
- 20 drivers
- 10-15 locations

Maintain vehicle state rather than generating unrelated random values.

Example evolution:
- speed = previous speed + random fluctuation
- temperature correlates roughly with speed
- fuel decreases gradually
- status is derived from health thresholds

Statuses:
- ACTIVE
- IDLE
- WARNING
- CRITICAL

Event types:
- UPDATE
- SPEED_ALERT
- TEMPERATURE_ALERT
- LOW_FUEL
- RECOVERY

Use bounded values and realistic transitions.

## 7. Periodic API Rules

Polling interval defaults to 10 seconds and can be configured to 5, 10, or 15 seconds.

Required endpoints:
- GET /api/dashboard/summary
- GET /api/dashboard/alerts
- GET /api/dashboard/trends

Periodic data must be logically different from raw SSE telemetry.

Summary should expose aggregated values such as:
- totalVehicles
- activeVehicles
- averageSpeed
- averageTemperature
- averageFuel
- trend deltas

Alerts should expose derived alert counts and recent alerts.

Trends should expose historical/aggregated time-series data for speed, temperature, and fuel.

## 8. Authentication Rules

Demo credentials:
- Email: demo@fleetpulse.com
- Password: password123

Endpoints:
- POST /api/auth/login
- POST /api/auth/logout
- GET /api/auth/session

Protect dashboard APIs with session validation.

Frontend must:
- redirect unauthenticated users to /login
- clear invalid/expired sessions
- redirect after logout
- handle 401 responses safely
- avoid rendering protected data after session expiry

Never store a real password or secret in source code.

## 9. Pages

Exactly six primary pages:
1. Login
2. Dashboard
3. Analytics
4. Vehicles
5. Alerts
6. Settings

All pages must contain meaningful fleet-related content.

## 10. Theme

Use a dark operations-dashboard theme.

Colors:
- Background: #0B1120
- Cards: #111827
- Card hover: #172033
- Primary: #6366F1
- Secondary: #8B5CF6
- Success: #22C55E
- Warning: #F59E0B
- Critical: #EF4444
- Info: #38BDF8
- Primary text: #F8FAFC
- Secondary text: #94A3B8
- Border: #1E293B

Keep contrast readable.

Avoid excessive gradients, shadows, glow effects, or animations.

## 11. Interaction Rules

Required interactions include:
- search
- filtering
- sorting
- live pause/resume
- configurable refresh interval
- temperature threshold control
- vehicle details drawer
- alert details drawer/modal

At least one control must change rendered content.

At least one interaction must trigger visible feedback such as a drawer, modal, toast, expanded content, or mode change.

## 12. Animation Rules

Use Framer Motion selectively for:
- page transitions
- card entrance
- number/value changes
- live indicator
- drawers
- alert transitions

Animations must support usability and must not distract from telemetry.

## 13. Code Quality

Prefer:
- small reusable components
- typed API responses
- explicit domain types
- service/store separation
- centralized constants
- reusable table/filter components
- predictable error handling

Avoid:
- any types without justification
- duplicated business logic
- hardcoded UI data when it should come from the API
- unnecessary abstraction
- unused dependencies
- console noise in production code

## 14. Development Workflow

Implement in this order:
1. foundation and architecture
2. backend data model and generator
3. authentication
4. SSE and polling
5. frontend pages
6. interactions
7. polish and validation

Keep documentation synchronized with implementation.

Before declaring the project complete, verify every assignment requirement manually.
