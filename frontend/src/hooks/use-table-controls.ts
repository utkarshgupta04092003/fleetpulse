'use client'

import { useMemo, useState } from 'react'

type SortDirection = 'asc' | 'desc'

type Options<T> = {
  rows: T[]
  searchFields: (keyof T)[]
  initialSort: keyof T
  initialDirection?: SortDirection
}

// Search and sort for the Vehicles and Alerts tables. One hook so both tables
// behave identically rather than each growing its own version.
export function useTableControls<T extends Record<string, unknown>>({
  rows,
  searchFields,
  initialSort,
  initialDirection = 'desc',
}: Options<T>) {
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<keyof T>(initialSort)
  const [direction, setDirection] = useState<SortDirection>(initialDirection)

  const toggleSort = (key: keyof T) => {
    if (key === sortKey) {
      setDirection((current) => (current === 'asc' ? 'desc' : 'asc'))
      return
    }
    setSortKey(key)
    setDirection('desc')
  }

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase()

    const searched = term
      ? rows.filter((row) =>
          searchFields.some((field) => String(row[field]).toLowerCase().includes(term)),
        )
      : rows

    return [...searched].sort((a, b) => {
      const left = a[sortKey]
      const right = b[sortKey]

      if (typeof left === 'number' && typeof right === 'number') {
        return direction === 'asc' ? left - right : right - left
      }

      const compared = String(left).localeCompare(String(right))
      return direction === 'asc' ? compared : -compared
    })
  }, [rows, search, searchFields, sortKey, direction])

  return { search, setSearch, sortKey, direction, toggleSort, visible }
}
