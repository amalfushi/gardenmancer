import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MantineProvider } from '@mantine/core'
import { CalendarFilter } from '@/components/calendar-filter'

function renderWithMantine(ui: React.ReactElement) {
  return render(<MantineProvider>{ui}</MantineProvider>)
}

describe('CalendarFilter', () => {
  it('renders the switch and badge when showing all plants', () => {
    renderWithMantine(
      <CalendarFilter
        showMyPlantsOnly={false}
        onToggle={() => {}}
        filteredCount={24}
        totalCount={24}
      />,
    )
    expect(screen.getByText('My Garden Plants Only')).toBeInTheDocument()
    expect(screen.getByText('Showing: All 24 Plants')).toBeInTheDocument()
  })

  it('shows filtered count when toggled on', () => {
    renderWithMantine(
      <CalendarFilter
        showMyPlantsOnly={true}
        onToggle={() => {}}
        filteredCount={8}
        totalCount={24}
      />,
    )
    expect(screen.getByText('Showing: 8 Garden Plants')).toBeInTheDocument()
  })

  it('uses singular "Plant" for count of 1', () => {
    renderWithMantine(
      <CalendarFilter
        showMyPlantsOnly={true}
        onToggle={() => {}}
        filteredCount={1}
        totalCount={24}
      />,
    )
    expect(screen.getByText('Showing: 1 Garden Plant')).toBeInTheDocument()
  })

  it('calls onToggle when switch is clicked', async () => {
    const user = userEvent.setup()
    const handleToggle = vi.fn()

    renderWithMantine(
      <CalendarFilter
        showMyPlantsOnly={false}
        onToggle={handleToggle}
        filteredCount={24}
        totalCount={24}
      />,
    )

    const switchEl = screen.getByRole('switch')
    await user.click(switchEl)
    expect(handleToggle).toHaveBeenCalledWith(true)
  })

  it('has accessible aria-label on the filter group', () => {
    renderWithMantine(
      <CalendarFilter
        showMyPlantsOnly={false}
        onToggle={() => {}}
        filteredCount={24}
        totalCount={24}
      />,
    )
    expect(screen.getByRole('group', { name: /calendar plant filter/i })).toBeInTheDocument()
  })

  it('badge has aria-live for screen readers', () => {
    const { container } = renderWithMantine(
      <CalendarFilter
        showMyPlantsOnly={false}
        onToggle={() => {}}
        filteredCount={24}
        totalCount={24}
      />,
    )
    const badge = container.querySelector('[aria-live="polite"]')
    expect(badge).toBeInTheDocument()
  })
})
