import type { Meta, StoryObj } from '@storybook/react'
import { MantineProvider } from '@mantine/core'
import { GardenSuggestions } from './garden-suggestions'
import type { Suggestion } from '@/lib/garden-utils'

import '@mantine/core/styles.css'

const meta: Meta<typeof GardenSuggestions> = {
  title: 'Components/GardenSuggestions',
  component: GardenSuggestions,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MantineProvider>
        <div style={{ maxWidth: 500, padding: 16 }}>
          <Story />
        </div>
      </MantineProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof GardenSuggestions>

export const NoIssues: Story = {
  args: {
    suggestions: [],
  },
}

export const Warnings: Story = {
  args: {
    suggestions: [
      {
        type: 'height',
        message: 'Corn is tall — place on the north side to avoid shading shorter plants.',
        severity: 'warning',
      },
      {
        type: 'sun',
        message:
          'Tomato (full sun) is close to Lettuce (shade). Group by sun needs for best results.',
        severity: 'warning',
      },
    ] satisfies Suggestion[],
  },
}

export const MultipleSuggestions: Story = {
  args: {
    suggestions: [
      {
        type: 'height',
        message: 'Tall plants are well-positioned on the north side. Good layout!',
        severity: 'success',
      },
      {
        type: 'sun',
        message: 'All plants need full sun — consistent light requirements.',
        severity: 'info',
      },
      {
        type: 'spacing',
        message:
          'Tomatoes need 24 inches between plants. Consider moving the basil closer as a companion plant.',
        severity: 'warning',
      },
      {
        type: 'companion',
        message:
          'Basil is an excellent companion for tomatoes — keeps pests away and improves flavor.',
        severity: 'success',
      },
    ] satisfies Suggestion[],
  },
}

export const AllSuccess: Story = {
  args: {
    suggestions: [
      {
        type: 'height',
        message: 'Tall plants are well-positioned on the north side. Good layout!',
        severity: 'success',
      },
      {
        type: 'sun',
        message: 'Plants are grouped by sun requirements. Nice planning!',
        severity: 'success',
      },
    ] satisfies Suggestion[],
  },
}
