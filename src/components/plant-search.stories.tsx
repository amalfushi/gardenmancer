import type { Meta, StoryObj } from '@storybook/react'
import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import { theme } from '@/theme'
import { PlantSearch } from './plant-search'
import { expect, fn, userEvent, within } from '@storybook/test'

const meta: Meta<typeof PlantSearch> = {
  title: 'Components/PlantSearch',
  component: PlantSearch,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MantineProvider theme={theme}>
        <div style={{ maxWidth: 600, padding: 16 }}>
          <Story />
        </div>
      </MantineProvider>
    ),
  ],
  argTypes: {
    onSearchChange: { action: 'searchChanged' },
    onSunFilterChange: { action: 'filterChanged' },
  },
}

export default meta
type Story = StoryObj<typeof PlantSearch>

export const Default: Story = {
  args: {
    search: '',
    sunFilter: null,
  },
}

export const WithSearchTerm: Story = {
  args: {
    search: 'tomato',
    sunFilter: null,
  },
}

export const WithFilterSelected: Story = {
  args: {
    search: '',
    sunFilter: 'full',
  },
}

export const TypeSearchQuery: Story = {
  args: {
    search: '',
    sunFilter: null,
    onSearchChange: fn(),
    onSunFilterChange: fn(),
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement)

    await step('Type a search query', async () => {
      const searchInput = canvas.getByLabelText('Search plants')
      await userEvent.type(searchInput, 'tomato')
      await expect(args.onSearchChange).toHaveBeenCalled()
    })

    await step('Verify onSearchChange was called for each character', async () => {
      await expect(args.onSearchChange).toHaveBeenCalledTimes(6)
    })
  },
}

export const SelectSunFilter: Story = {
  args: {
    search: '',
    sunFilter: null,
    onSearchChange: fn(),
    onSunFilterChange: fn(),
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement)

    await step('Open the sun filter dropdown and select Full Sun', async () => {
      const filterInput = canvas.getByLabelText('Filter by sun needs')
      await userEvent.click(filterInput)
      const option = await within(document.body).findByText('☀️ Full Sun')
      await userEvent.click(option)
    })

    await step('Verify filter callback was called', async () => {
      await expect(args.onSunFilterChange).toHaveBeenCalledWith('full', expect.anything())
    })
  },
}
