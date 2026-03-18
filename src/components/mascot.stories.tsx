import type { Meta, StoryObj } from '@storybook/react'
import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import { theme } from '@/theme'
import { Mascot } from './mascot'

const meta: Meta<typeof Mascot> = {
  title: 'Components/Mascot',
  component: Mascot,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MantineProvider theme={theme}>
        <div style={{ maxWidth: 480, padding: 16, textAlign: 'center' }}>
          <Story />
        </div>
      </MantineProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Mascot>

export const Small: Story = {
  args: { size: 'sm' },
}

export const Medium: Story = {
  args: { size: 'md' },
}

export const Large: Story = {
  args: { size: 'lg' },
}

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 24, justifyContent: 'center' }}>
      <Mascot size="sm" />
      <Mascot size="md" />
      <Mascot size="lg" />
    </div>
  ),
}
