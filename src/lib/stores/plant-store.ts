import { nanoid } from 'nanoid'
import { getDb } from '@/lib/db'
import type { Plant } from '@/types'

export const plantStore = {
  async getAll(): Promise<Plant[]> {
    const db = await getDb()
    return db.data.plants
  },

  async getById(id: string): Promise<Plant | undefined> {
    const db = await getDb()
    return db.data.plants.find((p) => p.id === id)
  },

  async search(query: string): Promise<Plant[]> {
    const db = await getDb()
    const lower = query.toLowerCase()
    return db.data.plants.filter(
      (p) => p.name.toLowerCase().includes(lower) || p.species?.toLowerCase().includes(lower),
    )
  },

  async add(plant: Omit<Plant, 'id'>): Promise<Plant> {
    const db = await getDb()
    const newPlant: Plant = { ...plant, id: nanoid() }
    db.data.plants.push(newPlant)
    await db.write()
    return newPlant
  },

  async update(id: string, updates: Partial<Plant>): Promise<Plant | undefined> {
    const db = await getDb()
    const index = db.data.plants.findIndex((p) => p.id === id)
    if (index === -1) return undefined
    db.data.plants[index] = { ...db.data.plants[index], ...updates }
    await db.write()
    return db.data.plants[index]
  },

  async remove(id: string): Promise<boolean> {
    const db = await getDb()
    const before = db.data.plants.length
    db.data.plants = db.data.plants.filter((p) => p.id !== id)
    if (db.data.plants.length === before) return false
    await db.write()
    return true
  },
}
