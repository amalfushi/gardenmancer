import type { Plant, Hemisphere } from '@/types'

/** Average last frost dates by USDA zone (month/day). */
const LAST_FROST_DATES: Record<number, { month: number; day: number }> = {
  3: { month: 5, day: 15 },
  4: { month: 5, day: 15 },
  5: { month: 4, day: 30 },
  6: { month: 4, day: 15 },
  7: { month: 4, day: 1 },
  8: { month: 3, day: 15 },
  9: { month: 2, day: 28 },
  10: { month: 2, day: 15 },
}

const CURRENT_YEAR = new Date().getFullYear()

export interface PlantingDates {
  startIndoors?: Date
  transplant?: Date
  directSow?: Date
}

/**
 * Mirror a month for southern hemisphere.
 * NH month 1 (Jan) → SH month 7 (Jul), etc.
 */
export function mirrorMonth(month: number): number {
  return ((month - 1 + 6) % 12) + 1
}

/**
 * Returns the average last frost date for a given USDA zone.
 * For southern hemisphere, the frost date is mirrored by 6 months.
 */
export function getLastFrostDate(zone: number, hemisphere?: Hemisphere): Date | undefined {
  const entry = LAST_FROST_DATES[zone]
  if (!entry) return undefined

  if (hemisphere === 'southern') {
    const mirroredMonth = mirrorMonth(entry.month)
    return new Date(CURRENT_YEAR, mirroredMonth - 1, entry.day)
  }

  return new Date(CURRENT_YEAR, entry.month - 1, entry.day)
}

/**
 * Parses a planting window string and returns the offset in days
 * relative to last frost date. Negative = before frost, positive = after.
 *
 * Supported formats:
 * - "6-8 weeks before last frost"
 * - "2-4 weeks before last frost"
 * - "After last frost date"
 * - "After last frost"
 * - "Direct sow after last frost"
 * - "1-2 weeks after last frost"
 * - "Not recommended" → null
 */
export function parseWindowString(window: string): number | null {
  const lower = window.toLowerCase().trim()

  if (lower === 'not recommended' || lower === '') return null

  // "X-Y weeks before last frost"
  const beforeMatch = lower.match(/(\d+)\s*-\s*(\d+)\s*weeks?\s*before\s*last\s*frost/)
  if (beforeMatch) {
    const avgWeeks = (parseInt(beforeMatch[1]) + parseInt(beforeMatch[2])) / 2
    return -Math.round(avgWeeks * 7)
  }

  // "X weeks before last frost"
  const singleBeforeMatch = lower.match(/(\d+)\s*weeks?\s*before\s*last\s*frost/)
  if (singleBeforeMatch) {
    return -parseInt(singleBeforeMatch[1]) * 7
  }

  // "X-Y weeks after last frost"
  const afterWeeksMatch = lower.match(/(\d+)\s*-\s*(\d+)\s*weeks?\s*after\s*last\s*frost/)
  if (afterWeeksMatch) {
    const avgWeeks = (parseInt(afterWeeksMatch[1]) + parseInt(afterWeeksMatch[2])) / 2
    return Math.round(avgWeeks * 7)
  }

  // "X weeks after last frost"
  const singleAfterMatch = lower.match(/(\d+)\s*weeks?\s*after\s*last\s*frost/)
  if (singleAfterMatch) {
    return parseInt(singleAfterMatch[1]) * 7
  }

  // "after last frost" / "direct sow after last frost"
  if (lower.includes('after last frost')) return 0

  return null
}

/**
 * Computes actual planting dates for a plant in a given USDA zone.
 */
export function getPlantingDates(plant: Plant, zone: number): PlantingDates {
  const frostDate = getLastFrostDate(zone)
  if (!frostDate) return {}

  const result: PlantingDates = {}

  if (plant.plantingWindows.startIndoors) {
    const offset = parseWindowString(plant.plantingWindows.startIndoors)
    if (offset !== null) {
      result.startIndoors = addDays(frostDate, offset)
    }
  }

  if (plant.plantingWindows.transplant) {
    const offset = parseWindowString(plant.plantingWindows.transplant)
    if (offset !== null) {
      result.transplant = addDays(frostDate, offset)
    }
  }

  if (plant.plantingWindows.directSow) {
    const offset = parseWindowString(plant.plantingWindows.directSow)
    if (offset !== null) {
      result.directSow = addDays(frostDate, offset)
    }
  }

  return result
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

/** All supported zones for UI selectors. */
export const SUPPORTED_ZONES = [3, 4, 5, 6, 7, 8, 9, 10] as const
