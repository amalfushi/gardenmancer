import type { Meta, StoryObj } from '@storybook/react'
import { MantineProvider } from '@mantine/core'
import { ShadeZoneEditor } from './shade-zone-editor'
import { expect, fn, userEvent, within } from '@storybook/test'

import '@mantine/core/styles.css'

const meta: Meta<typeof ShadeZoneEditor> = {
  title: 'Components/ShadeZoneEditor',
  component: ShadeZoneEditor,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MantineProvider>
        <div style={{ maxWidth: 320, padding: 16 }}>
          <Story />
        </div>
      </MantineProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ShadeZoneEditor>

export const Empty: Story = {
  args: {
    shadeZones: [],
    maxCols: 8,
    maxRows: 16,
    onUpdate: fn(),
  },
}

export const WithZones: Story = {
  args: {
    shadeZones: [
      { id: 'sz1', x: 0, y: 0, width: 3, height: 3, intensity: 'partial' },
      { id: 'sz2', x: 5, y: 5, width: 2, height: 2, intensity: 'full' },
    ],
    maxCols: 8,
    maxRows: 16,
    onUpdate: fn(),
  },
}

export const AddShadeZone: Story = {
  args: {
    shadeZones: [],
    maxCols: 8,
    maxRows: 16,
    onUpdate: fn(),
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement)

    await step('Click add shade zone button', async () => {
      const addButton = canvas.getByRole('button', { name: /add shade zone/i })
      await userEvent.click(addButton)
    })

    await step('Verify onUpdate was called', async () => {
      await expect(args.onUpdate).toHaveBeenCalledTimes(1)
    })
  },
}
