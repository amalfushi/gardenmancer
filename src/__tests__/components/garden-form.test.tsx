import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MantineProvider } from '@mantine/core'
import { GardenForm } from '@/components/garden-form'

function renderWithMantine(ui: React.ReactElement) {
  return render(<MantineProvider>{ui}</MantineProvider>)
}

describe('GardenForm', () => {
  it('renders all form fields', () => {
    renderWithMantine(<GardenForm onSubmit={() => {}} />)

    expect(screen.getByRole('textbox', { name: /garden name/i })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /garden type/i })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /width/i })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /length/i })).toBeInTheDocument()
    expect(screen.getByText(/Rotation/)).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /hemisphere/i })).toBeInTheDocument()
  })

  it('displays title when provided', () => {
    renderWithMantine(<GardenForm title="Create Garden" onSubmit={() => {}} />)
    expect(screen.getByRole('heading', { name: 'Create Garden' })).toBeInTheDocument()
  })

  it('shows "Create Garden" button for new garden', () => {
    renderWithMantine(<GardenForm onSubmit={() => {}} />)
    expect(screen.getByRole('button', { name: /create garden/i })).toBeInTheDocument()
  })

  it('shows "Update Garden" button for existing garden', () => {
    renderWithMantine(<GardenForm initialValues={{ name: 'My Garden' }} onSubmit={() => {}} />)
    expect(screen.getByRole('button', { name: /update garden/i })).toBeInTheDocument()
  })

  it('pre-fills initial values', () => {
    renderWithMantine(
      <GardenForm
        initialValues={{
          name: 'Test Garden',
          type: 'raised',
          width: 6,
          length: 10,
          rotationDegrees: 180,
        }}
        onSubmit={() => {}}
      />,
    )

    expect(screen.getByDisplayValue('Test Garden')).toBeInTheDocument()
  })

  it('calls onSubmit with form values', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()

    renderWithMantine(<GardenForm onSubmit={onSubmit} />)

    const nameInput = screen.getByRole('textbox', { name: /garden name/i })
    await user.clear(nameInput)
    await user.type(nameInput, 'My Veggie Plot')

    const submitBtn = screen.getByRole('button', { name: /create garden/i })
    await user.click(submitBtn)

    expect(onSubmit).toHaveBeenCalled()
    expect(onSubmit.mock.calls[0][0]).toEqual(expect.objectContaining({ name: 'My Veggie Plot' }))
  })

  it('validates required name', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()

    renderWithMantine(<GardenForm onSubmit={onSubmit} />)

    const submitBtn = screen.getByRole('button', { name: /create garden/i })
    await user.click(submitBtn)

    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('shows loading state', () => {
    renderWithMantine(<GardenForm onSubmit={() => {}} loading={true} />)
    const button = screen.getByRole('button', { name: /create garden/i })
    expect(button).toBeDisabled()
  })

  it('defaults rotationDegrees to 0', () => {
    renderWithMantine(<GardenForm onSubmit={() => {}} />)
    expect(screen.getByText(/Rotation \(0°\)/)).toBeInTheDocument()
  })
})
