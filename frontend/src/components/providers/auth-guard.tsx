'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Activity } from 'lucide-react'
import { useAuthStore } from '@/stores'

/**
 * Keeps a protected shell from rendering before the session is known.
 *
 * This is user experience, not security - the backend rejects unauthenticated
 * requests regardless. See docs/phase-01/architecture.md.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const status = useAuthStore((state) => state.status)
  const checkSession = useAuthStore((state) => state.checkSession)

  useEffect(() => {
    if (status === 'checking') void checkSession()
  }, [status, checkSession])

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/login')
  }, [status, router])

  if (status !== 'authenticated') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Activity className="size-5 animate-pulse text-primary" />
          <span className="text-sm">Checking session...</span>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
