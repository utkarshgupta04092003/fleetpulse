import type { Alert, AlertThresholds } from './alert'
import type { VehicleStatus } from './vehicle'

export type MetricDelta = {
  value: number
  delta: number
}

export type DashboardSummary = {
  totalVehicles: number
  activeVehicles: number
  idleVehicles: number
  warningVehicles: number
  criticalVehicles: number
  averageSpeed: MetricDelta
  averageTemperature: MetricDelta
  averageFuel: MetricDelta
  windowSeconds: number
  generatedAt: string
}

export type TrendPoint = {
  timestamp: string
  averageSpeed: number
  averageTemperature: number
  averageFuel: number
  eventCount: number
}

export type DashboardTrends = {
  points: TrendPoint[]
  bucketSeconds: number
  statusDistribution: Array<{ status: VehicleStatus; count: number }>
  generatedAt: string
}

export type DashboardAlerts = {
  alerts: Alert[]
  totalAlerts: number
  criticalCount: number
  warningCount: number
  thresholds: AlertThresholds
  generatedAt: string
}
