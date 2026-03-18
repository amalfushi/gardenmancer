import type { Meta, StoryObj } from '@storybook/react'
import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import { theme } from '@/theme'
import { LoadingState } from './loading-state'

const meta: Meta<typeof LoadingState> = {
  title: 'Components/LoadingState',
  component: LoadingState,
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
type Story = StoryObj<typeof LoadingState>

export const PageLoading: Story = {
  args: { variant: 'page' },
}

export const CardLoading: Story = {
  args: { variant: 'card' },
}

export const InlineLoading: Story = {
  args: { variant: 'inline' },
}
