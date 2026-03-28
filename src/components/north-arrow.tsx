'use client'

export interface NorthArrowProps {
  /** Size of the compass indicator in px */
  size?: number
}

/** HTML-based north arrow that always points up — rendered outside the Konva canvas */
export function NorthArrow({ size = 36 }: NorthArrowProps) {
  const pad = 12 // top padding for "N" label
  const r = (size - 2) / 2
  const cx = size / 2
  const cy = pad + r
  const totalHeight = pad + size

  return (
    <svg
      width={size}
      height={totalHeight}
      viewBox={`0 0 ${size} ${totalHeight}`}
      aria-label="North indicator"
      role="img"
      style={{ display: 'block' }}
    >
      {/* "N" label — above the circle */}
      <text
        x={cx}
        y={2}
        textAnchor="middle"
        fontSize={11}
        fontWeight="bold"
        fill="#166534"
        dominantBaseline="hanging"
      >
        N
      </text>

      {/* Background circle */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="rgba(255,255,255,0.85)"
        stroke="#166534"
        strokeWidth={1.5}
      />

      {/* North arrow (red) — full symmetric triangle */}
      <polygon
        points={`${cx},${cy - r + 3} ${cx - 5},${cy} ${cx + 5},${cy}`}
        fill="#ef4444"
        stroke="#b91c1c"
        strokeWidth={0.5}
      />

      {/* South arrow (gray) — full symmetric triangle */}
      <polygon
        points={`${cx},${cy + r - 3} ${cx - 5},${cy} ${cx + 5},${cy}`}
        fill="#9ca3af"
        stroke="#6b7280"
        strokeWidth={0.5}
      />
    </svg>
  )
}
