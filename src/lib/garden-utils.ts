import type {
  Plant,
  PlantPlacement,
  Garden,
  Hemisphere,
  ShadeZone,
  GardenType,
  OptimizationResult,
  OptimizationSuggestion,
} from '@/types'

/** Pixels per cell (each cell = 6 inches) */
export const CELL_SIZE = 24
/** Cells per foot (12 inches / 6 inches) */
export const CELLS_PER_FOOT = 2

/** Raised bed spacing multiplier (denser planting) */
export const RAISED_BED_MULTIPLIER = 0.7

/** Plants that need standard spacing even in raised beds (airflow-sensitive) */
export const AIRFLOW_EXCEPTION_NAMES = ['tomato', 'squash', 'pumpkin', 'zucchini', 'watermelon']

/** Snap floating-point coordinates to the nearest grid cell */
export function snapToGrid(x: number, y: number): { gridX: number; gridY: number } {
  return {
    gridX: Math.max(0, Math.round(x)),
    gridY: Math.max(0, Math.round(y)),
  }
}

/** Check if a grid position is within garden bounds */
export function isValidPlacement(
  gridX: number,
  gridY: number,
  cols: number,
  rows: number,
): boolean {
  return gridX >= 0 && gridY >= 0 && gridX < cols && gridY < rows
}

/** Get pixel center for a grid cell */
export function getCellCenter(gridX: number, gridY: number): { x: number; y: number } {
  return {
    x: gridX * CELL_SIZE + CELL_SIZE / 2,
    y: gridY * CELL_SIZE + CELL_SIZE / 2,
  }
}

/**
 * Get the spacing multiplier for a garden type.
 * Raised beds use 0.7x (denser planting).
 */
export function getSpacingMultiplier(gardenType: GardenType): number {
  return gardenType === 'raised' ? RAISED_BED_MULTIPLIER : 1.0
}

/** Check if a plant requires standard spacing (airflow exceptions) */
export function isAirflowException(plant: Plant): boolean {
  const lowerName = plant.name.toLowerCase()
  return AIRFLOW_EXCEPTION_NAMES.some((exception) => lowerName.includes(exception))
}

/**
 * Get effective spacing for a plant accounting for garden type.
 * Raised beds get 0.7x multiplier except for airflow-sensitive plants.
 */
export function getEffectiveSpacing(plant: Plant, gardenType: GardenType): number {
  const multiplier = getSpacingMultiplier(gardenType)
  if (multiplier < 1 && isAirflowException(plant)) {
    return plant.spacing
  }
  return plant.spacing * multiplier
}

/** Get the spacing radius in grid cells for a plant */
export function getSpacingInCells(plant: Plant, gardenType?: GardenType): number {
  const spacing = gardenType ? getEffectiveSpacing(plant, gardenType) : plant.spacing
  return spacing / 6
}

export interface SpacingCircle {
  centerX: number
  centerY: number
  radiusCells: number
  radiusPixels: number
  plantId: string
  gridX: number
  gridY: number
}

/** Compute the spacing footprint circle for a placed plant */
export function getSpacingCircle(
  plant: Plant,
  gridX: number,
  gridY: number,
  gardenType?: GardenType,
): SpacingCircle {
  const radiusCells = getSpacingInCells(plant, gardenType) / 2
  const center = getCellCenter(gridX, gridY)
  return {
    centerX: center.x,
    centerY: center.y,
    radiusCells,
    radiusPixels: radiusCells * CELL_SIZE,
    plantId: plant.id,
    gridX,
    gridY,
  }
}

export interface SpacingConflict {
  plant1: { plantId: string; gridX: number; gridY: number }
  plant2: { plantId: string; gridX: number; gridY: number }
  distance: number
  requiredDistance: number
  severity: 'warning' | 'error'
}

/** Detect spacing conflicts between placed plants */
export function detectSpacingConflicts(
  placements: PlantPlacement[],
  plantCatalog: Plant[],
  gardenType?: GardenType,
): SpacingConflict[] {
  const conflicts: SpacingConflict[] = []
  const findPlant = (id: string) => plantCatalog.find((p) => p.id === id)

  for (let i = 0; i < placements.length; i++) {
    for (let j = i + 1; j < placements.length; j++) {
      const p1 = placements[i]
      const p2 = placements[j]
      const plant1 = findPlant(p1.plantId)
      const plant2 = findPlant(p2.plantId)

      if (!plant1 || !plant2) continue

      // Distance in cells between the two placements
      const dx = p1.gridX - p2.gridX
      const dy = p1.gridY - p2.gridY
      const distance = Math.sqrt(dx * dx + dy * dy)

      // Required spacing uses effective spacing for garden type
      const radius1 = getSpacingInCells(plant1, gardenType) / 2
      const radius2 = getSpacingInCells(plant2, gardenType) / 2
      const requiredDistance = radius1 + radius2

      if (distance < requiredDistance) {
        const ratio = distance / requiredDistance
        conflicts.push({
          plant1: { plantId: p1.plantId, gridX: p1.gridX, gridY: p1.gridY },
          plant2: { plantId: p2.plantId, gridX: p2.gridX, gridY: p2.gridY },
          distance,
          requiredDistance,
          severity: ratio < 0.5 ? 'error' : 'warning',
        })
      }
    }
  }

  return conflicts
}

export interface Suggestion {
  type: 'height' | 'sun' | 'spacing' | 'companion' | 'antagonist' | 'shade' | 'density'
  message: string
  severity: 'info' | 'warning' | 'success'
}

/**
 * Get the sun-blocking side for a garden based on hemisphere.
 * In Northern Hemisphere: sun from south → tall plants go NORTH (low gridY).
 * In Southern Hemisphere: sun from north → tall plants go SOUTH (high gridY).
 */
export function getSunBlockingSide(hemisphere: Hemisphere): 'north' | 'south' {
  return hemisphere === 'northern' ? 'north' : 'south'
}

/**
 * Determine if a gridY position is on the "tall plant" side of the garden.
 * In NH: tall plants go north (low gridY when orientation=north).
 * In SH: tall plants go south (high gridY when orientation=north).
 * @deprecated Use rotation-based projection instead. Kept for legacy cardinal direction support.
 */
export function isOnTallPlantSide(
  gridY: number,
  rows: number,
  orientation: 'north' | 'south' | 'east' | 'west',
  hemisphere: Hemisphere,
): boolean {
  const threshold = rows * 0.33
  const tallSide = getSunBlockingSide(hemisphere)

  if (orientation === 'north') {
    return tallSide === 'north' ? gridY < threshold : gridY > rows - threshold
  } else if (orientation === 'south') {
    return tallSide === 'north' ? gridY > rows - threshold : gridY < threshold
  }
  // For east/west orientations, use X-axis logic — simplified to accept any position
  return true
}

/** Suggest tall plants on the correct side based on hemisphere */
export function getHeightSuggestions(
  garden: Garden,
  placements: PlantPlacement[],
  plantCatalog: Plant[],
): Suggestion[] {
  const suggestions: Suggestion[] = []
  const findPlant = (id: string) => plantCatalog.find((p) => p.id === id)
  const rows = garden.length * CELLS_PER_FOOT
  const hemisphere = garden.hemisphere ?? 'northern'
  const cols = garden.width * CELLS_PER_FOOT

  const tallPlacements = placements.filter((p) => {
    const plant = findPlant(p.plantId)
    return plant && (plant.heightCategory === 'tall' || plant.heightCategory === 'vine')
  })

  if (tallPlacements.length === 0) return suggestions

  // Determine the "tall plant" side based on hemisphere and continuous rotation.
  // In Northern Hemisphere: sun from south → tall plants go NORTH.
  // In Southern Hemisphere: sun from north → tall plants go SOUTH.
  // rotationDegrees: 0 = north at top, 90 = east at top, etc.
  const tallSide = getSunBlockingSide(hemisphere)
  const rotation = garden.rotationDegrees ?? 0
  const radians = (rotation * Math.PI) / 180

  for (const placement of tallPlacements) {
    const plant = findPlant(placement.plantId)
    if (!plant) continue

    // Project the plant position onto the north-south axis.
    // At 0° rotation, north = low gridY → north direction in grid = (0, -1).
    // At θ rotation, north direction = (-sin(θ), -cos(θ)).
    // The projection tells how far toward north the plant is (higher = more north).
    const centerX = placement.gridX - cols / 2
    const centerY = placement.gridY - rows / 2
    const northProjection = -(centerX * Math.sin(radians) + centerY * Math.cos(radians))
    const maxProjection = Math.max(cols, rows) / 2

    // In NH tall plants go north side, in SH tall plants go south side
    const isOnNorthSide = northProjection > maxProjection * 0.33
    const isCorrectSide = tallSide === 'north' ? isOnNorthSide : !isOnNorthSide

    if (!isCorrectSide) {
      suggestions.push({
        type: 'height',
        message: `${plant.name} is tall — place on the ${tallSide} side to avoid shading shorter plants.`,
        severity: 'warning',
      })
    }
  }

  if (suggestions.length === 0 && tallPlacements.length > 0) {
    suggestions.push({
      type: 'height',
      message: `Tall plants are well-positioned on the ${tallSide} side. Good layout!`,
      severity: 'success',
    })
  }

  return suggestions
}

/** Suggest grouping plants by sun needs */
export function getSunZoneSuggestions(
  placements: PlantPlacement[],
  plantCatalog: Plant[],
): Suggestion[] {
  const suggestions: Suggestion[] = []
  const findPlant = (id: string) => plantCatalog.find((p) => p.id === id)

  const sunGroups: Record<string, PlantPlacement[]> = {
    full: [],
    partial: [],
    shade: [],
  }

  for (const placement of placements) {
    const plant = findPlant(placement.plantId)
    if (plant) {
      sunGroups[plant.sunNeeds].push(placement)
    }
  }

  // Check if sun-loving plants are mixed with shade plants
  if (sunGroups.full.length > 0 && sunGroups.shade.length > 0) {
    // Check for proximity between full-sun and shade plants
    for (const fullSun of sunGroups.full) {
      for (const shade of sunGroups.shade) {
        const dx = fullSun.gridX - shade.gridX
        const dy = fullSun.gridY - shade.gridY
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 3) {
          const fullPlant = findPlant(fullSun.plantId)
          const shadePlant = findPlant(shade.plantId)
          if (fullPlant && shadePlant) {
            suggestions.push({
              type: 'sun',
              message: `${fullPlant.name} (full sun) is close to ${shadePlant.name} (shade). Group by sun needs for best results.`,
              severity: 'warning',
            })
          }
        }
      }
    }
  }

  const activeGroups = Object.entries(sunGroups).filter(([, arr]) => arr.length > 0)
  if (activeGroups.length >= 2 && suggestions.length === 0) {
    suggestions.push({
      type: 'sun',
      message: 'Plants are grouped by sun requirements. Nice planning!',
      severity: 'success',
    })
  }

  if (placements.length > 0 && activeGroups.length === 1) {
    suggestions.push({
      type: 'sun',
      message: `All plants need ${activeGroups[0][0]} sun — consistent light requirements.`,
      severity: 'info',
    })
  }

  return suggestions
}

/** Check if a grid cell falls within a shade zone */
export function isInShadeZone(
  gridX: number,
  gridY: number,
  shadeZones: ShadeZone[],
): ShadeZone | undefined {
  return shadeZones.find(
    (zone) =>
      gridX >= zone.x &&
      gridX < zone.x + zone.width &&
      gridY >= zone.y &&
      gridY < zone.y + zone.height,
  )
}

/** Get shade zone suggestions for plant placements */
export function getShadeZoneSuggestions(
  placements: PlantPlacement[],
  plantCatalog: Plant[],
  shadeZones: ShadeZone[],
): Suggestion[] {
  const suggestions: Suggestion[] = []
  if (shadeZones.length === 0) return suggestions

  const findPlant = (id: string) => plantCatalog.find((p) => p.id === id)

  for (const placement of placements) {
    const plant = findPlant(placement.plantId)
    if (!plant) continue

    const inShade = isInShadeZone(placement.gridX, placement.gridY, shadeZones)

    if (inShade && plant.sunNeeds === 'full') {
      suggestions.push({
        type: 'shade',
        message: `${plant.name} needs full sun but is placed in a ${inShade.intensity} shade zone. Move to an open area.`,
        severity: 'warning',
      })
    }

    if (!inShade && plant.sunNeeds === 'shade') {
      suggestions.push({
        type: 'shade',
        message: `${plant.name} prefers shade — consider moving it into a shade zone.`,
        severity: 'info',
      })
    }
  }

  const shadePlantsInShade = placements.filter((p) => {
    const plant = findPlant(p.plantId)
    return plant && plant.sunNeeds === 'shade' && isInShadeZone(p.gridX, p.gridY, shadeZones)
  })

  if (shadePlantsInShade.length > 0) {
    suggestions.push({
      type: 'shade',
      message: 'Shade-loving plants are well-placed in shade zones!',
      severity: 'success',
    })
  }

  return suggestions
}

/** Euclidean distance between two grid positions */
export function gridDistance(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x1 - x2
  const dy = y1 - y2
  return Math.sqrt(dx * dx + dy * dy)
}

/** Get companion planting suggestions for the current layout */
export function getCompanionSuggestions(
  placements: PlantPlacement[],
  plantCatalog: Plant[],
): Suggestion[] {
  const suggestions: Suggestion[] = []
  const findPlant = (id: string) => plantCatalog.find((p) => p.id === id)

  // Track which companion pairs we've already reported
  const reported = new Set<string>()

  for (const placement of placements) {
    const plant = findPlant(placement.plantId)
    if (!plant || plant.companionPlants.length === 0) continue

    for (const companionId of plant.companionPlants) {
      const companion = findPlant(companionId)
      if (!companion) continue

      // Deduplicate: only report each pair once
      const pairKey = [plant.id, companion.id].sort().join(':')
      if (reported.has(pairKey)) continue
      reported.add(pairKey)

      // Check if companion is in the garden
      const companionPlacement = placements.find((p) => p.plantId === companionId)
      if (companionPlacement) {
        const dist = gridDistance(
          placement.gridX,
          placement.gridY,
          companionPlacement.gridX,
          companionPlacement.gridY,
        )
        if (dist <= 3) {
          suggestions.push({
            type: 'companion',
            message: `${plant.name} and ${companion.name} are companion planted together — great pairing!`,
            severity: 'success',
          })
        } else {
          suggestions.push({
            type: 'companion',
            message: `${plant.name} and ${companion.name} are companions — move them within 2-3 cells of each other.`,
            severity: 'info',
          })
        }
      } else {
        // Companion not in garden — suggest adding it
        suggestions.push({
          type: 'companion',
          message: `Consider adding ${companion.name} — it's a great companion for ${plant.name}.`,
          severity: 'info',
        })
      }
    }
  }

  return suggestions
}

/**
 * Auto-optimize a garden layout.
 * Steps:
 * 1. Determine sun direction from hemisphere
 * 2. Sort plants by height (tall → ground)
 * 3. Place tall plants on sun-blocking side
 * 4. Place shade-tolerant plants in shade zones
 * 5. Group companion plants together (within 2-3 cells)
 * 6. Separate antagonist plants (>4 cells apart)
 * 7. Apply spacing rules (with raised bed multiplier)
 * 8. Distribute plants evenly across the entire garden
 * 9. Score layout and suggest improvements
 */
export function autoOptimizeLayout(
  garden: Garden,
  plantsToPlace: Plant[],
  plantCatalog: Plant[],
): OptimizationResult {
  const cols = garden.width * CELLS_PER_FOOT
  const rows = garden.length * CELLS_PER_FOOT
  const hemisphere = garden.hemisphere ?? 'northern'
  const shadeZones = garden.shadeZones ?? []

  // Track occupied cells
  const occupied = new Set<string>()
  const layout: PlantPlacement[] = []

  const key = (x: number, y: number) => `${x},${y}`

  // Sort plants by height (tall first)
  const heightOrder: Record<string, number> = {
    tall: 0,
    vine: 1,
    medium: 2,
    short: 3,
    ground: 4,
  }
  const sorted = [...plantsToPlace].sort(
    (a, b) => (heightOrder[a.heightCategory] ?? 3) - (heightOrder[b.heightCategory] ?? 3),
  )

  // Determine tall-plant placement using sun-away projection.
  // This accounts for continuous rotation + hemisphere properly.
  const rotation = garden.rotationDegrees ?? 0
  const rotRad = (rotation * Math.PI) / 180

  // Compute how far a position is from the sun side.
  // NH: sun from south → tall plants go north (high northProjection).
  // SH: sun from north → tall plants go south (low northProjection).
  function sunAwayScore(gridX: number, gridY: number): number {
    const cx = gridX - cols / 2
    const cy = gridY - rows / 2
    const northProjection = -(cx * Math.sin(rotRad) + cy * Math.cos(rotRad))
    return hemisphere === 'northern' ? northProjection : -northProjection
  }

  // Even distribution: compute ideal grid positions for N plants across the garden.
  // Divide the garden into a grid with even spacing between plants.
  const totalPlants = sorted.length
  const aspectRatio = cols / rows
  const plantCols = Math.max(1, Math.ceil(Math.sqrt(totalPlants * aspectRatio)))
  const plantRows = Math.max(1, Math.ceil(totalPlants / plantCols))
  const colSpacing = cols / (plantCols + 1)
  const rowSpacing = rows / (plantRows + 1)

  // Generate evenly spaced target positions
  const targetPositions: { gridX: number; gridY: number }[] = []
  for (let r = 1; r <= plantRows; r++) {
    for (let c = 1; c <= plantCols; c++) {
      if (targetPositions.length >= totalPlants) break
      targetPositions.push({
        gridX: Math.round(c * colSpacing),
        gridY: Math.round(r * rowSpacing),
      })
    }
  }

  // Clamp targets to grid bounds
  for (const pos of targetPositions) {
    pos.gridX = Math.max(0, Math.min(cols - 1, pos.gridX))
    pos.gridY = Math.max(0, Math.min(rows - 1, pos.gridY))
  }

  // Sort target positions by sun-away score (descending) so tall plants get the sun-away spots
  targetPositions.sort((a, b) => sunAwayScore(b.gridX, b.gridY) - sunAwayScore(a.gridX, a.gridY))

  function hasEnoughSpace(gridX: number, gridY: number, minDist: number): boolean {
    for (const p of layout) {
      const dist = gridDistance(gridX, gridY, p.gridX, p.gridY)
      const existingPlant = plantCatalog.find((pl) => pl.id === p.plantId)
      if (!existingPlant) continue
      const existingMinDist = getSpacingInCells(existingPlant, garden.type) / 2
      if (dist < Math.max(minDist, existingMinDist)) {
        return false
      }
    }
    return true
  }

  function findNearestValid(
    targetX: number,
    targetY: number,
    minDist: number,
    preferShade: boolean,
  ): { gridX: number; gridY: number } | null {
    // If shade-loving and shade zones exist, try shade zones first
    if (preferShade && shadeZones.length > 0) {
      let bestShade: { gridX: number; gridY: number; dist: number } | null = null
      for (const zone of shadeZones) {
        for (let y = zone.y; y < zone.y + zone.height && y < rows; y++) {
          for (let x = zone.x; x < zone.x + zone.width && x < cols; x++) {
            if (!occupied.has(key(x, y)) && hasEnoughSpace(x, y, minDist)) {
              const d = gridDistance(targetX, targetY, x, y)
              if (!bestShade || d < bestShade.dist) {
                bestShade = { gridX: x, gridY: y, dist: d }
              }
            }
          }
        }
      }
      if (bestShade) return { gridX: bestShade.gridX, gridY: bestShade.gridY }
    }

    // Spiral search outward from target position
    if (!occupied.has(key(targetX, targetY)) && hasEnoughSpace(targetX, targetY, minDist)) {
      return { gridX: targetX, gridY: targetY }
    }

    for (let radius = 1; radius < Math.max(cols, rows); radius++) {
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          if (Math.abs(dx) !== radius && Math.abs(dy) !== radius) continue
          const x = targetX + dx
          const y = targetY + dy
          if (x >= 0 && x < cols && y >= 0 && y < rows) {
            if (!occupied.has(key(x, y)) && hasEnoughSpace(x, y, minDist)) {
              return { gridX: x, gridY: y }
            }
          }
        }
      }
    }

    return null
  }

  // Place each plant at or near its target position
  for (let i = 0; i < sorted.length; i++) {
    const plant = sorted[i]
    const spacingCells = getSpacingInCells(plant, garden.type)
    const minDist = spacingCells / 2
    const isShadeLoving = plant.sunNeeds === 'shade' || plant.sunNeeds === 'partial'
    const target = targetPositions[i] ?? {
      gridX: Math.floor(cols / 2),
      gridY: Math.floor(rows / 2),
    }

    const pos = findNearestValid(target.gridX, target.gridY, minDist, isShadeLoving)
    if (pos) {
      layout.push({ plantId: plant.id, gridX: pos.gridX, gridY: pos.gridY })
      occupied.add(key(pos.gridX, pos.gridY))
    }
  }

  // Score the layout
  const { score, suggestions } = scoreLayout(garden, layout, plantCatalog)

  return { layout, score, suggestions }
}

/** Score a garden layout and generate improvement suggestions */
export function scoreLayout(
  garden: Garden,
  layout: PlantPlacement[],
  plantCatalog: Plant[],
): { score: number; suggestions: OptimizationSuggestion[] } {
  const suggestions: OptimizationSuggestion[] = []
  let score = 100
  const shadeZones = garden.shadeZones ?? []
  const findPlant = (id: string) => plantCatalog.find((p) => p.id === id)

  // Check height placement
  const heightSuggestions = getHeightSuggestions(garden, layout, plantCatalog)
  for (const s of heightSuggestions) {
    if (s.severity === 'warning') {
      score -= 10
      suggestions.push({ ...s, type: 'height' })
    }
  }

  // Check spacing conflicts
  const conflicts = detectSpacingConflicts(layout, plantCatalog, garden.type)
  for (const conflict of conflicts) {
    score -= conflict.severity === 'error' ? 15 : 5
    const p1 = findPlant(conflict.plant1.plantId)
    const p2 = findPlant(conflict.plant2.plantId)
    suggestions.push({
      type: 'spacing',
      message: `${p1?.name ?? 'Plant'} and ${p2?.name ?? 'Plant'} are too close (${conflict.distance.toFixed(1)} cells, need ${conflict.requiredDistance.toFixed(1)}).`,
      severity: conflict.severity === 'error' ? 'warning' : 'info',
    })
  }

  // Check shade zone placement
  const shadeSuggestions = getShadeZoneSuggestions(layout, plantCatalog, shadeZones)
  for (const s of shadeSuggestions) {
    if (s.severity === 'warning') score -= 8
    suggestions.push(s)
  }

  // Check companion planting proximity
  for (let i = 0; i < layout.length; i++) {
    const p1 = findPlant(layout[i].plantId)
    if (!p1 || p1.companionPlants.length === 0) continue

    for (let j = 0; j < layout.length; j++) {
      if (i === j) continue
      const p2 = findPlant(layout[j].plantId)
      if (!p2) continue

      if (p1.companionPlants.includes(p2.id)) {
        const dist = gridDistance(
          layout[i].gridX,
          layout[i].gridY,
          layout[j].gridX,
          layout[j].gridY,
        )
        if (dist > 3) {
          score -= 5
          suggestions.push({
            type: 'companion',
            message: `${p1.name} and ${p2.name} are companions — place within 2-3 cells for best results.`,
            severity: 'info',
          })
        }
      }
    }
  }

  // Check antagonist separation
  for (let i = 0; i < layout.length; i++) {
    const p1 = findPlant(layout[i].plantId)
    if (!p1?.antagonistPlants?.length) continue

    for (let j = 0; j < layout.length; j++) {
      if (i === j) continue
      const p2 = findPlant(layout[j].plantId)
      if (!p2) continue

      if (p1.antagonistPlants.includes(p2.id)) {
        const dist = gridDistance(
          layout[i].gridX,
          layout[i].gridY,
          layout[j].gridX,
          layout[j].gridY,
        )
        if (dist < 4) {
          score -= 10
          suggestions.push({
            type: 'antagonist',
            message: `${p1.name} and ${p2.name} don't grow well together — keep >4 cells apart.`,
            severity: 'warning',
          })
        }
      }
    }
  }

  // Bonus for good placement
  if (suggestions.length === 0 && layout.length > 0) {
    suggestions.push({
      type: 'spacing',
      message: 'Layout looks great — all plants are well-positioned!',
      severity: 'success',
    })
  }

  return { score: Math.max(0, Math.min(100, score)), suggestions }
}
