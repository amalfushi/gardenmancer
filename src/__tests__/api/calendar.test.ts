import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { CalendarEntry } from '@/types'

const mockEntries: CalendarEntry[] = [
  {
    id: 'cal-1',
    plantId: 'tomato-1',
    gardenId: 'garden-1',
    zone: 6,
    startIndoors: '2025-03-01',
    transplantDate: '2025-04-15',
  },
  {
    id: 'cal-2',
    plantId: 'basil-1',
    zone: 7,
    startIndoors: '2025-03-10',
  },
]

const mockStore = {
  getAll: vi.fn(),
  getByPlant: vi.fn(),
  getByGarden: vi.fn(),
  add: vi.fn(),
  remove: vi.fn(),
}

vi.mock('@/lib/stores/calendar-store', () => ({
  calendarStore: mockStore,
}))

const { GET, POST } = await import('@/app/api/calendar/route')

function createNextRequest(url: string) {
  const req = new URL(url)
  return {
    nextUrl: req,
    json: vi.fn(),
  } as unknown as import('next/server').NextRequest
}

describe('Calendar API - /api/calendar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/calendar', () => {
    it('returns all calendar entries', async () => {
      mockStore.getAll.mockResolvedValue(mockEntries)
      const req = createNextRequest('http://localhost:3000/api/calendar')
      const response = await GET(req)
      const data = await response.json()

      expect(data).toHaveLength(2)
      expect(mockStore.getAll).toHaveBeenCalled()
    })

    it('filters by zone', async () => {
      mockStore.getAll.mockResolvedValue(mockEntries)
      const req = createNextRequest('http://localhost:3000/api/calendar?zone=6')
      const response = await GET(req)
      const data = await response.json()

      expect(data).toHaveLength(1)
      expect(data[0].zone).toBe(6)
    })

    it('returns empty when no zone matches', async () => {
      mockStore.getAll.mockResolvedValue(mockEntries)
      const req = createNextRequest('http://localhost:3000/api/calendar?zone=3')
      const response = await GET(req)
      const data = await response.json()

      expect(data).toHaveLength(0)
    })
  })

  describe('POST /api/calendar', () => {
    it('creates a new calendar entry', async () => {
      const newEntry = {
        plantId: 'tomato-1',
        gardenId: 'garden-1',
        zone: 6,
      }
      mockStore.add.mockResolvedValue({ ...newEntry, id: 'cal-new' })

      const req = createNextRequest('http://localhost:3000/api/calendar')
      ;(req.json as ReturnType<typeof vi.fn>).mockResolvedValue(newEntry)

      const response = await POST(req)
      expect(response.status).toBe(201)
      const data = await response.json()
      expect(data.id).toBe('cal-new')
    })

    it('rejects invalid zone', async () => {
      const req = createNextRequest('http://localhost:3000/api/calendar')
      ;(req.json as ReturnType<typeof vi.fn>).mockResolvedValue({
        plantId: 'tomato-1',
        zone: 15,
      })

      const response = await POST(req)
      expect(response.status).toBe(400)
    })

    it('rejects missing plantId', async () => {
      const req = createNextRequest('http://localhost:3000/api/calendar')
      ;(req.json as ReturnType<typeof vi.fn>).mockResolvedValue({
        zone: 6,
      })

      const response = await POST(req)
      expect(response.status).toBe(400)
    })
  })
})
