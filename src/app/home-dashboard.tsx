'use client'

import { useEffect, useState } from 'react'
import type { Plant, Garden } from '@/types'
import { getPlantingDates } from '@/lib/calendar'
import { DashboardStats } from '@/components/dashboard-stats'

export function HomeDashboard() {
  const [plants, setPlants] = useState<Plant[]>([])
  const [gardens, setGardens] = useState<Garden[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/plants')
        .then((r) => r.json())
        .catch(() => []),
      fetch('/api/gardens')
        .then((r) => r.json())
        .catch(() => []),
    ])
      .then(([p, g]) => {
        setPlants(Array.isArray(p) ? p : [])
        setGardens(Array.isArray(g) ? g : [])
      })
      .finally(() => setLoading(false))
  }, [])

  const nextPlantingDate = getNextPlantingDate(plants)

  return (
    <DashboardStats
      totalPlants={plants.length}
      totalGardens={gardens.length}
      nextPlantingDate={nextPlantingDate}
      loading={loading}
    />
  )
}

function getNextPlantingDate(plants: Plant[]): string | null {
  const now = new Date()
  let earliest: Date | null = null

  for (const plant of plants) {
    // Default to zone 6 for dashboard overview
    const dates = getPlantingDates(plant, 6)
    for (const d of [dates.startIndoors, dates.transplant, dates.directSow]) {
      if (d && d >= now && (!earliest || d < earliest)) {
        earliest = d
      }
    }
  }

  if (!earliest) return null
  return earliest.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
