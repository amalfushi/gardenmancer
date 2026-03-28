'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Stage, Layer, Rect, Line, Text, Circle, Group } from 'react-konva'
import type { KonvaEventObject } from 'konva/lib/Node'
import type { PlantPlacement, Plant, ShadeZone, GardenType } from '@/types'
import {
  getSpacingCircle,
  detectSpacingConflicts,
  CELL_SIZE,
  CELLS_PER_FOOT,
} from '@/lib/garden-utils'
import { NorthArrow } from '@/components/north-arrow'
import { PlantColorLegend } from '@/components/plant-color-legend'

export interface GardenCanvasProps {
  /** Garden width in feet */
  width: number
  /** Garden length in feet */
  length: number
  /** Placed plants */
  plants: PlantPlacement[]
  /** Plant catalog for rendering names/colors */
  plantCatalog?: Plant[]
  /** Currently selected plant to place */
  selectedPlant?: Plant | null
  /** Callback when a cell is clicked to place a plant */
  onPlacePlant?: (placement: PlantPlacement) => void
  /** Callback when a plant is drag-and-dropped to a new cell */
  onMovePlant?: (fromIndex: number, toGridX: number, toGridY: number) => void
  /** Whether to show spacing circles */
  showSpacing?: boolean
  /** Shade zones to render */
  shadeZones?: ShadeZone[]
  /** Garden type for spacing calculations */
  gardenType?: GardenType
  /** Garden rotation in degrees for north arrow compass (0 = north) */
  rotationDegrees?: number
  /** Whether the canvas is in fullscreen mode */
  fullscreen?: boolean
}

const PLANT_COLORS: Record<string, string> = {
  ground: '#22c55e',
  short: '#4ade80',
  medium: '#f59e0b',
  tall: '#ef4444',
  vine: '#8b5cf6',
}

const DEFAULT_PLANT_COLOR = '#228be6'

function getPlantColor(plant?: Plant): string {
  if (!plant) return DEFAULT_PLANT_COLOR
  return PLANT_COLORS[plant.heightCategory] ?? DEFAULT_PLANT_COLOR
}

/** Get appropriate label length based on available cell size at current scale */
function getPlantLabel(plant: Plant | undefined, isLargeViewport: boolean): string {
  if (!plant) return '?'
  if (isLargeViewport) {
    // Show longer label on large viewports (up to 8 chars)
    return plant.name.length <= 8 ? plant.name : plant.name.substring(0, 7) + '…'
  }
  return plant.name.substring(0, 3)
}

export function GardenCanvas({
  width,
  length,
  plants,
  plantCatalog = [],
  selectedPlant = null,
  onPlacePlant,
  onMovePlant,
  showSpacing = true,
  shadeZones = [],
  gardenType,
  rotationDegrees = 0,
  fullscreen = false,
}: GardenCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [isLargeViewport, setIsLargeViewport] = useState(false)

  const cols = width * CELLS_PER_FOOT
  const rows = length * CELLS_PER_FOOT
  const canvasWidth = cols * CELL_SIZE
  const canvasHeight = rows * CELL_SIZE
  const labelMargin = 28

  // Bounding box of the rotated garden content
  const rotRad = (rotationDegrees * Math.PI) / 180
  const cosA = Math.abs(Math.cos(rotRad))
  const sinA = Math.abs(Math.sin(rotRad))
  const contentWidth = canvasWidth + labelMargin
  const contentHeight = canvasHeight + labelMargin
  const boundingWidth = contentWidth * cosA + contentHeight * sinA
  const boundingHeight = contentWidth * sinA + contentHeight * cosA

  useEffect(() => {
    function handleResize() {
      if (!containerRef.current) return
      const containerWidth = containerRef.current.offsetWidth
      const totalWidth = boundingWidth + 8
      const large = containerWidth >= 800
      setIsLargeViewport(large)
      // On large viewports or fullscreen, allow upscaling beyond 1.0
      const maxScale = fullscreen ? 2.5 : large ? 1.5 : 1
      const newScale = Math.min(maxScale, containerWidth / totalWidth)
      setScale(newScale)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [boundingWidth, fullscreen])

  const findPlant = useCallback(
    (plantId: string) => plantCatalog.find((p) => p.id === plantId),
    [plantCatalog],
  )

  // Compute spacing circles and conflicts
  const spacingCircles = useMemo(() => {
    if (!showSpacing) return []
    return plants
      .map((p) => {
        const plant = findPlant(p.plantId)
        if (!plant) return null
        return getSpacingCircle(plant, p.gridX, p.gridY, gardenType)
      })
      .filter(Boolean) as ReturnType<typeof getSpacingCircle>[]
  }, [plants, findPlant, showSpacing, gardenType])

  const spacingConflicts = useMemo(() => {
    if (!showSpacing) return []
    return detectSpacingConflicts(plants, plantCatalog, gardenType)
  }, [plants, plantCatalog, showSpacing, gardenType])

  // Build a set of conflicting positions for quick lookup
  const conflictPositions = useMemo(() => {
    const set = new Set<string>()
    for (const c of spacingConflicts) {
      set.add(`${c.plant1.gridX},${c.plant1.gridY}`)
      set.add(`${c.plant2.gridX},${c.plant2.gridY}`)
    }
    return set
  }, [spacingConflicts])

  const handleStageClick = (e: KonvaEventObject<MouseEvent>) => {
    if (!selectedPlant || !onPlacePlant) return
    const stage = e.target.getStage()
    if (!stage) return
    const pos = stage.getPointerPosition()
    if (!pos) return

    // Translate pointer position into the rotated group's local coordinates
    const stageCX = (boundingWidth + 8) / 2
    const stageCY = (boundingHeight + 8) / 2
    const contentCX = labelMargin + canvasWidth / 2
    const contentCY = labelMargin + canvasHeight / 2
    const dx = pos.x / scale - stageCX
    const dy = pos.y / scale - stageCY
    const rad = (-rotationDegrees * Math.PI) / 180
    const localX = dx * Math.cos(rad) - dy * Math.sin(rad) + contentCX
    const localY = dx * Math.sin(rad) + dy * Math.cos(rad) + contentCY

    const gridX = Math.floor((localX - labelMargin) / CELL_SIZE)
    const gridY = Math.floor((localY - labelMargin) / CELL_SIZE)

    if (gridX >= 0 && gridX < cols && gridY >= 0 && gridY < rows) {
      onPlacePlant({
        plantId: selectedPlant.id,
        gridX,
        gridY,
      })
    }
  }

  // Handle drag-and-drop of placed plants
  const handlePlantDragEnd = useCallback(
    (e: KonvaEventObject<DragEvent>, plantIndex: number) => {
      if (!onMovePlant) return
      const node = e.target
      const stage = node.getStage()
      if (!stage) return

      // The drag happened inside the rotated group, so node position is in group-local coords
      const newX = node.x()
      const newY = node.y()

      // Convert center position back to grid coordinates
      const gridX = Math.round((newX - labelMargin - CELL_SIZE / 2) / CELL_SIZE)
      const gridY = Math.round((newY - labelMargin - CELL_SIZE / 2) / CELL_SIZE)

      // Clamp to grid bounds
      const clampedX = Math.max(0, Math.min(cols - 1, gridX))
      const clampedY = Math.max(0, Math.min(rows - 1, gridY))

      onMovePlant(plantIndex, clampedX, clampedY)
    },
    [onMovePlant, labelMargin, cols, rows],
  )

  // Center of the garden content for rotation pivot
  const contentCenterX = labelMargin + canvasWidth / 2
  const contentCenterY = labelMargin + canvasHeight / 2

  // Stage dimensions use the bounding box of the rotated content
  const stageWidth = (boundingWidth + 8) * scale
  const stageHeight = (boundingHeight + 8) * scale

  // Position the rotation pivot at the center of the bounding stage
  const stageCenterX = (boundingWidth + 8) / 2
  const stageCenterY = (boundingHeight + 8) / 2

  // Determine if dimension labels should flip (when garden is rotated ~180°)
  const normalizedRot = ((rotationDegrees % 360) + 360) % 360
  const shouldFlipLabels = normalizedRot > 90 && normalizedRot < 270

  // Label font size scales with viewport
  const labelFontSize = isLargeViewport ? 11 : 8
  const dimFontSize = isLargeViewport ? 11 : 10

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        position: 'relative',
        ...(fullscreen
          ? {
              position: 'fixed',
              inset: 0,
              zIndex: 1000,
              backgroundColor: '#fff',
              overflow: 'auto',
              padding: 16,
            }
          : {}),
      }}
      data-testid="garden-canvas"
      role="img"
      aria-label={`Garden layout canvas, ${width} by ${length} feet, rotated ${rotationDegrees}°, with ${plants.length} plant${plants.length !== 1 ? 's' : ''} placed`}
    >
      {/* Header row: legend left, north arrow right */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 8,
        }}
      >
        <PlantColorLegend />
        <NorthArrow size={32} />
      </div>

      <Stage
        width={stageWidth}
        height={stageHeight}
        scaleX={scale}
        scaleY={scale}
        onClick={handleStageClick}
        style={{ cursor: selectedPlant ? 'crosshair' : 'default' }}
      >
        <Layer>
          {/* Rotatable garden group — rotates grid, plants, and overlays together */}
          <Group
            rotation={rotationDegrees}
            offsetX={contentCenterX}
            offsetY={contentCenterY}
            x={stageCenterX}
            y={stageCenterY}
          >
            {/* Background */}
            <Rect
              x={labelMargin}
              y={labelMargin}
              width={canvasWidth}
              height={canvasHeight}
              fill="#f0fdf4"
              stroke="#166534"
              strokeWidth={2}
            />

            {/* Grid lines — vertical */}
            {Array.from({ length: cols + 1 }, (_, i) => (
              <Line
                key={`v-${i}`}
                points={[
                  labelMargin + i * CELL_SIZE,
                  labelMargin,
                  labelMargin + i * CELL_SIZE,
                  labelMargin + canvasHeight,
                ]}
                stroke={i % CELLS_PER_FOOT === 0 ? '#86efac' : '#dcfce7'}
                strokeWidth={i % CELLS_PER_FOOT === 0 ? 1 : 0.5}
              />
            ))}

            {/* Grid lines — horizontal */}
            {Array.from({ length: rows + 1 }, (_, i) => (
              <Line
                key={`h-${i}`}
                points={[
                  labelMargin,
                  labelMargin + i * CELL_SIZE,
                  labelMargin + canvasWidth,
                  labelMargin + i * CELL_SIZE,
                ]}
                stroke={i % CELLS_PER_FOOT === 0 ? '#86efac' : '#dcfce7'}
                strokeWidth={i % CELLS_PER_FOOT === 0 ? 1 : 0.5}
              />
            ))}

            {/* Column labels (feet) — counter-rotated to stay readable */}
            {Array.from({ length: width }, (_, i) => {
              const lx =
                labelMargin + i * CELLS_PER_FOOT * CELL_SIZE + (CELLS_PER_FOOT * CELL_SIZE) / 2
              const ly = shouldFlipLabels ? labelMargin + canvasHeight + 14 : 4 + dimFontSize / 2
              return (
                <Text
                  key={`cl-${i}`}
                  x={lx}
                  y={ly}
                  text={`${i + 1}ft`}
                  fontSize={dimFontSize}
                  fill="#166534"
                  align="center"
                  rotation={-rotationDegrees}
                  offsetX={0}
                  offsetY={0}
                />
              )
            })}

            {/* Row labels (feet) — counter-rotated to stay readable */}
            {Array.from({ length: length }, (_, i) => {
              const lx = shouldFlipLabels ? labelMargin + canvasWidth + 4 : 2
              const ly = labelMargin + i * CELLS_PER_FOOT * CELL_SIZE + CELL_SIZE / 2
              return (
                <Text
                  key={`rl-${i}`}
                  x={lx}
                  y={ly}
                  text={`${i + 1}ft`}
                  fontSize={dimFontSize}
                  fill="#166534"
                  rotation={-rotationDegrees}
                  offsetX={0}
                  offsetY={0}
                />
              )
            })}

            {/* Spacing footprint circles */}
            {spacingCircles.map((circle, idx) => {
              const hasConflict = conflictPositions.has(`${circle.gridX},${circle.gridY}`)
              return (
                <Circle
                  key={`spacing-${idx}`}
                  x={labelMargin + circle.centerX}
                  y={labelMargin + circle.centerY}
                  radius={circle.radiusPixels}
                  fill={hasConflict ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.08)'}
                  stroke={hasConflict ? '#ef4444' : '#86efac'}
                  strokeWidth={1}
                  dash={[4, 2]}
                />
              )
            })}

            {/* Shade zone overlays */}
            {shadeZones.map((zone) => (
              <Rect
                key={`shade-${zone.id}`}
                x={labelMargin + zone.x * CELL_SIZE}
                y={labelMargin + zone.y * CELL_SIZE}
                width={zone.width * CELL_SIZE}
                height={zone.height * CELL_SIZE}
                fill={zone.intensity === 'full' ? 'rgba(55,65,81,0.35)' : 'rgba(107,114,128,0.2)'}
                stroke="#6b7280"
                strokeWidth={1}
                dash={[3, 3]}
              />
            ))}

            {/* Placed plants — draggable when no plant is selected for placement */}
            {plants.map((placement, idx) => {
              const plant = findPlant(placement.plantId)
              const color = getPlantColor(plant)
              const cx = labelMargin + placement.gridX * CELL_SIZE + CELL_SIZE / 2
              const cy = labelMargin + placement.gridY * CELL_SIZE + CELL_SIZE / 2
              const label = getPlantLabel(plant, isLargeViewport)
              const hasConflict = conflictPositions.has(`${placement.gridX},${placement.gridY}`)
              const isDraggable = !selectedPlant && !!onMovePlant

              return (
                <Group
                  key={`plant-${idx}`}
                  x={cx}
                  y={cy}
                  draggable={isDraggable}
                  onDragEnd={(e) => handlePlantDragEnd(e, idx)}
                  dragBoundFunc={(pos) => pos}
                >
                  <Circle
                    x={0}
                    y={0}
                    radius={CELL_SIZE * 0.4}
                    fill={color}
                    stroke={hasConflict ? '#ef4444' : '#fff'}
                    strokeWidth={hasConflict ? 2 : 1}
                  />
                  {/* Counter-rotate label so it always reads upright */}
                  <Text
                    x={0}
                    y={CELL_SIZE * 0.45}
                    text={label}
                    fontSize={labelFontSize}
                    fill="#333"
                    align="center"
                    width={isLargeViewport ? CELL_SIZE * 3 : CELL_SIZE}
                    offsetX={isLargeViewport ? (CELL_SIZE * 3) / 2 : CELL_SIZE / 2}
                    rotation={-rotationDegrees}
                  />
                </Group>
              )
            })}
          </Group>
        </Layer>
      </Stage>
    </div>
  )
}
