import type { Meta, StoryObj } from '@storybook/react'
import { ExampleButton } from './example-button'
import { expect, fn, userEvent, within } from '@storybook/test'

const meta: Meta<typeof ExampleButton> = {
  title: 'Components/ExampleButton',
  component: ExampleButton,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
}

export default meta
type Story = StoryObj<typeof ExampleButton>

export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
  },
}

export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    variant: 'secondary',
  },
}

export const Small: Story = {
  args: {
    children: 'Small',
    size: 'sm',
  },
}

export const Large: Story = {
  args: {
    children: 'Large Button',
    size: 'lg',
  },
}

export const ClickInteraction: Story = {
  args: {
    children: 'Click Me',
    variant: 'primary',
    onClick: fn(),
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement)

    await step('Click the button', async () => {
      const button = canvas.getByRole('button', { name: /click me/i })
      await userEvent.click(button)
    })

    await step('Verify onClick was called', async () => {
      await expect(args.onClick).toHaveBeenCalledTimes(1)
    })

    await step('Click again and verify count', async () => {
      const button = canvas.getByRole('button', { name: /click me/i })
      await userEvent.click(button)
      await expect(args.onClick).toHaveBeenCalledTimes(2)
    })
  },
}
