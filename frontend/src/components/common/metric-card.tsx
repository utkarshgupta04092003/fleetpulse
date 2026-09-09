'use client'

import { motion } from 'framer-motion'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { formatDelta } from '@/lib/format'
import { cn } from '@/lib/utils'

type MetricCardProps = {
  label: string
  value: number | string
  unit?: string
  delta?: number
  hint?: string
  tone?: 'default' | 'success' | 'warning' | 'critical' | 'info'
}

const TONES = {
  default: 'text-foreground',
  success: 'text-success',
  warning: 'text-warning',
  critical: 'text-critical',
  info: 'text-info',
}

export function MetricCard({ label, value, unit, delta, hint, tone = 'default' }: MetricCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>

        <div className="mt-2 flex items-baseline gap-1">
          {/* Keyed on value so the number animates when it changes. */}
          <motion.span
            key={String(value)}
            initial={{ opacity: 0.4, y: -3 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className={cn('text-2xl font-semibold tabular', TONES[tone])}
          >
            {value}
          </motion.span>
          {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
        </div>

        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
          {delta !== undefined && delta !== 0 && (
            <span
              className={cn(
                'flex items-center gap-1',
                delta > 0 ? 'text-success' : 'text-critical',
              )}
            >
              {delta > 0 ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
              {formatDelta(delta)}
            </span>
          )}
          {hint && <span>{hint}</span>}
        </div>
      </CardContent>
    </Card>
  )
}
