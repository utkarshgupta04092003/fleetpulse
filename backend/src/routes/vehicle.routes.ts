import { Router } from 'express'
import { VEHICLE_HISTORY_LIMIT } from '../config/index.js'
import { requireAuth } from '../middleware/index.js'
import { getAlerts, getVehicle, getVehicleHistory, getVehicles } from '../services/index.js'

const router = Router()

router.use(requireAuth)

router.get('/', (_req, res) => {
  const vehicles = getVehicles()
  res.json({ vehicles, total: vehicles.length, generatedAt: new Date().toISOString() })
})

router.get('/:id', (req, res) => {
  const vehicle = getVehicle(req.params.id)

  if (!vehicle) {
    res.status(404).json({ error: 'NOT_FOUND', message: `No vehicle ${req.params.id}` })
    return
  }

  res.json({
    vehicle,
    history: getVehicleHistory(vehicle.id, VEHICLE_HISTORY_LIMIT),
    alerts: getAlerts().alerts.filter((alert) => alert.vehicleId === vehicle.id),
  })
})

export default router
