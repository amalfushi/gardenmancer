'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Container, Title, SimpleGrid, Stack } from '@mantine/core'
import type { Plant } from '@/types'
import { PlantCard } from '@/components/plant-card'
import { PlantSearch } from '@/components/plant-search'
import { LoadingState } from '@/components/loading-state'
import { ErrorState } from '@/components/error-state'
import { EmptyState } from '@/components/empty-state'

export default function PlantsPage() {
  const router = useRouter()
  const [plants, setPlants] = useState<Plant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [sunFilter, setSunFilter] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    let cancelled = false
    fetch('/api/plants')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load plants')
        return res.json()
      })
      .then((data) => {
        if (!cancelled) setPlants(Array.isArray(data) ? data : [])
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

  const filtered = useMemo(() => {
    let result = plants
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.species?.toLowerCase().includes(q),
      )
    }
    if (sunFilter) {
      result = result.filter((p) => p.sunNeeds === sunFilter)
    }
    return result
  }, [plants, search, sunFilter])

  return (
    <Container size="lg" py="xl">
      <Stack gap="lg">
        <Title order={2}>🌿 Plant Database</Title>
        <PlantSearch
          search={search}
          onSearchChange={setSearch}
          sunFilter={sunFilter}
          onSunFilterChange={setSunFilter}
        />

        {loading ? (
          <LoadingState variant="page" />
        ) : error ? (
          <ErrorState
            title="Failed to Load Plants"
            message={error}
            onRetry={() => setRetryCount((c) => c + 1)}
          />
        ) : filtered.length === 0 ? (
          plants.length === 0 ? (
            <EmptyState
              icon="🌿"
              title="No Plants Yet"
              message="Your plant database is empty. Scan a seed packet or browse the catalog to get started."
            />
          ) : (
            <EmptyState
              icon="🔍"
              title="No Matches"
              message="No plants match your search. Try adjusting your filters."
            />
          )
        ) : (
          <SimpleGrid cols={{ base: 1, xs: 2, md: 3 }} spacing="md">
            {filtered.map((plant) => (
              <PlantCard
                key={plant.id}
                plant={plant}
                onClick={() => router.push(`/plants/${plant.id}`)}
              />
            ))}
          </SimpleGrid>
        )}
      </Stack>
    </Container>
  )
}
