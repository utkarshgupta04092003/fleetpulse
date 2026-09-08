import { DEFAULT_THRESHOLDS } from '../config/index.js'
import type {
  Alert,
  AlertSeverity,
  AlertThresholds,
  AlertType,
  DashboardAlerts,
  Vehicle,
} from '../types/index.js'
import { now } from '../utils/index.js'
import { getVehicles } from './telemetry.service.js'

export function getAlerts(overrides: Partial<AlertThresholds> = {}): DashboardAlerts {
  const thresholds = { ...DEFAULT_THRESHOLDS, ...overrides }
  const alerts = getVehicles().flatMap((vehicle) => buildAlerts(vehicle, thresholds))

  alerts.sort((a, b) => {
    if (a.severity !== b.severity) return a.severity === 'CRITICAL' ? -1 : 1
    return b.timestamp.localeCompare(a.timestamp)
  })

  return {
    alerts,
    totalAlerts: alerts.length,
    criticalCount: alerts.filter((alert) => alert.severity === 'CRITICAL').length,
    warningCount: alerts.filter((alert) => alert.severity === 'WARNING').length,
    thresholds,
    generatedAt: now(),
  }
}

function buildAlerts(vehicle: Vehicle, thresholds: AlertThresholds) {
  const alerts: Alert[] = []

  if (vehicle.temperature >= thresholds.temperatureCritical) {
    alerts.push(
      make(vehicle, 'TEMPERATURE', 'CRITICAL', vehicle.temperature, thresholds.temperatureCritical),
    )
  } else if (vehicle.temperature >= thresholds.temperatureWarning) {
    alerts.push(
      make(vehicle, 'TEMPERATURE', 'WARNING', vehicle.temperature, thresholds.temperatureWarning),
    )
  }

  if (vehicle.fuelLevel <= thresholds.fuelCritical) {
    alerts.push(make(vehicle, 'FUEL', 'CRITICAL', vehicle.fuelLevel, thresholds.fuelCritical))
  } else if (vehicle.fuelLevel <= thresholds.fuelWarning) {
    alerts.push(make(vehicle, 'FUEL', 'WARNING', vehicle.fuelLevel, thresholds.fuelWarning))
  }

  if (vehicle.speed >= thresholds.speed) {
    alerts.push(make(vehicle, 'SPEED', 'WARNING', vehicle.speed, thresholds.speed))
  }

  return alerts
}

function make(
  vehicle: Vehicle,
  type: AlertType,
  severity: AlertSeverity,
  value: number,
  threshold: number,
): Alert {
  return {
    // Stable per vehicle and metric so the table keeps row identity across polls.
    id: `${vehicle.id}-${type}`,
    vehicleId: vehicle.id,
    vehicleNumber: vehicle.vehicleNumber,
    severity,
    type,
    message: describe(vehicle, type, severity, value, threshold),
    value,
    threshold,
    status: 'OPEN',
    timestamp: vehicle.lastUpdated,
  }
}

function describe(
  vehicle: Vehicle,
  type: AlertType,
  severity: AlertSeverity,
  value: number,
  threshold: number,
) {
  const label = severity === 'CRITICAL' ? 'Critical' : 'Warning'

  if (type === 'TEMPERATURE') {
    return `${label}: ${vehicle.vehicleNumber} engine temperature ${value}C exceeds ${threshold}C`
  }
  if (type === 'FUEL') {
    return `${label}: ${vehicle.vehicleNumber} fuel level ${value}% below ${threshold}%`
  }
  return `${label}: ${vehicle.vehicleNumber} speed ${value} km/h exceeds ${threshold} km/h`
}
