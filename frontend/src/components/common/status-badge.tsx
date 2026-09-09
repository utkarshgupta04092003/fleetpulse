import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { AlertSeverity, VehicleStatus } from '@/types'

const STATUS_STYLES: Record<VehicleStatus, string> = {
  ACTIVE: 'border-success/30 bg-success/10 text-success',
  IDLE: 'border-border bg-muted text-muted-foreground',
  WARNING: 'border-warning/30 bg-warning/10 text-warning',
  CRITICAL: 'border-critical/30 bg-critical/10 text-critical',
}

export function StatusBadge({ status }: { status: VehicleStatus }) {
  return (
    <Badge variant="outline" className={cn('font-medium', STATUS_STYLES[status])}>
      {status}
    </Badge>
  )
}

const SEVERITY_STYLES: Record<AlertSeverity, string> = {
  WARNING: 'border-warning/30 bg-warning/10 text-warning',
  CRITICAL: 'border-critical/30 bg-critical/10 text-critical',
}

export function SeverityBadge({ severity }: { severity: AlertSeverity }) {
  return (
    <Badge variant="outline" className={cn('font-medium', SEVERITY_STYLES[severity])}>
      {severity}
    </Badge>
  )
}
