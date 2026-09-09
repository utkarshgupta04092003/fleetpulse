import { create } from 'zustand'
import { authApi } from '@/lib/fleet-api'
import { ApiError } from '@/lib/api'
import type { SessionUser } from '@/types'

type AuthStatus = 'checking' | 'authenticated' | 'unauthenticated'

type AuthState = {
  user: SessionUser | null
  status: AuthStatus
  error: string | null
  expired: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  checkSession: () => Promise<void>
  // Called by the central 401 handler, not by pages.
  markExpired: () => void
  clearError: () => void
}

// Both the auth guard and the login page ask who the user is, and React runs
// effects twice in development. Sharing one in-flight promise means one request
// instead of four.
let inFlight: Promise<void> | null = null

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: 'checking',
  error: null,
  expired: false,

  login: async (email, password) => {
    set({ error: null })

    try {
      const { user } = await authApi.login(email, password)
      set({ user, status: 'authenticated', error: null, expired: false })
      return true
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'Unable to sign in right now'
      set({ error: message, status: 'unauthenticated', user: null })
      return false
    }
  },

  logout: async () => {
    try {
      await authApi.logout()
    } catch {
      // The session is going away locally regardless of what the server says.
    }
    set({ user: null, status: 'unauthenticated', error: null, expired: false })
  },

  checkSession: async () => {
    if (inFlight) return inFlight

    inFlight = authApi
      .session()
      .then(({ user }) => {
        set({ user, status: 'authenticated' })
      })
      .catch(() => {
        set({ user: null, status: 'unauthenticated' })
      })
      .finally(() => {
        inFlight = null
      })

    return inFlight
  },

  markExpired: () => set({ user: null, status: 'unauthenticated', expired: true }),

  clearError: () => set({ error: null }),
}))
