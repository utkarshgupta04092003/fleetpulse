# Phase 05 - Frontend

## Objective

Build the six-page FleetPulse application using Next.js, TypeScript, Tailwind, shadcn/ui, Zustand, Recharts and Framer Motion.

## Frontend Structure

Suggested:

```text
frontend/
├── app/
│   ├── login/
│   ├── dashboard/
│   ├── analytics/
│   ├── vehicles/
│   ├── alerts/
│   └── settings/
├── components/
│   ├── layout/
│   ├── dashboard/
│   ├── vehicles/
│   ├── alerts/
│   └── ui/
├── stores/
│   ├── auth.store.ts
│   ├── telemetry.store.ts
│   ├── dashboard.store.ts
│   └── settings.store.ts
├── lib/
│   ├── api.ts
│   ├── auth.ts
│   └── telemetry.ts
└── types/
```

## State

### authStore
- authenticated
- user/session
- loading
- login/logout actions

### telemetryStore
- latest telemetry
- recent events
- connection state
- last received timestamp
- paused state

### dashboardStore
- summary
- alerts
- trends
- loading/error
- last updated timestamp

### settingsStore
- polling interval
- temperature threshold
- live enabled/paused

## API Client

Centralize authenticated requests.

The API client must:
- attach session credentials
- parse JSON
- handle errors
- handle 401 centrally

## Responsive Design

Support:
- desktop
- tablet
- smaller laptop widths

Prioritize dashboard readability over dense information.

## Component Principles

Prefer:
- reusable metric cards
- reusable status badges
- reusable tables
- reusable filters
- reusable drawer/modal
- reusable chart wrappers

Avoid large monolithic page components.

## Charts

Use Recharts for:
- speed trend
- temperature trend
- fuel trend
- fleet health distribution

Charts must use FleetPulse terminology and theme tokens.
