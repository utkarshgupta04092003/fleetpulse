export function formatTime(iso: string | null) {
  if (!iso) return '--:--:--'
  return new Date(iso).toLocaleTimeString([], { hour12: false })
}

export function formatRelative(iso: string | null) {
  if (!iso) return 'never'

  const seconds = Math.round((Date.now() - new Date(iso).getTime()) / 1000)
  if (seconds < 5) return 'just now'
  if (seconds < 60) return `${seconds}s ago`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  return `${Math.floor(seconds / 3600)}h ago`
}

export function formatDelta(delta: number) {
  if (delta === 0) return '0'
  return delta > 0 ? `+${delta}` : `${delta}`
}
