import { describe, it, expect, vi } from 'vitest'

vi.mock('@/lib/db', () => {
  const mockGardens = [
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

  const mockData = {
    plants: [],
    gardens: [...mockGardens],
    calendar: [],
  }

  return {
    getDb: vi.fn().mockResolvedValue({
      data: mockData,
      read: vi.fn(),
      write: vi.fn(),
    }),
  }
})

import { gardenStore } from '@/lib/stores/garden-store'

describe('gardenStore', () => {
  it('should get all gardens', async () => {
    const gardens = await gardenStore.getAll()
    expect(gardens).toHaveLength(1)
    expect(gardens[0].name).toBe('Test Garden')
  })

  it('should get garden by id', async () => {
    const garden = await gardenStore.getById('g1')
    expect(garden).toBeDefined()
    expect(garden?.name).toBe('Test Garden')
  })

  it('should return undefined for unknown id', async () => {
    const garden = await gardenStore.getById('nonexistent')
    expect(garden).toBeUndefined()
  })

  it('should create a garden', async () => {
    const garden = await gardenStore.create({
      name: 'New Garden',
      type: 'flat',
      width: 10,
      length: 20,
      rotationDegrees: 180,
      hemisphere: 'northern',
    })
    expect(garden.id).toBeDefined()
    expect(garden.name).toBe('New Garden')
    expect(garden.layout).toEqual([])
  })

  it('should remove a garden', async () => {
    const result = await gardenStore.remove('g1')
    expect(result).toBe(true)
  })

  it('should return false when removing nonexistent garden', async () => {
    const result = await gardenStore.remove('nonexistent')
    expect(result).toBe(false)
  })
})
