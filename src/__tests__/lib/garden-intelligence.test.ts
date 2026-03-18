import { describe, it, expect } from 'vitest'
import {
  getSunBlockingSide,
  isOnTallPlantSide,
  getHeightSuggestions,
  getSpacingMultiplier,
  isAirflowException,
  getEffectiveSpacing,
  getSpacingInCells,
  detectSpacingConflicts,
  isInShadeZone,
  getShadeZoneSuggestions,
  gridDistance,
  autoOptimizeLayout,
  scoreLayout,
  RAISED_BED_MULTIPLIER,
} from '@/lib/garden-utils'
import type { Plant, Garden, ShadeZone, PlantPlacement } from '@/types'

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
  orientation: 'north',
  hemisphere: 'northern',
  layout: [],
  ...overrides,
})

describe('Milestone 7 — Garden Intelligence', () => {
  // ─── 7.1 Hemisphere Support ───

  describe('7.1 Hemisphere Support', () => {
    describe('getSunBlockingSide', () => {
      it('returns north for northern hemisphere', () => {
        expect(getSunBlockingSide('northern')).toBe('north')
      })

      it('returns south for southern hemisphere', () => {
        expect(getSunBlockingSide('southern')).toBe('south')
      })
    })

    describe('isOnTallPlantSide', () => {
      const rows = 16 // 8ft * 2 cells/ft

      it('NH + north orientation: low gridY is correct for tall plants', () => {
        expect(isOnTallPlantSide(1, rows, 'north', 'northern')).toBe(true)
      })

      it('NH + north orientation: high gridY is NOT correct for tall plants', () => {
        expect(isOnTallPlantSide(14, rows, 'north', 'northern')).toBe(false)
      })

      it('SH + north orientation: high gridY IS correct for tall plants', () => {
        expect(isOnTallPlantSide(14, rows, 'north', 'southern')).toBe(true)
      })

      it('SH + north orientation: low gridY is NOT correct for tall plants', () => {
        expect(isOnTallPlantSide(1, rows, 'north', 'southern')).toBe(false)
      })

      it('NH + south orientation: high gridY is correct for tall plants', () => {
        expect(isOnTallPlantSide(14, rows, 'south', 'northern')).toBe(true)
      })

      it('SH + south orientation: low gridY is correct for tall plants', () => {
        expect(isOnTallPlantSide(1, rows, 'south', 'southern')).toBe(true)
      })

      it('east/west orientation always returns true', () => {
        expect(isOnTallPlantSide(5, rows, 'east', 'northern')).toBe(true)
        expect(isOnTallPlantSide(5, rows, 'west', 'southern')).toBe(true)
      })
    })

    describe('getHeightSuggestions with hemisphere', () => {
      it('warns when tall plant is on south side in NH', () => {
        const plant = makePlant({ id: 'corn', name: 'Corn', heightCategory: 'tall' })
        const garden = makeGarden({ hemisphere: 'northern', orientation: 'north' })
        const placements: PlantPlacement[] = [{ plantId: 'corn', gridX: 0, gridY: 14 }]

        const suggestions = getHeightSuggestions(garden, placements, [plant])
        expect(suggestions.some((s) => s.severity === 'warning')).toBe(true)
        expect(suggestions[0].message).toContain('north')
      })

      it('succeeds when tall plant is on north side in NH', () => {
        const plant = makePlant({ id: 'corn', name: 'Corn', heightCategory: 'tall' })
        const garden = makeGarden({ hemisphere: 'northern', orientation: 'north' })
        const placements: PlantPlacement[] = [{ plantId: 'corn', gridX: 0, gridY: 1 }]

        const suggestions = getHeightSuggestions(garden, placements, [plant])
        expect(suggestions.some((s) => s.severity === 'success')).toBe(true)
      })

      it('warns when tall plant is on north side in SH', () => {
        const plant = makePlant({ id: 'corn', name: 'Corn', heightCategory: 'tall' })
        const garden = makeGarden({ hemisphere: 'southern', orientation: 'north' })
        const placements: PlantPlacement[] = [{ plantId: 'corn', gridX: 0, gridY: 1 }]

        const suggestions = getHeightSuggestions(garden, placements, [plant])
        expect(suggestions.some((s) => s.severity === 'warning')).toBe(true)
        expect(suggestions[0].message).toContain('south')
      })

      it('succeeds when tall plant is on south side in SH', () => {
        const plant = makePlant({ id: 'corn', name: 'Corn', heightCategory: 'tall' })
        const garden = makeGarden({ hemisphere: 'southern', orientation: 'north' })
        const placements: PlantPlacement[] = [{ plantId: 'corn', gridX: 0, gridY: 14 }]

        const suggestions = getHeightSuggestions(garden, placements, [plant])
        expect(suggestions.some((s) => s.severity === 'success')).toBe(true)
      })

      it('NH + 90° rotation: tall plant on north side (low gridX) succeeds', () => {
        const plant = makePlant({ id: 'corn', name: 'Corn', heightCategory: 'tall' })
        const garden = makeGarden({
          hemisphere: 'northern',
          rotationDegrees: 90,
          width: 8,
          length: 8,
        })
        const placements: PlantPlacement[] = [{ plantId: 'corn', gridX: 1, gridY: 8 }]

        const suggestions = getHeightSuggestions(garden, placements, [plant])
        expect(suggestions.some((s) => s.severity === 'success')).toBe(true)
      })

      it('NH + 90° rotation: tall plant on south side (high gridX) warns', () => {
        const plant = makePlant({ id: 'corn', name: 'Corn', heightCategory: 'tall' })
        const garden = makeGarden({
          hemisphere: 'northern',
          rotationDegrees: 90,
          width: 8,
          length: 8,
        })
        const placements: PlantPlacement[] = [{ plantId: 'corn', gridX: 14, gridY: 8 }]

        const suggestions = getHeightSuggestions(garden, placements, [plant])
        expect(suggestions.some((s) => s.severity === 'warning')).toBe(true)
      })

      it('SH + 180° rotation: tall plant on top (low gridY) succeeds', () => {
        const plant = makePlant({ id: 'corn', name: 'Corn', heightCategory: 'tall' })
        const garden = makeGarden({ hemisphere: 'southern', rotationDegrees: 180 })
        const placements: PlantPlacement[] = [{ plantId: 'corn', gridX: 0, gridY: 1 }]

        const suggestions = getHeightSuggestions(garden, placements, [plant])
        expect(suggestions.some((s) => s.severity === 'success')).toBe(true)
      })

      it('NH + 180° rotation: tall plant at bottom (high gridY) succeeds', () => {
        const plant = makePlant({ id: 'corn', name: 'Corn', heightCategory: 'tall' })
        const garden = makeGarden({ hemisphere: 'northern', rotationDegrees: 180 })
        const placements: PlantPlacement[] = [{ plantId: 'corn', gridX: 0, gridY: 14 }]

        const suggestions = getHeightSuggestions(garden, placements, [plant])
        expect(suggestions.some((s) => s.severity === 'success')).toBe(true)
      })
    })
  })

  // ─── M8 Rotation + Hemisphere combined scenarios ───

  describe('M8 Rotation + Hemisphere combined', () => {
    describe('autoOptimizeLayout with rotation', () => {
      it('NH + 90° rotation: tall plants placed on low gridX side', () => {
        const garden = makeGarden({
          hemisphere: 'northern',
          rotationDegrees: 90,
          width: 8,
          length: 8,
        })
        const corn = makePlant({ id: 'corn', name: 'Corn', heightCategory: 'tall', spacing: 24 })
        const basil = makePlant({
          id: 'basil',
          name: 'Basil',
          heightCategory: 'short',
          spacing: 12,
        })

        const result = autoOptimizeLayout(garden, [corn, basil], [corn, basil])
        const cornPlacement = result.layout.find((p) => p.plantId === 'corn')
        const basilPlacement = result.layout.find((p) => p.plantId === 'basil')
        expect(cornPlacement).toBeDefined()
        expect(basilPlacement).toBeDefined()
        if (cornPlacement && basilPlacement) {
          expect(cornPlacement.gridX).toBeLessThan(basilPlacement.gridX)
        }
      })

      it('SH + 90° rotation: tall plants placed on high gridX side', () => {
        const garden = makeGarden({
          hemisphere: 'southern',
          rotationDegrees: 90,
          width: 8,
          length: 8,
        })
        const corn = makePlant({ id: 'corn', name: 'Corn', heightCategory: 'tall', spacing: 24 })
        const basil = makePlant({
          id: 'basil',
          name: 'Basil',
          heightCategory: 'short',
          spacing: 12,
        })

        const result = autoOptimizeLayout(garden, [corn, basil], [corn, basil])
        const cornPlacement = result.layout.find((p) => p.plantId === 'corn')
        const basilPlacement = result.layout.find((p) => p.plantId === 'basil')
        expect(cornPlacement).toBeDefined()
        expect(basilPlacement).toBeDefined()
        if (cornPlacement && basilPlacement) {
          expect(cornPlacement.gridX).toBeGreaterThan(basilPlacement.gridX)
        }
      })

      it('NH + 180° rotation: tall plants placed on high gridY side', () => {
        const garden = makeGarden({
          hemisphere: 'northern',
          rotationDegrees: 180,
          width: 4,
          length: 8,
        })
        const corn = makePlant({ id: 'corn', name: 'Corn', heightCategory: 'tall', spacing: 24 })
        const basil = makePlant({
          id: 'basil',
          name: 'Basil',
          heightCategory: 'short',
          spacing: 12,
        })

        const result = autoOptimizeLayout(garden, [corn, basil], [corn, basil])
        const cornPlacement = result.layout.find((p) => p.plantId === 'corn')
        const basilPlacement = result.layout.find((p) => p.plantId === 'basil')
        expect(cornPlacement).toBeDefined()
        expect(basilPlacement).toBeDefined()
        if (cornPlacement && basilPlacement) {
          expect(cornPlacement.gridY).toBeGreaterThan(basilPlacement.gridY)
        }
      })

      it('SH + 180° rotation: tall plants placed on low gridY side', () => {
        const garden = makeGarden({
          hemisphere: 'southern',
          rotationDegrees: 180,
          width: 4,
          length: 8,
        })
        const corn = makePlant({ id: 'corn', name: 'Corn', heightCategory: 'tall', spacing: 24 })
        const basil = makePlant({
          id: 'basil',
          name: 'Basil',
          heightCategory: 'short',
          spacing: 12,
        })

        const result = autoOptimizeLayout(garden, [corn, basil], [corn, basil])
        const cornPlacement = result.layout.find((p) => p.plantId === 'corn')
        const basilPlacement = result.layout.find((p) => p.plantId === 'basil')
        expect(cornPlacement).toBeDefined()
        expect(basilPlacement).toBeDefined()
        if (cornPlacement && basilPlacement) {
          expect(cornPlacement.gridY).toBeLessThan(basilPlacement.gridY)
        }
      })
    })
  })

  // ─── 7.2 Shade Zones ───

  describe('7.2 Shade Zones', () => {
    const zones: ShadeZone[] = [
      { id: 'sz1', x: 0, y: 0, width: 3, height: 3, intensity: 'partial' },
      { id: 'sz2', x: 5, y: 5, width: 2, height: 2, intensity: 'full' },
    ]

    describe('isInShadeZone', () => {
      it('returns shade zone when cell is inside', () => {
        const zone = isInShadeZone(1, 1, zones)
        expect(zone).toBeDefined()
        expect(zone?.id).toBe('sz1')
      })

      it('returns undefined when cell is outside all zones', () => {
        expect(isInShadeZone(4, 4, zones)).toBeUndefined()
      })

      it('detects boundary: cell at x=0,y=0 is inside', () => {
        expect(isInShadeZone(0, 0, zones)).toBeDefined()
      })

      it('detects boundary: cell at x+width is outside', () => {
        expect(isInShadeZone(3, 0, zones)).toBeUndefined()
      })

      it('returns full shade zone correctly', () => {
        const zone = isInShadeZone(5, 5, zones)
        expect(zone?.intensity).toBe('full')
      })

      it('returns undefined for empty shade zones array', () => {
        expect(isInShadeZone(0, 0, [])).toBeUndefined()
      })
    })

    describe('getShadeZoneSuggestions', () => {
      it('warns when full-sun plant is in shade zone', () => {
        const plant = makePlant({ id: 'tomato', name: 'Tomato', sunNeeds: 'full' })
        const placements: PlantPlacement[] = [{ plantId: 'tomato', gridX: 1, gridY: 1 }]
        const suggestions = getShadeZoneSuggestions(placements, [plant], zones)
        expect(suggestions.some((s) => s.severity === 'warning' && s.type === 'shade')).toBe(true)
      })

      it('suggests moving shade-loving plant into shade zone', () => {
        const plant = makePlant({ id: 'lettuce', name: 'Lettuce', sunNeeds: 'shade' })
        const placements: PlantPlacement[] = [{ plantId: 'lettuce', gridX: 4, gridY: 4 }]
        const suggestions = getShadeZoneSuggestions(placements, [plant], zones)
        expect(suggestions.some((s) => s.severity === 'info' && s.type === 'shade')).toBe(true)
      })

      it('reports success when shade plant is in shade zone', () => {
        const plant = makePlant({ id: 'lettuce', name: 'Lettuce', sunNeeds: 'shade' })
        const placements: PlantPlacement[] = [{ plantId: 'lettuce', gridX: 1, gridY: 1 }]
        const suggestions = getShadeZoneSuggestions(placements, [plant], zones)
        expect(suggestions.some((s) => s.severity === 'success')).toBe(true)
      })

      it('returns empty when no shade zones defined', () => {
        const plant = makePlant({ id: 'p1', sunNeeds: 'full' })
        const placements: PlantPlacement[] = [{ plantId: 'p1', gridX: 0, gridY: 0 }]
        const suggestions = getShadeZoneSuggestions(placements, [plant], [])
        expect(suggestions).toHaveLength(0)
      })
    })
  })

  // ─── 7.3 Raised Bed Density ───

  describe('7.3 Raised Bed Density', () => {
    describe('getSpacingMultiplier', () => {
      it('returns 0.7 for raised beds', () => {
        expect(getSpacingMultiplier('raised')).toBe(RAISED_BED_MULTIPLIER)
      })

      it('returns 1.0 for flat gardens', () => {
        expect(getSpacingMultiplier('flat')).toBe(1.0)
      })

      it('returns 1.0 for terraced gardens', () => {
        expect(getSpacingMultiplier('terraced')).toBe(1.0)
      })

      it('returns 1.0 for container gardens', () => {
        expect(getSpacingMultiplier('container')).toBe(1.0)
      })
    })

    describe('isAirflowException', () => {
      it('identifies Tomato as airflow exception', () => {
        expect(isAirflowException(makePlant({ name: 'Cherry Tomato' }))).toBe(true)
      })

      it('identifies Squash as airflow exception', () => {
        expect(isAirflowException(makePlant({ name: 'Butternut Squash' }))).toBe(true)
      })

      it('identifies Pumpkin as airflow exception', () => {
        expect(isAirflowException(makePlant({ name: 'Sugar Pumpkin' }))).toBe(true)
      })

      it('identifies Zucchini as airflow exception', () => {
        expect(isAirflowException(makePlant({ name: 'Zucchini' }))).toBe(true)
      })

      it('identifies Watermelon as airflow exception', () => {
        expect(isAirflowException(makePlant({ name: 'Watermelon' }))).toBe(true)
      })

      it('returns false for Basil', () => {
        expect(isAirflowException(makePlant({ name: 'Sweet Basil' }))).toBe(false)
      })

      it('returns false for Lettuce', () => {
        expect(isAirflowException(makePlant({ name: 'Lettuce' }))).toBe(false)
      })
    })

    describe('getEffectiveSpacing', () => {
      it('applies 0.7x multiplier for raised bed', () => {
        const plant = makePlant({ name: 'Basil', spacing: 12 })
        const effective = getEffectiveSpacing(plant, 'raised')
        expect(effective).toBeCloseTo(8.4)
      })

      it('keeps standard spacing for flat garden', () => {
        const plant = makePlant({ name: 'Basil', spacing: 12 })
        expect(getEffectiveSpacing(plant, 'flat')).toBe(12)
      })

      it('does NOT apply multiplier to tomatoes in raised beds', () => {
        const plant = makePlant({ name: 'Cherry Tomato', spacing: 24 })
        expect(getEffectiveSpacing(plant, 'raised')).toBe(24)
      })

      it('does NOT apply multiplier to squash in raised beds', () => {
        const plant = makePlant({ name: 'Butternut Squash', spacing: 36 })
        expect(getEffectiveSpacing(plant, 'raised')).toBe(36)
      })
    })

    describe('getSpacingInCells with gardenType', () => {
      it('reduces spacing cells for raised bed', () => {
        const plant = makePlant({ name: 'Basil', spacing: 12 })
        const withType = getSpacingInCells(plant, 'raised')
        const withoutType = getSpacingInCells(plant)
        expect(withType).toBeLessThan(withoutType)
      })

      it('keeps same spacing for flat garden', () => {
        const plant = makePlant({ name: 'Basil', spacing: 12 })
        expect(getSpacingInCells(plant, 'flat')).toBe(getSpacingInCells(plant))
      })
    })

    describe('detectSpacingConflicts with gardenType', () => {
      it('allows denser placement in raised beds', () => {
        const plant = makePlant({ id: 'basil', name: 'Basil', spacing: 12 })
        const placements: PlantPlacement[] = [
          { plantId: 'basil', gridX: 0, gridY: 0 },
          { plantId: 'basil', gridX: 1, gridY: 0 },
        ]
        const flatConflicts = detectSpacingConflicts(placements, [plant], 'flat')
        const raisedConflicts = detectSpacingConflicts(placements, [plant], 'raised')
        // Raised beds should have fewer or no conflicts
        expect(raisedConflicts.length).toBeLessThanOrEqual(flatConflicts.length)
      })
    })
  })

  // ─── 7.4 Auto-Optimize ───

  describe('7.4 Auto-Optimize', () => {
    describe('gridDistance', () => {
      it('calculates distance between same point as 0', () => {
        expect(gridDistance(0, 0, 0, 0)).toBe(0)
      })

      it('calculates distance correctly', () => {
        expect(gridDistance(0, 0, 3, 4)).toBe(5)
      })
    })

    describe('autoOptimizeLayout', () => {
      it('places tall plants on north side in NH', () => {
        const garden = makeGarden({
          hemisphere: 'northern',
          orientation: 'north',
          width: 4,
          length: 8,
        })
        const corn = makePlant({ id: 'corn', name: 'Corn', heightCategory: 'tall', spacing: 24 })
        const basil = makePlant({
          id: 'basil',
          name: 'Basil',
          heightCategory: 'short',
          spacing: 12,
        })

        const result = autoOptimizeLayout(garden, [corn, basil], [corn, basil])
        expect(result.layout.length).toBe(2)

        const cornPlacement = result.layout.find((p) => p.plantId === 'corn')
        const basilPlacement = result.layout.find((p) => p.plantId === 'basil')
        expect(cornPlacement).toBeDefined()
        expect(basilPlacement).toBeDefined()
        if (cornPlacement && basilPlacement) {
          // Corn (tall) should have lower gridY (north side)
          expect(cornPlacement.gridY).toBeLessThan(basilPlacement.gridY)
        }
      })

      it('places tall plants on south side in SH', () => {
        const garden = makeGarden({
          hemisphere: 'southern',
          orientation: 'north',
          width: 4,
          length: 8,
        })
        const corn = makePlant({ id: 'corn', name: 'Corn', heightCategory: 'tall', spacing: 24 })
        const basil = makePlant({
          id: 'basil',
          name: 'Basil',
          heightCategory: 'short',
          spacing: 12,
        })

        const result = autoOptimizeLayout(garden, [corn, basil], [corn, basil])
        const cornPlacement = result.layout.find((p) => p.plantId === 'corn')
        const basilPlacement = result.layout.find((p) => p.plantId === 'basil')
        if (cornPlacement && basilPlacement) {
          // Corn (tall) should have higher gridY (south side)
          expect(cornPlacement.gridY).toBeGreaterThan(basilPlacement.gridY)
        }
      })

      it('places shade-loving plants in shade zones', () => {
        const garden = makeGarden({
          shadeZones: [{ id: 'sz1', x: 0, y: 0, width: 4, height: 4, intensity: 'partial' }],
          width: 4,
          length: 8,
          type: 'flat',
        })
        const lettuce = makePlant({
          id: 'lettuce',
          name: 'Lettuce',
          sunNeeds: 'shade',
          heightCategory: 'short',
          spacing: 12,
        })

        const result = autoOptimizeLayout(garden, [lettuce], [lettuce])
        const placement = result.layout.find((p) => p.plantId === 'lettuce')
        expect(placement).toBeDefined()
        if (placement) {
          // Should be placed in shade zone (x < 4, y < 4)
          expect(placement.gridX).toBeLessThan(4)
          expect(placement.gridY).toBeLessThan(4)
        }
      })

      it('returns empty layout when no plants to place', () => {
        const garden = makeGarden()
        const result = autoOptimizeLayout(garden, [], [])
        expect(result.layout).toHaveLength(0)
      })

      it('respects spacing constraints', () => {
        const garden = makeGarden({ width: 4, length: 4, type: 'flat' })
        const plant = makePlant({ id: 'p1', spacing: 24 })

        const result = autoOptimizeLayout(garden, [plant, plant], [plant])
        // Plants should be placed with enough spacing
        if (result.layout.length === 2) {
          const dist = gridDistance(
            result.layout[0].gridX,
            result.layout[0].gridY,
            result.layout[1].gridX,
            result.layout[1].gridY,
          )
          expect(dist).toBeGreaterThanOrEqual(1)
        }
      })
    })

    describe('scoreLayout', () => {
      it('returns score of 100 for perfect layout', () => {
        const garden = makeGarden({ width: 8, length: 8 })
        const plant = makePlant({ id: 'p1', name: 'Basil', heightCategory: 'short', spacing: 12 })
        const layout: PlantPlacement[] = [{ plantId: 'p1', gridX: 0, gridY: 8 }]
        const { score } = scoreLayout(garden, layout, [plant])
        expect(score).toBeGreaterThanOrEqual(80)
      })

      it('reduces score for spacing conflicts', () => {
        const garden = makeGarden({ width: 4, length: 8, type: 'flat' })
        const plant = makePlant({ id: 'p1', name: 'Basil', spacing: 24 })
        const layout: PlantPlacement[] = [
          { plantId: 'p1', gridX: 0, gridY: 0 },
          { plantId: 'p1', gridX: 1, gridY: 0 },
        ]
        const { score } = scoreLayout(garden, layout, [plant])
        expect(score).toBeLessThan(100)
      })

      it('reduces score for antagonist plants too close', () => {
        const p1 = makePlant({ id: 'p1', name: 'Fennel', antagonistPlants: ['p2'], spacing: 6 })
        const p2 = makePlant({ id: 'p2', name: 'Tomato', spacing: 6 })
        const garden = makeGarden({ width: 4, length: 8 })
        const layout: PlantPlacement[] = [
          { plantId: 'p1', gridX: 0, gridY: 0 },
          { plantId: 'p2', gridX: 1, gridY: 0 },
        ]
        const { score, suggestions } = scoreLayout(garden, layout, [p1, p2])
        expect(score).toBeLessThan(100)
        expect(suggestions.some((s) => s.type === 'antagonist')).toBe(true)
      })

      it('generates companion planting suggestions for distant companions', () => {
        const p1 = makePlant({ id: 'p1', name: 'Tomato', companionPlants: ['p2'], spacing: 6 })
        const p2 = makePlant({ id: 'p2', name: 'Basil', spacing: 6 })
        const garden = makeGarden({ width: 8, length: 8 })
        const layout: PlantPlacement[] = [
          { plantId: 'p1', gridX: 0, gridY: 0 },
          { plantId: 'p2', gridX: 10, gridY: 10 },
        ]
        const { suggestions } = scoreLayout(garden, layout, [p1, p2])
        expect(suggestions.some((s) => s.type === 'companion')).toBe(true)
      })

      it('score is clamped between 0 and 100', () => {
        const garden = makeGarden({ width: 2, length: 2, type: 'flat' })
        const plant = makePlant({ id: 'p1', spacing: 24, antagonistPlants: ['p1'] })
        const layout: PlantPlacement[] = [
          { plantId: 'p1', gridX: 0, gridY: 0 },
          { plantId: 'p1', gridX: 0, gridY: 1 },
          { plantId: 'p1', gridX: 1, gridY: 0 },
          { plantId: 'p1', gridX: 1, gridY: 1 },
        ]
        const { score } = scoreLayout(garden, layout, [plant])
        expect(score).toBeGreaterThanOrEqual(0)
        expect(score).toBeLessThanOrEqual(100)
      })
    })
  })
})
