import type { AlertThresholds } from '../types/index.js'

export const FLEET_SIZE = 100

export const METRIC_BOUNDS = {
  speed: { min: 0, max: 120 },
  temperature: { min: 40, max: 110 },
  fuelLevel: { min: 0, max: 100 },
} as const

export const DEFAULT_THRESHOLDS: AlertThresholds = {
  speed: 95,
  temperatureWarning: 75,
  temperatureCritical: 85,
  fuelWarning: 15,
  fuelCritical: 8,
}

export const TEMPERATURE_THRESHOLD_RANGE = { min: 60, max: 100 } as const

// Batched per tick; one vehicle per tick would leave the fleet visibly frozen.
export const VEHICLES_PER_TICK = 4

export const REFUEL_FLOOR = 6
export const REFUEL_RANGE = { min: 85, max: 100 } as const

export const SUMMARY_WINDOW_SECONDS = 60
export const TREND_BUCKET_SECONDS = 30
export const TREND_BUCKET_COUNT = 20
