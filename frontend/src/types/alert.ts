export type AlertSeverity = 'WARNING' | 'CRITICAL'

export type AlertType = 'SPEED' | 'TEMPERATURE' | 'FUEL'

export type AlertStatus = 'OPEN' | 'RESOLVED'

export type Alert = {
  id: string
  vehicleId: string
  vehicleNumber: string
  severity: AlertSeverity
  type: AlertType
  message: string
  value: number
  threshold: number
  status: AlertStatus
  timestamp: string
}

export type AlertThresholds = {
  speed: number
  temperatureWarning: number
  temperatureCritical: number
  fuelWarning: number
  fuelCritical: number
}
