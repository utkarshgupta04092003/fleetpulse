import { Router } from 'express'
import { SSE_HEARTBEAT_MS } from '../config/index.js'
import { onTelemetry } from '../generators/index.js'
import { requireAuth } from '../middleware/index.js'
import type { TelemetryEvent } from '../types/index.js'

const router = Router()

router.get('/stream', requireAuth, (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
  })
  res.flushHeaders()

  const send = (event: TelemetryEvent) => {
    res.write(`data: ${JSON.stringify(event)}\n\n`)
  }

  // Comment frame: tells the client the stream is open before the first tick.
  res.write(': connected\n\n')

  const unsubscribe = onTelemetry(send)
  const heartbeat = setInterval(() => res.write(': ping\n\n'), SSE_HEARTBEAT_MS)

  console.log('[sse] client connected')

  req.on('close', () => {
    clearInterval(heartbeat)
    unsubscribe()
    console.log('[sse] client disconnected')
  })
})

export default router
