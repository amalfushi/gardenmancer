import type { Meta, StoryObj } from '@storybook/react'
import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import { theme } from '@/theme'
import { ZoneSelector } from './zone-selector'
import { useState } from 'react'
import { expect, fn, userEvent, within } from '@storybook/test'

const meta: Meta<typeof ZoneSelector> = {
  title: 'Components/ZoneSelector',
  component: ZoneSelector,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MantineProvider theme={theme}>
        <div style={{ maxWidth: 400, padding: 16 }}>
          <Story />
        </div>
      </MantineProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ZoneSelector>

function DefaultRenderer() {
  const [value, setValue] = useState<string | null>(null)
  return <ZoneSelector value={value} onChange={setValue} />
}

export const Default: Story = {
  render: () => <DefaultRenderer />,
}

function PreSelectedRenderer() {
  const [value, setValue] = useState<string | null>('6')
  return <ZoneSelector value={value} onChange={setValue} />
}

export const PreSelected: Story = {
  render: () => <PreSelectedRenderer />,
}

export const SelectZone: Story = {
  args: {
    value: null,
    onChange: fn(),
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement)

    await step('Open the zone dropdown', async () => {
      const zoneInput = canvas.getByLabelText('USDA Hardiness Zone')
      await userEvent.click(zoneInput)
    })

    await step('Select Zone 7', async () => {
      const option = await within(document.body).findByText('Zone 7')
      await userEvent.click(option)
    })

    await step('Verify onChange was called with zone 7', async () => {
      await expect(args.onChange).toHaveBeenCalledWith('7', expect.anything())
    })
  },
}

export const ChangeZone: Story = {
  args: {
    value: '5',
    onChange: fn(),
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement)

    await step('Verify current value is Zone 5', async () => {
      const zoneInput = canvas.getByLabelText('USDA Hardiness Zone')
      await expect(zoneInput).toHaveValue('Zone 5')
    })

    await step('Open dropdown and select Zone 9', async () => {
      const zoneInput = canvas.getByLabelText('USDA Hardiness Zone')
      await userEvent.click(zoneInput)
      const option = await within(document.body).findByText('Zone 9')
      await userEvent.click(option)
    })

    await step('Verify onChange was called with zone 9', async () => {
      await expect(args.onChange).toHaveBeenCalledWith('9', expect.anything())
    })
  },
}
