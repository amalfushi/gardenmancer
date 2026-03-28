'use client'

import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import {
  Button,
  Container,
  Grid,
  Slider,
  Stack,
  Title,
  Text,
  Loader,
  Center,
  Group,
  Badge,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import dynamic from 'next/dynamic'
import { PlantPalette } from '@/components/plant-palette'
import { GardenSuggestions } from '@/components/garden-suggestions'
import { ShadeZoneEditor } from '@/components/shade-zone-editor'
import { AutoOptimizeButton } from '@/components/auto-optimize-button'
import {
  getHeightSuggestions,
  getSunZoneSuggestions,
  getShadeZoneSuggestions,
  getCompanionSuggestions,
  autoOptimizeLayout,
  CELLS_PER_FOOT,
} from '@/lib/garden-utils'
import type { Garden, Plant, PlantPlacement, ShadeZone, OptimizationResult } from '@/types'

const GardenCanvas = dynamic(
  () => import('@/components/garden-canvas').then((m) => m.GardenCanvas),
  {
    ssr: false,
    loading: () => (
      <Center h={300}>
        <Loader color="green" />
      </Center>
    ),
  },
)

export default function GardenDetailPage() {
  const params = useParams<{ id: string }>()
  const [garden, setGarden] = useState<Garden | null>(null)
  const [plants, setPlants] = useState<Plant[]>([])
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fullscreen, setFullscreen] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const [gardenRes, plantsRes] = await Promise.all([
          fetch(`/api/gardens/${params.id}`),
          fetch('/api/plants'),
        ])

        if (!gardenRes.ok) {
          setError('Garden not found')
          return
        }

        const gardenData = await gardenRes.json()
        setGarden(gardenData)

        if (plantsRes.ok) {
          const plantsData = await plantsRes.json()
          setPlants(plantsData)
        }
      } catch {
        setError('Failed to load garden')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [params.id])

  const handlePlacePlant = useCallback(
    async (placement: PlantPlacement) => {
      if (!garden) return

      const updatedLayout = [...(garden.layout ?? []), placement]
      try {
        const res = await fetch(`/api/gardens/${garden.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ layout: updatedLayout }),
        })

        if (res.ok) {
          const updated = await res.json()
          setGarden(updated)
        } else {
          notifications.show({ title: 'Error', message: 'Failed to place plant', color: 'red' })
        }
      } catch {
        notifications.show({ title: 'Error', message: 'Failed to place plant', color: 'red' })
      }
    },
    [garden],
  )

  const handleMovePlant = useCallback(
    async (fromIndex: number, toGridX: number, toGridY: number) => {
      if (!garden) return
      const currentLayout = garden.layout ?? []
      if (fromIndex < 0 || fromIndex >= currentLayout.length) return

      const updatedLayout = currentLayout.map((p, i) =>
        i === fromIndex ? { ...p, gridX: toGridX, gridY: toGridY } : p,
      )

      // Optimistic update
      setGarden((prev) => (prev ? { ...prev, layout: updatedLayout } : prev))

      try {
        const res = await fetch(`/api/gardens/${garden.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ layout: updatedLayout }),
        })
        if (res.ok) {
          const updated = await res.json()
          setGarden(updated)
        } else {
          // Revert on failure
          setGarden((prev) => (prev ? { ...prev, layout: currentLayout } : prev))
          notifications.show({ title: 'Error', message: 'Failed to move plant', color: 'red' })
        }
      } catch {
        setGarden((prev) => (prev ? { ...prev, layout: currentLayout } : prev))
        notifications.show({ title: 'Error', message: 'Failed to move plant', color: 'red' })
      }
    },
    [garden],
  )

  const handleClearLayout = useCallback(async () => {
    if (!garden) return
    try {
      const res = await fetch(`/api/gardens/${garden.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ layout: [] }),
      })
      if (res.ok) {
        const updated = await res.json()
        setGarden(updated)
        notifications.show({ title: 'Cleared', message: 'Layout cleared', color: 'blue' })
      }
    } catch {
      notifications.show({ title: 'Error', message: 'Failed to clear layout', color: 'red' })
    }
  }, [garden])

  const handleShadeZonesUpdate = useCallback(
    async (zones: ShadeZone[]) => {
      if (!garden) return
      try {
        const res = await fetch(`/api/gardens/${garden.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ shadeZones: zones }),
        })
        if (res.ok) {
          const updated = await res.json()
          setGarden(updated)
        }
      } catch {
        notifications.show({
          title: 'Error',
          message: 'Failed to update shade zones',
          color: 'red',
        })
      }
    },
    [garden],
  )

  const handleAutoOptimize = useCallback((): OptimizationResult | null => {
    if (!garden || plants.length === 0) return null

    const placedPlantIds = (garden.layout ?? []).map((p) => p.plantId)
    const plantsToPlace = placedPlantIds
      .map((id) => plants.find((p) => p.id === id))
      .filter(Boolean) as Plant[]

    if (plantsToPlace.length === 0) return null

    return autoOptimizeLayout(garden, plantsToPlace, plants)
  }, [garden, plants])

  const handleApplyOptimization = useCallback(
    async (result: OptimizationResult) => {
      if (!garden) return
      try {
        const res = await fetch(`/api/gardens/${garden.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ layout: result.layout }),
        })
        if (res.ok) {
          const updated = await res.json()
          setGarden(updated)
          notifications.show({
            title: 'Optimized!',
            message: `Layout optimized with score ${result.score}/100`,
            color: 'green',
          })
        }
      } catch {
        notifications.show({
          title: 'Error',
          message: 'Failed to apply optimization',
          color: 'red',
        })
      }
    },
    [garden],
  )

  const handleRotationChange = useCallback(
    async (value: number) => {
      if (!garden) return
      // Update local state immediately for real-time canvas feedback
      setGarden((prev) => (prev ? { ...prev, rotationDegrees: value } : prev))
    },
    [garden],
  )

  const handleRotationCommit = useCallback(
    async (value: number) => {
      if (!garden) return
      try {
        const res = await fetch(`/api/gardens/${garden.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rotationDegrees: value }),
        })
        if (res.ok) {
          const updated = await res.json()
          setGarden(updated)
        } else {
          notifications.show({ title: 'Error', message: 'Failed to update rotation', color: 'red' })
        }
      } catch {
        notifications.show({ title: 'Error', message: 'Failed to update rotation', color: 'red' })
      }
    },
    [garden],
  )

  if (loading) {
    return (
      <Center h={400}>
        <Loader color="green" />
      </Center>
    )
  }

  if (error || !garden) {
    return (
      <Container size="sm" py="xl">
        <Text c="red">{error ?? 'Garden not found'}</Text>
      </Container>
    )
  }

  const shadeZones = garden.shadeZones ?? []
  const suggestions = [
    ...getHeightSuggestions(garden, garden.layout ?? [], plants),
    ...getSunZoneSuggestions(garden.layout ?? [], plants),
    ...getShadeZoneSuggestions(garden.layout ?? [], plants, shadeZones),
    ...getCompanionSuggestions(garden.layout ?? [], plants),
  ]

  const hemisphereLabel = garden.hemisphere === 'southern' ? '🌍 Southern' : '🌍 Northern'

  return (
    <Container size="lg" py="xl">
      <Stack gap="lg">
        <Group justify="space-between" align="center">
          <div>
            <Title order={2}>🏡 {garden.name}</Title>
            <Text size="sm" c="dimmed">
              {garden.width}×{garden.length} ft · {garden.rotationDegrees}° rotation ·{' '}
              {hemisphereLabel} · {garden.type === 'raised' ? 'Raised Bed' : garden.type}
            </Text>
          </div>
          <Group gap="xs">
            <Badge color="green" variant="light" size="lg">
              {garden.layout?.length ?? 0} plants
            </Badge>
            <Button size="xs" variant="light" color="blue" onClick={() => setFullscreen((f) => !f)}>
              {fullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            </Button>
            {(garden.layout?.length ?? 0) > 0 && (
              <Button size="xs" variant="light" color="red" onClick={handleClearLayout}>
                Clear
              </Button>
            )}
          </Group>
        </Group>

        <Grid gutter="md">
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Stack gap="md">
              <PlantPalette
                plants={plants}
                selectedPlant={selectedPlant}
                onSelectPlant={setSelectedPlant}
              />

              <ShadeZoneEditor
                shadeZones={shadeZones}
                maxCols={garden.width * CELLS_PER_FOOT}
                maxRows={garden.length * CELLS_PER_FOOT}
                onUpdate={handleShadeZonesUpdate}
              />

              <div>
                <Text size="sm" fw={500} mb={4}>
                  Rotation ({garden.rotationDegrees}°)
                </Text>
                <Text size="xs" c="dimmed" mb="xs">
                  Which direction does the top of the garden face? 0° = North
                </Text>
                <Slider
                  min={0}
                  max={360}
                  step={1}
                  marks={[
                    { value: 0, label: 'N' },
                    { value: 90, label: 'E' },
                    { value: 180, label: 'S' },
                    { value: 270, label: 'W' },
                  ]}
                  label={(v) => `${v}°`}
                  value={garden.rotationDegrees}
                  onChange={handleRotationChange}
                  onChangeEnd={handleRotationCommit}
                  aria-label="Rotation degrees"
                />
              </div>

              {(garden.layout?.length ?? 0) > 0 && (
                <AutoOptimizeButton
                  onOptimize={handleAutoOptimize}
                  onApply={handleApplyOptimization}
                />
              )}
            </Stack>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 9 }}>
            <GardenCanvas
              width={garden.width}
              length={garden.length}
              plants={garden.layout ?? []}
              plantCatalog={plants}
              selectedPlant={selectedPlant}
              onPlacePlant={handlePlacePlant}
              onMovePlant={handleMovePlant}
              shadeZones={shadeZones}
              gardenType={garden.type}
              rotationDegrees={garden.rotationDegrees}
              fullscreen={fullscreen}
            />
          </Grid.Col>
        </Grid>

        {(garden.layout?.length ?? 0) > 0 && <GardenSuggestions suggestions={suggestions} />}
      </Stack>
    </Container>
  )
}
