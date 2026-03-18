import type { Meta, StoryObj } from '@storybook/react'
import { Text, Stack, Card, Badge, Group, Code } from '@mantine/core'
import { MantineProvider } from '@mantine/core'

import '@mantine/core/styles.css'

/**
 * GardenCanvas uses react-konva (HTML5 Canvas) which may not render in Storybook.
 * These placeholder stories document the component's states and props.
 */

interface CanvasStoryPlaceholderProps {
  title: string
  width: number
  length: number
  plantCount: number
  description: string
}

function CanvasStoryPlaceholder({
  title,
  width,
  length,
  plantCount,
  description,
}: CanvasStoryPlaceholderProps) {
  return (
    <MantineProvider>
      <Card withBorder shadow="sm" padding="lg" radius="md">
        <Stack gap="sm">
          <Group justify="space-between">
            <Text fw={700} size="lg">
              {title}
            </Text>
            <Badge color="green" variant="light">
              Canvas Component
            </Badge>
          </Group>
          <Text size="sm" c="dimmed">
            {description}
          </Text>
          <Group gap="xl">
            <div>
              <Text size="xs" c="dimmed">
                Dimensions
              </Text>
              <Text fw={500}>
                {width}×{length} ft
              </Text>
            </div>
            <div>
              <Text size="xs" c="dimmed">
                Grid cells
              </Text>
              <Text fw={500}>
                {width * 2}×{length * 2}
              </Text>
            </div>
            <div>
              <Text size="xs" c="dimmed">
                Plants
              </Text>
              <Text fw={500}>{plantCount}</Text>
            </div>
          </Group>
          <Code block>{`<GardenCanvas
  width={${width}}
  length={${length}}
  plants={[${plantCount > 0 ? '...' : ''}]}
  onPlacePlant={(placement) => { ... }}
/>`}</Code>
          <div
            style={{
              width: '100%',
              height: 200,
              background: '#f0fdf4',
              border: '2px solid #166534',
              borderRadius: 8,
              display: 'grid',
              gridTemplateColumns: `repeat(${width * 2}, 1fr)`,
              gridTemplateRows: `repeat(${Math.min(length * 2, 8)}, 1fr)`,
              gap: 1,
              padding: 4,
            }}
          >
            {Array.from({ length: width * 2 * Math.min(length * 2, 8) }, (_, i) => (
              <div
                key={i}
                style={{
                  background: i < plantCount ? '#4ade80' : '#dcfce7',
                  borderRadius: i < plantCount ? '50%' : 2,
                  minHeight: 8,
                }}
              />
            ))}
          </div>
        </Stack>
      </Card>
    </MantineProvider>
  )
}

const meta: Meta<typeof CanvasStoryPlaceholder> = {
  title: 'Components/GardenCanvas',
  component: CanvasStoryPlaceholder,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Interactive garden layout canvas built with react-konva. Renders a grid overlay based on garden dimensions (6-inch cells), supports plant placement via click, and displays spacing conflict visualizations.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof CanvasStoryPlaceholder>

export const Empty4x4: Story = {
  args: {
    title: 'Empty 4×4 Garden',
    width: 4,
    length: 4,
    plantCount: 0,
    description: 'A small raised bed with no plants placed. Grid shows 8×8 cells (6-inch spacing).',
  },
}

export const Empty4x8: Story = {
  args: {
    title: 'Empty 4×8 Garden',
    width: 4,
    length: 8,
    plantCount: 0,
    description:
      'A standard raised bed with no plants. Grid shows 8×16 cells (6-inch spacing).',
  },
}

export const WithPlants: Story = {
  args: {
    title: 'Garden With Plants',
    width: 4,
    length: 8,
    plantCount: 5,
    description:
      'A 4×8 garden with 5 plants placed. Plants render as colored circles with name labels, snapped to the grid.',
  },
}
