'use client'

import { useState } from 'react'
import { ArrowDown, ArrowUp, Search } from 'lucide-react'
import { EmptyState, StatusBadge } from '@/components/common'
import { VehicleDrawer } from '@/components/vehicles/vehicle-drawer'
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
import { useVehicles } from '@/hooks/use-vehicles'
import { formatRelative } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Vehicle, VehicleStatus } from '@/types'

const COLUMNS: { key: keyof Vehicle; label: string; numeric?: boolean }[] = [
  { key: 'vehicleNumber', label: 'Vehicle' },
  { key: 'driverName', label: 'Driver' },
  { key: 'location', label: 'Location' },
  { key: 'speed', label: 'Speed', numeric: true },
  { key: 'temperature', label: 'Temp', numeric: true },
  { key: 'fuelLevel', label: 'Fuel', numeric: true },
  { key: 'status', label: 'Status' },
  { key: 'lastUpdated', label: 'Updated' },
]

const STATUSES: (VehicleStatus | 'ALL')[] = ['ALL', 'ACTIVE', 'IDLE', 'WARNING', 'CRITICAL']

export default function VehiclesPage() {
  const { vehicles, loading, error } = useVehicles()
  const [status, setStatus] = useState<VehicleStatus | 'ALL'>('ALL')
  const [selected, setSelected] = useState<Vehicle | null>(null)

  const filtered = status === 'ALL' ? vehicles : vehicles.filter((v) => v.status === status)

  const { search, setSearch, sortKey, direction, toggleSort, visible } = useTableControls({
    rows: filtered,
    searchFields: ['vehicleNumber', 'driverName', 'location'],
    initialSort: 'vehicleNumber',
    initialDirection: 'asc',
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search vehicle, driver or location"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-3">
          <Select value={status} onValueChange={(value) => setStatus(value as VehicleStatus | 'ALL')}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((option) => (
                <SelectItem key={option} value={option}>
                  {option === 'ALL' ? 'All statuses' : option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <span className="whitespace-nowrap text-xs text-muted-foreground tabular">
            {visible.length} of {vehicles.length}
          </span>
        </div>
      </div>

      {error && (
        <p className="rounded-md border border-warning/30 bg-warning/10 px-3 py-2 text-sm text-warning">
          {error}
        </p>
      )}

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-2 p-4">
              {[0, 1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-9" />
              ))}
            </div>
          ) : visible.length === 0 ? (
            <EmptyState message="No vehicles match the current filters" />
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
                  {visible.map((vehicle) => (
                    <TableRow
                      key={vehicle.id}
                      onClick={() => setSelected(vehicle)}
                      className="cursor-pointer hover:bg-surface-hover"
                    >
                      <TableCell className="font-medium">{vehicle.vehicleNumber}</TableCell>
                      <TableCell className="text-muted-foreground">{vehicle.driverName}</TableCell>
                      <TableCell className="text-muted-foreground">{vehicle.location}</TableCell>
                      <TableCell className="text-right tabular">{vehicle.speed}</TableCell>
                      <TableCell className="text-right tabular">{vehicle.temperature}</TableCell>
                      <TableCell className="text-right tabular">{vehicle.fuelLevel}</TableCell>
                      <TableCell>
                        <StatusBadge status={vehicle.status} />
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                        {formatRelative(vehicle.lastUpdated)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <VehicleDrawer vehicle={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
