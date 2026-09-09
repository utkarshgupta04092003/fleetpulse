import { RECENT_EVENTS_LIMIT } from '@/config'
import type { TelemetryEvent, VehicleStatus } from '@/types'
import { create } from 'zustand'

export type ConnectionState = 'connecting' | 'live' | 'reconnecting' | 'paused'

export type ReceivedEvent = TelemetryEvent & { seq: number }

type TelemetryState = {
  connection: ConnectionState
  lastReceivedAt: string | null
  eventCount: number
  recentEvents: ReceivedEvent[]
  latestByVehicle: Record<string, TelemetryEvent>
  applyEvent: (event: TelemetryEvent) => void
  setConnection: (connection: ConnectionState) => void
  reset: () => void
}

const initial = {
  connection: 'connecting' as ConnectionState,
  lastReceivedAt: null,
  eventCount: 0,
  recentEvents: [] as ReceivedEvent[],
  latestByVehicle: {} as Record<string, TelemetryEvent>,
}

export const useTelemetryStore = create<TelemetryState>((set) => ({
  ...initial,

  applyEvent: (event) =>
    set((state) => {
      const seq = state.eventCount + 1

      return {
        connection: state.connection === 'paused' ? 'paused' : 'live',
        lastReceivedAt: event.timestamp,
        eventCount: seq,
        recentEvents: [{ ...event, seq }, ...state.recentEvents].slice(0, RECENT_EVENTS_LIMIT),
        latestByVehicle: { ...state.latestByVehicle, [event.vehicleId]: event },
      }
    }),

  setConnection: (connection) => set({ connection }),

  reset: () => set(initial),
}))

type LatestByVehicle = Record<string, TelemetryEvent>

export function computeLiveMetrics(latestByVehicle: LatestByVehicle) {
  const events = Object.values(latestByVehicle)

  if (events.length === 0) {
    return { speed: 0, temperature: 0, fuelLevel: 0, vehicles: 0 }
  }

  const total = events.reduce(
    (acc, event) => ({
      speed: acc.speed + event.speed,
      temperature: acc.temperature + event.temperature,
      fuelLevel: acc.fuelLevel + event.fuelLevel,
    }),
    { speed: 0, temperature: 0, fuelLevel: 0 },
  )

  const round = (value: number) => Math.round((value / events.length) * 10) / 10

  return {
    speed: round(total.speed),
    temperature: round(total.temperature),
    fuelLevel: round(total.fuelLevel),
    vehicles: events.length,
  }
}

export function computeStatusCounts(latestByVehicle: LatestByVehicle) {
  const counts: Record<VehicleStatus, number> = {
    ACTIVE: 0,
    IDLE: 0,
    WARNING: 0,
    CRITICAL: 0,
  }

  for (const event of Object.values(latestByVehicle)) {
    counts[event.status]++
  }

  return counts
}
