export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'

export const POLL_INTERVALS = [5, 10, 15] as const
export const DEFAULT_POLL_INTERVAL = 10

export const TEMPERATURE_THRESHOLD = {
  min: 60,
  max: 100,
  default: 75,
  step: 1,
} as const

export const RECENT_EVENTS_LIMIT = 25

export const STATUS_ORDER = ['ACTIVE', 'IDLE', 'WARNING', 'CRITICAL'] as const

export const ROUTES = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/analytics', label: 'Analytics' },
  { href: '/vehicles', label: 'Vehicles' },
  { href: '/alerts', label: 'Alerts' },
  { href: '/settings', label: 'Settings' },
] as const
