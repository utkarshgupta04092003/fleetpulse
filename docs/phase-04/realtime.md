# Phase 04 - Realtime and Polling

## Objective

Implement the two distinct backend-to-frontend data flows required by the assignment.

## Flow A - Realtime SSE

Endpoint:

```text
GET /api/telemetry/stream
```

The server sends telemetry approximately every 2 seconds.

Example event:

```json
{
  "vehicleId": "VH-001",
  "speed": 62,
  "temperature": 71.4,
  "fuelLevel": 64.8,
  "status": "ACTIVE",
  "eventType": "UPDATE",
  "timestamp": "2026-09-08T12:00:00.000Z"
}
```

Frontend:
- uses EventSource
- parses events
- updates telemetryStore
- records lastReceivedAt
- renders current values
- maintains recent event history

## LIVE Indicator

Dashboard must show:
- LIVE when stream is connected and receiving data
- RECONNECTING when connection is unavailable
- PAUSED when user pauses applying live updates

The last received timestamp must always be visible.

## Pause/Resume

Pause is a UI control.

When paused:
- keep the app stable
- do not update displayed live metrics
- retain enough connection state to resume safely

When resumed:
- apply new incoming telemetry
- update last received time
- return to LIVE state

## Flow B - Periodic REST Polling

Default interval: 10 seconds.

Allowed intervals:
- 5 seconds
- 10 seconds
- 15 seconds

Required APIs:
- /api/dashboard/summary
- /api/dashboard/alerts
- /api/dashboard/trends

The frontend must display:
- data
- last updated timestamp
- loading state
- error state

## Difference Between Flows

Realtime:
- raw recent telemetry
- individual vehicle events
- rapidly changing values

Periodic:
- averages
- totals
- trend deltas
- derived alerts
- historical trends

This distinction must remain visible in the UI and architecture.

## Failure Handling

SSE:
- reconnect when appropriate
- display connection state
- avoid duplicate timers

REST:
- show stale/error state when a poll fails
- retry on the next interval
- handle 401 centrally

## Cleanup

On page unmount or logout:
- close EventSource
- clear polling interval
- prevent state updates after cleanup
