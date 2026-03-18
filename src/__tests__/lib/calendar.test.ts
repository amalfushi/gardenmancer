import { describe, it, expect } from 'vitest'
import {
  getLastFrostDate,
  parseWindowString,
  getPlantingDates,
  SUPPORTED_ZONES,
} from '@/lib/calendar'
import type { Plant } from '@/types'

const CURRENT_YEAR = new Date().getFullYear()

function makePlant(windows: Plant['plantingWindows']): Plant {
  return {
    id: 'test-plant',
    name: 'Test Plant',
    spacing: 12,
    sunNeeds: 'full',
    daysToMaturity: 60,
    heightCategory: 'medium',
    waterNeeds: 'medium',
    companionPlants: [],
    zones: [5, 6, 7],
    plantingWindows: windows,
    source: 'manual',
  }
}

describe('getLastFrostDate', () => {
  it('returns correct date for zone 5', () => {
    const date = getLastFrostDate(5)
    expect(date).toEqual(new Date(CURRENT_YEAR, 3, 30)) // April 30
  })

  it('returns correct date for zone 3', () => {
    const date = getLastFrostDate(3)
    expect(date).toEqual(new Date(CURRENT_YEAR, 4, 15)) // May 15
  })

  it('returns correct date for zone 10', () => {
    const date = getLastFrostDate(10)
    expect(date).toEqual(new Date(CURRENT_YEAR, 1, 15)) // Feb 15
  })

  it('returns correct date for zone 8', () => {
    const date = getLastFrostDate(8)
    expect(date).toEqual(new Date(CURRENT_YEAR, 2, 15)) // March 15
  })

  it('returns undefined for unsupported zone', () => {
    expect(getLastFrostDate(1)).toBeUndefined()
    expect(getLastFrostDate(13)).toBeUndefined()
  })
})

describe('parseWindowString', () => {
  it('parses "6-8 weeks before last frost"', () => {
    const days = parseWindowString('6-8 weeks before last frost')
    expect(days).toBe(-49) // average 7 weeks * 7 days
  })

  it('parses "2-4 weeks before last frost"', () => {
    const days = parseWindowString('2-4 weeks before last frost')
    expect(days).toBe(-21) // average 3 weeks * 7 days
  })

  it('parses "After last frost"', () => {
    expect(parseWindowString('After last frost')).toBe(0)
  })

  it('parses "After last frost date"', () => {
    expect(parseWindowString('After last frost date')).toBe(0)
  })

  it('parses "Direct sow after last frost"', () => {
    expect(parseWindowString('Direct sow after last frost')).toBe(0)
  })

  it('parses "1-2 weeks after last frost"', () => {
    const days = parseWindowString('1-2 weeks after last frost')
    expect(days).toBe(11) // average 1.5 weeks * 7 ≈ 11
  })

  it('parses "4 weeks before last frost"', () => {
    expect(parseWindowString('4 weeks before last frost')).toBe(-28)
  })

  it('parses "2 weeks after last frost"', () => {
    expect(parseWindowString('2 weeks after last frost')).toBe(14)
  })

  it('returns null for "Not recommended"', () => {
    expect(parseWindowString('Not recommended')).toBeNull()
  })

  it('returns null for empty string', () => {
    expect(parseWindowString('')).toBeNull()
  })

  it('is case insensitive', () => {
    expect(parseWindowString('AFTER LAST FROST')).toBe(0)
    expect(parseWindowString('6-8 Weeks Before Last Frost')).toBe(-49)
  })
})

describe('getPlantingDates', () => {
  it('computes dates for zone 5 with all windows', () => {
    const plant = makePlant({
      startIndoors: '6-8 weeks before last frost',
      transplant: 'After last frost',
      directSow: 'Not recommended',
    })
    const dates = getPlantingDates(plant, 5)
    // Zone 5 last frost: April 30
    // Start indoors: 49 days before = March 12
    expect(dates.startIndoors?.getMonth()).toBe(2) // March
    expect(dates.transplant?.getMonth()).toBe(3) // April
    expect(dates.transplant?.getDate()).toBe(30)
    expect(dates.directSow).toBeUndefined()
  })

  it('computes dates for zone 8', () => {
    const plant = makePlant({
      directSow: 'Direct sow after last frost',
    })
    const dates = getPlantingDates(plant, 8)
    // Zone 8 last frost: March 15
    expect(dates.directSow?.getMonth()).toBe(2) // March
    expect(dates.directSow?.getDate()).toBe(15)
    expect(dates.startIndoors).toBeUndefined()
    expect(dates.transplant).toBeUndefined()
  })

  it('returns empty for unsupported zone', () => {
    const plant = makePlant({
      startIndoors: '6-8 weeks before last frost',
    })
    const dates = getPlantingDates(plant, 1)
    expect(dates).toEqual({})
  })

  it('returns empty for plant with no windows', () => {
    const plant = makePlant({})
    const dates = getPlantingDates(plant, 5)
    expect(dates).toEqual({})
  })

  it('handles zone 3 (cold zone)', () => {
    const plant = makePlant({
      startIndoors: '6-8 weeks before last frost',
      transplant: 'After last frost',
    })
    const dates = getPlantingDates(plant, 3)
    // Zone 3 last frost: May 15
    // Start indoors: 49 days before ≈ March 27
    expect(dates.startIndoors?.getMonth()).toBe(2) // March
    expect(dates.transplant?.getMonth()).toBe(4) // May
    expect(dates.transplant?.getDate()).toBe(15)
  })

  it('handles zone 10 (warm zone)', () => {
    const plant = makePlant({
      startIndoors: '6-8 weeks before last frost',
    })
    const dates = getPlantingDates(plant, 10)
    // Zone 10 last frost: Feb 15
    // Start indoors: 49 days before ≈ Dec 29 of previous year
    expect(dates.startIndoors).toBeDefined()
    expect(dates.startIndoors!.getTime()).toBeLessThan(new Date(CURRENT_YEAR, 1, 15).getTime())
  })
})

describe('SUPPORTED_ZONES', () => {
  it('contains zones 3-10', () => {
    expect(SUPPORTED_ZONES).toEqual([3, 4, 5, 6, 7, 8, 9, 10])
  })

  it('all zones have frost dates', () => {
    for (const zone of SUPPORTED_ZONES) {
      expect(getLastFrostDate(zone)).toBeDefined()
    }
  })
})
