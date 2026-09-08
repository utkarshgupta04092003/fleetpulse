import { Router } from 'express'
import { z } from 'zod'
import { TEMPERATURE_THRESHOLD_RANGE } from '../config/index.js'
import { requireAuth } from '../middleware/index.js'
import { getAlerts, getSummary, getTrends } from '../services/index.js'

// Never trust a client threshold - clamp it to a sane band before deriving.
const alertQuerySchema = z.object({
  tempThreshold: z.coerce
    .number()
    .min(TEMPERATURE_THRESHOLD_RANGE.min)
    .max(TEMPERATURE_THRESHOLD_RANGE.max)
    .optional(),
})

const router = Router()

router.use(requireAuth)

router.get('/summary', (_req, res) => {
  res.json(getSummary())
})

router.get('/alerts', (req, res) => {
  const parsed = alertQuerySchema.safeParse(req.query)

  if (!parsed.success) {
    res.status(400).json({
      error: 'INVALID_INPUT',
      message: `tempThreshold must be between ${TEMPERATURE_THRESHOLD_RANGE.min} and ${TEMPERATURE_THRESHOLD_RANGE.max}`,
    })
    return
  }

  const { tempThreshold } = parsed.data

  res.json(
    getAlerts(
      tempThreshold === undefined
        ? {}
        : { temperatureWarning: tempThreshold, temperatureCritical: tempThreshold + 10 },
    ),
  )
})

router.get('/trends', (_req, res) => {
  res.json(getTrends())
})

export default router
