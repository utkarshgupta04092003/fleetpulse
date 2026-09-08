import {
  SUMMARY_WINDOW_SECONDS,
  TREND_BUCKET_COUNT,
  TREND_BUCKET_SECONDS,
} from '../config/index.js'
import type {
  DashboardSummary,
  DashboardTrends,
  MetricDelta,
  TelemetryEvent,
  TrendPoint,
  VehicleStatus,
} from '../types/index.js'
import { average, isWithin, now, round1 } from '../utils/index.js'
import { getEventsSince, getHistory, getVehicles } from './telemetry.service.js'

type MetricKey = 'speed' | 'temperature' | 'fuelLevel'

export function getSummary(): DashboardSummary {
  const vehicles = getVehicles()
  const clock = Date.now()
  const windowMs = SUMMARY_WINDOW_SECONDS * 1000

  const current = getEventsSince(clock - windowMs)
  const previous = getHistory().filter((event) =>
    isWithin(event.timestamp, clock - windowMs * 2, clock - windowMs),
  )

  const counts = { ACTIVE: 0, IDLE: 0, WARNING: 0, CRITICAL: 0 }
  for (const vehicle of vehicles) {
    counts[vehicle.status]++
  }

  return {
    totalVehicles: vehicles.length,
    activeVehicles: counts.ACTIVE,
    idleVehicles: counts.IDLE,
    warningVehicles: counts.WARNING,
    criticalVehicles: counts.CRITICAL,
    averageSpeed: delta(current, previous, 'speed'),
    averageTemperature: delta(current, previous, 'temperature'),
    averageFuel: delta(current, previous, 'fuelLevel'),
    windowSeconds: SUMMARY_WINDOW_SECONDS,
    generatedAt: now(),
  }
}

function delta(
  current: TelemetryEvent[],
  previous: TelemetryEvent[],
  key: MetricKey,
): MetricDelta {
  const value = round1(average(current.map((event) => event[key])))

  // No prior window yet, so there is nothing to compare against.
  if (previous.length === 0) return { value, delta: 0 }

  const before = average(previous.map((event) => event[key]))
  return { value, delta: round1(value - before) }
}

export function getTrends(): DashboardTrends {
  const clock = Date.now()
  const bucketMs = TREND_BUCKET_SECONDS * 1000
  const history = getHistory()
  const points: TrendPoint[] = []

  for (let i = TREND_BUCKET_COUNT - 1; i >= 0; i--) {
    const end = clock - i * bucketMs
    const events = history.filter((event) => isWithin(event.timestamp, end - bucketMs, end))

    points.push({
      timestamp: new Date(end).toISOString(),
      averageSpeed: round1(average(events.map((event) => event.speed))),
      averageTemperature: round1(average(events.map((event) => event.temperature))),
      averageFuel: round1(average(events.map((event) => event.fuelLevel))),
      eventCount: events.length,
    })
  }

  const counts: Record<VehicleStatus, number> = {
    ACTIVE: 0,
    IDLE: 0,
    WARNING: 0,
    CRITICAL: 0,
  }

  for (const vehicle of getVehicles()) {
    counts[vehicle.status]++
  }

  return {
    points,
    bucketSeconds: TREND_BUCKET_SECONDS,
    statusDistribution: Object.entries(counts).map(([status, count]) => ({
      status: status as VehicleStatus,
      count,
    })),
    generatedAt: now(),
  }
}
