import type { Session } from './session.js'

declare module 'express-serve-static-core' {
  interface Request {
    session?: Session
  }
}
