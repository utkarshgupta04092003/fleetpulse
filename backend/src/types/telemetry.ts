import type { VehicleStatus } from './vehicle.js'

export type TelemetryEventType =
  | 'UPDATE'
  | 'SPEED_ALERT'
  | 'TEMPERATURE_ALERT'
  | 'LOW_FUEL'
  | 'RECOVERY'

export type TelemetryEvent = {
  vehicleId: string
  speed: number
  temperature: number
  fuelLevel: number
  status: VehicleStatus
  eventType: TelemetryEventType
  timestamp: string
}
