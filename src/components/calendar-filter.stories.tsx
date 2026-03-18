import type { Meta, StoryObj } from '@storybook/react'
import { MantineProvider } from '@mantine/core'
import { CalendarFilter } from './calendar-filter'
import { theme } from '@/theme'

const meta: Meta<typeof CalendarFilter> = {
  title: 'Components/CalendarFilter',
  component: CalendarFilter,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MantineProvider theme={theme}>
        <div style={{ maxWidth: 480, margin: '0 auto', padding: '1rem' }}>
          <Story />
        </div>
      </MantineProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof CalendarFilter>

export const ShowingAll: Story = {
  args: {
    showMyPlantsOnly: false,
    onToggle: () => {},
    filteredCount: 24,
    totalCount: 24,
  },
}

export const ShowingMyPlants: Story = {
  args: {
    showMyPlantsOnly: true,
    onToggle: () => {},
    filteredCount: 8,
    totalCount: 24,
  },
}

export const NoGardenPlants: Story = {
  args: {
    showMyPlantsOnly: true,
    onToggle: () => {},
    filteredCount: 0,
    totalCount: 24,
  },
}

export const SinglePlant: Story = {
  args: {
    showMyPlantsOnly: true,
    onToggle: () => {},
    filteredCount: 1,
    totalCount: 1,
  },
}
