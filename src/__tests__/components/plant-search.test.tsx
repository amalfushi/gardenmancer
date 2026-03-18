import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MantineProvider } from '@mantine/core'
import { PlantSearch } from '@/components/plant-search'

function renderWithMantine(ui: React.ReactElement) {
  return render(<MantineProvider>{ui}</MantineProvider>)
}

describe('PlantSearch', () => {
  it('renders search input', () => {
    renderWithMantine(
      <PlantSearch
        search=""
        onSearchChange={vi.fn()}
        sunFilter={null}
        onSunFilterChange={vi.fn()}
      />,
    )
    expect(screen.getByPlaceholderText('Search plants...')).toBeInTheDocument()
  })

  it('renders sun filter select', () => {
    renderWithMantine(
      <PlantSearch
        search=""
        onSearchChange={vi.fn()}
        sunFilter={null}
        onSunFilterChange={vi.fn()}
      />,
    )
    expect(screen.getByPlaceholderText('Sun needs')).toBeInTheDocument()
  })

  it('displays current search value', () => {
    renderWithMantine(
      <PlantSearch
        search="tomato"
        onSearchChange={vi.fn()}
        sunFilter={null}
        onSunFilterChange={vi.fn()}
      />,
    )
    expect(screen.getByDisplayValue('tomato')).toBeInTheDocument()
  })

  it('calls onSearchChange when typing', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    renderWithMantine(
      <PlantSearch
        search=""
        onSearchChange={handleChange}
        sunFilter={null}
        onSunFilterChange={vi.fn()}
      />,
    )
    await user.type(screen.getByPlaceholderText('Search plants...'), 'basil')
    expect(handleChange).toHaveBeenCalled()
  })

  it('renders with empty state', () => {
    renderWithMantine(
      <PlantSearch
        search=""
        onSearchChange={vi.fn()}
        sunFilter={null}
        onSunFilterChange={vi.fn()}
      />,
    )
    const input = screen.getByPlaceholderText('Search plants...')
    expect(input).toHaveValue('')
  })
})
