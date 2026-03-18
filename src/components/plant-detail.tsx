'use client'

import { Stack, Group, Badge, Paper, Title, Text, Divider } from '@mantine/core'
import type { Plant } from '@/types'

const sunLabels: Record<string, { icon: string; text: string }> = {
  full: { icon: '☀️', text: 'Full Sun' },
  partial: { icon: '⛅', text: 'Partial Shade' },
  shade: { icon: '🌑', text: 'Shade' },
}

const heightLabels: Record<string, string> = {
  ground: 'Ground Cover',
  short: 'Short',
  medium: 'Medium',
  tall: 'Tall',
  vine: 'Vine',
}

const waterLabels: Record<string, { icon: string; text: string }> = {
  low: { icon: '💧', text: 'Low' },
  medium: { icon: '💧💧', text: 'Medium' },
  high: { icon: '💧💧💧', text: 'High' },
}

interface PlantDetailProps {
  plant: Plant
  actions?: React.ReactNode
}

export function PlantDetail({ plant, actions }: PlantDetailProps) {
  return (
    <Stack gap="md">
      <Group justify="space-between" align="flex-start">
        <div>
          <Title order={2}>{plant.name}</Title>
          {plant.species && (
            <Text size="md" c="dimmed" fs="italic">
              {plant.species}
            </Text>
          )}
        </div>
        {actions}
      </Group>

      <Divider />

      <Paper p="md" withBorder radius="md">
        <Title order={4} mb="sm">
          Growing Info
        </Title>
        <Group gap="lg" wrap="wrap">
          <Stack gap={4}>
            <Text size="xs" c="dimmed">
              Sun Needs
            </Text>
            <Badge variant="light" color="yellow" size="lg">
              <span role="img" aria-hidden="true">
                {sunLabels[plant.sunNeeds]?.icon}
              </span>{' '}
              {sunLabels[plant.sunNeeds]?.text}
            </Badge>
          </Stack>
          <Stack gap={4}>
            <Text size="xs" c="dimmed">
              Water Needs
            </Text>
            <Badge variant="light" color="blue" size="lg">
              <span role="img" aria-hidden="true">
                {waterLabels[plant.waterNeeds]?.icon}
              </span>{' '}
              {waterLabels[plant.waterNeeds]?.text}
            </Badge>
          </Stack>
          <Stack gap={4}>
            <Text size="xs" c="dimmed">
              Height
            </Text>
            <Badge variant="light" color="green" size="lg">
              {heightLabels[plant.heightCategory]}
            </Badge>
          </Stack>
          <Stack gap={4}>
            <Text size="xs" c="dimmed">
              Spacing
            </Text>
            <Text fw={600}>{plant.spacing}″</Text>
          </Stack>
          <Stack gap={4}>
            <Text size="xs" c="dimmed">
              Days to Maturity
            </Text>
            <Text fw={600}>{plant.daysToMaturity} days</Text>
          </Stack>
        </Group>
      </Paper>

      {plant.zones.length > 0 && (
        <Paper p="md" withBorder radius="md">
          <Title order={4} mb="sm">
            Hardiness Zones
          </Title>
          <Group gap="xs">
            {plant.zones.map((zone) => (
              <Badge key={zone} variant="filled" color="green" size="md">
                Zone {zone}
              </Badge>
            ))}
          </Group>
        </Paper>
      )}

      {(plant.plantingWindows.startIndoors ||
        plant.plantingWindows.transplant ||
        plant.plantingWindows.directSow) && (
        <Paper p="md" withBorder radius="md">
          <Title order={4} mb="sm">
            Planting Windows
          </Title>
          <Stack gap="xs">
            {plant.plantingWindows.startIndoors && (
              <Group gap="sm">
                <Text size="sm" fw={600}>
                  <span role="img" aria-hidden="true">
                    🏠
                  </span>{' '}
                  Start Indoors:
                </Text>
                <Text size="sm">{plant.plantingWindows.startIndoors}</Text>
              </Group>
            )}
            {plant.plantingWindows.transplant && (
              <Group gap="sm">
                <Text size="sm" fw={600}>
                  <span role="img" aria-hidden="true">
                    🌱
                  </span>{' '}
                  Transplant:
                </Text>
                <Text size="sm">{plant.plantingWindows.transplant}</Text>
              </Group>
            )}
            {plant.plantingWindows.directSow && (
              <Group gap="sm">
                <Text size="sm" fw={600}>
                  <span role="img" aria-hidden="true">
                    🌰
                  </span>{' '}
                  Direct Sow:
                </Text>
                <Text size="sm">{plant.plantingWindows.directSow}</Text>
              </Group>
            )}
          </Stack>
        </Paper>
      )}

      {plant.companionPlants.length > 0 && (
        <Paper p="md" withBorder radius="md">
          <Title order={4} mb="sm">
            Companion Plants
          </Title>
          <Group gap="xs">
            {plant.companionPlants.map((cp) => (
              <Badge key={cp} variant="outline" color="green" size="md">
                {cp}
              </Badge>
            ))}
          </Group>
        </Paper>
      )}

      <Paper p="md" withBorder radius="md">
        <Group gap="sm">
          <Text size="sm" c="dimmed">
            Source:
          </Text>
          <Badge variant="dot" size="sm">
            {plant.source}
          </Badge>
        </Group>
      </Paper>
    </Stack>
  )
}
