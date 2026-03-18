export type Hemisphere = 'northern' | 'southern'

export type GardenType = 'raised' | 'flat' | 'terraced' | 'container'

export type Orientation = 'north' | 'south' | 'east' | 'west'

export type SunNeeds = 'full' | 'partial' | 'shade'

export type HeightCategory = 'ground' | 'short' | 'medium' | 'tall' | 'vine'

export interface Plant {
  id: string
  name: string
  species?: string
  spacing: number
  sunNeeds: SunNeeds
  daysToMaturity: number
  heightCategory: HeightCategory
  waterNeeds: 'low' | 'medium' | 'high'
  companionPlants: string[]
  antagonistPlants?: string[]
  zones: number[]
  plantingWindows: {
    startIndoors?: string
    transplant?: string
    directSow?: string
  }
  source: 'seed' | 'scan' | 'manual'
}

export interface PlantPlacement {
  plantId: string
  gridX: number
  gridY: number
  plantedDate?: string
}

export interface ShadeZone {
  id: string
  x: number
  y: number
  width: number
  height: number
  intensity: 'partial' | 'full'
}

export type CardinalDirection = 'north' | 'south' | 'east' | 'west'

export interface Garden {
  id: string
  name: string
  type: GardenType
  width: number
  length: number
  /** Rotation in degrees (0 = north/top of screen, clockwise). Replaces old cardinal `orientation`. */
  rotationDegrees: number
  hemisphere: Hemisphere
  layout: PlantPlacement[]
  shadeZones?: ShadeZone[]
}

/** Convert legacy cardinal orientation to rotation degrees */
export function cardinalToDegrees(orientation: CardinalDirection): number {
  switch (orientation) {
    case 'north':
      return 0
    case 'east':
      return 90
    case 'south':
      return 180
    case 'west':
      return 270
  }
}

/** Migrate a garden object from legacy orientation to rotationDegrees */
export function migrateGarden(garden: Record<string, unknown>): Record<string, unknown> {
  if ('rotationDegrees' in garden) return garden
  const orientation = garden.orientation as CardinalDirection | undefined
  const rotationDegrees = orientation ? cardinalToDegrees(orientation) : 0
  const { orientation: _, ...rest } = garden
  return { ...rest, rotationDegrees }
}

export interface CalendarEntry {
  id: string
  plantId: string
  gardenId?: string
  zone: number
  startIndoors?: string
  transplantDate?: string
  harvestDate?: string
}

export interface OptimizationResult {
  layout: PlantPlacement[]
  score: number
  suggestions: OptimizationSuggestion[]
}

export interface OptimizationSuggestion {
  type: 'height' | 'sun' | 'spacing' | 'companion' | 'antagonist' | 'shade' | 'density'
  message: string
  severity: 'info' | 'warning' | 'success'
}

export interface GardenmancerDB {
  plants: Plant[]
  gardens: Garden[]
  calendar: CalendarEntry[]
}
