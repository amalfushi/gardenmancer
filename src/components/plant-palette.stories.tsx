import type { Meta, StoryObj } from '@storybook/react'
import { MantineProvider } from '@mantine/core'
import { PlantPalette } from './plant-palette'
import type { Plant } from '@/types'
import { expect, fn, userEvent, within } from '@storybook/test'

import '@mantine/core/styles.css'

const meta: Meta<typeof PlantPalette> = {
  title: 'Components/PlantPalette',
  component: PlantPalette,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MantineProvider>
        <div style={{ maxWidth: 280, padding: 16 }}>
          <Story />
        </div>
      </MantineProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof PlantPalette>

const basePlant: Plant = {
  id: 'tomato-cherry',
  name: 'Cherry Tomato',
  species: 'Solanum lycopersicum',
  spacing: 24,
  sunNeeds: 'full',
  daysToMaturity: 65,
  heightCategory: 'medium',
  waterNeeds: 'medium',
  companionPlants: ['basil'],
  zones: [5, 6, 7],
  plantingWindows: { startIndoors: '6 weeks before last frost' },
  source: 'seed',
}

const fewPlants: Plant[] = [
  basePlant,
  {
    ...basePlant,
    id: 'basil-sweet',
    name: 'Sweet Basil',
    spacing: 12,
    sunNeeds: 'full',
    heightCategory: 'short',
  },
  {
    ...basePlant,
    id: 'lettuce',
    name: 'Butter Lettuce',
    spacing: 8,
    sunNeeds: 'partial',
    heightCategory: 'ground',
  },
]

const manyPlants: Plant[] = [
  ...fewPlants,
  { ...basePlant, id: 'pepper-bell', name: 'Bell Pepper', spacing: 18, heightCategory: 'medium' },
  {
    ...basePlant,
    id: 'cucumber',
    name: 'Cucumber',
    spacing: 36,
    heightCategory: 'vine',
    sunNeeds: 'full',
  },
  {
    ...basePlant,
    id: 'carrot',
    name: 'Carrot',
    spacing: 3,
    heightCategory: 'ground',
    sunNeeds: 'full',
  },
  {
    ...basePlant,
    id: 'corn',
    name: 'Sweet Corn',
    spacing: 12,
    heightCategory: 'tall',
    sunNeeds: 'full',
  },
  {
    ...basePlant,
    id: 'zucchini',
    name: 'Zucchini',
    spacing: 36,
    heightCategory: 'medium',
    sunNeeds: 'full',
  },
  {
    ...basePlant,
    id: 'kale',
    name: 'Kale',
    spacing: 18,
    heightCategory: 'short',
    sunNeeds: 'partial',
  },
  {
    ...basePlant,
    id: 'spinach',
    name: 'Spinach',
    spacing: 6,
    heightCategory: 'ground',
    sunNeeds: 'shade',
  },
]

export const FewPlants: Story = {
  args: {
    plants: fewPlants,
    onSelectPlant: (plant) => console.log('Selected:', plant.name),
  },
}

export const ManyPlants: Story = {
  args: {
    plants: manyPlants,
    onSelectPlant: (plant) => console.log('Selected:', plant.name),
  },
}

export const Selected: Story = {
  args: {
    plants: fewPlants,
    selectedPlant: fewPlants[0],
    onSelectPlant: (plant) => console.log('Selected:', plant.name),
  },
}

export const Empty: Story = {
  args: {
    plants: [],
  },
}

export const SelectPlantInteraction: Story = {
  args: {
    plants: fewPlants,
    onSelectPlant: fn(),
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement)

    await step('Verify plants are listed', async () => {
      await expect(canvas.getByText('Cherry Tomato')).toBeInTheDocument()
      await expect(canvas.getByText('Sweet Basil')).toBeInTheDocument()
      await expect(canvas.getByText('Butter Lettuce')).toBeInTheDocument()
    })

    await step('Click Sweet Basil', async () => {
      const basilButton = canvas.getByLabelText('Select Sweet Basil')
      await userEvent.click(basilButton)
    })

    await step('Verify onSelectPlant was called with basil plant', async () => {
      await expect(args.onSelectPlant).toHaveBeenCalledTimes(1)
      await expect(args.onSelectPlant).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'basil-sweet', name: 'Sweet Basil' }),
      )
    })

    await step('Click Butter Lettuce', async () => {
      const lettuceButton = canvas.getByLabelText('Select Butter Lettuce')
      await userEvent.click(lettuceButton)
    })

    await step('Verify onSelectPlant was called again', async () => {
      await expect(args.onSelectPlant).toHaveBeenCalledTimes(2)
      await expect(args.onSelectPlant).toHaveBeenLastCalledWith(
        expect.objectContaining({ id: 'lettuce', name: 'Butter Lettuce' }),
      )
    })
  },
}
