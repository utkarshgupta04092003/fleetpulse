'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Activity, AlertTriangle, BarChart3, LayoutDashboard, Settings, Truck } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/vehicles', label: 'Vehicles', icon: Truck },
  { href: '/alerts', label: 'Alerts', icon: AlertTriangle },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-56 shrink-0 border-r border-border bg-sidebar md:flex md:flex-col">
      <div className="flex h-14 items-center gap-2 border-b border-border px-4">
        <Activity className="size-5 text-primary" />
        <span className="font-semibold tracking-tight">FleetPulse</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                active
                  ? 'bg-primary/10 text-foreground'
                  : 'text-muted-foreground hover:bg-surface-hover hover:text-foreground',
              )}
            >
              <Icon className={cn('size-4', active && 'text-primary')} />
              {label}
            </Link>
          )
        })}
      </nav>

      <p className="border-t border-border p-3 text-xs text-muted-foreground">
        Fleet telemetry monitoring
      </p>
    </aside>
  )
}
