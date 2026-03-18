import { nanoid } from 'nanoid'
import { getDb } from '@/lib/db'
import type { Garden, PlantPlacement } from '@/types'

export const gardenStore = {
  async getAll(): Promise<Garden[]> {
    const db = await getDb()
    return db.data.gardens
  },

  async getById(id: string): Promise<Garden | undefined> {
    const db = await getDb()
    return db.data.gardens.find((g) => g.id === id)
  },

  async create(garden: Omit<Garden, 'id' | 'layout'>): Promise<Garden> {
    const db = await getDb()
    const newGarden: Garden = {
      ...garden,
      id: nanoid(),
      layout: [],
      hemisphere: garden.hemisphere ?? 'northern',
    }
    db.data.gardens.push(newGarden)
    await db.write()
    return newGarden
  },

  async update(id: string, updates: Partial<Omit<Garden, 'id'>>): Promise<Garden | undefined> {
    const db = await getDb()
    const index = db.data.gardens.findIndex((g) => g.id === id)
    if (index === -1) return undefined
    db.data.gardens[index] = { ...db.data.gardens[index], ...updates }
    await db.write()
    return db.data.gardens[index]
  },

  async addPlant(gardenId: string, placement: PlantPlacement): Promise<Garden | undefined> {
    const db = await getDb()
    const garden = db.data.gardens.find((g) => g.id === gardenId)
    if (!garden) return undefined
    garden.layout.push(placement)
    await db.write()
    return garden
  },

  async removePlant(gardenId: string, plantId: string): Promise<Garden | undefined> {
    const db = await getDb()
    const garden = db.data.gardens.find((g) => g.id === gardenId)
    if (!garden) return undefined
    garden.layout = garden.layout.filter((p) => p.plantId !== plantId)
    await db.write()
    return garden
  },

  async remove(id: string): Promise<boolean> {
    const db = await getDb()
    const before = db.data.gardens.length
    db.data.gardens = db.data.gardens.filter((g) => g.id !== id)
    if (db.data.gardens.length === before) return false
    await db.write()
    return true
  },
}
