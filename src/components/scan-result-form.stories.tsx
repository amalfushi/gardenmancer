import type { Meta, StoryObj } from '@storybook/react'
import { MantineProvider } from '@mantine/core'
import { ScanResultForm } from './scan-result-form'
import { theme } from '@/theme'
import type { Plant } from '@/types'
import { expect, fn, userEvent, within } from '@storybook/test'

const tomatoPlant: Plant = {
  id: 'tomato-scan-1',
  name: 'Cherry Tomato',
  species: 'Solanum lycopersicum',
  spacing: 24,
  sunNeeds: 'full',
  daysToMaturity: 65,
  heightCategory: 'medium',
  waterNeeds: 'medium',
  companionPlants: ['basil', 'carrots', 'parsley'],
  zones: [3, 4, 5, 6, 7, 8, 9, 10],
  plantingWindows: {
    startIndoors: '6-8 weeks before last frost',
    transplant: 'After last frost date',
  },
  source: 'scan',
}

const minimalPlant: Plant = {
  id: 'minimal-scan-1',
  name: 'Unknown Plant',
  spacing: 12,
  sunNeeds: 'full',
  daysToMaturity: 60,
  heightCategory: 'medium',
  waterNeeds: 'medium',
  companionPlants: [],
  zones: [5, 6, 7],
  plantingWindows: {},
  source: 'scan',
}

const meta: Meta<typeof ScanResultForm> = {
  title: 'Components/ScanResultForm',
  component: ScanResultForm,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MantineProvider theme={theme}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <Story />
        </div>
      </MantineProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ScanResultForm>

export const CompletePlant: Story = {
  args: {
    plant: tomatoPlant,
    onSave: () => {},
    onDiscard: () => {},
  },
}

export const PartialPlant: Story = {
  args: {
    plant: minimalPlant,
    onSave: () => {},
    onDiscard: () => {},
  },
}

export const EditingState: Story = {
  args: {
    plant: tomatoPlant,
    onSave: () => {},
    onDiscard: () => {},
  },
}

export const EditAndSave: Story = {
  args: {
    plant: tomatoPlant,
    onSave: fn(),
    onDiscard: fn(),
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement)

    await step('Edit the plant name', async () => {
      const nameInput = canvas.getByLabelText('Plant Name')
      await userEvent.clear(nameInput)
      await userEvent.type(nameInput, 'Roma Tomato')
      await expect(nameInput).toHaveValue('Roma Tomato')
    })

    await step('Edit the species field', async () => {
      const speciesInput = canvas.getByLabelText('Species')
      await userEvent.clear(speciesInput)
      await userEvent.type(speciesInput, 'Solanum lycopersicum var. roma')
      await expect(speciesInput).toHaveValue('Solanum lycopersicum var. roma')
    })

    await step('Submit the form and verify callback', async () => {
      const saveButton = canvas.getByRole('button', { name: /confirm & save/i })
      await userEvent.click(saveButton)
      await expect(args.onSave).toHaveBeenCalledTimes(1)
    })
  },
}

export const DiscardAction: Story = {
  args: {
    plant: tomatoPlant,
    onSave: fn(),
    onDiscard: fn(),
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement)

    await step('Click discard button', async () => {
      const discardButton = canvas.getByRole('button', { name: /discard/i })
      await userEvent.click(discardButton)
    })

    await step('Verify discard callback was called', async () => {
      await expect(args.onDiscard).toHaveBeenCalledTimes(1)
      await expect(args.onSave).not.toHaveBeenCalled()
    })
  },
}
