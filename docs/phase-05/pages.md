# Phase 05 - Pages

## 1. Login

Purpose:
- authenticate user
- explain FleetPulse briefly
- provide demo credentials hint
- show validation/loading/error feedback

Must use the same visual theme as the authenticated application.

## 2. Dashboard

Primary realtime page.

Content:
- total vehicles
- active vehicles
- average speed
- average temperature
- average fuel
- LIVE indicator
- last received timestamp
- live vehicle telemetry
- recent events
- connection status

At least three metrics must visibly change over time.

## 3. Analytics

Purpose:
- show periodic aggregated data

Content:
- average speed
- fleet health distribution
- temperature trend
- fuel trend
- performance summary
- trend deltas
- last updated timestamp

The page should not simply duplicate the raw SSE feed.

## 4. Vehicles

Purpose:
- inspect the fleet

Content:
- vehicle table
- vehicle number
- driver
- location
- speed
- temperature
- fuel
- status
- last updated

Interactions:
- search
- status filter
- sorting
- vehicle row click
- details drawer

## 5. Alerts

Purpose:
- investigate derived fleet problems

Content:
- total alerts
- critical count
- warning count
- alert table
- severity
- vehicle
- alert type
- value
- threshold
- time
- resolution status

Interactions:
- search
- severity filter
- sorting
- details drawer/modal

## 6. Settings

Purpose:
- control user/session preferences

Content:
- live updates toggle
- pause/resume control
- polling interval: 5/10/15 seconds
- temperature threshold slider
- current session information
- logout

Changing settings must visibly affect application behavior or rendered data.

## Navigation

Use a consistent sidebar/header navigation.

Show current route clearly.

Navigation should remain usable on every protected page.
