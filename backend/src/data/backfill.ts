import { BACKFILL_INTERVAL_MS, BACKFILL_POINTS } from '../config/index.js'
import { evolveMetrics, pickEventType } from '../services/evolution.js'
import { deriveStatus } from '../services/status.js'
import type { TelemetryEvent, Vehicle } from '../types/index.js'

// Walks every vehicle forward through the recent past so the app has history
// on first load: vehicle charts are not empty and trend buckets are populated.
// Leaves each vehicle at the final state, which becomes its current telemetry.
export function createBackfill(fleet: Map<string, Vehicle>) {
  const events: TelemetryEvent[] = []
  const start = Date.now() - BACKFILL_POINTS * BACKFILL_INTERVAL_MS

  for (const vehicle of fleet.values()) {
    let current = vehicle

    for (let i = 0; i < BACKFILL_POINTS; i++) {
      const { metrics, refuelled } = evolveMetrics(current)
      const status = deriveStatus(metrics)
      const timestamp = new Date(start + i * BACKFILL_INTERVAL_MS).toISOString()

      events.push({
        vehicleId: current.id,
        ...metrics,
        status,
        eventType: pickEventType(metrics, status, current.status, refuelled),
        timestamp,
      })

      current = { ...current, ...metrics, status, lastUpdated: timestamp }
    }

    fleet.set(current.id, current)
  }

  // The ring buffer drops from the front, so it has to be in time order.
  events.sort((a, b) => a.timestamp.localeCompare(b.timestamp))
  return events
}
