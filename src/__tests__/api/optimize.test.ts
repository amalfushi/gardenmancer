import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/stores/garden-store', () => ({
  gardenStore: {
    getById: vi.fn().mockImplementation(async (id: string) =>
      id === 'g1'
        ? {
            id: 'g1',
            name: 'Test Garden',
            type: 'raised',
            width: 4,
            length: 8,
            rotationDegrees: 0,
            hemisphere: 'northern',
            layout: [
              { plantId: 'tomato', gridX: 0, gridY: 0 },
              { plantId: 'basil', gridX: 1, gridY: 0 },
            ],
          }
        : undefined,
    ),
  },
}))

vi.mock('@/lib/stores/plant-store', () => ({
  plantStore: {
    getAll: vi.fn().mockResolvedValue([
      {
        id: 'tomato',
        name: 'Cherry Tomato',
        spacing: 24,
        sunNeeds: 'full',
        daysToMaturity: 65,
        heightCategory: 'medium',
        waterNeeds: 'medium',
        companionPlants: ['basil'],
        zones: [5, 6, 7],
        plantingWindows: {},
        source: 'seed',
      },
      {
        id: 'basil',
        name: 'Sweet Basil',
        spacing: 12,
        sunNeeds: 'full',
        daysToMaturity: 60,
        heightCategory: 'short',
        waterNeeds: 'medium',
        companionPlants: ['tomato'],
        zones: [5, 6, 7],
        plantingWindows: {},
        source: 'seed',
      },
    ]),
  },
}))

vi.mock('@/lib/claude', () => ({
  optimizeGardenLayout: vi.fn().mockResolvedValue({
    suggestions: [
      {
        type: 'spacing',
        message: 'Tomatoes need 24 inches between plants.',
        severity: 'warning',
      },
    ],
    overallScore: 72,
    maxScore: 100,
  }),
}))

import { POST } from '@/app/api/gardens/[id]/optimize/route'

describe('POST /api/gardens/[id]/optimize', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns optimization suggestions for a valid garden', async () => {
    const req = new Request('http://localhost/api/gardens/g1/optimize', {
      method: 'POST',
    })
    const res = await POST(req, { params: Promise.resolve({ id: 'g1' }) })
    expect(res.status).toBe(200)

    const data = await res.json()
    expect(data.suggestions).toBeDefined()
    expect(data.suggestions).toHaveLength(1)
    expect(data.overallScore).toBe(72)
  })

  it('returns 404 for unknown garden', async () => {
    const req = new Request('http://localhost/api/gardens/xxx/optimize', {
      method: 'POST',
    })
    const res = await POST(req, { params: Promise.resolve({ id: 'xxx' }) })
    expect(res.status).toBe(404)
  })

  it('calls optimizeGardenLayout with garden data', async () => {
    const { optimizeGardenLayout } = await import('@/lib/claude')
    const req = new Request('http://localhost/api/gardens/g1/optimize', {
      method: 'POST',
    })
    await POST(req, { params: Promise.resolve({ id: 'g1' }) })

    expect(optimizeGardenLayout).toHaveBeenCalledWith(
      expect.objectContaining({
        garden: expect.objectContaining({
          id: 'g1',
          name: 'Test Garden',
          width: 4,
          length: 8,
        }),
        placements: expect.arrayContaining([
          expect.objectContaining({ plantId: 'tomato', gridX: 0, gridY: 0 }),
        ]),
      }),
    )
  })
})
