'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Container, Title, Text, Stack, Loader, Center, Button, Group } from '@mantine/core'
import Link from 'next/link'
import type { Plant } from '@/types'
import { PlantDetail } from '@/components/plant-detail'
import { AddToGardenButton } from '@/components/add-to-garden-button'

export default function PlantDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [plant, setPlant] = useState<Plant | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!id) return
    fetch(`/api/plants/${id}`)
      .then((res) => {
        if (!res.ok) {
          setNotFound(true)
          return null
        }
        return res.json()
      })
      .then((data) => {
        if (data) setPlant(data)
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <Container size="sm" py="xl">
        <Center py="xl">
          <Loader color="green" />
        </Center>
      </Container>
    )
  }

  if (notFound || !plant) {
    return (
      <Container size="sm" py="xl">
        <Stack align="center" gap="md" py="xl">
          <Title order={3}>🌿 Plant Not Found</Title>
          <Text c="dimmed">The plant you&apos;re looking for doesn&apos;t exist.</Text>
          <Button component={Link} href="/plants" variant="light" color="green">
            ← Back to Plants
          </Button>
        </Stack>
      </Container>
    )
  }

  return (
    <Container size="sm" py="xl">
      <Group mb="md">
        <Button component={Link} href="/plants" variant="subtle" color="green" size="sm">
          ← Back to Plants
        </Button>
      </Group>
      <PlantDetail plant={plant} actions={<AddToGardenButton plantId={plant.id} />} />
    </Container>
  )
}
