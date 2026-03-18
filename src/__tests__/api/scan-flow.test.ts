import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Plant } from '@/types'

// Mock claude module
vi.mock('@/lib/claude', () => ({
  scanSeedPacket: vi.fn(),
}))

import { scanSeedPacket } from '@/lib/claude'
import { parseScanResponse } from '@/lib/scan-parser'
import { POST } from '@/app/api/scan/route'

const scanFixture = {
  name: 'Cherry Tomato',
  species: 'Solanum lycopersicum',
  spacing: 24,
  sunNeeds: 'full',
  daysToMaturity: 65,
  heightCategory: 'medium',
  waterNeeds: 'medium',
  companionPlants: ['basil', 'carrots', 'parsley'],
  zones: [3, 4, 5, 6, 7, 8, 9, 10],
  plantingWindows: {
    startIndoors: '6-8 weeks before last frost',
    transplant: 'After last frost date',
    directSow: null,
  },
  source: 'scan',
}

describe('Scan-to-Save Integration Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('full flow: scan → parse → validate plant', async () => {
    // Step 1: Mock Claude returning scan data
    vi.mocked(scanSeedPacket).mockResolvedValue(scanFixture)

    // Step 2: Create a mock request with an image
    const formData = new FormData()
    const file = new File(['fake-image'], 'seed.png', { type: 'image/png' })
    formData.set('image', file)

    const request = {
      formData: () => Promise.resolve(formData),
    } as unknown as Request

    // Step 3: Call the scan API
    const scanResponse = await POST(request as never)
    expect(scanResponse.status).toBe(200)

    const plant: Plant = await scanResponse.json()

    // Step 4: Verify the parsed plant data
    expect(plant.name).toBe('Cherry Tomato')
    expect(plant.species).toBe('Solanum lycopersicum')
    expect(plant.spacing).toBe(24)
    expect(plant.sunNeeds).toBe('full')
    expect(plant.daysToMaturity).toBe(65)
    expect(plant.source).toBe('scan')
    expect(plant.id).toBeTruthy()
    expect(plant.companionPlants).toContain('basil')
    expect(plant.zones).toContain(5)
  })

  it('parser handles mock fixture correctly', () => {
    const plant = parseScanResponse(scanFixture)

    expect(plant.name).toBe('Cherry Tomato')
    expect(plant.source).toBe('scan')
    expect(plant.id).toBeTruthy()
    expect(plant.plantingWindows.startIndoors).toBe('6-8 weeks before last frost')
    expect(plant.plantingWindows.directSow).toBeUndefined()
  })

  it('save-ready plant matches expected schema', async () => {
    vi.mocked(scanSeedPacket).mockResolvedValue(scanFixture)

    const formData = new FormData()
    formData.set('image', new File(['img'], 'test.jpg', { type: 'image/jpeg' }))

    const request = {
      formData: () => Promise.resolve(formData),
    } as unknown as Request

    const response = await POST(request as never)
    const plant: Plant = await response.json()

    // Verify plant is ready to be saved via POST /api/plants
    const { id: _id, ...savePayload } = plant
    expect(savePayload).toHaveProperty('name')
    expect(savePayload).toHaveProperty('spacing')
    expect(savePayload).toHaveProperty('sunNeeds')
    expect(savePayload).toHaveProperty('daysToMaturity')
    expect(savePayload).toHaveProperty('heightCategory')
    expect(savePayload).toHaveProperty('waterNeeds')
    expect(savePayload).toHaveProperty('companionPlants')
    expect(savePayload).toHaveProperty('zones')
    expect(savePayload).toHaveProperty('plantingWindows')
    expect(savePayload).toHaveProperty('source')
    expect(savePayload.source).toBe('scan')
  })

  it('handles scan failure gracefully', async () => {
    vi.mocked(scanSeedPacket).mockRejectedValue(new Error('Network error'))

    const formData = new FormData()
    formData.set('image', new File(['img'], 'test.jpg', { type: 'image/jpeg' }))

    const request = {
      formData: () => Promise.resolve(formData),
    } as unknown as Request

    const response = await POST(request as never)
    expect(response.status).toBe(500)

    const data = await response.json()
    expect(data.error).toBe('Network error')
  })
})
