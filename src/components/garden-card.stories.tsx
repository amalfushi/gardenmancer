import type { Meta, StoryObj } from '@storybook/react'
import { MantineProvider } from '@mantine/core'
import { GardenCard } from './garden-card'
import type { Garden } from '@/types'
import { expect, fn, userEvent, within } from '@storybook/test'

import '@mantine/core/styles.css'

const meta: Meta<typeof GardenCard> = {
  title: 'Components/GardenCard',
  component: GardenCard,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MantineProvider>
        <div style={{ maxWidth: 360, padding: 16 }}>
          <Story />
        </div>
      </MantineProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof GardenCard>

const baseGarden: Garden = {
  id: 'g1',
  name: 'My Raised Bed',
  type: 'raised',
  width: 4,
  length: 8,
  rotationDegrees: 0,
  hemisphere: 'northern',
  layout: [],
}

export const RaisedBed: Story = {
  args: {
    garden: baseGarden,
  },
}

export const FlatGarden: Story = {
  args: {
    garden: { ...baseGarden, id: 'g2', name: 'Backyard Plot', type: 'flat', width: 10, length: 20 },
  },
}

export const Container: Story = {
  args: {
    garden: {
      ...baseGarden,
      id: 'g3',
      name: 'Patio Container',
      type: 'container',
      width: 2,
      length: 2,
    },
  },
}

export const WithPlants: Story = {
  args: {
    garden: {
      ...baseGarden,
      id: 'g4',
      name: 'Veggie Garden',
      layout: [
        { plantId: 'tomato-cherry', gridX: 0, gridY: 0 },
        { plantId: 'basil-sweet', gridX: 1, gridY: 0 },
        { plantId: 'pepper-bell', gridX: 2, gridY: 0 },
      ],
    },
  },
}

export const ClickInteraction: Story = {
  args: {
    garden: baseGarden,
    onClick: fn(),
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement)

    await step('Verify garden card content', async () => {
      await expect(canvas.getByText('My Raised Bed')).toBeInTheDocument()
      await expect(canvas.getByText('Raised Bed')).toBeInTheDocument()
      await expect(canvas.getByText(/4 × 8 ft/)).toBeInTheDocument()
    })

    await step('Click the garden card', async () => {
      const card = canvas.getByLabelText('Garden: My Raised Bed')
      await userEvent.click(card)
    })

    await step('Verify onClick was called', async () => {
      await expect(args.onClick).toHaveBeenCalledTimes(1)
    })
  },
}
