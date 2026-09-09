'use client'

import { SeverityBadge } from '@/components/common'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { formatRelative, formatTime } from '@/lib/format'
import type { Alert } from '@/types'

const UNITS: Record<Alert['type'], string> = {
  TEMPERATURE: 'C',
  FUEL: '%',
  SPEED: 'km/h',
}

export function AlertDrawer({ alert, onClose }: { alert: Alert | null; onClose: () => void }) {
  return (
    <Sheet open={alert !== null} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        {alert && (
          <>
            <SheetHeader>
              <SheetTitle className="flex items-center gap-3">
                {alert.vehicleNumber}
                <SeverityBadge severity={alert.severity} />
              </SheetTitle>
              <SheetDescription>
                {alert.type} alert · raised {formatRelative(alert.timestamp)}
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-6 px-4 pb-6">
              <p className="rounded-md border border-border bg-muted/40 p-3 text-sm">
                {alert.message}
              </p>

              <dl className="space-y-3 text-sm">
                {[
                  { label: 'Recorded value', value: `${alert.value} ${UNITS[alert.type]}` },
                  { label: 'Threshold', value: `${alert.threshold} ${UNITS[alert.type]}` },
                  {
                    label: 'Exceeded by',
                    value: `${Math.round(Math.abs(alert.value - alert.threshold) * 10) / 10} ${UNITS[alert.type]}`,
                  },
                  { label: 'Vehicle', value: `${alert.vehicleNumber} (${alert.vehicleId})` },
                  { label: 'Status', value: alert.status },
                  { label: 'Raised at', value: formatTime(alert.timestamp) },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between border-b border-border pb-2"
                  >
                    <dt className="text-muted-foreground">{row.label}</dt>
                    <dd className="font-medium tabular">{row.value}</dd>
                  </div>
                ))}
              </dl>

              <p className="text-xs text-muted-foreground">
                Alerts are derived by the backend on every poll. Adjusting the temperature
                threshold in Settings changes which vehicles appear here.
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
