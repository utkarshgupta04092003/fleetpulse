import { API_URL } from '@/config'

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

type ErrorBody = { error?: string; message?: string }

// Registered by the app providers. Keeping it a callback avoids api.ts having
// to import the auth store, which would import api.ts back.
let onUnauthorized: (() => void) | null = null

export function setUnauthorizedHandler(handler: (() => void) | null) {
  onUnauthorized = handler
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      // Without this the session cookie is never sent.
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...init?.headers,
      },
    })
  } catch {
    throw new ApiError(0, 'NETWORK_ERROR', 'Cannot reach the FleetPulse API')
  }

  if (response.status === 401) {
    onUnauthorized?.()
    throw new ApiError(401, 'UNAUTHORIZED', 'Your session has expired')
  }

  if (response.status === 204) {
    return undefined as T
  }

  const body = await response.json().catch(() => null)

  if (!response.ok) {
    const error = (body ?? {}) as ErrorBody
    throw new ApiError(
      response.status,
      error.error ?? 'UNKNOWN',
      error.message ?? 'Something went wrong',
    )
  }

  return body as T
}
