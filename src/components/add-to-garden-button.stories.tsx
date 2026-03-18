import type { Meta, StoryObj } from '@storybook/react'
import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import { theme } from '@/theme'
import { AddToGardenButton } from './add-to-garden-button'
import { expect, fn, userEvent, within } from '@storybook/test'

const meta: Meta<typeof AddToGardenButton> = {
  title: 'Components/AddToGardenButton',
  component: AddToGardenButton,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MantineProvider theme={theme}>
        <div style={{ padding: 16 }}>
          <Story />
        </div>
      </MantineProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof AddToGardenButton>

export const Default: Story = {
  args: {
    plantId: 'tomato-cherry',
    zone: 6,
  },
}

export const WithCallback: Story = {
  args: {
    plantId: 'basil-sweet',
    zone: 7,
    onAdded: () => alert('Plant added to garden!'),
  },
}

export const NoZone: Story = {
  args: {
    plantId: 'sunflower',
  },
}

export const OpenModal: Story = {
  args: {
    plantId: 'tomato-cherry',
    zone: 6,
    onAdded: fn(),
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Click the Add to Garden button', async () => {
      const addButton = canvas.getByRole('button', { name: /add to garden/i })
      await expect(addButton).toBeInTheDocument()
      await userEvent.click(addButton)
    })

    await step('Verify modal opens with title', async () => {
      const modal = await within(document.body).findByText('Add to Garden')
      await expect(modal).toBeInTheDocument()
    })
  },
}
