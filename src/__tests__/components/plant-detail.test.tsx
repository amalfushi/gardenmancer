import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MantineProvider } from '@mantine/core'
import { PlantDetail } from '@/components/plant-detail'
import type { Plant } from '@/types'

const fullPlant: Plant = {
  id: 'tomato-cherry',
  name: 'Cherry Tomato',
  species: 'Solanum lycopersicum',
  spacing: 24,
  sunNeeds: 'full',
  daysToMaturity: 65,
  heightCategory: 'tall',
  waterNeeds: 'medium',
  companionPlants: ['basil-sweet', 'marigold'],
  zones: [5, 6, 7],
  plantingWindows: {
    startIndoors: '6-8 weeks before last frost',
    transplant: 'After last frost',
    directSow: 'Not recommended',
  },
  source: 'seed',
}

function renderWithMantine(ui: React.ReactElement) {
  return render(<MantineProvider>{ui}</MantineProvider>)
}

describe('PlantDetail', () => {
  it('renders plant name and species', () => {
    renderWithMantine(<PlantDetail plant={fullPlant} />)
    expect(screen.getByText('Cherry Tomato')).toBeInTheDocument()
    expect(screen.getByText('Solanum lycopersicum')).toBeInTheDocument()
  })

  it('renders growing info badges', () => {
    renderWithMantine(<PlantDetail plant={fullPlant} />)
    expect(screen.getByText(/Full Sun/)).toBeInTheDocument()
    // Water needs "Medium" text is within a Badge alongside emoji spans
    const waterBadge = screen
      .getAllByText(/Medium/)
      .find((el) => el.closest('.mantine-Badge-root')?.textContent?.includes('💧'))
    expect(waterBadge).toBeInTheDocument()
    expect(screen.getByText('Tall')).toBeInTheDocument()
  })

  it('renders spacing and maturity', () => {
    renderWithMantine(<PlantDetail plant={fullPlant} />)
    expect(screen.getByText('24″')).toBeInTheDocument()
    expect(screen.getByText('65 days')).toBeInTheDocument()
  })

  it('renders hardiness zones', () => {
    renderWithMantine(<PlantDetail plant={fullPlant} />)
    expect(screen.getByText('Zone 5')).toBeInTheDocument()
    expect(screen.getByText('Zone 6')).toBeInTheDocument()
    expect(screen.getByText('Zone 7')).toBeInTheDocument()
  })

  it('renders planting windows', () => {
    renderWithMantine(<PlantDetail plant={fullPlant} />)
    expect(screen.getByText('6-8 weeks before last frost')).toBeInTheDocument()
    expect(screen.getByText('After last frost')).toBeInTheDocument()
    expect(screen.getByText('Not recommended')).toBeInTheDocument()
  })

  it('renders companion plants', () => {
    renderWithMantine(<PlantDetail plant={fullPlant} />)
    expect(screen.getByText('basil-sweet')).toBeInTheDocument()
    expect(screen.getByText('marigold')).toBeInTheDocument()
  })

  it('renders source badge', () => {
    renderWithMantine(<PlantDetail plant={fullPlant} />)
    expect(screen.getByText('seed')).toBeInTheDocument()
  })

  it('hides zones section when empty', () => {
    const noZones = { ...fullPlant, zones: [] }
    renderWithMantine(<PlantDetail plant={noZones} />)
    expect(screen.queryByText('Hardiness Zones')).not.toBeInTheDocument()
  })

  it('hides companion plants when empty', () => {
    const noCp = { ...fullPlant, companionPlants: [] }
    renderWithMantine(<PlantDetail plant={noCp} />)
    expect(screen.queryByText('Companion Plants')).not.toBeInTheDocument()
  })

  it('hides planting windows section when none provided', () => {
    const noWindows = { ...fullPlant, plantingWindows: {} }
    renderWithMantine(<PlantDetail plant={noWindows} />)
    expect(screen.queryByText('Planting Windows')).not.toBeInTheDocument()
  })

  it('renders actions slot', () => {
    renderWithMantine(<PlantDetail plant={fullPlant} actions={<button>Add to Garden</button>} />)
    expect(screen.getByText('Add to Garden')).toBeInTheDocument()
  })

  it('renders without species when not provided', () => {
    const noSpecies = { ...fullPlant, species: undefined }
    renderWithMantine(<PlantDetail plant={noSpecies} />)
    expect(screen.getByText('Cherry Tomato')).toBeInTheDocument()
    expect(screen.queryByText('Solanum lycopersicum')).not.toBeInTheDocument()
  })
})
