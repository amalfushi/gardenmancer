import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MantineProvider } from '@mantine/core'
import { ScanResultForm } from '@/components/scan-result-form'
import type { Plant } from '@/types'

const mockPlant: Plant = {
  id: 'tomato-1',
  name: 'Cherry Tomato',
  species: 'Solanum lycopersicum',
  spacing: 24,
  sunNeeds: 'full',
  daysToMaturity: 65,
  heightCategory: 'medium',
  waterNeeds: 'medium',
  companionPlants: ['basil'],
  zones: [5, 6, 7],
  plantingWindows: { startIndoors: '6-8 weeks before last frost' },
  source: 'scan',
}

function renderWithMantine(ui: React.ReactElement) {
  return render(<MantineProvider>{ui}</MantineProvider>)
}

describe('ScanResultForm', () => {
  it('renders the scan results title', () => {
    renderWithMantine(<ScanResultForm plant={mockPlant} onSave={() => {}} onDiscard={() => {}} />)
    expect(screen.getByText(/Scan Results/)).toBeInTheDocument()
  })

  it('renders plant name in form field', () => {
    renderWithMantine(<ScanResultForm plant={mockPlant} onSave={() => {}} onDiscard={() => {}} />)
    const nameInput = screen.getByLabelText(/Plant Name/i)
    expect(nameInput).toHaveValue('Cherry Tomato')
  })

  it('renders species in form field', () => {
    renderWithMantine(<ScanResultForm plant={mockPlant} onSave={() => {}} onDiscard={() => {}} />)
    const speciesInput = screen.getByLabelText(/Species/i)
    expect(speciesInput).toHaveValue('Solanum lycopersicum')
  })

  it('renders spacing value', () => {
    renderWithMantine(<ScanResultForm plant={mockPlant} onSave={() => {}} onDiscard={() => {}} />)
    const spacingInput = screen.getByLabelText(/Spacing/i) as HTMLInputElement
    expect(spacingInput.value).toBe('24')
  })

  it('renders days to maturity', () => {
    renderWithMantine(<ScanResultForm plant={mockPlant} onSave={() => {}} onDiscard={() => {}} />)
    const daysInput = screen.getByLabelText(/Days to Maturity/i) as HTMLInputElement
    expect(daysInput.value).toBe('65')
  })

  it('renders Confirm & Save and Discard buttons', () => {
    renderWithMantine(<ScanResultForm plant={mockPlant} onSave={() => {}} onDiscard={() => {}} />)
    expect(screen.getByRole('button', { name: /Confirm & Save/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Discard/i })).toBeInTheDocument()
  })

  it('calls onDiscard when discard button clicked', async () => {
    const user = userEvent.setup()
    const handleDiscard = vi.fn()
    renderWithMantine(
      <ScanResultForm plant={mockPlant} onSave={() => {}} onDiscard={handleDiscard} />,
    )
    await user.click(screen.getByRole('button', { name: /Discard/i }))
    expect(handleDiscard).toHaveBeenCalled()
  })

  it('calls onSave with updated plant when form submitted', async () => {
    const user = userEvent.setup()
    const handleSave = vi.fn()
    renderWithMantine(<ScanResultForm plant={mockPlant} onSave={handleSave} onDiscard={() => {}} />)

    // Edit the name field
    const nameInput = screen.getByLabelText(/Plant Name/i)
    await user.clear(nameInput)
    await user.type(nameInput, 'Big Tomato')

    await user.click(screen.getByRole('button', { name: /Confirm & Save/i }))
    expect(handleSave).toHaveBeenCalled()
    const savedPlant = handleSave.mock.calls[0][0]
    expect(savedPlant.name).toBe('Big Tomato')
    expect(savedPlant.source).toBe('scan')
    expect(savedPlant.id).toBe('tomato-1')
  }, 15000)

  it('renders with minimal plant data', () => {
    const minimalPlant: Plant = {
      id: 'minimal-1',
      name: 'Unknown',
      spacing: 12,
      sunNeeds: 'full',
      daysToMaturity: 60,
      heightCategory: 'medium',
      waterNeeds: 'medium',
      companionPlants: [],
      zones: [5, 6, 7],
      plantingWindows: {},
      source: 'scan',
    }
    renderWithMantine(
      <ScanResultForm plant={minimalPlant} onSave={() => {}} onDiscard={() => {}} />,
    )
    expect(screen.getByLabelText(/Plant Name/i)).toHaveValue('Unknown')
  })
})
