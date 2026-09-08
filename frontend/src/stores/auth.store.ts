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
    try {
      const { user } = await authApi.session()
      set({ user, status: 'authenticated' })
    } catch {
      set({ user: null, status: 'unauthenticated' })
    }
  },

  markExpired: () => set({ user: null, status: 'unauthenticated', expired: true }),

  clearError: () => set({ error: null }),
}))
