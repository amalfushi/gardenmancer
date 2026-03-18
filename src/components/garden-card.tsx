import { Badge, Card, Group, Stack, Text, Title } from '@mantine/core'
import type { Garden } from '@/types'

export interface GardenCardProps {
  garden: Garden
  onClick?: () => void
}

const typeColors: Record<string, string> = {
  raised: 'green',
  flat: 'blue',
  terraced: 'orange',
  container: 'grape',
}

const typeLabels: Record<string, string> = {
  raised: 'Raised Bed',
  flat: 'Flat Garden',
  terraced: 'Terraced',
  container: 'Container',
}

export function GardenCard({ garden, onClick }: GardenCardProps) {
  const plantCount = garden.layout?.length ?? 0

  return (
    <Card
      shadow="sm"
      padding="lg"
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
      style={onClick ? { cursor: 'pointer' } : undefined}
      aria-label={`Garden: ${garden.name}`}
    >
      <Stack gap="xs">
        <Group justify="space-between" align="flex-start">
          <Title order={4}>{garden.name}</Title>
          <Badge color={typeColors[garden.type] ?? 'gray'} variant="light">
            {typeLabels[garden.type] ?? garden.type}
          </Badge>
        </Group>

        <Text size="sm" c="dimmed">
          {garden.width} × {garden.length} ft · {garden.rotationDegrees}° rotation
        </Text>

        {plantCount > 0 && (
          <Text size="sm">
            <span role="img" aria-hidden="true">
              🌱
            </span>{' '}
            {plantCount} plant{plantCount !== 1 ? 's' : ''} placed
          </Text>
        )}
      </Stack>
    </Card>
  )
}
