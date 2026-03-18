import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { MantineProvider } from '@mantine/core'
import { Mascot } from '@/components/mascot'

function renderWithMantine(ui: React.ReactElement) {
  return render(<MantineProvider>{ui}</MantineProvider>)
}

describe('Mascot', () => {
  it('renders an SVG with role="img"', () => {
    const { container } = renderWithMantine(<Mascot />)
    const svg = container.querySelector('svg')
    expect(svg).toBeTruthy()
    expect(svg?.getAttribute('role')).toBe('img')
  })

  it('has a default aria-label', () => {
    const { container } = renderWithMantine(<Mascot />)
    const svg = container.querySelector('svg')
    expect(svg?.getAttribute('aria-label')).toBe('Gardenmancer wizard mascot')
  })

  it('accepts a custom aria-label', () => {
    const { container } = renderWithMantine(<Mascot aria-label="Spooky wizard" />)
    const svg = container.querySelector('svg')
    expect(svg?.getAttribute('aria-label')).toBe('Spooky wizard')
  })

  it('renders small size', () => {
    const { container } = renderWithMantine(<Mascot size="sm" />)
    const svg = container.querySelector('svg')
    expect(svg?.getAttribute('width')).toBe('64')
  })

  it('renders medium size (default)', () => {
    const { container } = renderWithMantine(<Mascot />)
    const svg = container.querySelector('svg')
    expect(svg?.getAttribute('width')).toBe('128')
  })

  it('renders large size', () => {
    const { container } = renderWithMantine(<Mascot size="lg" />)
    const svg = container.querySelector('svg')
    expect(svg?.getAttribute('width')).toBe('220')
  })

  it('contains glowing eyes', () => {
    const { container } = renderWithMantine(<Mascot />)
    const eyes = container.querySelectorAll('.mascot-eye ellipse')
    expect(eyes.length).toBeGreaterThanOrEqual(2)
  })

  it('contains the plant element', () => {
    const { container } = renderWithMantine(<Mascot />)
    const plant = container.querySelector('.mascot-plant')
    expect(plant).toBeTruthy()
  })

  it('applies custom style prop', () => {
    const { container } = renderWithMantine(<Mascot style={{ opacity: 0.5 }} />)
    const svg = container.querySelector('svg')
    expect(svg?.style.opacity).toBe('0.5')
  })
})
