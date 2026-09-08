# Phase 06 - Interactions

## Objective

Satisfy the assignment's multi-modality interaction requirement with meaningful controls and visible responses.

## Interaction 1 - Search

Vehicles and Alerts pages provide search.

Search affects rendered rows immediately.

## Interaction 2 - Filtering

Vehicles:
- status filter

Alerts:
- severity filter
- alert type filter

Filtering changes the visible dataset.

## Interaction 3 - Sorting

Tables support sorting by useful fields.

Examples:
- speed
- temperature
- fuel
- timestamp
- severity

## Interaction 4 - Live Pause/Resume

Dashboard and Settings provide live control.

Visible state:
- LIVE
- PAUSED
- RECONNECTING

Metric updates stop/resume accordingly.

## Interaction 5 - Threshold Slider

Settings exposes a temperature threshold.

Changing the threshold updates:
- alert interpretation
- visible warning/critical state where applicable
- derived alert presentation

The threshold should be sent to the backend when server-side derivation is required, otherwise the frontend can use it for display filtering while preserving backend defaults.

## Interaction 6 - Vehicle Drawer

Clicking a vehicle opens a drawer containing:
- vehicle information
- current telemetry
- status
- recent telemetry chart
- recent alerts

Closing the drawer returns to the table.

## Interaction 7 - Alert Drawer

Clicking an alert opens details:
- alert message
- metric value
- threshold
- vehicle
- timestamp
- status

## Interaction 8 - Animation

Use subtle motion for:
- page entry
- metric changes
- drawer opening
- alert appearance
- live indicator

## Interaction Acceptance

The implementation must demonstrate:
- at least one control changing rendered content
- at least one action producing a visible UI response
- at least two interaction categories

FleetPulse exceeds the minimum with form, realtime, modal/drawer and visual interactions.
