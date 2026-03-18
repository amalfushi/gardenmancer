import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MantineProvider } from '@mantine/core'
import { GardenCard } from '@/components/garden-card'
import type { Garden } from '@/types'

function renderWithMantine(ui: React.ReactElement) {
  return render(<MantineProvider>{ui}</MantineProvider>)
}

const baseGarden: Garden = {
  id: 'test-1',
  name: 'Test Garden',
  type: 'raised',
  width: 4,
  length: 8,
  rotationDegrees: 0,
  hemisphere: 'northern',
  layout: [],
}

describe('GardenCard', () => {
  it('renders garden name', () => {
    renderWithMantine(<GardenCard garden={baseGarden} />)
    expect(screen.getByText('Test Garden')).toBeInTheDocument()
  })

  it('renders garden type badge', () => {
    renderWithMantine(<GardenCard garden={baseGarden} />)
    expect(screen.getByText('Raised Bed')).toBeInTheDocument()
  })

  it('renders dimensions', () => {
    renderWithMantine(<GardenCard garden={baseGarden} />)
    expect(screen.getByText(/4 × 8 ft/)).toBeInTheDocument()
  })

  it('renders rotation', () => {
    renderWithMantine(<GardenCard garden={baseGarden} />)
    expect(screen.getByText(/0° rotation/i)).toBeInTheDocument()
  })

  it('shows plant count when plants are placed', () => {
    const gardenWithPlants: Garden = {
      ...baseGarden,
      layout: [
        { plantId: 'p1', gridX: 0, gridY: 0 },
        { plantId: 'p2', gridX: 1, gridY: 0 },
      ],
    }
    renderWithMantine(<GardenCard garden={gardenWithPlants} />)
    expect(screen.getByText(/2 plants placed/)).toBeInTheDocument()
  })

  it('does not show plant count when empty', () => {
    renderWithMantine(<GardenCard garden={baseGarden} />)
    expect(screen.queryByText(/plant/)).not.toBeInTheDocument()
  })

  it('renders flat garden type', () => {
    renderWithMantine(<GardenCard garden={{ ...baseGarden, type: 'flat' }} />)
    expect(screen.getByText('Flat Garden')).toBeInTheDocument()
  })

  it('renders container type', () => {
    renderWithMantine(<GardenCard garden={{ ...baseGarden, type: 'container' }} />)
    expect(screen.getByText('Container')).toBeInTheDocument()
  })

  it('renders terraced type', () => {
    renderWithMantine(<GardenCard garden={{ ...baseGarden, type: 'terraced' }} />)
    expect(screen.getByText('Terraced')).toBeInTheDocument()
  })

  it('has aria-label with garden name', () => {
    renderWithMantine(<GardenCard garden={baseGarden} />)
    expect(screen.getByLabelText('Garden: Test Garden')).toBeInTheDocument()
  })
})
