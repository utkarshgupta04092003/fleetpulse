// Mirrors backend/src/types - the backend copy is canonical.
export type VehicleStatus = 'ACTIVE' | 'IDLE' | 'WARNING' | 'CRITICAL'

export type Vehicle = {
  id: string
  vehicleNumber: string
  driverName: string
  location: string
  speed: number
  temperature: number
  fuelLevel: number
  status: VehicleStatus
  lastUpdated: string
}

export type VehicleMetrics = Pick<Vehicle, 'speed' | 'temperature' | 'fuelLevel'>
