'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { API_URL } from '@/config'
import { setUnauthorizedHandler } from '@/lib/api'
import {
  useAuthStore,
  useDashboardStore,
  useSettingsStore,
  useTelemetryStore,
} from '@/stores'
import type { TelemetryEvent } from '@/types'

/**
 * Owns the two long-lived connections: one EventSource and one poll timer.
 *
 * Mounted once in the protected layout rather than in a page, so navigating
 * between pages does not tear down and rebuild the stream.
 */
export function FleetProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const authenticated = useAuthStore((state) => state.status === 'authenticated')
  const pollInterval = useSettingsStore((state) => state.pollInterval)
  const tempThreshold = useSettingsStore((state) => state.tempThreshold)

  // Persisted settings are rehydrated after mount so the server and client
  // render identical markup on first paint.
  useEffect(() => {
    void useSettingsStore.persist.rehydrate()
  }, [])

  // Central 401 handling: clear everything and send the user to login.
  useEffect(() => {
    setUnauthorizedHandler(() => {
      useAuthStore.getState().markExpired()
      useTelemetryStore.getState().reset()
      useDashboardStore.getState().reset()
      router.replace('/login')
    })

    return () => setUnauthorizedHandler(null)
  }, [router])

  // SSE stream.
  useEffect(() => {
    if (!authenticated) return

    useTelemetryStore.getState().setConnection('connecting')

    const source = new EventSource(`${API_URL}/api/telemetry/stream`, {
      withCredentials: true,
    })

    source.onopen = () => {
      const { paused } = useSettingsStore.getState()
      useTelemetryStore.getState().setConnection(paused ? 'paused' : 'live')
    }

    source.onmessage = (message) => {
      // Read state fresh rather than from the closure, otherwise pause would
      // be evaluated against whatever it was when this handler was created.
      if (useSettingsStore.getState().paused) return

      try {
        const event = JSON.parse(message.data) as TelemetryEvent
        useTelemetryStore.getState().applyEvent(event)
      } catch {
        // A malformed frame should not kill the stream.
      }
    }

    source.onerror = () => {
      // EventSource reconnects on its own; reconnecting here would double up.
      useTelemetryStore.getState().setConnection('reconnecting')
    }

    return () => {
      source.close()
      useTelemetryStore.getState().reset()
    }
  }, [authenticated])

  // Reflect pause in the connection badge without touching the connection.
  useEffect(() => {
    const unsubscribe = useSettingsStore.subscribe((state) => {
      const telemetry = useTelemetryStore.getState()
      if (state.paused) {
        telemetry.setConnection('paused')
      } else if (telemetry.connection === 'paused') {
        telemetry.setConnection('live')
      }
    })

    return unsubscribe
  }, [])

  // Periodic polling of the aggregated endpoints.
  useEffect(() => {
    if (!authenticated) return

    const refresh = () => void useDashboardStore.getState().refresh(tempThreshold)

    refresh()
    const timer = setInterval(refresh, pollInterval * 1000)

    return () => clearInterval(timer)
  }, [authenticated, pollInterval, tempThreshold])

  return <>{children}</>
}
