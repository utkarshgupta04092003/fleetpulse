# FleetPulse - Project Brief

## Overview

FleetPulse is a production-style full-stack fleet and vehicle telemetry monitoring dashboard built for the Full-Stack Recruitment Task.

The application simulates a delivery fleet and provides two complementary data flows:

1. Live telemetry through Server-Sent Events.
2. Periodically fetched aggregated and derived analytics through REST APIs.

The goal is to demonstrate production-style full-stack engineering rather than merely displaying static dummy data.

## Core User Story

A fleet operations user logs into FleetPulse and monitors vehicle health in real time.

They can:
- see live vehicle telemetry
- identify unhealthy vehicles
- inspect individual vehicles
- review alerts
- analyze fleet-level trends
- control live/polling behavior
- log out safely

## Domain

Fleet / vehicle telemetry monitoring.

### Primary entities

- Vehicle
- Driver
- Telemetry Event
- Alert
- Fleet Metric
- Location

## Realtime Flow

Backend simulator
-> telemetry state update
-> SSE event
-> frontend SSE client
-> Zustand telemetry store
-> live dashboard UI

Telemetry contains:
- vehicleId
- speed
- temperature
- fuelLevel
- status
- eventType
- timestamp

## Periodic Flow

Frontend polling service
-> REST aggregation endpoints
-> dashboard/analytics Zustand state
-> charts, summaries and alerts

Default polling interval: 10 seconds.

Available intervals:
- 5 seconds
- 10 seconds
- 15 seconds

## Authentication

Demo login:
- demo@fleetpulse.com
- password123

Protected application pages:
- Dashboard
- Analytics
- Vehicles
- Alerts
- Settings

The backend also protects dashboard APIs.

## Pages

### Login
Public entry point and authentication flow.

### Dashboard
Realtime fleet overview with:
- live metrics
- LIVE indicator
- last received time
- live telemetry
- recent events

### Analytics
Aggregated periodic data:
- average speed
- fleet health
- fuel trends
- temperature trends
- performance summary

### Vehicles
Vehicle search/filter/sort and vehicle details drawer.

### Alerts
Derived alerts with severity, filtering, sorting and alert details.

### Settings
Session controls and telemetry preferences:
- live updates
- pause/resume
- polling interval
- temperature threshold
- logout

## Success Criteria

The implementation is successful when:
- live values visibly change without refresh
- SSE is demonstrably used
- periodic REST polling is demonstrably used
- periodic data differs from raw telemetry
- protected routes work
- logout and invalid-session handling work
- all six pages are meaningful
- at least two interaction categories are implemented
- theme is consistent
- assignment requirements are demonstrably satisfied
