import { DEFAULT_THRESHOLDS } from '../config/index.js'
import type { AlertThresholds, VehicleMetrics, VehicleStatus } from '../types/index.js'

// Worst condition wins. Everything that shows a status calls this.
export function deriveStatus(
  metrics: VehicleMetrics,
  thresholds: AlertThresholds = DEFAULT_THRESHOLDS,
): VehicleStatus {
  const { speed, temperature, fuelLevel } = metrics

  if (temperature >= thresholds.temperatureCritical) return 'CRITICAL'
  if (fuelLevel <= thresholds.fuelCritical) return 'CRITICAL'
  if (temperature >= thresholds.temperatureWarning) return 'WARNING'
  if (fuelLevel <= thresholds.fuelWarning) return 'WARNING'
  if (speed >= thresholds.speed) return 'WARNING'
  if (speed < 1) return 'IDLE'

  return 'ACTIVE'
}
