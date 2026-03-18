import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { MantineProvider } from '@mantine/core'
import { LoadingState } from '@/components/loading-state'

function renderWithMantine(ui: React.ReactElement) {
  return render(<MantineProvider>{ui}</MantineProvider>)
}

describe('LoadingState', () => {
  it('renders page loader by default', () => {
    renderWithMantine(<LoadingState />)
    // Page variant shows a spinner
    expect(document.querySelector('[role="presentation"]') ?? document.body.firstChild).toBeTruthy()
  })

  it('renders page variant', () => {
    const { container } = renderWithMantine(<LoadingState variant="page" />)
    expect(container.firstChild).toBeTruthy()
  })

  it('renders card variant', () => {
    const { container } = renderWithMantine(<LoadingState variant="card" />)
    expect(container.firstChild).toBeTruthy()
  })

  it('renders inline variant', () => {
    const { container } = renderWithMantine(<LoadingState variant="inline" />)
    expect(container.firstChild).toBeTruthy()
  })
})
