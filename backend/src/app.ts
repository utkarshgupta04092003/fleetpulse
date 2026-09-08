import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import { env } from './config/index.js'
import { errorHandler, notFound } from './middleware/index.js'
import { authRoutes, dashboardRoutes, telemetryRoutes, vehicleRoutes } from './routes/index.js'

export function createApp() {
  const app = express()

  // credentials must be enabled or the session cookie is never sent.
  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }))
  app.use(express.json())
  app.use(cookieParser())

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', uptime: Math.round(process.uptime()) })
  })

  app.use('/api/auth', authRoutes)
  app.use('/api/telemetry', telemetryRoutes)
  app.use('/api/dashboard', dashboardRoutes)
  app.use('/api/vehicles', vehicleRoutes)

  app.use(notFound)
  app.use(errorHandler)

  return app
}
