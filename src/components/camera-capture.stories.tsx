import type { Meta, StoryObj } from '@storybook/react'
import { MantineProvider } from '@mantine/core'
import { CameraCapture } from './camera-capture'
import { theme } from '@/theme'

const meta: Meta<typeof CameraCapture> = {
  title: 'Components/CameraCapture',
  component: CameraCapture,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MantineProvider theme={theme}>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <Story />
        </div>
      </MantineProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof CameraCapture>

export const Default: Story = {
  args: {
    onCapture: () => {},
    isLoading: false,
  },
}

export const Loading: Story = {
  args: {
    onCapture: () => {},
    isLoading: true,
  },
}

export const MobileView: Story = {
  args: {
    onCapture: () => {},
    isLoading: false,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}
