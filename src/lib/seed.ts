import fs from 'node:fs'
import path from 'node:path'
import type { GardenmancerDB } from '@/types'

export interface SeedOptions {
  force?: boolean
}

export async function seedDatabase(options?: SeedOptions): Promise<void> {
  const dbPath = path.join(process.cwd(), 'data', 'db.json')
  const seedPath = path.join(process.cwd(), 'data', 'seed-plants.json')
  const force = options?.force ?? false

  // Check if db.json already has data (skip seeding unless --force)
  if (!force && fs.existsSync(dbPath)) {
    const content = fs.readFileSync(dbPath, 'utf-8').trim()
    if (content && content !== '{}' && content !== 'null') {
      try {
        const data = JSON.parse(content) as GardenmancerDB
        if (data.plants && data.plants.length > 0) {
          console.log('Database already seeded — skipping. Use --force to re-seed.')
          return
        }
      } catch {
        console.warn('Database file is corrupt — re-seeding.')
      }
    }
  }

  // Ensure data directory exists
  const dataDir = path.dirname(dbPath)
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }

  // Read seed data
  const seedData = JSON.parse(fs.readFileSync(seedPath, 'utf-8'))

  // Write initial database
  const db: GardenmancerDB = {
    plants: seedData,
    gardens: [],
    calendar: [],
  }

  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2))
  console.log(`Database seeded with ${seedData.length} plants`)
}
