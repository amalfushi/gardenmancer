import type { Meta, StoryObj } from '@storybook/react'
import { Text, Stack, Card, Badge, Group, SimpleGrid } from '@mantine/core'
import { MantineProvider } from '@mantine/core'

import '@mantine/core/styles.css'

/**
 * NorthArrow uses react-konva (HTML5 Canvas) which may not render in Storybook.
 * These placeholder stories document the component's rotation behavior.
 */

interface NorthArrowStoryProps {
  title: string
  rotationDegrees: number
  description: string
}

function NorthArrowStoryPlaceholder({ title, rotationDegrees, description }: NorthArrowStoryProps) {
  const arrowRotation = -rotationDegrees

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
                Garden Rotation
              </Text>
              <Text fw={500}>{rotationDegrees}°</Text>
            </div>
            <div>
              <Text size="xs" c="dimmed">
                Arrow Rotation
              </Text>
              <Text fw={500}>{arrowRotation}°</Text>
            </div>
          </Group>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              border: '2px solid #166534',
              background: 'rgba(255,255,255,0.85)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: `rotate(${arrowRotation}deg)`,
              position: 'relative',
            }}
          >
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderBottom: '18px solid #ef4444',
                position: 'absolute',
                top: 6,
              }}
            />
            <Text
              size="xs"
              fw={700}
              c="#166534"
              style={{
                position: 'absolute',
                top: -2,
                transform: `rotate(${-arrowRotation}deg)`,
              }}
            >
              N
            </Text>
          </div>
        </Stack>
      </Card>
    </MantineProvider>
  )
}

const meta: Meta<typeof NorthArrowStoryPlaceholder> = {
  title: 'Components/NorthArrow',
  component: NorthArrowStoryPlaceholder,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Compass indicator rendered in the upper-left corner of the garden canvas. Rotates to show north direction based on garden rotation (0-360°).',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof NorthArrowStoryPlaceholder>

export const Rotation0: Story = {
  args: {
    title: 'Garden at 0° (North)',
    rotationDegrees: 0,
    description: 'Arrow points up — top of garden faces north. No rotation.',
  },
}

export const Rotation90: Story = {
  args: {
    title: 'Garden at 90° (East)',
    rotationDegrees: 90,
    description: 'Arrow rotated -90° — top of garden faces east.',
  },
}

export const Rotation180: Story = {
  args: {
    title: 'Garden at 180° (South)',
    rotationDegrees: 180,
    description: 'Arrow rotated -180° — top of garden faces south.',
  },
}

export const Rotation270: Story = {
  args: {
    title: 'Garden at 270° (West)',
    rotationDegrees: 270,
    description: 'Arrow rotated -270° — top of garden faces west.',
  },
}

export const Rotation45: Story = {
  args: {
    title: 'Garden at 45° (NE)',
    rotationDegrees: 45,
    description: 'Arrow rotated -45° — top of garden faces northeast.',
  },
}

export const AllRotations: Story = {
  render: () => (
    <MantineProvider>
      <SimpleGrid cols={2}>
        <NorthArrowStoryPlaceholder title="0° (N)" rotationDegrees={0} description="No rotation" />
        <NorthArrowStoryPlaceholder
          title="45° (NE)"
          rotationDegrees={45}
          description="-45° arrow"
        />
        <NorthArrowStoryPlaceholder title="90° (E)" rotationDegrees={90} description="-90° arrow" />
        <NorthArrowStoryPlaceholder
          title="180° (S)"
          rotationDegrees={180}
          description="-180° arrow"
        />
        <NorthArrowStoryPlaceholder
          title="270° (W)"
          rotationDegrees={270}
          description="-270° arrow"
        />
        <NorthArrowStoryPlaceholder
          title="315° (NW)"
          rotationDegrees={315}
          description="-315° arrow"
        />
      </SimpleGrid>
    </MantineProvider>
  ),
}
