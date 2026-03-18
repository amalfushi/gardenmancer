'use client'

import {
  ActionIcon,
  Badge,
  Button,
  Group,
  NumberInput,
  Select,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { nanoid } from 'nanoid'
import { useState } from 'react'
import type { ShadeZone } from '@/types'

export interface ShadeZoneEditorProps {
  shadeZones: ShadeZone[]
  maxCols: number
  maxRows: number
  onUpdate: (zones: ShadeZone[]) => void
}

export function ShadeZoneEditor({ shadeZones, maxCols, maxRows, onUpdate }: ShadeZoneEditorProps) {
  const [newX, setNewX] = useState(0)
  const [newY, setNewY] = useState(0)
  const [newWidth, setNewWidth] = useState(2)
  const [newHeight, setNewHeight] = useState(2)
  const [newIntensity, setNewIntensity] = useState<'partial' | 'full'>('partial')

  const handleAdd = () => {
    const zone: ShadeZone = {
      id: nanoid(),
      x: newX,
      y: newY,
      width: Math.min(newWidth, maxCols - newX),
      height: Math.min(newHeight, maxRows - newY),
      intensity: newIntensity,
    }
    onUpdate([...shadeZones, zone])
  }

  const handleRemove = (id: string) => {
    onUpdate(shadeZones.filter((z) => z.id !== id))
  }

  return (
    <Stack gap="sm" aria-label="Shade zone editor">
      <Title order={4}>🌤️ Shade Zones</Title>

      {shadeZones.length > 0 && (
        <Stack gap="xs">
          {shadeZones.map((zone) => (
            <Group key={zone.id} gap="xs" align="center">
              <Badge color={zone.intensity === 'full' ? 'dark' : 'gray'} variant="light" size="sm">
                {zone.intensity}
              </Badge>
              <Text size="xs" c="dimmed">
                ({zone.x},{zone.y}) {zone.width}×{zone.height}
              </Text>
              <ActionIcon
                size="xs"
                color="red"
                variant="subtle"
                onClick={() => handleRemove(zone.id)}
                aria-label={`Remove shade zone at ${zone.x},${zone.y}`}
              >
                ✕
              </ActionIcon>
            </Group>
          ))}
        </Stack>
      )}

      <Group gap="xs" grow>
        <NumberInput
          label="X"
          min={0}
          max={maxCols - 1}
          value={newX}
          onChange={(v) => setNewX(Number(v) || 0)}
          size="xs"
          aria-label="Shade zone X position"
        />
        <NumberInput
          label="Y"
          min={0}
          max={maxRows - 1}
          value={newY}
          onChange={(v) => setNewY(Number(v) || 0)}
          size="xs"
          aria-label="Shade zone Y position"
        />
      </Group>

      <Group gap="xs" grow>
        <NumberInput
          label="Width"
          min={1}
          max={maxCols}
          value={newWidth}
          onChange={(v) => setNewWidth(Number(v) || 1)}
          size="xs"
          aria-label="Shade zone width"
        />
        <NumberInput
          label="Height"
          min={1}
          max={maxRows}
          value={newHeight}
          onChange={(v) => setNewHeight(Number(v) || 1)}
          size="xs"
          aria-label="Shade zone height"
        />
      </Group>

      <Select
        label="Intensity"
        data={[
          { value: 'partial', label: 'Partial Shade' },
          { value: 'full', label: 'Full Shade' },
        ]}
        value={newIntensity}
        onChange={(v) => setNewIntensity((v as 'partial' | 'full') ?? 'partial')}
        size="xs"
        aria-label="Shade zone intensity"
      />

      <Button size="xs" variant="light" onClick={handleAdd} aria-label="Add shade zone">
        + Add Shade Zone
      </Button>
    </Stack>
  )
}
