export type Session = {
  id: string
  email: string
  createdAt: string
  expiresAt: string
}

export type SessionUser = {
  email: string
  expiresAt: string
}
