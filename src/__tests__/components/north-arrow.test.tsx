import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MantineProvider } from '@mantine/core'

import { NorthArrow } from '@/components/north-arrow'

function renderWithMantine(ui: React.ReactElement) {
  return render(<MantineProvider>{ui}</MantineProvider>)
}

describe('NorthArrow', () => {
  it('renders the "N" label', () => {
    renderWithMantine(<NorthArrow />)
    expect(screen.getByText('N')).toBeInTheDocument()
  })

  it('renders an SVG element with aria-label', () => {
    const { container } = renderWithMantine(<NorthArrow />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute('aria-label', 'North indicator')
  })

  it('renders with default size', () => {
    const { container } = renderWithMantine(<NorthArrow />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('width', '36')
  })

  it('renders with custom size', () => {
    const { container } = renderWithMantine(<NorthArrow size={48} />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('width', '48')
  })

  it('always points north (no rotation applied)', () => {
    const { container } = renderWithMantine(<NorthArrow />)
    const svg = container.querySelector('svg')
    // SVG should not have a transform/rotation — it always points up
    expect(svg?.getAttribute('transform')).toBeNull()
  })

  it('contains north arrow polygon and south arrow polygon', () => {
    const { container } = renderWithMantine(<NorthArrow />)
    const polygons = container.querySelectorAll('polygon')
    expect(polygons.length).toBe(2)
  })
})
