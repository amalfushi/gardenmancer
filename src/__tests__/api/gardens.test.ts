import { describe, it, expect, vi } from 'vitest'

vi.mock('@/lib/stores/garden-store', () => {
  const gardens = [
    {
      id: 'g1',
      name: 'Test Garden',
      type: 'raised',
      width: 4,
      length: 8,
      rotationDegrees: 0,
      hemisphere: 'northern',
      layout: [],
    },
  ]

  return {
    gardenStore: {
      getAll: vi.fn().mockResolvedValue([...gardens]),
      getById: vi.fn().mockImplementation(async (id: string) => gardens.find((g) => g.id === id)),
      create: vi.fn().mockImplementation(async (data: Record<string, unknown>) => ({
        id: 'new-id',
        ...data,
        layout: [],
      })),
      update: vi.fn().mockImplementation(async (id: string, data: Record<string, unknown>) => {
        const g = gardens.find((g) => g.id === id)
        return g ? { ...g, ...data } : undefined
      }),
      remove: vi.fn().mockImplementation(async (id: string) => gardens.some((g) => g.id === id)),
    },
  }
})

import { GET, POST } from '@/app/api/gardens/route'
import { GET as GET_BY_ID, PUT, DELETE } from '@/app/api/gardens/[id]/route'

function createRequest(body?: Record<string, unknown>, method = 'POST') {
  return new Request('http://localhost/api/gardens', {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
}

describe('Gardens API', () => {
  describe('GET /api/gardens', () => {
    it('returns all gardens', async () => {
      const res = await GET()
      const data = await res.json()
      expect(data).toHaveLength(1)
      expect(data[0].name).toBe('Test Garden')
    })
  })

  describe('POST /api/gardens', () => {
    it('creates a garden with valid data', async () => {
      const req = createRequest({
        name: 'New Garden',
        type: 'raised',
        width: 4,
        length: 8,
        rotationDegrees: 90,
      })
      const res = await POST(req)
      expect(res.status).toBe(201)
      const data = await res.json()
      expect(data.name).toBe('New Garden')
    })

    it('rejects invalid data', async () => {
      const req = createRequest({ name: '' })
      const res = await POST(req)
      expect(res.status).toBe(400)
    })

    it('rejects missing required fields', async () => {
      const req = createRequest({ name: 'Test' })
      const res = await POST(req)
      expect(res.status).toBe(400)
    })
  })

  describe('GET /api/gardens/[id]', () => {
    it('returns a garden by id', async () => {
      const req = new Request('http://localhost/api/gardens/g1')
      const res = await GET_BY_ID(req, { params: Promise.resolve({ id: 'g1' }) })
      const data = await res.json()
      expect(data.name).toBe('Test Garden')
    })

    it('returns 404 for unknown id', async () => {
      const req = new Request('http://localhost/api/gardens/xxx')
      const res = await GET_BY_ID(req, { params: Promise.resolve({ id: 'xxx' }) })
      expect(res.status).toBe(404)
    })
  })

  describe('PUT /api/gardens/[id]', () => {
    it('updates a garden', async () => {
      const req = new Request('http://localhost/api/gardens/g1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Updated Garden' }),
      })
      const res = await PUT(req, { params: Promise.resolve({ id: 'g1' }) })
      const data = await res.json()
      expect(data.name).toBe('Updated Garden')
    })

    it('returns 404 for unknown garden', async () => {
      const req = new Request('http://localhost/api/gardens/xxx', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'X' }),
      })
      const res = await PUT(req, { params: Promise.resolve({ id: 'xxx' }) })
      expect(res.status).toBe(404)
    })
  })

  describe('DELETE /api/gardens/[id]', () => {
    it('deletes a garden', async () => {
      const req = new Request('http://localhost/api/gardens/g1', { method: 'DELETE' })
      const res = await DELETE(req, { params: Promise.resolve({ id: 'g1' }) })
      const data = await res.json()
      expect(data.success).toBe(true)
    })

    it('returns 404 for unknown garden', async () => {
      const req = new Request('http://localhost/api/gardens/xxx', { method: 'DELETE' })
      const res = await DELETE(req, { params: Promise.resolve({ id: 'xxx' }) })
      expect(res.status).toBe(404)
    })
  })
})
