import { Router } from 'express'
import { z } from 'zod'
import { SESSION_COOKIE, env, isProduction } from '../config/index.js'
import { requireAuth } from '../middleware/index.js'
import { createSession, destroySession } from '../services/index.js'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

const router = Router()

router.post('/login', (req, res) => {
  const parsed = loginSchema.safeParse(req.body)

  if (!parsed.success) {
    res.status(400).json({ error: 'INVALID_INPUT', message: 'Email and password are required' })
    return
  }

  const { email, password } = parsed.data

  if (email !== env.DEMO_EMAIL || password !== env.DEMO_PASSWORD) {
    console.log(`[auth] failed login for ${email}`)
    res.status(401).json({ error: 'INVALID_CREDENTIALS', message: 'Invalid email or password' })
    return
  }

  const session = createSession(email)
  console.log(`[auth] login ${email}`)

  res.cookie(SESSION_COOKIE, session.id, {
    httpOnly: true,
    sameSite: isProduction ? 'none' : 'lax',
    secure: isProduction,
    path: '/',
    maxAge: env.SESSION_TTL_MINUTES * 60_000,
  })

  res.json({ user: { email: session.email, expiresAt: session.expiresAt } })
})

router.get('/session', requireAuth, (req, res) => {
  res.json({ user: { email: req.session!.email, expiresAt: req.session!.expiresAt } })
})

router.post('/logout', (req, res) => {
  destroySession(req.cookies?.[SESSION_COOKIE])
  res.clearCookie(SESSION_COOKIE, {
    path: '/',
    sameSite: isProduction ? 'none' : 'lax',
    secure: isProduction,
  })
  res.status(204).end()
})

export default router
