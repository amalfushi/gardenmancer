import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MantineProvider } from '@mantine/core'

// Mock react-konva since it requires Canvas in tests
vi.mock('react-konva', () => ({
  Stage: ({ children, ...props }: Record<string, unknown>) => (
    <div data-testid="stage" {...props}>
      {children as React.ReactNode}
    </div>
  ),
  Layer: ({ children }: Record<string, unknown>) => (
    <div data-testid="layer">{children as React.ReactNode}</div>
  ),
  Rect: (props: Record<string, unknown>) => <div data-testid="rect" {...props} />,
  Line: (props: Record<string, unknown>) => <div data-testid="line" {...props} />,
  Text: (props: Record<string, unknown>) => (
    <div data-testid="konva-text">{props.text as string}</div>
  ),
  Circle: (props: Record<string, unknown>) => <div data-testid="circle" {...props} />,
  Group: ({ children, ...props }: Record<string, unknown>) => (
    <div data-testid="group" {...props}>
      {children as React.ReactNode}
    </div>
  ),
}))

import { NorthArrow } from '@/components/north-arrow'

function renderWithMantine(ui: React.ReactElement) {
  return render(<MantineProvider>{ui}</MantineProvider>)
}

describe('NorthArrow', () => {
  it('renders the "N" label', () => {
    renderWithMantine(<NorthArrow rotationDegrees={0} />)
    expect(screen.getByText('N')).toBeInTheDocument()
  })

  it('renders with default position and size', () => {
    const { container } = renderWithMantine(<NorthArrow rotationDegrees={0} />)
    const groups = container.querySelectorAll('[data-testid="group"]')
    expect(groups.length).toBeGreaterThanOrEqual(1)
  })

  it('renders with various rotation angles without errors', () => {
    const angles = [0, 45, 90, 135, 180, 225, 270, 315, 360]
    for (const degrees of angles) {
      const { unmount } = renderWithMantine(<NorthArrow rotationDegrees={degrees} />)
      expect(screen.getByText('N')).toBeInTheDocument()
      unmount()
    }
  })

  it('applies custom position and size', () => {
    renderWithMantine(<NorthArrow rotationDegrees={180} x={50} y={50} size={40} />)
    expect(screen.getByText('N')).toBeInTheDocument()
  })

  it('applies correct rotation for degree values', () => {
    // rotationDegrees=0 → arrow rotation=-0 (north at top)
    // rotationDegrees=90 → arrow rotation=-90
    // rotationDegrees=180 → arrow rotation=-180
    const testCases = [
      { degrees: 0, expectedRotation: 0 },
      { degrees: 90, expectedRotation: -90 },
      { degrees: 180, expectedRotation: -180 },
      { degrees: 270, expectedRotation: -270 },
    ]

    for (const { degrees, expectedRotation } of testCases) {
      const { container, unmount } = renderWithMantine(<NorthArrow rotationDegrees={degrees} />)
      const outerGroup = container.querySelector('[data-testid="group"]')
      expect(outerGroup).toHaveAttribute('rotation', String(expectedRotation))
      unmount()
    }
  })

  it('supports arbitrary angles like 45°', () => {
    const { container } = renderWithMantine(<NorthArrow rotationDegrees={45} />)
    const outerGroup = container.querySelector('[data-testid="group"]')
    expect(outerGroup).toHaveAttribute('rotation', String(-45))
  })
})
