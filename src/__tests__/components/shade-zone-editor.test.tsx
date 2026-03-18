import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MantineProvider } from '@mantine/core'
import { ShadeZoneEditor } from '@/components/shade-zone-editor'
import type { ShadeZone } from '@/types'

function renderWithMantine(ui: React.ReactElement) {
  return render(<MantineProvider>{ui}</MantineProvider>)
}

describe('ShadeZoneEditor', () => {
  const emptyZones: ShadeZone[] = []
  const zones: ShadeZone[] = [
    { id: 'sz1', x: 0, y: 0, width: 3, height: 3, intensity: 'partial' },
    { id: 'sz2', x: 5, y: 5, width: 2, height: 2, intensity: 'full' },
  ]

  it('renders the title', () => {
    renderWithMantine(
      <ShadeZoneEditor shadeZones={emptyZones} maxCols={8} maxRows={16} onUpdate={() => {}} />,
    )
    expect(screen.getByText(/shade zones/i)).toBeInTheDocument()
  })

  it('renders existing shade zones', () => {
    renderWithMantine(
      <ShadeZoneEditor shadeZones={zones} maxCols={8} maxRows={16} onUpdate={() => {}} />,
    )
    expect(screen.getByText('partial')).toBeInTheDocument()
    expect(screen.getByText('full')).toBeInTheDocument()
  })

  it('calls onUpdate when adding a zone', async () => {
    const onUpdate = vi.fn()
    const user = userEvent.setup()
    renderWithMantine(
      <ShadeZoneEditor shadeZones={emptyZones} maxCols={8} maxRows={16} onUpdate={onUpdate} />,
    )

    const addButton = screen.getByRole('button', { name: /add shade zone/i })
    await user.click(addButton)

    expect(onUpdate).toHaveBeenCalledTimes(1)
    const updatedZones = onUpdate.mock.calls[0][0]
    expect(updatedZones).toHaveLength(1)
    expect(updatedZones[0]).toHaveProperty('id')
    expect(updatedZones[0]).toHaveProperty('intensity', 'partial')
  })

  it('calls onUpdate when removing a zone', async () => {
    const onUpdate = vi.fn()
    const user = userEvent.setup()
    renderWithMantine(
      <ShadeZoneEditor shadeZones={zones} maxCols={8} maxRows={16} onUpdate={onUpdate} />,
    )

    const removeButtons = screen.getAllByRole('button', { name: /remove shade zone/i })
    await user.click(removeButtons[0])

    expect(onUpdate).toHaveBeenCalledTimes(1)
    const updatedZones = onUpdate.mock.calls[0][0]
    expect(updatedZones).toHaveLength(1)
  })

  it('has proper aria labels', () => {
    renderWithMantine(
      <ShadeZoneEditor shadeZones={emptyZones} maxCols={8} maxRows={16} onUpdate={() => {}} />,
    )
    expect(screen.getByLabelText(/shade zone editor/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/shade zone x position/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/shade zone y position/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/shade zone width/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/shade zone height/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/shade zone intensity/i)).toBeInTheDocument()
  })
})
