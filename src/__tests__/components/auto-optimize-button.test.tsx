import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MantineProvider } from '@mantine/core'
import { AutoOptimizeButton } from '@/components/auto-optimize-button'
import type { OptimizationResult } from '@/types'

function renderWithMantine(ui: React.ReactElement) {
  return render(<MantineProvider>{ui}</MantineProvider>)
}

const mockResult: OptimizationResult = {
  layout: [
    { plantId: 'corn', gridX: 0, gridY: 0 },
    { plantId: 'basil', gridX: 2, gridY: 4 },
  ],
  score: 85,
  suggestions: [
    {
      type: 'height',
      message: 'Tall plants are well-positioned on the north side.',
      severity: 'success',
    },
    {
      type: 'spacing',
      message: 'Basil and Corn are too close together.',
      severity: 'warning',
    },
  ],
}

describe('AutoOptimizeButton', () => {
  it('renders the optimize button', () => {
    renderWithMantine(<AutoOptimizeButton onOptimize={() => null} onApply={() => {}} />)
    expect(screen.getByRole('button', { name: /auto-optimize layout/i })).toBeInTheDocument()
  })

  it('shows results after clicking optimize', async () => {
    const user = userEvent.setup()
    const onOptimize = vi.fn(() => mockResult)

    renderWithMantine(<AutoOptimizeButton onOptimize={onOptimize} onApply={() => {}} />)

    await user.click(screen.getByRole('button', { name: /auto-optimize layout/i }))

    expect(screen.getByText('Optimization Results')).toBeInTheDocument()
    expect(screen.getByText(/Score: 85/)).toBeInTheDocument()
    expect(screen.getByText(/Tall plants are well-positioned/)).toBeInTheDocument()
    expect(screen.getByText(/too close together/)).toBeInTheDocument()
  })

  it('calls onApply when apply button clicked', async () => {
    const user = userEvent.setup()
    const onApply = vi.fn()

    renderWithMantine(<AutoOptimizeButton onOptimize={() => mockResult} onApply={onApply} />)

    await user.click(screen.getByRole('button', { name: /auto-optimize layout/i }))
    const applyButtons = screen.getAllByRole('button', { name: /apply optimized layout/i })
    expect(applyButtons).toHaveLength(2)
    await user.click(applyButtons[0])

    expect(onApply).toHaveBeenCalledWith(mockResult)
  })

  it('hides results after dismiss', async () => {
    const user = userEvent.setup()

    renderWithMantine(<AutoOptimizeButton onOptimize={() => mockResult} onApply={() => {}} />)

    await user.click(screen.getByRole('button', { name: /auto-optimize layout/i }))
    expect(screen.getByText('Optimization Results')).toBeInTheDocument()

    const dismissButtons = screen.getAllByRole('button', { name: /dismiss/i })
    await user.click(dismissButtons[0])
    expect(screen.queryByText('Optimization Results')).not.toBeInTheDocument()
  })

  it('does not show results when optimize returns null', async () => {
    const user = userEvent.setup()

    renderWithMantine(<AutoOptimizeButton onOptimize={() => null} onApply={() => {}} />)

    await user.click(screen.getByRole('button', { name: /auto-optimize layout/i }))
    expect(screen.queryByText('Optimization Results')).not.toBeInTheDocument()
  })

  it('has proper aria labels', async () => {
    const user = userEvent.setup()

    renderWithMantine(<AutoOptimizeButton onOptimize={() => mockResult} onApply={() => {}} />)

    await user.click(screen.getByRole('button', { name: /auto-optimize layout/i }))
    expect(screen.getByLabelText('Optimization results')).toBeInTheDocument()
    expect(screen.getByLabelText(/layout score: 85/i)).toBeInTheDocument()
  })
})
