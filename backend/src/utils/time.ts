export function now() {
  return new Date().toISOString()
}

export function toMillis(timestamp: string) {
  return new Date(timestamp).getTime()
}

export function isWithin(timestamp: string, start: number, end: number) {
  const time = toMillis(timestamp)
  return time >= start && time < end
}
