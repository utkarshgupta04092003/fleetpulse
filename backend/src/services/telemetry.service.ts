import { env } from '../config/index.js'
import { createBackfill, createFleet } from '../data/index.js'
import type { TelemetryEvent, Vehicle } from '../types/index.js'
import { toMillis } from '../utils/index.js'

const fleet = createFleet()
const history: TelemetryEvent[] = createBackfill(fleet)

export function getVehicles() {
  return Array.from(fleet.values())
}

export function getVehicle(id: string) {
  return fleet.get(id)
}

export function updateVehicle(vehicle: Vehicle) {
  fleet.set(vehicle.id, vehicle)
}

export function addEvent(event: TelemetryEvent) {
  history.push(event)
  if (history.length > env.HISTORY_LIMIT) {
    history.splice(0, history.length - env.HISTORY_LIMIT)
  }
}

export function getHistory() {
  return history
}

export function getVehicleHistory(vehicleId: string, limit = 30) {
  return history.filter((event) => event.vehicleId === vehicleId).slice(-limit)
}

export function getEventsSince(since: number) {
  return history.filter((event) => toMillis(event.timestamp) >= since)
}
