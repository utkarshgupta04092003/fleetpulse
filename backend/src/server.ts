import { createApp } from './app.js'
import { env } from './config/index.js'
import { startGenerator, stopGenerator } from './generators/index.js'

const app = createApp()
const server = app.listen(env.PORT, () => {
  console.log(`[server] listening on http://localhost:${env.PORT} (${env.NODE_ENV})`)
  startGenerator()
  console.log(`[generator] started at ${env.TELEMETRY_INTERVAL_MS}ms`)
})

function shutdown(signal: string) {
  console.log(`[server] ${signal} received, shutting down`)
  stopGenerator()
  server.close(() => process.exit(0))
}

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))
