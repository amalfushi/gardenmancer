'use client'

export interface NorthArrowProps {
  /** Size of the compass indicator in px */
  size?: number
}

/** HTML-based north arrow that always points up — rendered outside the Konva canvas */
export function NorthArrow({ size = 32 }: NorthArrowProps) {
  const half = size / 2

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-label="North indicator"
      role="img"
      style={{ display: 'block' }}
    >
      {/* Background circle */}
      <circle
        cx={half}
        cy={half}
        r={half - 1}
        fill="rgba(255,255,255,0.85)"
        stroke="#166534"
        strokeWidth={1.5}
      />
      {/* North arrow (red) */}
      <polygon
        points={`${half},${4} ${half - 5},${half} ${half},${half - 3}`}
        fill="#ef4444"
        stroke="#b91c1c"
        strokeWidth={0.5}
      />
      {/* South arrow (gray) */}
      <polygon
        points={`${half},${size - 4} ${half + 5},${half} ${half},${half + 3}`}
        fill="#9ca3af"
        stroke="#6b7280"
        strokeWidth={0.5}
      />
      {/* "N" label */}
      <text
        x={half}
        y={3}
        textAnchor="middle"
        fontSize={9}
        fontWeight="bold"
        fill="#166534"
        dominantBaseline="hanging"
      >
        N
      </text>
    </svg>
  )
}
