import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MantineProvider } from '@mantine/core'
import { EmptyState } from '@/components/empty-state'

function renderWithMantine(ui: React.ReactElement) {
  return render(<MantineProvider>{ui}</MantineProvider>)
}

describe('EmptyState', () => {
  it('renders title', () => {
    renderWithMantine(<EmptyState title="No Plants" message="Add some plants" />)
    expect(screen.getByText('No Plants')).toBeInTheDocument()
  })

  it('renders message', () => {
    renderWithMantine(<EmptyState title="Empty" message="Nothing here yet" />)
    expect(screen.getByText('Nothing here yet')).toBeInTheDocument()
  })

  it('renders custom icon', () => {
    renderWithMantine(<EmptyState icon="🌿" title="No Plants" message="Add some" />)
    expect(screen.getByText('🌿')).toBeInTheDocument()
  })

  it('renders default icon when not specified', () => {
    renderWithMantine(<EmptyState title="Empty" message="Nothing" />)
    expect(screen.getByText('📭')).toBeInTheDocument()
  })

  it('renders action button when actionLabel and onAction provided', () => {
    renderWithMantine(
      <EmptyState
        title="No Gardens"
        message="Create one"
        actionLabel="Create Garden"
        onAction={() => {}}
      />,
    )
    expect(screen.getByText('Create Garden')).toBeInTheDocument()
  })

  it('does not render action button when no onAction', () => {
    renderWithMantine(
      <EmptyState title="No Gardens" message="Create one" actionLabel="Create Garden" />,
    )
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('calls onAction when button clicked', async () => {
    const user = userEvent.setup()
    const handleAction = vi.fn()
    renderWithMantine(
      <EmptyState title="Empty" message="Nothing" actionLabel="Add" onAction={handleAction} />,
    )
    await user.click(screen.getByText('Add'))
    expect(handleAction).toHaveBeenCalled()
  })
})
