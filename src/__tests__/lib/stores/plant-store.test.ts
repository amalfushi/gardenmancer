import { describe, it, expect, vi } from 'vitest'

vi.mock('@/lib/db', () => {
  const mockData = {
    plants: [
      {
        id: 'test-tomato',
        name: 'Cherry Tomato',
        species: 'Solanum lycopersicum',
        spacing: 24,
        sunNeeds: 'full',
        daysToMaturity: 65,
        heightCategory: 'medium',
        waterNeeds: 'medium',
        companionPlants: ['basil'],
        zones: [5, 6, 7],
        plantingWindows: { startIndoors: '6 weeks before last frost' },
        source: 'seed',
      },
    ],
    gardens: [],
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

import { plantStore } from '@/lib/stores/plant-store'

describe('plantStore', () => {
  it('should get all plants', async () => {
    const plants = await plantStore.getAll()
    expect(plants).toHaveLength(1)
    expect(plants[0].name).toBe('Cherry Tomato')
  })

  it('should get plant by id', async () => {
    const plant = await plantStore.getById('test-tomato')
    expect(plant).toBeDefined()
    expect(plant?.name).toBe('Cherry Tomato')
  })

  it('should return undefined for unknown id', async () => {
    const plant = await plantStore.getById('nonexistent')
    expect(plant).toBeUndefined()
  })

  it('should search plants by name', async () => {
    const results = await plantStore.search('tomato')
    expect(results).toHaveLength(1)
  })

  it('should return empty for no matches', async () => {
    const results = await plantStore.search('xyz')
    expect(results).toHaveLength(0)
  })
})
