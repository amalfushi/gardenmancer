import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MantineProvider } from '@mantine/core'
import { DashboardStats } from '@/components/dashboard-stats'

function renderWithMantine(ui: React.ReactElement) {
  return render(<MantineProvider>{ui}</MantineProvider>)
}

describe('DashboardStats', () => {
  it('renders plant count', () => {
    renderWithMantine(
      <DashboardStats totalPlants={52} totalGardens={3} nextPlantingDate="Mar 15" />,
    )
    expect(screen.getByText('52')).toBeInTheDocument()
  })

  it('renders garden count', () => {
    renderWithMantine(
      <DashboardStats totalPlants={52} totalGardens={3} nextPlantingDate="Mar 15" />,
    )
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('renders next planting date', () => {
    renderWithMantine(
      <DashboardStats totalPlants={52} totalGardens={3} nextPlantingDate="Mar 15" />,
    )
    expect(screen.getByText('Mar 15')).toBeInTheDocument()
  })

  it('renders empty state text when no data', () => {
    renderWithMantine(<DashboardStats totalPlants={0} totalGardens={0} nextPlantingDate={null} />)
    expect(screen.getAllByText('None yet')).toHaveLength(2)
    expect(screen.getByText('No dates')).toBeInTheDocument()
  })

  it('renders loading state when loading', () => {
    const { container } = renderWithMantine(
      <DashboardStats totalPlants={0} totalGardens={0} nextPlantingDate={null} loading />,
    )
    // In loading mode, there should be no stat labels visible
    expect(screen.queryByText('Plants')).not.toBeInTheDocument()
    // Should render some elements (the skeleton papers)
    expect(container.firstChild).toBeTruthy()
  })

  it('renders labels', () => {
    renderWithMantine(<DashboardStats totalPlants={10} totalGardens={2} nextPlantingDate="Apr 1" />)
    expect(screen.getByText('Plants')).toBeInTheDocument()
    expect(screen.getByText('Gardens')).toBeInTheDocument()
    expect(screen.getByText('Next Planting')).toBeInTheDocument()
  })
})
