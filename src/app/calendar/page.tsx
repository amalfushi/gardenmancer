'use client'

import { useEffect, useState, useMemo } from 'react'
import { Container, Title, Text, Stack } from '@mantine/core'
import type { Plant, Garden } from '@/types'
import { getPlantingDates } from '@/lib/calendar'
import { ZoneSelector } from '@/components/zone-selector'
import { CalendarView } from '@/components/calendar-view'
import { CalendarFilter } from '@/components/calendar-filter'
import { LoadingState } from '@/components/loading-state'
import { ErrorState } from '@/components/error-state'
import { EmptyState } from '@/components/empty-state'
import type { CalendarPlantEntry } from '@/components/calendar-view'

export default function CalendarPage() {
  const [plants, setPlants] = useState<Plant[]>([])
  const [gardens, setGardens] = useState<Garden[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [zone, setZone] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [showMyPlantsOnly, setShowMyPlantsOnly] = useState(false)

  useEffect(() => {
    let cancelled = false
    Promise.all([
      fetch('/api/plants').then((res) => {
        if (!res.ok) throw new Error('Failed to load plant data')
        return res.json()
      }),
      fetch('/api/gardens').then((res) => {
        if (!res.ok) throw new Error('Failed to load gardens')
        return res.json()
      }),
    ])
      .then(([plantData, gardenData]) => {
        if (!cancelled) {
          setPlants(Array.isArray(plantData) ? plantData : [])
          setGardens(Array.isArray(gardenData) ? gardenData : [])
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Unknown error')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [retryCount])

  // Collect plant IDs used in any garden layout
  const gardenPlantIds = useMemo(() => {
    const ids = new Set<string>()
    for (const garden of gardens) {
      for (const placement of garden.layout ?? []) {
        ids.add(placement.plantId)
      }
    }
    return ids
  }, [gardens])

  // Filter plants based on toggle
  const filteredPlants = useMemo(() => {
    if (!showMyPlantsOnly) return plants
    return plants.filter((p) => gardenPlantIds.has(p.id))
  }, [plants, showMyPlantsOnly, gardenPlantIds])

  const calendarPlants: CalendarPlantEntry[] = useMemo(() => {
    if (!zone) return []
    const zoneNum = parseInt(zone)
    return filteredPlants
      .map((plant) => ({
        plantName: plant.name,
        dates: getPlantingDates(plant, zoneNum),
      }))
      .filter(
        (entry) => entry.dates.startIndoors || entry.dates.transplant || entry.dates.directSow,
      )
  }, [filteredPlants, zone])

  return (
    <Container size="md" py="xl">
      <Stack gap="lg">
        <Title order={2}>📅 Planting Calendar</Title>
        <Text c="dimmed">Select your USDA zone to see when to plant.</Text>

        <ZoneSelector value={zone} onChange={setZone} />

        {!loading && !error && zone && (
          <CalendarFilter
            showMyPlantsOnly={showMyPlantsOnly}
            onToggle={setShowMyPlantsOnly}
            filteredCount={filteredPlants.length}
            totalCount={plants.length}
          />
        )}

        {loading ? (
          <LoadingState variant="page" />
        ) : error ? (
          <ErrorState
            title="Failed to Load Calendar"
            message={error}
            onRetry={() => setRetryCount((c) => c + 1)}
          />
        ) : !zone ? (
          <EmptyState
            icon="📅"
            title="Select a Zone"
            message="Choose your USDA hardiness zone above to view your planting calendar."
          />
        ) : calendarPlants.length === 0 ? (
          <EmptyState
            icon="🌱"
            title="No Planting Dates"
            message={
              showMyPlantsOnly
                ? 'No plants in your gardens have planting windows for this zone. Try showing all plants.'
                : 'No plants have planting windows for this zone.'
            }
          />
        ) : (
          <CalendarView plants={calendarPlants} zone={parseInt(zone)} />
        )}
      </Stack>
    </Container>
  )
}
