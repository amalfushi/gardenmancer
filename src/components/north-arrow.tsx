'use client'

import { Group, Line, Text, Circle } from 'react-konva'

export interface NorthArrowProps {
  /** Garden rotation in degrees (0 = north at top, clockwise) */
  rotationDegrees: number
  /** X position on canvas */
  x?: number
  /** Y position on canvas */
  y?: number
  /** Size of the compass indicator */
  size?: number
}

export function NorthArrow({ rotationDegrees, x = 20, y = 20, size = 28 }: NorthArrowProps) {
  // The arrow shows where north is relative to the garden's rotation.
  // If the garden is rotated clockwise by rotationDegrees, north appears
  // counter-clockwise by that amount from the top of the canvas.
  const rotation = -rotationDegrees
  const half = size / 2
  const cx = x + half
  const cy = y + half

  return (
    <Group rotation={rotation} offsetX={cx} offsetY={cy} x={cx} y={cy}>
      {/* Background circle */}
      <Circle
        x={cx}
        y={cy}
        radius={half}
        fill="rgba(255,255,255,0.85)"
        stroke="#166534"
        strokeWidth={1.5}
      />

      {/* Arrow pointing up (north) — red half */}
      <Line
        points={[cx, cy - half + 5, cx - 5, cy, cx, cy - 3]}
        fill="#ef4444"
        closed
        stroke="#b91c1c"
        strokeWidth={0.5}
      />

      {/* Arrow pointing down (south) — gray half */}
      <Line
        points={[cx, cy + half - 5, cx + 5, cy, cx, cy + 3]}
        fill="#9ca3af"
        closed
        stroke="#6b7280"
        strokeWidth={0.5}
      />

      {/* "N" label */}
      <Text
        x={cx - 5}
        y={cy - half - 1}
        text="N"
        fontSize={9}
        fontStyle="bold"
        fill="#166534"
        align="center"
        width={10}
      />
    </Group>
  )
}
