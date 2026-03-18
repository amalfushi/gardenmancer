import type { Meta, StoryObj } from '@storybook/react'
import { MantineProvider } from '@mantine/core'
import { AutoOptimizeButton } from './auto-optimize-button'
import { expect, fn, userEvent, within } from '@storybook/test'

import '@mantine/core/styles.css'

const meta: Meta<typeof AutoOptimizeButton> = {
  title: 'Components/AutoOptimizeButton',
  component: AutoOptimizeButton,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MantineProvider>
        <div style={{ maxWidth: 360, padding: 16 }}>
          <Story />
        </div>
      </MantineProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof AutoOptimizeButton>

export const Default: Story = {
  args: {
    onOptimize: fn(() => ({
      layout: [
        { plantId: 'corn', gridX: 0, gridY: 0 },
        { plantId: 'basil', gridX: 2, gridY: 4 },
      ],
      score: 85,
      suggestions: [
        {
          type: 'height' as const,
          message: 'Tall plants are well-positioned on the north side. Good layout!',
          severity: 'success' as const,
        },
      ],
    })),
    onApply: fn(),
  },
}

export const ClickOptimize: Story = {
  args: {
    onOptimize: fn(() => ({
      layout: [{ plantId: 'corn', gridX: 0, gridY: 0 }],
      score: 92,
      suggestions: [
        {
          type: 'spacing' as const,
          message: 'Layout looks great — all plants are well-positioned!',
          severity: 'success' as const,
        },
      ],
    })),
    onApply: fn(),
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement)

    await step('Click auto-optimize button', async () => {
      const optimizeBtn = canvas.getByRole('button', { name: /auto-optimize layout/i })
      await userEvent.click(optimizeBtn)
    })

    await step('Verify optimization results appear', async () => {
      await expect(canvas.getByText('Optimization Results')).toBeInTheDocument()
      await expect(canvas.getByText(/Score: 92/)).toBeInTheDocument()
    })

    await step('Click apply button', async () => {
      const applyBtn = canvas.getByRole('button', { name: /apply optimized layout/i })
      await userEvent.click(applyBtn)
      await expect(args.onApply).toHaveBeenCalledTimes(1)
    })
  },
}

export const LowScore: Story = {
  args: {
    onOptimize: fn(() => ({
      layout: [
        { plantId: 'p1', gridX: 0, gridY: 0 },
        { plantId: 'p2', gridX: 1, gridY: 0 },
      ],
      score: 35,
      suggestions: [
        {
          type: 'spacing' as const,
          message: 'Plants are too close together.',
          severity: 'warning' as const,
        },
        {
          type: 'height' as const,
          message: 'Tall plants should be on the north side.',
          severity: 'warning' as const,
        },
      ],
    })),
    onApply: fn(),
  },
}
