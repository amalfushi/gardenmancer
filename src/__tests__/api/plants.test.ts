import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Plant } from '@/types'

const mockPlants: Plant[] = [
  {
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
  },
  {
    id: 'lettuce-1',
    name: 'Butterhead Lettuce',
    species: 'Lactuca sativa',
    spacing: 10,
    sunNeeds: 'partial',
    daysToMaturity: 55,
    heightCategory: 'short',
    waterNeeds: 'medium',
    companionPlants: ['carrot'],
    zones: [3, 4, 5, 6, 7],
    plantingWindows: { directSow: '2-4 weeks before last frost' },
    source: 'seed',
  },
]

const mockStore = {
  getAll: vi.fn(),
  getById: vi.fn(),
  search: vi.fn(),
  add: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
}

vi.mock('@/lib/stores/plant-store', () => ({
  plantStore: mockStore,
}))

// Dynamic imports to ensure mocks are applied
const { GET: plantsGET, POST: plantsPOST } = await import('@/app/api/plants/route')
const {
  GET: plantByIdGET,
  PUT: plantByIdPUT,
  DELETE: plantByIdDELETE,
} = await import('@/app/api/plants/[id]/route')

function createRequest(url: string, options?: RequestInit) {
  return new Request(url, options) as unknown as import('next/server').NextRequest
}

function createNextRequest(url: string) {
  const req = new URL(url)
  return {
    nextUrl: req,
    json: vi.fn(),
  } as unknown as import('next/server').NextRequest
}

describe('Plants API - /api/plants', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/plants', () => {
    it('returns all plants', async () => {
      mockStore.getAll.mockResolvedValue(mockPlants)
      const req = createNextRequest('http://localhost:3000/api/plants')
      const response = await plantsGET(req)
      const data = await response.json()

      expect(data).toHaveLength(2)
      expect(data[0].name).toBe('Cherry Tomato')
      expect(mockStore.getAll).toHaveBeenCalled()
    })

    it('searches plants by query param', async () => {
      mockStore.search.mockResolvedValue([mockPlants[0]])
      const req = createNextRequest('http://localhost:3000/api/plants?search=tomato')
      const response = await plantsGET(req)
      const data = await response.json()

      expect(data).toHaveLength(1)
      expect(data[0].name).toBe('Cherry Tomato')
      expect(mockStore.search).toHaveBeenCalledWith('tomato')
    })

    it('returns empty array when no matches', async () => {
      mockStore.search.mockResolvedValue([])
      const req = createNextRequest('http://localhost:3000/api/plants?search=nonexistent')
      const response = await plantsGET(req)
      const data = await response.json()

      expect(data).toHaveLength(0)
    })
  })

  describe('POST /api/plants', () => {
    it('creates a new plant with valid data', async () => {
      const newPlant = {
        name: 'Basil',
        spacing: 12,
        sunNeeds: 'full',
        daysToMaturity: 30,
        heightCategory: 'short',
        waterNeeds: 'medium',
        companionPlants: [],
        zones: [5, 6, 7],
        plantingWindows: {},
        source: 'manual',
      }
      mockStore.add.mockResolvedValue({ ...newPlant, id: 'basil-1' })

      const req = createNextRequest('http://localhost:3000/api/plants')
      ;(req.json as ReturnType<typeof vi.fn>).mockResolvedValue(newPlant)

      const response = await plantsPOST(req)
      expect(response.status).toBe(201)
      const data = await response.json()
      expect(data.id).toBe('basil-1')
    })

    it('rejects invalid plant data', async () => {
      const invalid = { name: '' }
      const req = createNextRequest('http://localhost:3000/api/plants')
      ;(req.json as ReturnType<typeof vi.fn>).mockResolvedValue(invalid)

      const response = await plantsPOST(req)
      expect(response.status).toBe(400)
    })

    it('rejects missing required fields', async () => {
      const req = createNextRequest('http://localhost:3000/api/plants')
      ;(req.json as ReturnType<typeof vi.fn>).mockResolvedValue({})

      const response = await plantsPOST(req)
      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.error).toBe('Validation failed')
    })
  })
})

describe('Plants API - /api/plants/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const makeParams = (id: string) => ({ params: Promise.resolve({ id }) })

  describe('GET /api/plants/[id]', () => {
    it('returns a plant by id', async () => {
      mockStore.getById.mockResolvedValue(mockPlants[0])
      const req = createRequest('http://localhost:3000/api/plants/tomato-1')
      const response = await plantByIdGET(req, makeParams('tomato-1'))
      const data = await response.json()

      expect(data.name).toBe('Cherry Tomato')
    })

    it('returns 404 for unknown plant', async () => {
      mockStore.getById.mockResolvedValue(undefined)
      const req = createRequest('http://localhost:3000/api/plants/nope')
      const response = await plantByIdGET(req, makeParams('nope'))

      expect(response.status).toBe(404)
    })
  })

  describe('PUT /api/plants/[id]', () => {
    it('updates an existing plant', async () => {
      const updated = { ...mockPlants[0], name: 'Super Tomato' }
      mockStore.update.mockResolvedValue(updated)
      const req = createRequest('http://localhost:3000/api/plants/tomato-1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Super Tomato' }),
      })
      const response = await plantByIdPUT(req, makeParams('tomato-1'))
      const data = await response.json()

      expect(data.name).toBe('Super Tomato')
    })

    it('returns 404 for unknown plant', async () => {
      mockStore.update.mockResolvedValue(undefined)
      const req = createRequest('http://localhost:3000/api/plants/nope', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'New Name' }),
      })
      const response = await plantByIdPUT(req, makeParams('nope'))
      expect(response.status).toBe(404)
    })

    it('rejects invalid update data', async () => {
      const req = createRequest('http://localhost:3000/api/plants/tomato-1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sunNeeds: 'invalid-value' }),
      })
      const response = await plantByIdPUT(req, makeParams('tomato-1'))
      expect(response.status).toBe(400)
    })
  })

  describe('DELETE /api/plants/[id]', () => {
    it('deletes an existing plant', async () => {
      mockStore.remove.mockResolvedValue(true)
      const req = createRequest('http://localhost:3000/api/plants/tomato-1', {
        method: 'DELETE',
      })
      const response = await plantByIdDELETE(req, makeParams('tomato-1'))
      const data = await response.json()

      expect(data.success).toBe(true)
    })

    it('returns 404 for unknown plant', async () => {
      mockStore.remove.mockResolvedValue(false)
      const req = createRequest('http://localhost:3000/api/plants/nope', {
        method: 'DELETE',
      })
      const response = await plantByIdDELETE(req, makeParams('nope'))
      expect(response.status).toBe(404)
    })
  })
})
