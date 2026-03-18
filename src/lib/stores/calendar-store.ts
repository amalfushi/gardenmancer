import { nanoid } from 'nanoid'
import { getDb } from '@/lib/db'
import type { CalendarEntry } from '@/types'

export const calendarStore = {
  async getAll(): Promise<CalendarEntry[]> {
    const db = await getDb()
    return db.data.calendar
  },

  async getByPlant(plantId: string): Promise<CalendarEntry[]> {
    const db = await getDb()
    return db.data.calendar.filter((e) => e.plantId === plantId)
  },

  async getByGarden(gardenId: string): Promise<CalendarEntry[]> {
    const db = await getDb()
    return db.data.calendar.filter((e) => e.gardenId === gardenId)
  },

  async add(entry: Omit<CalendarEntry, 'id'>): Promise<CalendarEntry> {
    const db = await getDb()
    const newEntry: CalendarEntry = { ...entry, id: nanoid() }
    db.data.calendar.push(newEntry)
    await db.write()
    return newEntry
  },

  async remove(id: string): Promise<boolean> {
    const db = await getDb()
    const before = db.data.calendar.length
    db.data.calendar = db.data.calendar.filter((e) => e.id !== id)
    if (db.data.calendar.length === before) return false
    await db.write()
    return true
  },
}
