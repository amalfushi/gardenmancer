import type { Meta, StoryObj } from '@storybook/react'
import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import { theme } from '@/theme'
import { ErrorState } from './error-state'

const meta: Meta<typeof ErrorState> = {
  title: 'Components/ErrorState',
  component: ErrorState,
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
type Story = StoryObj<typeof ErrorState>

export const NetworkError: Story = {
  args: {
    title: 'Network Error',
    message: 'Unable to connect to the server. Please check your internet connection.',
    onRetry: () => alert('Retrying...'),
  },
}

export const NotFound: Story = {
  args: {
    title: 'Not Found',
    message: 'The requested resource could not be found.',
  },
}

export const GenericError: Story = {
  args: {
    title: 'Something went wrong',
    message: 'An unexpected error occurred. Please try again later.',
    onRetry: () => alert('Retrying...'),
  },
}
