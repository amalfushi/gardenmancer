import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MantineProvider } from '@mantine/core'
import { CameraCapture } from '@/components/camera-capture'

function renderWithMantine(ui: React.ReactElement) {
  return render(<MantineProvider>{ui}</MantineProvider>)
}

describe('CameraCapture', () => {
  it('renders the component with title', () => {
    renderWithMantine(<CameraCapture onCapture={() => {}} isLoading={false} />)
    expect(screen.getByText(/Capture Seed Packet/)).toBeInTheDocument()
  })

  it('renders upload prompt when no image selected', () => {
    renderWithMantine(<CameraCapture onCapture={() => {}} isLoading={false} />)
    expect(screen.getByText(/Tap to take a photo or choose an image/)).toBeInTheDocument()
  })

  it('renders Take Photo and Upload Image buttons when no preview', () => {
    renderWithMantine(<CameraCapture onCapture={() => {}} isLoading={false} />)
    expect(screen.getByRole('button', { name: /Take a photo/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Upload an image/i })).toBeInTheDocument()
  })

  it('has a hidden camera input with capture attribute', () => {
    renderWithMantine(<CameraCapture onCapture={() => {}} isLoading={false} />)
    const input = screen.getByTestId('camera-input') as HTMLInputElement
    expect(input).toHaveAttribute('accept', 'image/*')
    expect(input).toHaveAttribute('capture', 'environment')
    expect(input.type).toBe('file')
  })

  it('has a hidden file input without capture attribute for gallery upload', () => {
    renderWithMantine(<CameraCapture onCapture={() => {}} isLoading={false} />)
    const input = screen.getByTestId('file-input') as HTMLInputElement
    expect(input).toHaveAttribute('accept', 'image/*')
    expect(input).not.toHaveAttribute('capture')
    expect(input.type).toBe('file')
  })

  it('shows preview after file selection via upload', async () => {
    const OriginalFileReader = globalThis.FileReader
    globalThis.FileReader = class MockFileReader {
      onload: ((ev: ProgressEvent<FileReader>) => void) | null = null
      result: string | ArrayBuffer | null = null
      readAsDataURL() {
        this.result = 'data:image/png;base64,ZmFrZQ=='
        queueMicrotask(() => {
          if (this.onload) {
            this.onload({
              target: { result: this.result },
            } as unknown as ProgressEvent<FileReader>)
          }
        })
      }
    } as unknown as typeof FileReader

    renderWithMantine(<CameraCapture onCapture={() => {}} isLoading={false} />)

    const file = new File(['fake-image-data'], 'seed-packet.png', { type: 'image/png' })
    const input = screen.getByTestId('file-input') as HTMLInputElement

    fireEvent.change(input, { target: { files: [file] } })

    await waitFor(() => {
      expect(screen.getByAltText('Seed packet preview')).toBeInTheDocument()
    })
    expect(screen.getByRole('button', { name: /Scan Packet/i })).toBeInTheDocument()

    globalThis.FileReader = OriginalFileReader
  })

  it('shows preview after camera capture', async () => {
    const OriginalFileReader = globalThis.FileReader
    globalThis.FileReader = class MockFileReader {
      onload: ((ev: ProgressEvent<FileReader>) => void) | null = null
      result: string | ArrayBuffer | null = null
      readAsDataURL() {
        this.result = 'data:image/png;base64,ZmFrZQ=='
        queueMicrotask(() => {
          if (this.onload) {
            this.onload({
              target: { result: this.result },
            } as unknown as ProgressEvent<FileReader>)
          }
        })
      }
    } as unknown as typeof FileReader

    renderWithMantine(<CameraCapture onCapture={() => {}} isLoading={false} />)

    const file = new File(['camera-photo'], 'photo.jpg', { type: 'image/jpeg' })
    const input = screen.getByTestId('camera-input') as HTMLInputElement

    fireEvent.change(input, { target: { files: [file] } })

    await waitFor(() => {
      expect(screen.getByAltText('Seed packet preview')).toBeInTheDocument()
    })

    globalThis.FileReader = OriginalFileReader
  })

  it('calls onCapture when scan button clicked', async () => {
    const OriginalFileReader = globalThis.FileReader
    globalThis.FileReader = class MockFileReader {
      onload: ((ev: ProgressEvent<FileReader>) => void) | null = null
      result: string | ArrayBuffer | null = null
      readAsDataURL() {
        this.result = 'data:image/png;base64,ZmFrZQ=='
        queueMicrotask(() => {
          if (this.onload) {
            this.onload({
              target: { result: this.result },
            } as unknown as ProgressEvent<FileReader>)
          }
        })
      }
    } as unknown as typeof FileReader

    const user = userEvent.setup()
    const handleCapture = vi.fn()

    renderWithMantine(<CameraCapture onCapture={handleCapture} isLoading={false} />)

    const file = new File(['fake-image-data'], 'seed-packet.png', { type: 'image/png' })
    const input = screen.getByTestId('file-input') as HTMLInputElement

    fireEvent.change(input, { target: { files: [file] } })

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Scan Packet/i })).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /Scan Packet/i }))
    expect(handleCapture).toHaveBeenCalledWith(file)

    globalThis.FileReader = OriginalFileReader
  })

  it('disables buttons when loading', () => {
    renderWithMantine(<CameraCapture onCapture={() => {}} isLoading={true} />)
    expect(screen.getByRole('button', { name: /Take a photo/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /Upload an image/i })).toBeDisabled()
  })
})
