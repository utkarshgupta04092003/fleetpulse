import { VEHICLES_PER_TICK, env } from '../config/index.js'
import {
  addEvent,
  deriveStatus,
  evolveMetrics,
  getVehicles,
  pickEventType,
  updateVehicle,
} from '../services/index.js'
import type { TelemetryEvent, Vehicle } from '../types/index.js'
import { now, randomItem } from '../utils/index.js'

type Listener = (event: TelemetryEvent) => void

const listeners = new Set<Listener>()
let timer: NodeJS.Timeout | null = null

export function onTelemetry(listener: Listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function startGenerator() {
  if (timer) return

  timer = setInterval(() => {
    try {
      tick()
    } catch (error) {
      console.error('[generator] tick failed', error)
    }
  }, env.TELEMETRY_INTERVAL_MS)
}

export function stopGenerator() {
  if (!timer) return
  clearInterval(timer)
  timer = null
}

function tick() {
  for (const vehicle of pickDistinct(getVehicles(), VEHICLES_PER_TICK)) {
    const event = evolve(vehicle)
    for (const listener of listeners) {
      listener(event)
    }
  }
}

function pickDistinct(vehicles: Vehicle[], count: number) {
  const chosen = new Map<string, Vehicle>()
  let attempts = 0

  while (chosen.size < Math.min(count, vehicles.length) && attempts < count * 10) {
    const vehicle = randomItem(vehicles)
    chosen.set(vehicle.id, vehicle)
    attempts++
  }

  return chosen.values()
}

function evolve(vehicle: Vehicle): TelemetryEvent {
  const { metrics, refuelled } = evolveMetrics(vehicle)
  const status = deriveStatus(metrics)
  const timestamp = now()

  updateVehicle({ ...vehicle, ...metrics, status, lastUpdated: timestamp })

  const event: TelemetryEvent = {
    vehicleId: vehicle.id,
    ...metrics,
    status,
    eventType: pickEventType(metrics, status, vehicle.status, refuelled),
    timestamp,
  }

  addEvent(event)
  return event
}
