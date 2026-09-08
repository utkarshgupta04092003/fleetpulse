import { create } from 'zustand'
import { ApiError } from '@/lib/api'
import { dashboardApi } from '@/lib/fleet-api'
import type { DashboardAlerts, DashboardSummary, DashboardTrends } from '@/types'

type DashboardState = {
  summary: DashboardSummary | null
  alerts: DashboardAlerts | null
  trends: DashboardTrends | null
  loading: boolean
  error: string | null
  lastUpdatedAt: string | null
  refresh: (tempThreshold: number) => Promise<void>
  reset: () => void
}

const initial = {
  summary: null,
  alerts: null,
  trends: null,
  loading: false,
  error: null,
  lastUpdatedAt: null,
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  ...initial,

  refresh: async (tempThreshold) => {
    // Only the first load shows a spinner; later polls refresh in place so the
    // page does not flash every interval.
    if (!get().summary) set({ loading: true })

    try {
      const [summary, alerts, trends] = await Promise.all([
        dashboardApi.summary(),
        dashboardApi.alerts(tempThreshold),
        dashboardApi.trends(),
      ])

      set({
        summary,
        alerts,
        trends,
        loading: false,
        error: null,
        lastUpdatedAt: new Date().toISOString(),
      })
    } catch (error) {
      // A 401 is handled centrally; anything else leaves the previous data on
      // screen and surfaces a stale-data warning.
      if (error instanceof ApiError && error.status === 401) return

      set({
        loading: false,
        error: error instanceof ApiError ? error.message : 'Failed to refresh dashboard data',
      })
    }
  },

  reset: () => set(initial),
}))
