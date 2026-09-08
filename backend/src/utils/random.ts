export function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min)
}

export function randomChance(probability: number) {
  return Math.random() < probability
}

export function randomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}
