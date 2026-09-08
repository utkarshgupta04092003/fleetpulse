'use client'

import { usePathname } from 'next/navigation'
import { LiveIndicator } from '@/components/dashboard/live-indicator'
import { ROUTES } from '@/config'

export function Header() {
  const pathname = usePathname()
  const title = ROUTES.find((route) => route.href === pathname)?.label ?? 'FleetPulse'

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4 md:px-6">
      <h1 className="text-sm font-semibold tracking-tight md:text-base">{title}</h1>
      <LiveIndicator />
    </header>
  )
}
