'use client'

import { motion } from 'framer-motion'
import { useTelemetryStore } from '@/stores'
import { formatTime } from '@/lib/format'
import { cn } from '@/lib/utils'

const LABELS = {
  connecting: { text: 'CONNECTING', dot: 'bg-muted-foreground', tone: 'text-muted-foreground' },
  live: { text: 'LIVE', dot: 'bg-success', tone: 'text-success' },
  reconnecting: { text: 'RECONNECTING', dot: 'bg-warning', tone: 'text-warning' },
  paused: { text: 'PAUSED', dot: 'bg-info', tone: 'text-info' },
} as const

export function LiveIndicator() {
  const connection = useTelemetryStore((state) => state.connection)
  const lastReceivedAt = useTelemetryStore((state) => state.lastReceivedAt)
  const label = LABELS[connection]

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <span className="relative flex size-2">
          {connection === 'live' && (
            <motion.span
              className="absolute inline-flex size-full rounded-full bg-success"
              animate={{ opacity: [0.7, 0, 0.7], scale: [1, 2, 1] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            />
          )}
          <span className={cn('relative inline-flex size-2 rounded-full', label.dot)} />
        </span>
        <span className={cn('text-xs font-semibold tracking-wider', label.tone)}>
          {label.text}
        </span>
      </div>

      <span className="hidden text-xs text-muted-foreground sm:inline tabular">
        Last update {formatTime(lastReceivedAt)}
      </span>
    </div>
  )
}
