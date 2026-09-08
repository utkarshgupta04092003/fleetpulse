import {
  DEFAULT_THRESHOLDS,
  METRIC_BOUNDS,
  REFUEL_FLOOR,
  REFUEL_RANGE,
} from '../config/index.js'
import type {
  TelemetryEventType,
  VehicleMetrics,
  VehicleStatus,
} from '../types/index.js'
import { clamp, randomBetween, randomChance, round1 } from '../utils/index.js'

export type EvolutionResult = {
  metrics: VehicleMetrics
  refuelled: boolean
}

// One step of telemetry drift. Shared by the live generator and the boot
// backfill so seeded history obeys the same rules as live data.
export function evolveMetrics(current: VehicleMetrics): EvolutionResult {
  const refuelled = current.fuelLevel <= REFUEL_FLOOR

  // Parked vehicles mostly stay parked, otherwise they never settle.
  const drifted =
    current.speed < 1 && randomChance(0.7) ? 0 : current.speed + randomBetween(-8, 8)

  const speed = clamp(drifted, METRIC_BOUNDS.speed.min, METRIC_BOUNDS.speed.max)

  return {
    refuelled,
    metrics: {
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
              current.fuelLevel - randomBetween(0.05, 0.4),
              METRIC_BOUNDS.fuelLevel.min,
              METRIC_BOUNDS.fuelLevel.max,
            ),
      ),
    },
  }
}

export function pickEventType(
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
