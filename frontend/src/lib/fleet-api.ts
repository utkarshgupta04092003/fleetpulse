import type {
  DashboardAlerts,
  DashboardSummary,
  DashboardTrends,
  SessionUser,
  TelemetryEvent,
  Vehicle,
} from '@/types'
import { apiFetch } from './api'

type UserResponse = { user: SessionUser }

export const authApi = {
  login: (email: string, password: string) =>
    apiFetch<UserResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  session: () => apiFetch<UserResponse>('/api/auth/session'),
  logout: () => apiFetch<void>('/api/auth/logout', { method: 'POST' }),
}

export const dashboardApi = {
  summary: () => apiFetch<DashboardSummary>('/api/dashboard/summary'),
  alerts: (tempThreshold?: number) =>
    apiFetch<DashboardAlerts>(
      tempThreshold === undefined
        ? '/api/dashboard/alerts'
        : `/api/dashboard/alerts?tempThreshold=${tempThreshold}`,
    ),
  trends: () => apiFetch<DashboardTrends>('/api/dashboard/trends'),
}

type VehicleListResponse = { vehicles: Vehicle[]; total: number; generatedAt: string }
type VehicleDetailResponse = {
  vehicle: Vehicle
  history: TelemetryEvent[]
  alerts: DashboardAlerts['alerts']
}

export const vehicleApi = {
  list: () => apiFetch<VehicleListResponse>('/api/vehicles'),
  detail: (id: string) => apiFetch<VehicleDetailResponse>(`/api/vehicles/${id}`),
}
