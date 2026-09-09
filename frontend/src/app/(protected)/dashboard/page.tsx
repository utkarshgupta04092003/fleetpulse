'use client'

import { useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MetricCard, Section, EmptyState, StatusBadge } from '@/components/common'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { formatTime, formatRelative } from '@/lib/format'
import {
  computeLiveMetrics,
  computeStatusCounts,
  useDashboardStore,
  useTelemetryStore,
} from '@/stores'

const EVENT_TONE: Record<string, string> = {
  UPDATE: 'text-muted-foreground',
  RECOVERY: 'text-success',
  SPEED_ALERT: 'text-warning',
  LOW_FUEL: 'text-warning',
  TEMPERATURE_ALERT: 'text-critical',
}

export default function DashboardPage() {
  const latestByVehicle = useTelemetryStore((state) => state.latestByVehicle)
  const live = useMemo(() => computeLiveMetrics(latestByVehicle), [latestByVehicle])
  const counts = useMemo(() => computeStatusCounts(latestByVehicle), [latestByVehicle])
  const recentEvents = useTelemetryStore((state) => state.recentEvents)
  const eventCount = useTelemetryStore((state) => state.eventCount)
  const lastReceivedAt = useTelemetryStore((state) => state.lastReceivedAt)

  const summary = useDashboardStore((state) => state.summary)
  const lastUpdatedAt = useDashboardStore((state) => state.lastUpdatedAt)
  const error = useDashboardStore((state) => state.error)

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Live telemetry</h2>
          <p className="text-xs text-muted-foreground">
            {eventCount} events received · last {formatRelative(lastReceivedAt)}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label="Average speed"
            value={live.speed}
            unit="km/h"
            hint="from live stream"
          />
          <MetricCard
            label="Average temperature"
            value={live.temperature}
            unit="C"
            hint="from live stream"
            tone={live.temperature >= 75 ? 'warning' : 'default'}
          />
          <MetricCard
            label="Average fuel"
            value={live.fuelLevel}
            unit="%"
            hint="from live stream"
            tone={live.fuelLevel <= 20 ? 'warning' : 'default'}
          />
          <MetricCard
            label="Vehicles reporting"
            value={live.vehicles}
            hint="seen on the stream"
            tone="info"
          />
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Fleet summary</h2>
          <p className="text-xs text-muted-foreground">
            {error ? (
              <span className="text-warning">Showing last known data · {error}</span>
            ) : (
              <>Last updated {formatTime(lastUpdatedAt)}</>
            )}
          </p>
        </div>

        {summary ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard label="Total vehicles" value={summary.totalVehicles} />
            <MetricCard
              label="Active"
              value={summary.activeVehicles}
              tone="success"
              hint={`${summary.idleVehicles} idle`}
            />
            <MetricCard
              label="Warning"
              value={summary.warningVehicles}
              tone="warning"
            />
            <MetricCard
              label="Critical"
              value={summary.criticalVehicles}
              tone="critical"
            />
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[104px]" />
            ))}
          </div>
        )}
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Section
            title="Recent telemetry events"
            description="Raw events as they arrive on the stream"
          >
            {recentEvents.length === 0 ? (
              <EmptyState message="Waiting for the first telemetry event..." />
            ) : (
              <ul className="divide-y divide-border">
                <AnimatePresence initial={false}>
                  {recentEvents.slice(0, 10).map((event) => (
                    <motion.li
                      key={event.seq}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 py-2 text-sm"
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-3">
                        <span className="font-mono text-xs text-muted-foreground">
                          {formatTime(event.timestamp)}
                        </span>
                        <span className="font-medium">{event.vehicleId}</span>
                        <span
                          className={`truncate text-xs ${EVENT_TONE[event.eventType] ?? 'text-muted-foreground'}`}
                        >
                          {event.eventType}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs tabular text-muted-foreground">
                        <span>{event.speed} km/h</span>
                        <span>{event.temperature} C</span>
                        <span>{event.fuelLevel}%</span>
                        <StatusBadge status={event.status} />
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}
          </Section>
        </div>

        <Section title="Live status mix" description="Vehicles seen on the stream">
          {live.vehicles === 0 ? (
            <EmptyState message="No vehicles reported yet" />
          ) : (
            <ul className="space-y-2">
              {(['ACTIVE', 'IDLE', 'WARNING', 'CRITICAL'] as const).map((status) => (
                <li key={status} className="flex items-center justify-between">
                  <StatusBadge status={status} />
                  <Badge variant="secondary" className="tabular">
                    {counts[status]}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </Section>
      </div>
    </div>
  )
}
