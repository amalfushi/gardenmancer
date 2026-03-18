import { describe, it, expect } from 'vitest'
import {
  snapToGrid,
  isValidPlacement,
  getCellCenter,
  getSpacingCircle,
  getSpacingInCells,
  detectSpacingConflicts,
  getHeightSuggestions,
  getSunZoneSuggestions,
} from '@/lib/garden-utils'
import type { Plant, PlantPlacement, Garden } from '@/types'

const makePlant = (overrides: Partial<Plant> = {}): Plant => ({
  id: 'test-plant',
  name: 'Test Plant',
  spacing: 24,
  sunNeeds: 'full',
  daysToMaturity: 65,
  heightCategory: 'medium',
  waterNeeds: 'medium',
  companionPlants: [],
  zones: [5, 6, 7],
  plantingWindows: {},
  source: 'seed',
  ...overrides,
})

const makeGarden = (overrides: Partial<Garden> = {}): Garden => ({
  id: 'test-garden',
  name: 'Test Garden',
  type: 'raised',
  width: 4,
  length: 8,
  rotationDegrees: 0,
  hemisphere: 'northern',
  layout: [],
  ...overrides,
})

describe('garden-utils', () => {
  describe('snapToGrid', () => {
    it('snaps coordinates to nearest grid cell', () => {
      expect(snapToGrid(0.7, 1.3)).toEqual({ gridX: 1, gridY: 1 })
    })

    it('snaps negative values to 0', () => {
      expect(snapToGrid(-1, -2)).toEqual({ gridX: 0, gridY: 0 })
    })

    it('returns exact grid position for whole numbers', () => {
      expect(snapToGrid(3, 5)).toEqual({ gridX: 3, gridY: 5 })
    })

    it('rounds correctly at 0.5 boundary', () => {
      expect(snapToGrid(2.5, 3.5)).toEqual({ gridX: 3, gridY: 4 })
    })
  })

  describe('isValidPlacement', () => {
    it('returns true for valid grid coordinates', () => {
      expect(isValidPlacement(0, 0, 8, 16)).toBe(true)
    })

    it('returns true for max valid position', () => {
      expect(isValidPlacement(7, 15, 8, 16)).toBe(true)
    })

    it('returns false for negative X', () => {
      expect(isValidPlacement(-1, 0, 8, 16)).toBe(false)
    })

    it('returns false for negative Y', () => {
      expect(isValidPlacement(0, -1, 8, 16)).toBe(false)
    })

    it('returns false for X exceeding grid', () => {
      expect(isValidPlacement(8, 0, 8, 16)).toBe(false)
    })

    it('returns false for Y exceeding grid', () => {
      expect(isValidPlacement(0, 16, 8, 16)).toBe(false)
    })
  })

  describe('getCellCenter', () => {
    it('returns center coordinates for cell 0,0', () => {
      const center = getCellCenter(0, 0)
      expect(center.x).toBe(12) // CELL_SIZE/2 = 24/2 = 12
      expect(center.y).toBe(12)
    })

    it('returns center coordinates for cell 1,1', () => {
      const center = getCellCenter(1, 1)
      expect(center.x).toBe(36) // 1*24 + 12
      expect(center.y).toBe(36)
    })

    it('returns center coordinates for cell 3,5', () => {
      const center = getCellCenter(3, 5)
      expect(center.x).toBe(84) // 3*24 + 12
      expect(center.y).toBe(132) // 5*24 + 12
    })
  })

  describe('getSpacingInCells', () => {
    it('converts 24-inch spacing to 4 cells', () => {
      const plant = makePlant({ spacing: 24 })
      expect(getSpacingInCells(plant)).toBe(4)
    })

    it('converts 12-inch spacing to 2 cells', () => {
      const plant = makePlant({ spacing: 12 })
      expect(getSpacingInCells(plant)).toBe(2)
    })

    it('converts 6-inch spacing to 1 cell', () => {
      const plant = makePlant({ spacing: 6 })
      expect(getSpacingInCells(plant)).toBe(1)
    })

    it('converts 36-inch spacing to 6 cells', () => {
      const plant = makePlant({ spacing: 36 })
      expect(getSpacingInCells(plant)).toBe(6)
    })
  })

  describe('getSpacingCircle', () => {
    it('computes correct spacing circle for a plant', () => {
      const plant = makePlant({ spacing: 24 })
      const circle = getSpacingCircle(plant, 2, 3)
      expect(circle.plantId).toBe('test-plant')
      expect(circle.gridX).toBe(2)
      expect(circle.gridY).toBe(3)
      expect(circle.radiusCells).toBe(2) // 4 cells / 2
      expect(circle.radiusPixels).toBe(48) // 2 cells * 24px
    })

    it('returns smaller radius for closer-spacing plants', () => {
      const plant = makePlant({ spacing: 6 })
      const circle = getSpacingCircle(plant, 0, 0)
      expect(circle.radiusCells).toBe(0.5) // 1 cell / 2
    })

    it('center is at cell center position', () => {
      const plant = makePlant({ spacing: 12 })
      const circle = getSpacingCircle(plant, 1, 1)
      expect(circle.centerX).toBe(36) // 1*24 + 12
      expect(circle.centerY).toBe(36)
    })
  })

  describe('detectSpacingConflicts', () => {
    it('returns empty array when no plants overlap', () => {
      const plant = makePlant({ id: 'p1', spacing: 12 })
      const placements: PlantPlacement[] = [
        { plantId: 'p1', gridX: 0, gridY: 0 },
        { plantId: 'p1', gridX: 5, gridY: 5 },
      ]
      const conflicts = detectSpacingConflicts(placements, [plant])
      expect(conflicts).toHaveLength(0)
    })

    it('detects overlap between two close plants', () => {
      const plant = makePlant({ id: 'p1', spacing: 24 })
      const placements: PlantPlacement[] = [
        { plantId: 'p1', gridX: 0, gridY: 0 },
        { plantId: 'p1', gridX: 1, gridY: 0 },
      ]
      const conflicts = detectSpacingConflicts(placements, [plant])
      expect(conflicts.length).toBeGreaterThan(0)
    })

    it('marks close conflicts as error severity', () => {
      const plant = makePlant({ id: 'p1', spacing: 24 })
      const placements: PlantPlacement[] = [
        { plantId: 'p1', gridX: 0, gridY: 0 },
        { plantId: 'p1', gridX: 0, gridY: 1 },
      ]
      const conflicts = detectSpacingConflicts(placements, [plant])
      expect(conflicts[0].severity).toBe('error')
    })

    it('marks moderate conflicts as warning severity', () => {
      const plant = makePlant({ id: 'p1', spacing: 24 })
      const placements: PlantPlacement[] = [
        { plantId: 'p1', gridX: 0, gridY: 0 },
        { plantId: 'p1', gridX: 3, gridY: 0 },
      ]
      const conflicts = detectSpacingConflicts(placements, [plant])
      expect(conflicts[0].severity).toBe('warning')
    })

    it('handles mixed plant types', () => {
      const tomato = makePlant({ id: 'tomato', spacing: 24 })
      const basil = makePlant({ id: 'basil', spacing: 12 })
      const placements: PlantPlacement[] = [
        { plantId: 'tomato', gridX: 0, gridY: 0 },
        { plantId: 'basil', gridX: 2, gridY: 0 },
      ]
      const conflicts = detectSpacingConflicts(placements, [tomato, basil])
      expect(conflicts.length).toBeGreaterThan(0)
    })

    it('ignores plants not in catalog', () => {
      const plant = makePlant({ id: 'p1', spacing: 24 })
      const placements: PlantPlacement[] = [
        { plantId: 'p1', gridX: 0, gridY: 0 },
        { plantId: 'unknown', gridX: 1, gridY: 0 },
      ]
      const conflicts = detectSpacingConflicts(placements, [plant])
      expect(conflicts).toHaveLength(0)
    })

    it('returns empty for single plant', () => {
      const plant = makePlant({ id: 'p1', spacing: 24 })
      const placements: PlantPlacement[] = [{ plantId: 'p1', gridX: 0, gridY: 0 }]
      const conflicts = detectSpacingConflicts(placements, [plant])
      expect(conflicts).toHaveLength(0)
    })

    it('returns empty for no placements', () => {
      const plant = makePlant({ id: 'p1', spacing: 24 })
      const conflicts = detectSpacingConflicts([], [plant])
      expect(conflicts).toHaveLength(0)
    })
  })

  describe('getHeightSuggestions', () => {
    it('returns empty when no tall plants', () => {
      const plant = makePlant({ id: 'p1', heightCategory: 'short' })
      const garden = makeGarden()
      const placements: PlantPlacement[] = [{ plantId: 'p1', gridX: 0, gridY: 0 }]
      const suggestions = getHeightSuggestions(garden, placements, [plant])
      expect(suggestions).toHaveLength(0)
    })

    it('warns when tall plant is not on north side', () => {
      const plant = makePlant({ id: 'p1', name: 'Corn', heightCategory: 'tall' })
      const garden = makeGarden({ rotationDegrees: 0 })
      // gridY of 12 is south-ish for a 16-row garden
      const placements: PlantPlacement[] = [{ plantId: 'p1', gridX: 0, gridY: 12 }]
      const suggestions = getHeightSuggestions(garden, placements, [plant])
      expect(suggestions.length).toBeGreaterThan(0)
      expect(suggestions[0].severity).toBe('warning')
      expect(suggestions[0].type).toBe('height')
    })

    it('succeeds when tall plant is on north side', () => {
      const plant = makePlant({ id: 'p1', name: 'Corn', heightCategory: 'tall' })
      const garden = makeGarden({ rotationDegrees: 0 })
      const placements: PlantPlacement[] = [{ plantId: 'p1', gridX: 0, gridY: 1 }]
      const suggestions = getHeightSuggestions(garden, placements, [plant])
      expect(suggestions.length).toBeGreaterThan(0)
      expect(suggestions[0].severity).toBe('success')
    })

    it('includes vine plants as tall', () => {
      const plant = makePlant({ id: 'p1', name: 'Cucumber', heightCategory: 'vine' })
      const garden = makeGarden({ rotationDegrees: 0 })
      const placements: PlantPlacement[] = [{ plantId: 'p1', gridX: 0, gridY: 14 }]
      const suggestions = getHeightSuggestions(garden, placements, [plant])
      expect(suggestions[0].severity).toBe('warning')
    })

    it('handles arbitrary rotation angles', () => {
      const plant = makePlant({ id: 'p1', name: 'Corn', heightCategory: 'tall' })
      // 180° = south at top, so north side is at high gridY
      const garden = makeGarden({ rotationDegrees: 180 })
      // gridY of 14 should now be on the north side (bottom of garden)
      const placements: PlantPlacement[] = [{ plantId: 'p1', gridX: 4, gridY: 14 }]
      const suggestions = getHeightSuggestions(garden, placements, [plant])
      expect(suggestions.length).toBeGreaterThan(0)
      expect(suggestions[0].severity).toBe('success')
    })
  })

  describe('getSunZoneSuggestions', () => {
    it('warns when full-sun and shade plants are close', () => {
      const sun = makePlant({ id: 'sun', name: 'Tomato', sunNeeds: 'full' })
      const shade = makePlant({ id: 'shade', name: 'Lettuce', sunNeeds: 'shade' })
      const placements: PlantPlacement[] = [
        { plantId: 'sun', gridX: 0, gridY: 0 },
        { plantId: 'shade', gridX: 1, gridY: 1 },
      ]
      const suggestions = getSunZoneSuggestions(placements, [sun, shade])
      expect(suggestions.some((s) => s.severity === 'warning')).toBe(true)
    })

    it('succeeds when different sun groups are separated', () => {
      const sun = makePlant({ id: 'sun', name: 'Tomato', sunNeeds: 'full' })
      const shade = makePlant({ id: 'shade', name: 'Lettuce', sunNeeds: 'shade' })
      const placements: PlantPlacement[] = [
        { plantId: 'sun', gridX: 0, gridY: 0 },
        { plantId: 'shade', gridX: 10, gridY: 10 },
      ]
      const suggestions = getSunZoneSuggestions(placements, [sun, shade])
      expect(suggestions.some((s) => s.severity === 'success')).toBe(true)
    })

    it('reports info when all plants have same sun needs', () => {
      const p1 = makePlant({ id: 'p1', sunNeeds: 'full' })
      const p2 = makePlant({ id: 'p2', sunNeeds: 'full' })
      const placements: PlantPlacement[] = [
        { plantId: 'p1', gridX: 0, gridY: 0 },
        { plantId: 'p2', gridX: 1, gridY: 1 },
      ]
      const suggestions = getSunZoneSuggestions(placements, [p1, p2])
      expect(suggestions.some((s) => s.severity === 'info')).toBe(true)
    })
  })
})
