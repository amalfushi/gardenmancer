import type { Meta, StoryObj } from '@storybook/react'
import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import { theme } from '@/theme'
import { CalendarView } from './calendar-view'
import type { CalendarPlantEntry } from './calendar-view'
import { expect, within } from '@storybook/test'

const meta: Meta<typeof CalendarView> = {
  title: 'Components/CalendarView',
  component: CalendarView,
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
type Story = StoryObj<typeof CalendarView>

export const Empty: Story = {
  args: {
    plants: [],
    zone: 6,
  },
}

const year = new Date().getFullYear()

const singlePlant: CalendarPlantEntry[] = [
  {
    plantName: 'Cherry Tomato',
    dates: {
      startIndoors: new Date(year, 1, 28), // Feb
      transplant: new Date(year, 3, 15), // Apr
    },
  },
]

export const SinglePlant: Story = {
  args: {
    plants: singlePlant,
    zone: 6,
  },
}

const multiplePlants: CalendarPlantEntry[] = [
  {
    plantName: 'Cherry Tomato',
    dates: {
      startIndoors: new Date(year, 1, 28),
      transplant: new Date(year, 3, 15),
    },
  },
  {
    plantName: 'Sweet Basil',
    dates: {
      startIndoors: new Date(year, 1, 28),
      transplant: new Date(year, 3, 15),
    },
  },
  {
    plantName: 'Sunflower',
    dates: {
      directSow: new Date(year, 3, 15),
    },
  },
  {
    plantName: 'Lettuce',
    dates: {
      directSow: new Date(year, 2, 15),
    },
  },
]

export const MultiplePlants: Story = {
  args: {
    plants: multiplePlants,
    zone: 6,
  },
}

export const EmptyStateVerification: Story = {
  args: {
    plants: [],
    zone: 6,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Verify empty state message', async () => {
      await expect(canvas.getByText(/no plants to display/i)).toBeInTheDocument()
    })
  },
}

export const CalendarContentVerification: Story = {
  args: {
    plants: multiplePlants,
    zone: 6,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Verify calendar title shows correct zone', async () => {
      await expect(canvas.getByText('Zone 6 Planting Calendar')).toBeInTheDocument()
    })

    await step('Verify all 12 months are displayed', async () => {
      const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ]
      for (const month of months) {
        await expect(canvas.getByText(month)).toBeInTheDocument()
      }
    })

    await step('Verify plant events are rendered as badges', async () => {
      await expect(canvas.getByText(/Start Indoors.*Cherry Tomato/i)).toBeInTheDocument()
      await expect(canvas.getByText(/Transplant.*Cherry Tomato/i)).toBeInTheDocument()
    })
  },
}
