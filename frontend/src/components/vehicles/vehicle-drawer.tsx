'use client'

import { useEffect, useState } from 'react'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { SeverityBadge, StatusBadge } from '@/components/common'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { ApiError } from '@/lib/api'
import { vehicleApi } from '@/lib/fleet-api'
import { formatTime } from '@/lib/format'
import type { Alert, TelemetryEvent, Vehicle } from '@/types'

type Props = {
  vehicle: Vehicle | null
  onClose: () => void
}

type Detail = {
  vehicleId: string
  history: TelemetryEvent[]
  alerts: Alert[]
}

export function VehicleDrawer({ vehicle, onClose }: Props) {
  const [detail, setDetail] = useState<Detail | null>(null)

  useEffect(() => {
    if (!vehicle) return

    let active = true

    vehicleApi
      .detail(vehicle.id)
      .then((response) => {
        // The drawer may have been closed or switched while this was in flight.
        if (!active) return
        setDetail({
          vehicleId: vehicle.id,
          history: response.history,
          alerts: response.alerts,
        })
      })
      .catch((error: unknown) => {
        if (error instanceof ApiError) return
      })

    return () => {
      active = false
    }
  }, [vehicle])

  // Derived rather than stored, so no setState happens in the effect body.
  const loading = vehicle !== null && detail?.vehicleId !== vehicle.id
  const history = detail?.vehicleId === vehicle?.id ? (detail?.history ?? []) : []
  const alerts = detail?.vehicleId === vehicle?.id ? (detail?.alerts ?? []) : []

  const chartData = history.map((event) => ({
    time: formatTime(event.timestamp),
    speed: event.speed,
    temperature: event.temperature,
    fuelLevel: event.fuelLevel,
  }))

  return (
    <Sheet open={vehicle !== null} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        {vehicle && (
          <>
            <SheetHeader>
              <SheetTitle className="flex items-center gap-3">
                {vehicle.vehicleNumber}
                <StatusBadge status={vehicle.status} />
              </SheetTitle>
              <SheetDescription>
                {vehicle.driverName} · {vehicle.location}
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-6 px-4 pb-6">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Speed', value: vehicle.speed, unit: 'km/h' },
                  { label: 'Temperature', value: vehicle.temperature, unit: 'C' },
                  { label: 'Fuel', value: vehicle.fuelLevel, unit: '%' },
                ].map((metric) => (
                  <div key={metric.label} className="rounded-md border border-border p-3">
                    <p className="text-xs text-muted-foreground">{metric.label}</p>
                    <p className="mt-1 text-lg font-semibold tabular">
                      {metric.value}
                      <span className="ml-1 text-xs font-normal text-muted-foreground">
                        {metric.unit}
                      </span>
                    </p>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="mb-2 text-sm font-semibold">Recent telemetry</h3>
                {loading ? (
                  <Skeleton className="h-48" />
                ) : chartData.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    No telemetry recorded for this vehicle yet
                  </p>
                ) : (
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <XAxis dataKey="time" hide />
                        <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} width={32} />
                        <Tooltip
                          contentStyle={{
                            background: 'var(--card)',
                            border: '1px solid var(--border)',
                            borderRadius: 8,
                            fontSize: 12,
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="speed"
                          stroke="var(--chart-1)"
                          dot={false}
                          strokeWidth={2}
                        />
                        <Line
                          type="monotone"
                          dataKey="temperature"
                          stroke="var(--chart-4)"
                          dot={false}
                          strokeWidth={2}
                        />
                        <Line
                          type="monotone"
                          dataKey="fuelLevel"
                          stroke="var(--chart-3)"
                          dot={false}
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>

              <div>
                <h3 className="mb-2 text-sm font-semibold">Open alerts</h3>
                {alerts.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No open alerts for this vehicle.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {alerts.map((alert) => (
                      <li
                        key={alert.id}
                        className="rounded-md border border-border p-3 text-sm"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <SeverityBadge severity={alert.severity} />
                          <span className="text-xs text-muted-foreground">
                            {formatTime(alert.timestamp)}
                          </span>
                        </div>
                        <p className="mt-2 text-muted-foreground">{alert.message}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
