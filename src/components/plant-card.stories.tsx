import type { Meta, StoryObj } from '@storybook/react'
import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import { theme } from '@/theme'
import { PlantCard } from './plant-card'
import type { Plant } from '@/types'
import { expect, fn, userEvent, within } from '@storybook/test'

const basePlant: Plant = {
  id: 'tomato-cherry',
  name: 'Cherry Tomato',
  species: 'Solanum lycopersicum',
  spacing: 24,
  sunNeeds: 'full',
  daysToMaturity: 65,
  heightCategory: 'tall',
  waterNeeds: 'medium',
  companionPlants: ['basil'],
  zones: [5, 6, 7],
  plantingWindows: { startIndoors: '6-8 weeks before last frost' },
  source: 'seed',
}

const meta: Meta<typeof PlantCard> = {
  title: 'Components/PlantCard',
  component: PlantCard,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MantineProvider theme={theme}>
        <div style={{ maxWidth: 320, padding: 16 }}>
          <Story />
        </div>
      </MantineProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof PlantCard>

export const Default: Story = {
  args: { plant: basePlant },
}

export const FullSun: Story = {
  args: {
    plant: { ...basePlant, sunNeeds: 'full', name: 'Sunflower' },
  },
}

export const PartialShade: Story = {
  args: {
    plant: { ...basePlant, sunNeeds: 'partial', name: 'Butterhead Lettuce' },
  },
}

export const Shade: Story = {
  args: {
    plant: { ...basePlant, sunNeeds: 'shade', name: 'Hostas' },
  },
}

export const TallPlant: Story = {
  args: {
    plant: { ...basePlant, heightCategory: 'tall', name: 'Corn', daysToMaturity: 90, spacing: 12 },
  },
}

export const GroundCover: Story = {
  args: {
    plant: {
      ...basePlant,
      heightCategory: 'ground',
      name: 'Creeping Thyme',
      spacing: 6,
      daysToMaturity: 120,
    },
  },
}

export const ClickInteraction: Story = {
  args: {
    plant: basePlant,
    onClick: fn(),
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement)

    await step('Verify plant details are rendered', async () => {
      await expect(canvas.getByText('Cherry Tomato')).toBeInTheDocument()
      await expect(canvas.getByText('Full Sun')).toBeInTheDocument()
      await expect(canvas.getByText('Tall')).toBeInTheDocument()
    })

    await step('Click the card', async () => {
      const card = canvas.getByRole('button', { name: /View details for Cherry Tomato/i })
      await userEvent.click(card)
    })

    await step('Verify onClick was called', async () => {
      await expect(args.onClick).toHaveBeenCalledTimes(1)
    })
  },
}
