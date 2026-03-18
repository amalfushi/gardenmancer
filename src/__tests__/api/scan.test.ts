import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the claude module
vi.mock('@/lib/claude', () => ({
  scanSeedPacket: vi.fn(),
}))

// Mock the scan-parser module
vi.mock('@/lib/scan-parser', () => ({
  parseScanResponse: vi.fn(),
}))

import { POST } from '@/app/api/scan/route'
import { scanSeedPacket } from '@/lib/claude'
import { parseScanResponse } from '@/lib/scan-parser'
import type { Plant } from '@/types'

const mockPlant: Plant = {
  id: 'test-id',
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

function createMockRequest(formData?: FormData) {
  const fd = formData ?? new FormData()
  return {
    formData: () => Promise.resolve(fd),
  } as unknown as Request
}

describe('POST /api/scan', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 400 when no image file provided', async () => {
    const request = createMockRequest()

    const response = await POST(request as never)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('No image file provided')
  })

  it('scans an image and returns plant data', async () => {
    const mockRaw = { name: 'Cherry Tomato' }
    vi.mocked(scanSeedPacket).mockResolvedValue(mockRaw)
    vi.mocked(parseScanResponse).mockReturnValue(mockPlant)

    const formData = new FormData()
    const file = new File(['fake-image-data'], 'seed.png', { type: 'image/png' })
    formData.set('image', file)
    const request = createMockRequest(formData)

    const response = await POST(request as never)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.name).toBe('Cherry Tomato')
    expect(scanSeedPacket).toHaveBeenCalled()
    expect(parseScanResponse).toHaveBeenCalledWith(mockRaw)
  })

  it('returns 500 when scan fails', async () => {
    vi.mocked(scanSeedPacket).mockRejectedValue(new Error('API failure'))

    const formData = new FormData()
    const file = new File(['fake'], 'seed.png', { type: 'image/png' })
    formData.set('image', file)
    const request = createMockRequest(formData)

    const response = await POST(request as never)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('API failure')
  })

  it('returns 500 when parser fails', async () => {
    vi.mocked(scanSeedPacket).mockResolvedValue({ invalid: true })
    vi.mocked(parseScanResponse).mockImplementation(() => {
      throw new Error('Validation failed')
    })

    const formData = new FormData()
    const file = new File(['fake'], 'seed.png', { type: 'image/png' })
    formData.set('image', file)
    const request = createMockRequest(formData)

    const response = await POST(request as never)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Validation failed')
  })
})
