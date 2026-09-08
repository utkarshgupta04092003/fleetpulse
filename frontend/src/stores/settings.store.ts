import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DEFAULT_POLL_INTERVAL, TEMPERATURE_THRESHOLD } from '@/config'

type SettingsState = {
  pollInterval: number
  tempThreshold: number
  paused: boolean
  setPollInterval: (seconds: number) => void
  setTempThreshold: (value: number) => void
  setPaused: (paused: boolean) => void
  togglePaused: () => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      pollInterval: DEFAULT_POLL_INTERVAL,
      tempThreshold: TEMPERATURE_THRESHOLD.default,
      paused: false,
      setPollInterval: (pollInterval) => set({ pollInterval }),
      setTempThreshold: (tempThreshold) => set({ tempThreshold }),
      setPaused: (paused) => set({ paused }),
      togglePaused: () => set((state) => ({ paused: !state.paused })),
    }),
    {
      name: 'fleetpulse-settings',
      // Rehydrated manually after mount so server and client render the same
      // markup on first paint.
      skipHydration: true,
    },
  ),
)
