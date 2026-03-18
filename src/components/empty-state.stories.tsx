import type { Meta, StoryObj } from '@storybook/react'
import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import { theme } from '@/theme'
import { EmptyState } from './empty-state'

const meta: Meta<typeof EmptyState> = {
  title: 'Components/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MantineProvider theme={theme}>
        <div style={{ maxWidth: 480, padding: 16 }}>
          <Story />
        </div>
      </MantineProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof EmptyState>

export const NoPlants: Story = {
  args: {
    icon: '🌿',
    title: 'No Plants Yet',
    message: 'Add your first plant to get started with your garden planning.',
    actionLabel: 'Browse Plants',
    onAction: () => alert('Navigate to plants'),
  },
}

export const NoGardens: Story = {
  args: {
    icon: '🏡',
    title: 'No Gardens Yet',
    message: 'Create your first garden bed to start designing your layout.',
    actionLabel: 'Create Garden',
    onAction: () => alert('Navigate to create garden'),
  },
}

export const NoCalendarEntries: Story = {
  args: {
    icon: '📅',
    title: 'No Planting Dates',
    message: 'Select a USDA zone to see your planting calendar.',
  },
}
