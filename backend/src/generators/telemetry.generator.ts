import {
  DEFAULT_THRESHOLDS,
  METRIC_BOUNDS,
  REFUEL_FLOOR,
  REFUEL_RANGE,
  VEHICLES_PER_TICK,
  env,
} from '../config/index.js'
import { addEvent, deriveStatus, getVehicles, updateVehicle } from '../services/index.js'
import type {
  TelemetryEvent,
  TelemetryEventType,
  Vehicle,
  VehicleMetrics,
  VehicleStatus,
} from '../types/index.js'
import { clamp, now, randomBetween, randomChance, randomItem, round1 } from '../utils/index.js'

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
  const vehicles = getVehicles()

  for (let i = 0; i < VEHICLES_PER_TICK; i++) {
    const event = evolve(randomItem(vehicles))
    for (const listener of listeners) {
      listener(event)
    }
  }
}

function evolve(vehicle: Vehicle): TelemetryEvent {
  const refuelled = vehicle.fuelLevel <= REFUEL_FLOOR

  // Parked vehicles mostly stay parked, otherwise they never settle.
  const drifted =
    vehicle.speed < 1 && randomChance(0.7) ? 0 : vehicle.speed + randomBetween(-8, 8)

  const speed = clamp(drifted, METRIC_BOUNDS.speed.min, METRIC_BOUNDS.speed.max)

  const metrics: VehicleMetrics = {
    speed: round1(speed),
    temperature: round1(
      clamp(
        50 + speed * 0.35 + randomBetween(-3, 3),
        METRIC_BOUNDS.temperature.min,
        METRIC_BOUNDS.temperature.max,
      ),
    ),
    fuelLevel: round1(
      refuelled
        ? randomBetween(REFUEL_RANGE.min, REFUEL_RANGE.max)
        : clamp(
            vehicle.fuelLevel - randomBetween(0.05, 0.4),
            METRIC_BOUNDS.fuelLevel.min,
            METRIC_BOUNDS.fuelLevel.max,
          ),
    ),
  }

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

function pickEventType(
  metrics: VehicleMetrics,
  status: VehicleStatus,
  previousStatus: VehicleStatus,
  refuelled: boolean,
): TelemetryEventType {
  if (refuelled) return 'RECOVERY'
  if (metrics.temperature >= DEFAULT_THRESHOLDS.temperatureWarning) return 'TEMPERATURE_ALERT'
  if (metrics.speed >= DEFAULT_THRESHOLDS.speed) return 'SPEED_ALERT'
  if (metrics.fuelLevel <= DEFAULT_THRESHOLDS.fuelWarning) return 'LOW_FUEL'

  const wasUnhealthy = previousStatus === 'WARNING' || previousStatus === 'CRITICAL'
  if (wasUnhealthy && status !== 'WARNING' && status !== 'CRITICAL') return 'RECOVERY'

  return 'UPDATE'
}
