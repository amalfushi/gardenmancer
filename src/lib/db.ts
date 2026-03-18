import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import path from 'node:path'
import type { GardenmancerDB } from '@/types'

const defaultData: GardenmancerDB = {
  plants: [],
  gardens: [],
  calendar: [],
}

// Store the db instance on globalThis so it survives Next.js HMR in dev mode.
// Module-level variables are reset when webpack/turbopack re-evaluates modules
// during hot reload, which would discard the cached Low instance and force
// unnecessary re-reads (or worse, race conditions with concurrent requests).
const globalForDb = globalThis as unknown as {
  __gardenmancerDb: Low<GardenmancerDB> | null
}
globalForDb.__gardenmancerDb ??= null

export async function getDb(): Promise<Low<GardenmancerDB>> {
  if (globalForDb.__gardenmancerDb) return globalForDb.__gardenmancerDb

  const dbPath = path.join(process.cwd(), 'data', 'db.json')
  const adapter = new JSONFile<GardenmancerDB>(dbPath)
  const db = new Low(adapter, defaultData)
  await db.read()

  globalForDb.__gardenmancerDb = db
  return db
}

/** Reset the singleton — used for testing only. */
export function resetDb(): void {
  globalForDb.__gardenmancerDb = null
}
