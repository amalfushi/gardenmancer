import type { Meta, StoryObj } from '@storybook/react'
import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import { theme } from '@/theme'
import { DashboardStats } from './dashboard-stats'

const meta: Meta<typeof DashboardStats> = {
  title: 'Components/DashboardStats',
  component: DashboardStats,
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
type Story = StoryObj<typeof DashboardStats>

export const WithData: Story = {
  args: {
    totalPlants: 52,
    totalGardens: 3,
    nextPlantingDate: 'Mar 15',
    loading: false,
  },
}

export const EmptyState: Story = {
  args: {
    totalPlants: 0,
    totalGardens: 0,
    nextPlantingDate: null,
    loading: false,
  },
}

export const Loading: Story = {
  args: {
    totalPlants: 0,
    totalGardens: 0,
    nextPlantingDate: null,
    loading: true,
  },
}
