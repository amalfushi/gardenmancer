import type { Meta, StoryObj } from '@storybook/react'
import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import { theme } from '@/theme'
import { PlantDetail } from './plant-detail'
import type { Plant } from '@/types'

const meta: Meta<typeof PlantDetail> = {
  title: 'Components/PlantDetail',
  component: PlantDetail,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MantineProvider theme={theme}>
        <div style={{ maxWidth: 600, padding: 16 }}>
          <Story />
        </div>
      </MantineProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof PlantDetail>

const fullPlant: Plant = {
  id: 'tomato-cherry',
  name: 'Cherry Tomato',
  species: 'Solanum lycopersicum',
  spacing: 24,
  sunNeeds: 'full',
  daysToMaturity: 65,
  heightCategory: 'tall',
  waterNeeds: 'medium',
  companionPlants: ['basil-sweet', 'marigold', 'carrot'],
  zones: [3, 4, 5, 6, 7, 8, 9, 10],
  plantingWindows: {
    startIndoors: '6-8 weeks before last frost',
    transplant: 'After last frost',
    directSow: 'Not recommended',
  },
  source: 'seed',
}

export const FullPlant: Story = {
  args: { plant: fullPlant },
}

export const MinimalPlant: Story = {
  args: {
    plant: {
      id: 'generic-1',
      name: 'Mystery Plant',
      spacing: 12,
      sunNeeds: 'partial',
      daysToMaturity: 45,
      heightCategory: 'short',
      waterNeeds: 'low',
      companionPlants: [],
      zones: [],
      plantingWindows: {},
      source: 'manual',
    },
  },
}

export const Herb: Story = {
  args: {
    plant: {
      id: 'basil-sweet',
      name: 'Sweet Basil',
      species: 'Ocimum basilicum',
      spacing: 12,
      sunNeeds: 'full',
      daysToMaturity: 30,
      heightCategory: 'short',
      waterNeeds: 'medium',
      companionPlants: ['tomato-cherry', 'pepper-bell'],
      zones: [4, 5, 6, 7, 8, 9, 10],
      plantingWindows: {
        startIndoors: '6-8 weeks before last frost',
        transplant: 'After last frost',
      },
      source: 'seed',
    },
  },
}

export const Flower: Story = {
  args: {
    plant: {
      id: 'sunflower',
      name: 'Sunflower',
      species: 'Helianthus annuus',
      spacing: 18,
      sunNeeds: 'full',
      daysToMaturity: 80,
      heightCategory: 'tall',
      waterNeeds: 'low',
      companionPlants: ['cucumber-slicing', 'corn-sweet'],
      zones: [3, 4, 5, 6, 7, 8, 9],
      plantingWindows: {
        directSow: 'After last frost',
      },
      source: 'seed',
    },
  },
}
