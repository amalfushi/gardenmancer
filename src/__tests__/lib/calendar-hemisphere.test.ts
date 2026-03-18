import { describe, it, expect } from 'vitest'
import { mirrorMonth, getLastFrostDate } from '@/lib/calendar'

describe('Calendar — Hemisphere Support', () => {
  describe('mirrorMonth', () => {
    it('mirrors January (1) to July (7)', () => {
      expect(mirrorMonth(1)).toBe(7)
    })

    it('mirrors July (7) to January (1)', () => {
      expect(mirrorMonth(7)).toBe(1)
    })

    it('mirrors March (3) to September (9)', () => {
      expect(mirrorMonth(3)).toBe(9)
    })

    it('mirrors October (10) to April (4)', () => {
      expect(mirrorMonth(10)).toBe(4)
    })

    it('mirrors June (6) to December (12)', () => {
      expect(mirrorMonth(6)).toBe(12)
    })

    it('mirrors December (12) to June (6)', () => {
      expect(mirrorMonth(12)).toBe(6)
    })
  })

  describe('getLastFrostDate with hemisphere', () => {
    it('returns NH frost date for zone 5 without hemisphere', () => {
      const date = getLastFrostDate(5)
      expect(date).toBeDefined()
      if (date) expect(date.getMonth()).toBe(3) // April (0-indexed)
    })

    it('returns NH frost date for zone 5 with northern hemisphere', () => {
      const date = getLastFrostDate(5, 'northern')
      expect(date).toBeDefined()
      if (date) expect(date.getMonth()).toBe(3) // April
    })

    it('mirrors frost date for zone 5 in southern hemisphere', () => {
      const date = getLastFrostDate(5, 'southern')
      expect(date).toBeDefined()
      // NH zone 5 = April 30 → SH mirrors to October 30
      if (date) expect(date.getMonth()).toBe(9) // October (0-indexed)
    })

    it('mirrors frost date for zone 8 in southern hemisphere', () => {
      const date = getLastFrostDate(8, 'southern')
      expect(date).toBeDefined()
      // NH zone 8 = March 15 → SH mirrors to September 15
      if (date) expect(date.getMonth()).toBe(8) // September (0-indexed)
    })

    it('returns undefined for unsupported zone', () => {
      expect(getLastFrostDate(1)).toBeUndefined()
      expect(getLastFrostDate(1, 'southern')).toBeUndefined()
    })
  })
})
