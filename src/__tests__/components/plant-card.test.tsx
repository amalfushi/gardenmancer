import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MantineProvider } from '@mantine/core'
import { PlantCard } from '@/components/plant-card'
import type { Plant } from '@/types'

const mockPlant: Plant = {
  id: 'tomato-1',
  name: 'Cherry Tomato',
  species: 'Solanum lycopersicum',
  spacing: 24,
  sunNeeds: 'full',
  daysToMaturity: 65,
  heightCategory: 'tall',
  waterNeeds: 'medium',
  companionPlants: ['basil'],
  zones: [5, 6, 7],
  plantingWindows: { startIndoors: '6-8 weeks before last frost' },
  source: 'seed',
}

function renderWithMantine(ui: React.ReactElement) {
  return render(<MantineProvider>{ui}</MantineProvider>)
}

describe('PlantCard', () => {
  it('renders plant name', () => {
    renderWithMantine(<PlantCard plant={mockPlant} />)
    expect(screen.getByText('Cherry Tomato')).toBeInTheDocument()
  })

  it('renders species', () => {
    renderWithMantine(<PlantCard plant={mockPlant} />)
    expect(screen.getByText('Solanum lycopersicum')).toBeInTheDocument()
  })

  it('renders sun needs badge', () => {
    renderWithMantine(<PlantCard plant={mockPlant} />)
    expect(screen.getByText('Full Sun')).toBeInTheDocument()
  })

  it('renders height category badge', () => {
    renderWithMantine(<PlantCard plant={mockPlant} />)
    expect(screen.getByText('Tall')).toBeInTheDocument()
  })

  it('renders spacing info', () => {
    renderWithMantine(<PlantCard plant={mockPlant} />)
    expect(screen.getByText(/24″ spacing/)).toBeInTheDocument()
  })

  it('renders days to maturity', () => {
    renderWithMantine(<PlantCard plant={mockPlant} />)
    expect(screen.getByText(/65 days/)).toBeInTheDocument()
  })

  it('renders partial shade badge', () => {
    const partialPlant = { ...mockPlant, sunNeeds: 'partial' as const }
    renderWithMantine(<PlantCard plant={partialPlant} />)
    expect(screen.getByText('Partial Shade')).toBeInTheDocument()
  })

  it('renders shade badge', () => {
    const shadePlant = { ...mockPlant, sunNeeds: 'shade' as const }
    renderWithMantine(<PlantCard plant={shadePlant} />)
    expect(screen.getByText('Shade')).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    renderWithMantine(<PlantCard plant={mockPlant} onClick={handleClick} />)
    await user.click(screen.getByText('Cherry Tomato'))
    expect(handleClick).toHaveBeenCalled()
  })

  it('renders without species when not provided', () => {
    const noSpecies = { ...mockPlant, species: undefined }
    renderWithMantine(<PlantCard plant={noSpecies} />)
    expect(screen.getByText('Cherry Tomato')).toBeInTheDocument()
    expect(screen.queryByText('Solanum lycopersicum')).not.toBeInTheDocument()
  })
})
