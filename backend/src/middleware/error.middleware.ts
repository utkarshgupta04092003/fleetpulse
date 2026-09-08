import type { NextFunction, Request, Response } from 'express'

export function notFound(req: Request, res: Response) {
  res.status(404).json({ error: 'NOT_FOUND', message: `No route for ${req.method} ${req.path}` })
}

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  console.error('[error]', error)
  res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Something went wrong' })
}
