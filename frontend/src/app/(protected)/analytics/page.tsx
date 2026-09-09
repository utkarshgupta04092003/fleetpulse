'use client'

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { MetricCard, Section } from '@/components/common'
import { Skeleton } from '@/components/ui/skeleton'
import { formatTime } from '@/lib/format'
import { useDashboardStore, useSettingsStore } from '@/stores'
import type { VehicleStatus } from '@/types'

const STATUS_FILL: Record<VehicleStatus, string> = {
  ACTIVE: 'var(--success)',
  IDLE: 'var(--muted-foreground)',
  WARNING: 'var(--warning)',
  CRITICAL: 'var(--critical)',
}

const TOOLTIP_STYLE = {
  background: 'var(--card)',
  border: '1px solid var(--border)',
  borderRadius: 8,
  fontSize: 12,
} as const

const AXIS_TICK = { fontSize: 11, fill: 'var(--muted-foreground)' } as const

export default function AnalyticsPage() {
  const summary = useDashboardStore((state) => state.summary)
  const trends = useDashboardStore((state) => state.trends)
  const lastUpdatedAt = useDashboardStore((state) => state.lastUpdatedAt)
  const error = useDashboardStore((state) => state.error)
  const pollInterval = useSettingsStore((state) => state.pollInterval)

  if (!summary || !trends) {
    return (
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-[104px]" />
          ))}
        </div>
        <Skeleton className="h-72" />
        <Skeleton className="h-72" />
      </div>
    )
  }

  const series = trends.points.map((point) => ({
    time: formatTime(point.timestamp),
    speed: point.averageSpeed,
    temperature: point.averageTemperature,
    fuel: point.averageFuel,
    events: point.eventCount,
  }))

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          Aggregated over a {summary.windowSeconds}s window, refreshed every {pollInterval}s.
        </p>
        <p className="text-xs text-muted-foreground">
          {error ? (
            <span className="text-warning">Stale · {error}</span>
          ) : (
            <>Last updated {formatTime(lastUpdatedAt)}</>
          )}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <MetricCard
          label="Average speed"
          value={summary.averageSpeed.value}
          unit="km/h"
          delta={summary.averageSpeed.delta}
          hint="vs previous window"
        />
        <MetricCard
          label="Average temperature"
          value={summary.averageTemperature.value}
          unit="C"
          delta={summary.averageTemperature.delta}
          hint="vs previous window"
        />
        <MetricCard
          label="Average fuel"
          value={summary.averageFuel.value}
          unit="%"
          delta={summary.averageFuel.delta}
          hint="vs previous window"
        />
      </div>

      <Section
        title="Speed and temperature trend"
        description={`Fleet averages per ${trends.bucketSeconds}s bucket`}
      >
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={series}>
              <defs>
                <linearGradient id="speedFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="tempFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-4)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="var(--chart-4)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--border)" vertical={false} />
              <XAxis dataKey="time" tick={AXIS_TICK} tickLine={false} axisLine={false} />
              <YAxis tick={AXIS_TICK} tickLine={false} axisLine={false} width={36} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Area
                type="monotone"
                dataKey="speed"
                stroke="var(--chart-1)"
                fill="url(#speedFill)"
                strokeWidth={2}
                name="Speed km/h"
              />
              <Area
                type="monotone"
                dataKey="temperature"
                stroke="var(--chart-4)"
                fill="url(#tempFill)"
                strokeWidth={2}
                name="Temperature C"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Section>

      <div className="grid gap-4 lg:grid-cols-2">
        <Section title="Fuel trend" description="Average fleet fuel level over time">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={series}>
                <defs>
                  <linearGradient id="fuelFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-3)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--chart-3)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="time" tick={AXIS_TICK} tickLine={false} axisLine={false} />
                <YAxis tick={AXIS_TICK} tickLine={false} axisLine={false} width={36} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Area
                  type="monotone"
                  dataKey="fuel"
                  stroke="var(--chart-3)"
                  fill="url(#fuelFill)"
                  strokeWidth={2}
                  name="Fuel %"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Section>

        <Section title="Fleet health" description="Current status distribution">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trends.statusDistribution}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="status" tick={AXIS_TICK} tickLine={false} axisLine={false} />
                <YAxis tick={AXIS_TICK} tickLine={false} axisLine={false} width={36} />
                <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'var(--surface-hover)' }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} name="Vehicles">
                  {trends.statusDistribution.map((entry) => (
                    <Cell key={entry.status} fill={STATUS_FILL[entry.status]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Section>
      </div>

      <Section
        title="Performance summary"
        description="Derived from the aggregation window, not the raw stream"
      >
        <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Total vehicles', value: summary.totalVehicles },
            { label: 'Active', value: summary.activeVehicles },
            { label: 'Idle', value: summary.idleVehicles },
            { label: 'Warning', value: summary.warningVehicles },
            { label: 'Critical', value: summary.criticalVehicles },
            { label: 'Trend buckets', value: trends.points.length },
            { label: 'Bucket size', value: `${trends.bucketSeconds}s` },
            {
              label: 'Events in window',
              value: series.reduce((total, point) => total + point.events, 0),
            },
          ].map((row) => (
            <div key={row.label} className="rounded-md border border-border p-3">
              <dt className="text-xs text-muted-foreground">{row.label}</dt>
              <dd className="mt-1 text-lg font-semibold tabular">{row.value}</dd>
            </div>
          ))}
        </dl>
      </Section>
    </div>
  )
}
