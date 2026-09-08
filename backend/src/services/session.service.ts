import { randomUUID } from 'node:crypto'
import { env } from '../config/index.js'
import type { Session } from '../types/index.js'

const sessions = new Map<string, Session>()

export function createSession(email: string): Session {
  const createdAt = Date.now()
  const session: Session = {
    id: randomUUID(),
    email,
    createdAt: new Date(createdAt).toISOString(),
    expiresAt: new Date(createdAt + env.SESSION_TTL_MINUTES * 60_000).toISOString(),
  }

  sessions.set(session.id, session)
  return session
}

// Expired sessions are dropped on read, so a stale id behaves exactly like an unknown one.
export function getSession(id: string | undefined) {
  if (!id) return undefined

  const session = sessions.get(id)
  if (!session) return undefined

  if (new Date(session.expiresAt).getTime() <= Date.now()) {
    sessions.delete(id)
    return undefined
  }

  return session
}

export function destroySession(id: string | undefined) {
  if (!id) return false
  return sessions.delete(id)
}

export function countSessions() {
  return sessions.size
}
