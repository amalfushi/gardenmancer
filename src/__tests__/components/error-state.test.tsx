import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MantineProvider } from '@mantine/core'
import { ErrorState } from '@/components/error-state'

function renderWithMantine(ui: React.ReactElement) {
  return render(<MantineProvider>{ui}</MantineProvider>)
}

describe('ErrorState', () => {
  it('renders default title', () => {
    renderWithMantine(<ErrorState message="Something failed" />)
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })

  it('renders custom title', () => {
    renderWithMantine(<ErrorState title="Network Error" message="Cannot connect" />)
    expect(screen.getByText('Network Error')).toBeInTheDocument()
  })

  it('renders error message', () => {
    renderWithMantine(<ErrorState message="Unable to load plants" />)
    expect(screen.getByText('Unable to load plants')).toBeInTheDocument()
  })

  it('renders retry button when onRetry provided', () => {
    renderWithMantine(<ErrorState message="Error" onRetry={() => {}} />)
    expect(screen.getByText('Try Again')).toBeInTheDocument()
  })

  it('does not render retry button when onRetry not provided', () => {
    renderWithMantine(<ErrorState message="Error" />)
    expect(screen.queryByText('Try Again')).not.toBeInTheDocument()
  })

  it('calls onRetry when retry button clicked', async () => {
    const user = userEvent.setup()
    const handleRetry = vi.fn()
    renderWithMantine(<ErrorState message="Error" onRetry={handleRetry} />)
    await user.click(screen.getByText('Try Again'))
    expect(handleRetry).toHaveBeenCalled()
  })
})
