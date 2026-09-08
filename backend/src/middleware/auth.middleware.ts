import type { NextFunction, Request, Response } from 'express'
import { SESSION_COOKIE } from '../config/index.js'
import { getSession } from '../services/index.js'

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const session = getSession(req.cookies?.[SESSION_COOKIE])

  if (!session) {
    res.status(401).json({ error: 'UNAUTHORIZED', message: 'Session missing or expired' })
    return
  }

  req.session = session
  next()
}
