'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ROUTES } from '@/config'
import { cn } from '@/lib/utils'

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="flex gap-1 overflow-x-auto border-b border-border px-3 py-2 md:hidden">
      {ROUTES.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            'whitespace-nowrap rounded-md px-3 py-1.5 text-xs transition-colors',
            pathname === href
              ? 'bg-primary/10 text-foreground'
              : 'text-muted-foreground hover:bg-surface-hover',
          )}
        >
          {label}
        </Link>
      ))}
    </nav>
  )
}
