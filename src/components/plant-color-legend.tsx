'use client'

import { Group, Badge, Paper, Text, Stack } from '@mantine/core'

const PLANT_COLORS: Record<string, { color: string; label: string }> = {
  ground: { color: '#22c55e', label: 'Ground Cover' },
  short: { color: '#4ade80', label: 'Short' },
  medium: { color: '#f59e0b', label: 'Medium' },
  tall: { color: '#ef4444', label: 'Tall' },
  vine: { color: '#8b5cf6', label: 'Vine' },
}

export function PlantColorLegend() {
  return (
    <Paper p="xs" withBorder radius="md">
      <Stack gap={4}>
        <Text size="xs" fw={600} c="dimmed">
          Height Legend
        </Text>
        <Group gap="xs" wrap="wrap">
          {Object.entries(PLANT_COLORS).map(([key, { color, label }]) => (
            <Badge
              key={key}
              size="sm"
              variant="filled"
              styles={{ root: { backgroundColor: color, color: '#fff' } }}
            >
              {label}
            </Badge>
          ))}
        </Group>
      </Stack>
    </Paper>
  )
}
