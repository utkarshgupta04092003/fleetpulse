# Phase 02 - Backend

## Objective

Build the Express backend, synthetic fleet state and aggregation services.

## Backend Responsibilities

- start HTTP server
- expose health endpoint
- authenticate demo users
- validate sessions
- generate telemetry
- maintain recent history
- provide SSE stream
- provide aggregated APIs
- derive alerts

## Generator

The generator runs continuously at approximately two-second intervals.

Each cycle:
1. choose a vehicle
2. evolve its current telemetry
3. derive status
4. determine event type
5. append the event to history
6. broadcast through SSE

## Metric Evolution

Do not generate completely independent random values.

Example:

```text
newSpeed = previousSpeed + random(-8, +8)
temperature ~= 50 + speed * 0.35 + random(-3, +3)
fuelLevel = previousFuelLevel - smallConsumption
```

Clamp values to realistic ranges.

## Status Rules

Example initial rules:
- temperature > 85 -> CRITICAL
- temperature > 75 -> WARNING
- fuel < 15 -> WARNING
- otherwise -> ACTIVE

The rules may be refined during implementation, but must remain deterministic and documented.

## Aggregation Services

### Summary

Calculate:
- total vehicles
- active vehicles
- average speed
- average temperature
- average fuel
- trend deltas against a previous window

### Alerts

Derive alerts from telemetry thresholds.

Include:
- severity
- vehicle
- metric
- current value
- threshold
- message
- timestamp
- status

### Trends

Produce historical time-series points suitable for Recharts.

Metrics:
- average speed
- average temperature
- average fuel

## API Validation

Use Zod where request input requires validation.

Do not trust client-provided vehicle IDs, thresholds or query parameters.

## Logging

Keep logs useful:
- server start
- authentication events
- SSE connection/disconnection
- unexpected generator errors

Avoid logging passwords or session secrets.
