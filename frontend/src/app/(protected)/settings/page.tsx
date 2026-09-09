'use client'

import { useRouter } from 'next/navigation'
import { LogOut, Pause, Play } from 'lucide-react'
import { toast } from 'sonner'
import { Section } from '@/components/common'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { POLL_INTERVALS, TEMPERATURE_THRESHOLD } from '@/config'
import { formatTime } from '@/lib/format'
import { cn } from '@/lib/utils'
import {
  useAuthStore,
  useDashboardStore,
  useSettingsStore,
  useTelemetryStore,
} from '@/stores'

export default function SettingsPage() {
  const router = useRouter()

  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  const { pollInterval, tempThreshold, paused, setPollInterval, setTempThreshold, togglePaused } =
    useSettingsStore()

  const connection = useTelemetryStore((state) => state.connection)
  const eventCount = useTelemetryStore((state) => state.eventCount)
  const lastReceivedAt = useTelemetryStore((state) => state.lastReceivedAt)
  const lastUpdatedAt = useDashboardStore((state) => state.lastUpdatedAt)
  const alerts = useDashboardStore((state) => state.alerts)

  const onLogout = async () => {
    await logout()
    useTelemetryStore.getState().reset()
    useDashboardStore.getState().reset()
    router.replace('/login')
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Section
        title="Live telemetry"
        description="Pause stops applying incoming events without dropping the connection"
      >
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="paused">Live updates</Label>
            <p className="text-xs text-muted-foreground">
              Currently {connection.toUpperCase()} · {eventCount} events · last{' '}
              {formatTime(lastReceivedAt)}
            </p>
          </div>
          <Switch
            id="paused"
            checked={!paused}
            onCheckedChange={() => {
              togglePaused()
              toast(paused ? 'Live updates resumed' : 'Live updates paused')
            }}
          />
        </div>

        <p className="mt-4 flex items-center gap-2 rounded-md border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
          {paused ? <Pause className="size-4 text-info" /> : <Play className="size-4 text-success" />}
          {paused
            ? 'Incoming events are being ignored. The stream stays connected.'
            : 'Incoming events are being applied as they arrive.'}
        </p>
      </Section>

      <Section
        title="Refresh interval"
        description="How often the aggregated dashboard endpoints are polled"
      >
        <div className="flex gap-2">
          {POLL_INTERVALS.map((seconds) => (
            <Button
              key={seconds}
              variant={pollInterval === seconds ? 'default' : 'outline'}
              className={cn('flex-1', pollInterval === seconds && 'pointer-events-none')}
              onClick={() => {
                setPollInterval(seconds)
                toast(`Polling every ${seconds} seconds`)
              }}
            >
              {seconds}s
            </Button>
          ))}
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          Last polled at {formatTime(lastUpdatedAt)}. Changing this restarts the timer
          immediately.
        </p>
      </Section>

      <Section
        title="Temperature threshold"
        description="Sent to the backend, which re-derives alerts against it"
      >
        <div className="flex items-center justify-between">
          <Label>Warning above</Label>
          <span className="text-lg font-semibold tabular">{tempThreshold} C</span>
        </div>

        <Slider
          className="mt-4"
          min={TEMPERATURE_THRESHOLD.min}
          max={TEMPERATURE_THRESHOLD.max}
          step={TEMPERATURE_THRESHOLD.step}
          value={[tempThreshold]}
          onValueChange={(value) => {
            const next = Array.isArray(value) ? value[0] : value
            if (typeof next === 'number') setTempThreshold(next)
          }}
        />

        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>{TEMPERATURE_THRESHOLD.min} C</span>
          <span>{TEMPERATURE_THRESHOLD.max} C</span>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          {alerts
            ? `${alerts.totalAlerts} alerts at the current threshold (${alerts.criticalCount} critical, ${alerts.warningCount} warning).`
            : 'Waiting for the next poll...'}
        </p>
      </Section>

      <Section title="Session" description="Demo account for this assessment">
        <dl className="space-y-3 text-sm">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <dt className="text-muted-foreground">Signed in as</dt>
            <dd className="font-medium">{user?.email ?? 'unknown'}</dd>
          </div>
          <div className="flex items-center justify-between border-b border-border pb-2">
            <dt className="text-muted-foreground">Session expires</dt>
            <dd className="font-medium tabular">{formatTime(user?.expiresAt ?? null)}</dd>
          </div>
        </dl>

        <Button variant="outline" className="mt-4 w-full" onClick={onLogout}>
          <LogOut className="size-4" />
          Log out
        </Button>
      </Section>
    </div>
  )
}
