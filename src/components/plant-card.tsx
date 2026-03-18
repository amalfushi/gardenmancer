'use client'

import { Card, Text, Group, Badge, Stack } from '@mantine/core'
import type { Plant } from '@/types'

const sunIcons: Record<string, string> = {
  full: '☀️',
  partial: '⛅',
  shade: '🌑',
}

const sunLabels: Record<string, string> = {
  full: 'Full Sun',
  partial: 'Partial Shade',
  shade: 'Shade',
}

const heightLabels: Record<string, string> = {
  ground: 'Ground Cover',
  short: 'Short',
  medium: 'Medium',
  tall: 'Tall',
  vine: 'Vine',
}

interface PlantCardProps {
  plant: Plant
  onClick?: () => void
}

export function PlantCard({ plant, onClick }: PlantCardProps) {
  return (
    <Card
      shadow="sm"
      padding="md"
      radius="md"
      withBorder
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e: React.KeyboardEvent) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onClick()
              }
            }
          : undefined
      }
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? `View details for ${plant.name}` : undefined}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <Stack gap="xs">
        <Text fw={600} size="lg" lineClamp={1}>
          {plant.name}
        </Text>

        {plant.species && (
          <Text size="xs" c="dimmed" fs="italic">
            {plant.species}
          </Text>
        )}

        <Group gap="xs" wrap="wrap">
          <Badge variant="light" color="yellow" size="sm" leftSection={sunIcons[plant.sunNeeds]}>
            {sunLabels[plant.sunNeeds]}
          </Badge>
          <Badge variant="light" color="green" size="sm">
            {heightLabels[plant.heightCategory]}
          </Badge>
        </Group>

        <Group gap="lg">
          <Text size="sm" c="dimmed">
            <span role="img" aria-hidden="true">
              📏
            </span>{' '}
            {plant.spacing}″ spacing
          </Text>
          <Text size="sm" c="dimmed">
            <span role="img" aria-hidden="true">
              🕐
            </span>{' '}
            {plant.daysToMaturity} days
          </Text>
        </Group>
      </Stack>
    </Card>
  )
}
