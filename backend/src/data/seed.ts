import { FLEET_SIZE } from '../config/index.js'
import { deriveStatus } from '../services/status.js'
import type { Vehicle } from '../types/index.js'
import { now, randomBetween, randomChance, round1 } from '../utils/index.js'

export const drivers = [
  'Amara Okafor',
  'Ravi Deshmukh',
  'Elena Marchetti',
  'Tomas Brennan',
  'Priya Nair',
  'Marcus Adeyemi',
  'Sofia Reyes',
  'Daniel Kowalski',
  'Leila Haddad',
  'Jonas Lindqvist',
  'Meera Iyer',
  'Owen Gallagher',
  'Nadia Petrova',
  'Hugo Ferreira',
  'Kiran Malhotra',
  'Grace Mensah',
  'Andrei Popescu',
  'Yuki Tanaka',
  'Sean Whitaker',
  'Farida Rahman',
]

export const locations = [
  'Northgate Depot',
  'Harbour Terminal',
  'Westfield Hub',
  'Central Yard',
  'Riverside Depot',
  'Eastline Junction',
  'Southbank Terminal',
  'Airport Freight Gate',
  'Meadowbrook Hub',
  'Ironworks Yard',
  'Lakeside Crossing',
  'Summit Distribution',
]

export function createFleet() {
  const timestamp = now()
  const fleet = new Map<string, Vehicle>()

  for (let i = 0; i < FLEET_SIZE; i++) {
    const id = `VH-${String(i + 1).padStart(3, '0')}`

    // Some vehicles start parked so the fleet is not uniformly in motion.
    const speed = randomChance(0.25) ? 0 : randomBetween(25, 85)

    const metrics = {
      speed: round1(speed),
      temperature: round1(50 + speed * 0.35 + randomBetween(-4, 4)),
      fuelLevel: round1(randomBetween(20, 100)),
    }

    fleet.set(id, {
      id,
      vehicleNumber: `FP-${1001 + i}`,
      driverName: drivers[i % drivers.length],
      location: locations[i % locations.length],
      ...metrics,
      status: deriveStatus(metrics),
      lastUpdated: timestamp,
    })
  }

  return fleet
}
