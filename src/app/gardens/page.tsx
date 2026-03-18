'use client'

import { useEffect, useState } from 'react'
import { Button, Container, Group, SimpleGrid, Stack, Title } from '@mantine/core'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { GardenCard } from '@/components/garden-card'
import { LoadingState } from '@/components/loading-state'
import { ErrorState } from '@/components/error-state'
import { EmptyState } from '@/components/empty-state'
import type { Garden } from '@/types'

export default function GardensPage() {
  const router = useRouter()
  const [gardens, setGardens] = useState<Garden[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    let cancelled = false
    fetch('/api/gardens')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load gardens')
        return res.json()
      })
      .then((data) => {
        if (!cancelled) setGardens(Array.isArray(data) ? data : [])
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

  return (
    <Container size="sm" py="xl">
      <Stack gap="lg">
        <Group justify="space-between" align="center" wrap="wrap">
          <Title order={2}>🏡 My Gardens</Title>
          <Button component={Link} href="/gardens/new">
            + Create New Garden
          </Button>
        </Group>

        {loading ? (
          <LoadingState variant="page" />
        ) : error ? (
          <ErrorState
            title="Failed to Load Gardens"
            message={error}
            onRetry={() => setRetryCount((c) => c + 1)}
          />
        ) : gardens.length === 0 ? (
          <EmptyState
            icon="🏡"
            title="No Gardens Yet"
            message="Create your first garden bed to start designing your layout."
            actionLabel="Create Garden"
            onAction={() => router.push('/gardens/new')}
          />
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            {gardens.map((garden) => (
              <Link
                key={garden.id}
                href={`/gardens/${garden.id}`}
                style={{ textDecoration: 'none' }}
              >
                <GardenCard garden={garden} />
              </Link>
            ))}
          </SimpleGrid>
        )}
      </Stack>
    </Container>
  )
}
