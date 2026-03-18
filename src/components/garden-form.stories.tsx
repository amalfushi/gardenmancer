import type { Meta, StoryObj } from '@storybook/react'
import { MantineProvider } from '@mantine/core'
import { GardenForm } from './garden-form'
import { expect, fn, userEvent, within } from '@storybook/test'

import '@mantine/core/styles.css'

const meta: Meta<typeof GardenForm> = {
  title: 'Components/GardenForm',
  component: GardenForm,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MantineProvider>
        <div style={{ maxWidth: 400, padding: 16 }}>
          <Story />
        </div>
      </MantineProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof GardenForm>

export const CreateNew: Story = {
  args: {
    title: 'Create New Garden',
    onSubmit: (values) => console.log('Create:', values),
  },
}

export const EditExisting: Story = {
  args: {
    title: 'Edit Garden',
    initialValues: {
      name: 'My Raised Bed',
      type: 'raised',
      width: 4,
      length: 8,
      rotationDegrees: 0,
    },
    onSubmit: (values) => console.log('Update:', values),
  },
}

export const Loading: Story = {
  args: {
    title: 'Saving...',
    loading: true,
    onSubmit: () => {},
  },
}

export const FillAndSubmit: Story = {
  args: {
    title: 'Create New Garden',
    onSubmit: fn(),
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement)

    await step('Fill in garden name', async () => {
      const nameInput = canvas.getByLabelText('Garden Name')
      await userEvent.type(nameInput, 'Backyard Veggie Patch')
      await expect(nameInput).toHaveValue('Backyard Veggie Patch')
    })

    await step('Submit the form', async () => {
      const submitButton = canvas.getByRole('button', { name: /create garden/i })
      await userEvent.click(submitButton)
    })

    await step('Verify onSubmit was called with form values', async () => {
      await expect(args.onSubmit).toHaveBeenCalledTimes(1)
      await expect(args.onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Backyard Veggie Patch' }),
      )
    })
  },
}

export const SubmitEmptyName: Story = {
  args: {
    title: 'Create New Garden',
    onSubmit: fn(),
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement)

    await step('Clear the name field and submit', async () => {
      const nameInput = canvas.getByLabelText('Garden Name')
      await userEvent.clear(nameInput)
      const submitButton = canvas.getByRole('button', { name: /create garden/i })
      await userEvent.click(submitButton)
    })

    await step('Verify form was NOT submitted (validation error)', async () => {
      await expect(args.onSubmit).not.toHaveBeenCalled()
      await expect(canvas.getByText('Name is required')).toBeInTheDocument()
    })
  },
}
