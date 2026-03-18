/**
 * @vitest-environment node
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import fs from 'node:fs'
import type { GardenmancerDB } from '@/types'

// ── Mock lowdb so tests don't touch the filesystem ──────────────────────
vi.mock('lowdb', () => {
  const MockLow = vi.fn().mockImplementation(function (
    this: Record<string, unknown>,
    _adapter: unknown,
    defaultData: unknown,
  ) {
    this.data = { ...(defaultData as object) }
    this.read = vi.fn().mockResolvedValue(undefined)
    this.write = vi.fn().mockResolvedValue(undefined)
  })
  return { Low: MockLow }
})
vi.mock('lowdb/node', () => {
  const MockJSONFile = vi.fn()
  return { JSONFile: MockJSONFile }
})

// ── Mock node:fs for seed tests ─────────────────────────────────────────
vi.mock('node:fs', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>
  return {
    ...actual,
    default: {
      ...actual,
      existsSync: vi.fn(),
      readFileSync: vi.fn(),
      writeFileSync: vi.fn(),
      mkdirSync: vi.fn(),
    },
  }
})

// ─────────────────────────────────────────────────────────────────────────
// DB singleton tests
// ─────────────────────────────────────────────────────────────────────────
describe('getDb – globalThis singleton', () => {
  beforeEach(() => {
    vi.resetModules()
    const g = globalThis as unknown as { __gardenmancerDb: unknown }
    g.__gardenmancerDb = null
  })

  it('returns the same instance on repeated calls', async () => {
    const { getDb } = await import('./db')
    const db1 = await getDb()
    const db2 = await getDb()
    expect(db1).toBe(db2)
  })

  it('survives module re-evaluation (simulated HMR)', async () => {
    const { getDb } = await import('./db')
    const db1 = await getDb()

    // Simulate HMR: clear module cache but keep globalThis intact
    vi.resetModules()
    const { getDb: getDbAfterHmr } = await import('./db')
    const db2 = await getDbAfterHmr()

    expect(db2).toBe(db1)
  })

  it('creates a fresh instance after resetDb()', async () => {
    const { getDb, resetDb } = await import('./db')
    const db1 = await getDb()
    resetDb()
    const db2 = await getDb()
    expect(db2).not.toBe(db1)
  })
})

// ─────────────────────────────────────────────────────────────────────────
// Seed tests
// ─────────────────────────────────────────────────────────────────────────
describe('seedDatabase', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.restoreAllMocks()
  })

  it('skips seeding when db.json has plant data', async () => {
    const { seedDatabase } = await import('./seed')
    const existing: GardenmancerDB = {
      plants: [
        {
          id: '1',
          name: 'Tomato',
          spacing: 24,
          sunNeeds: 'full',
          daysToMaturity: 65,
          heightCategory: 'medium',
          waterNeeds: 'medium',
          companionPlants: [],
          zones: [5],
          plantingWindows: {},
          source: 'seed',
        },
      ],
      gardens: [],
      calendar: [],
    }

    vi.mocked(fs.existsSync).mockReturnValue(true)
    vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify(existing))
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    await seedDatabase()

    expect(fs.writeFileSync).not.toHaveBeenCalled()
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('already seeded'))
  })

  it('seeds when db.json does not exist', async () => {
    const { seedDatabase } = await import('./seed')
    const seedPlants = [{ id: '1', name: 'Tomato' }]

    vi.mocked(fs.existsSync).mockImplementation((p) => {
      if (String(p).includes('db.json')) return false
      return true
    })
    vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify(seedPlants))
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    await seedDatabase()

    expect(fs.writeFileSync).toHaveBeenCalled()
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('seeded with'))
  })

  it('re-seeds when force option is set', async () => {
    const { seedDatabase } = await import('./seed')
    const existing: GardenmancerDB = {
      plants: [
        {
          id: '1',
          name: 'Tomato',
          spacing: 24,
          sunNeeds: 'full',
          daysToMaturity: 65,
          heightCategory: 'medium',
          waterNeeds: 'medium',
          companionPlants: [],
          zones: [5],
          plantingWindows: {},
          source: 'seed',
        },
      ],
      gardens: [],
      calendar: [],
    }
    const seedPlants = [{ id: '1', name: 'Tomato' }]

    vi.mocked(fs.existsSync).mockReturnValue(true)
    vi.mocked(fs.readFileSync).mockImplementation((p) => {
      if (String(p).includes('seed-plants')) return JSON.stringify(seedPlants)
      return JSON.stringify(existing)
    })
    vi.spyOn(console, 'log').mockImplementation(() => {})

    await seedDatabase({ force: true })

    expect(fs.writeFileSync).toHaveBeenCalled()
  })

  it('re-seeds when db.json contains corrupt JSON', async () => {
    const { seedDatabase } = await import('./seed')
    const seedPlants = [{ id: '1', name: 'Tomato' }]

    vi.mocked(fs.existsSync).mockReturnValue(true)
    vi.mocked(fs.readFileSync).mockImplementation((p) => {
      if (String(p).includes('seed-plants')) return JSON.stringify(seedPlants)
      return '{corrupt json!!!'
    })
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(console, 'log').mockImplementation(() => {})

    await seedDatabase()

    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('corrupt'))
    expect(fs.writeFileSync).toHaveBeenCalled()
  })
})
