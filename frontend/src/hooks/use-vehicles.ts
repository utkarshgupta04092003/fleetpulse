'use client'

import { useEffect, useMemo, useState } from 'react'
import { ApiError } from '@/lib/api'
import { vehicleApi } from '@/lib/fleet-api'
import { useSettingsStore, useTelemetryStore } from '@/stores'
import type { Vehicle } from '@/types'

/**
 * Fleet list from the polled API, with live stream events layered on top.
 *
 * The API call gives every vehicle including ones the stream has not touched
 * yet; the stream keeps the ones it has touched current between polls.
 */
export function useVehicles() {
  const pollInterval = useSettingsStore((state) => state.pollInterval)
  const latestByVehicle = useTelemetryStore((state) => state.latestByVehicle)

  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    // State is only set from the promise callbacks, never synchronously in the
    // effect body.
    const fetchVehicles = () => {
      vehicleApi
        .list()
        .then((response) => {
          if (!active) return
          setVehicles(response.vehicles)
          setError(null)
          setLoaded(true)
        })
        .catch((cause: unknown) => {
          // A 401 is handled centrally; leave the last known list on screen.
          if (!active || (cause instanceof ApiError && cause.status === 401)) return
          setError(cause instanceof ApiError ? cause.message : 'Failed to load vehicles')
          setLoaded(true)
        })
    }

    fetchVehicles()
    const timer = setInterval(fetchVehicles, pollInterval * 1000)

    return () => {
      active = false
      clearInterval(timer)
    }
  }, [pollInterval])

  const merged = useMemo(
    () =>
      vehicles.map((vehicle) => {
        const live = latestByVehicle[vehicle.id]
        if (!live) return vehicle

        return {
          ...vehicle,
          speed: live.speed,
          temperature: live.temperature,
          fuelLevel: live.fuelLevel,
          status: live.status,
          lastUpdated: live.timestamp,
        }
      }),
    [vehicles, latestByVehicle],
  )

  return { vehicles: merged, loading: !loaded, error }
}
