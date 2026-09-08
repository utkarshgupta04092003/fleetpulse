import 'dotenv/config'
import { z } from 'zod'

// Defaults are specified in docs/phase-01/runtime.md.
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  CORS_ORIGIN: z.string().url().default('http://localhost:3000'),
  SESSION_TTL_MINUTES: z.coerce.number().int().positive().default(30),
  DEMO_EMAIL: z.string().email().default('demo@fleetpulse.com'),
  DEMO_PASSWORD: z.string().min(1).default('password123'),
  TELEMETRY_INTERVAL_MS: z.coerce.number().int().positive().default(2000),
  HISTORY_LIMIT: z.coerce.number().int().positive().default(3000),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  const issues = parsed.error.issues.map((i) => `  ${i.path.join('.')}: ${i.message}`).join('\n')
  throw new Error(`Invalid environment configuration:\n${issues}`)
}

export const env = parsed.data

export const isProduction = env.NODE_ENV === 'production'
