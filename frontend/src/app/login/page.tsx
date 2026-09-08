'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Activity } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/stores'

export default function LoginPage() {
  const router = useRouter()
  const { login, error, expired, status, checkSession, clearError } = useAuthStore()

  const [email, setEmail] = useState('demo@fleetpulse.com')
  const [password, setPassword] = useState('password123')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    void checkSession()
  }, [checkSession])

  useEffect(() => {
    if (status === 'authenticated') router.replace('/dashboard')
  }, [status, router])

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSubmitting(true)
    const ok = await login(email, password)
    setSubmitting(false)
    if (ok) router.replace('/dashboard')
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-sm"
      >
        <div className="mb-6 flex items-center gap-2">
          <Activity className="size-6 text-primary" />
          <span className="text-xl font-semibold tracking-tight">FleetPulse</span>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Fleet operations sign in</CardTitle>
            <CardDescription>
              Monitor live vehicle telemetry, alerts and fleet analytics.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {expired && (
              <p className="mb-4 rounded-md border border-warning/30 bg-warning/10 px-3 py-2 text-sm text-warning">
                Your session expired. Please sign in again.
              </p>
            )}

            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    clearError()
                  }}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    clearError()
                  }}
                  required
                />
              </div>

              {error && <p className="text-sm text-critical">{error}</p>}

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>

            <p className="mt-4 text-xs text-muted-foreground">
              Demo access: demo@fleetpulse.com / password123
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
