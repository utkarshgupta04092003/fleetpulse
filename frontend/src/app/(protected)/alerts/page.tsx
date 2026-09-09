'use client'

import { useState } from 'react'
import { ArrowDown, ArrowUp, Search } from 'lucide-react'
import { AlertDrawer } from '@/components/alerts/alert-drawer'
import { EmptyState, MetricCard, SeverityBadge } from '@/components/common'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useTableControls } from '@/hooks/use-table-controls'
import { formatRelative, formatTime } from '@/lib/format'
import { cn } from '@/lib/utils'
import { useDashboardStore } from '@/stores'
import type { Alert, AlertSeverity, AlertType } from '@/types'

const COLUMNS: { key: keyof Alert; label: string; numeric?: boolean }[] = [
  { key: 'severity', label: 'Severity' },
  { key: 'vehicleNumber', label: 'Vehicle' },
  { key: 'type', label: 'Type' },
  { key: 'value', label: 'Value', numeric: true },
  { key: 'threshold', label: 'Threshold', numeric: true },
  { key: 'status', label: 'Status' },
  { key: 'timestamp', label: 'Raised' },
]

const SEVERITIES: (AlertSeverity | 'ALL')[] = ['ALL', 'CRITICAL', 'WARNING']
const TYPES: (AlertType | 'ALL')[] = ['ALL', 'TEMPERATURE', 'FUEL', 'SPEED']

export default function AlertsPage() {
  const alerts = useDashboardStore((state) => state.alerts)
  const lastUpdatedAt = useDashboardStore((state) => state.lastUpdatedAt)

  const [severity, setSeverity] = useState<AlertSeverity | 'ALL'>('ALL')
  const [type, setType] = useState<AlertType | 'ALL'>('ALL')
  const [selected, setSelected] = useState<Alert | null>(null)

  const rows = (alerts?.alerts ?? []).filter(
    (alert) =>
      (severity === 'ALL' || alert.severity === severity) &&
      (type === 'ALL' || alert.type === type),
  )

  const { search, setSearch, sortKey, direction, toggleSort, visible } = useTableControls({
    rows,
    searchFields: ['vehicleNumber', 'message', 'type'],
    initialSort: 'timestamp',
  })

  if (!alerts) {
    return (
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-[104px]" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <MetricCard label="Total alerts" value={alerts.totalAlerts} />
        <MetricCard label="Critical" value={alerts.criticalCount} tone="critical" />
        <MetricCard label="Warning" value={alerts.warningCount} tone="warning" />
      </div>

      <p className="text-xs text-muted-foreground">
        Derived from thresholds: temperature warning {alerts.thresholds.temperatureWarning}C,
        critical {alerts.thresholds.temperatureCritical}C · fuel warning{' '}
        {alerts.thresholds.fuelWarning}% · speed {alerts.thresholds.speed} km/h · last updated{' '}
        {formatTime(lastUpdatedAt)}
      </p>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search vehicle or message"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-3">
          <Select
            value={severity}
            onValueChange={(value) => setSeverity(value as AlertSeverity | 'ALL')}
          >
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SEVERITIES.map((option) => (
                <SelectItem key={option} value={option}>
                  {option === 'ALL' ? 'All severities' : option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={type} onValueChange={(value) => setType(value as AlertType | 'ALL')}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TYPES.map((option) => (
                <SelectItem key={option} value={option}>
                  {option === 'ALL' ? 'All types' : option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <span className="whitespace-nowrap text-xs text-muted-foreground tabular">
            {visible.length} of {alerts.totalAlerts}
          </span>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {visible.length === 0 ? (
            <EmptyState message="No alerts match the current filters" />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {COLUMNS.map((column) => (
                      <TableHead
                        key={String(column.key)}
                        onClick={() => toggleSort(column.key)}
                        className={cn(
                          'cursor-pointer select-none whitespace-nowrap hover:text-foreground',
                          column.numeric && 'text-right',
                        )}
                      >
                        <span
                          className={cn(
                            'inline-flex items-center gap-1',
                            column.numeric && 'flex-row-reverse',
                          )}
                        >
                          {column.label}
                          {sortKey === column.key &&
                            (direction === 'asc' ? (
                              <ArrowUp className="size-3" />
                            ) : (
                              <ArrowDown className="size-3" />
                            ))}
                        </span>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {visible.map((alert) => (
                    <TableRow
                      key={alert.id}
                      onClick={() => setSelected(alert)}
                      className="cursor-pointer hover:bg-surface-hover"
                    >
                      <TableCell>
                        <SeverityBadge severity={alert.severity} />
                      </TableCell>
                      <TableCell className="font-medium">{alert.vehicleNumber}</TableCell>
                      <TableCell className="text-muted-foreground">{alert.type}</TableCell>
                      <TableCell className="text-right tabular">{alert.value}</TableCell>
                      <TableCell className="text-right tabular text-muted-foreground">
                        {alert.threshold}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{alert.status}</TableCell>
                      <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                        {formatRelative(alert.timestamp)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDrawer alert={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
