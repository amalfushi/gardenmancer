'use client'

import { Box, Group, ScrollArea, Stack, Text, UnstyledButton, Badge } from '@mantine/core'
import type { Plant } from '@/types'

export interface PlantPaletteProps {
  plants: Plant[]
  selectedPlant?: Plant | null
  onSelectPlant?: (plant: Plant) => void
}

const sunIcons: Record<string, string> = {
  full: '☀️',
  partial: '⛅',
  shade: '🌙',
}

export function PlantPalette({ plants, selectedPlant = null, onSelectPlant }: PlantPaletteProps) {
  return (
    <Box aria-label="Plant palette">
      <Text fw={600} size="sm" mb="xs">
        🌱 Plant Palette
      </Text>
      <ScrollArea h={360} offsetScrollbars>
        <Stack gap={4}>
          {plants.map((plant) => {
            const isSelected = selectedPlant?.id === plant.id
            return (
              <UnstyledButton
                key={plant.id}
                onClick={() => onSelectPlant?.(plant)}
                p="xs"
                style={{
                  borderRadius: 'var(--mantine-radius-sm)',
                  border: isSelected
                    ? '2px solid var(--mantine-color-green-6)'
                    : '1px solid var(--mantine-color-gray-3)',
                  background: isSelected
                    ? 'var(--mantine-color-green-0)'
                    : 'var(--mantine-color-body)',
                }}
                aria-label={`Select ${plant.name}`}
                aria-pressed={isSelected}
              >
                <Group justify="space-between" wrap="nowrap" gap="xs">
                  <Stack gap={2}>
                    <Text size="sm" fw={isSelected ? 600 : 400} lineClamp={1}>
                      {plant.name}
                    </Text>
                    <Group gap={4}>
                      <Text size="xs" c="dimmed">
                        {sunIcons[plant.sunNeeds] ?? ''} {plant.spacing}″ spacing
                      </Text>
                    </Group>
                  </Stack>
                  <Badge size="xs" variant="light" color="green">
                    {plant.heightCategory}
                  </Badge>
                </Group>
              </UnstyledButton>
            )
          })}
          {plants.length === 0 && (
            <Text size="sm" c="dimmed" ta="center" py="md">
              No plants available
            </Text>
          )}
        </Stack>
      </ScrollArea>
    </Box>
  )
}
