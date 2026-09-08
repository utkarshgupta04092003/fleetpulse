export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export function round1(value: number) {
  return Math.round(value * 10) / 10
}

export function average(values: number[]) {
  if (values.length === 0) return 0
  const total = values.reduce((sum, value) => sum + value, 0)
  return total / values.length
}
