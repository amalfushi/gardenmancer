'use client'

import type { CSSProperties } from 'react'

export type MascotSize = 'sm' | 'md' | 'lg'

export interface MascotProps {
  /** Render size preset */
  size?: MascotSize
  /** Optional inline style overrides */
  style?: CSSProperties
  /** Accessible label */
  'aria-label'?: string
}

const sizeMap: Record<MascotSize, number> = {
  sm: 64,
  md: 128,
  lg: 220,
}

/**
 * A spooky dark-green wizard mascot — the Gardenmancer.
 * SVG-based, with a subtle eye-glow animation.
 */
export function Mascot({
  size = 'md',
  style,
  'aria-label': ariaLabel = 'Gardenmancer wizard mascot',
}: MascotProps) {
  const px = sizeMap[size]

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 260"
      width={px}
      height={px * 1.3}
      role="img"
      aria-label={ariaLabel}
      style={style}
    >
      <style>{`
        @keyframes glow {
          0%, 100% { opacity: .85; filter: drop-shadow(0 0 3px #4ade80); }
          50%       { opacity: 1;   filter: drop-shadow(0 0 8px #22c55e); }
        }
        .mascot-eye { animation: glow 2.5s ease-in-out infinite; }
        @keyframes sway {
          0%, 100% { transform: rotate(-2deg); }
          50%      { transform: rotate(2deg);  }
        }
        .mascot-plant { animation: sway 3s ease-in-out infinite; transform-origin: 140px 190px; }
      `}</style>

      <defs>
        {/* Mystical aura gradient */}
        <radialGradient id="aura" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#22c55e" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#14532d" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Aura behind wizard */}
      <circle cx="100" cy="140" r="100" fill="url(#aura)" />

      {/* Cloak / body */}
      <path
        d="M100 55 C55 80, 40 160, 50 240 L150 240 C160 160, 145 80, 100 55Z"
        fill="#166534"
        stroke="#14532d"
        strokeWidth="2"
      />

      {/* Hood */}
      <path
        d="M100 20 C60 20, 50 65, 55 95 Q78 110, 100 105 Q122 110, 145 95 C150 65, 140 20, 100 20Z"
        fill="#15803d"
        stroke="#14532d"
        strokeWidth="2"
      />

      {/* Inner hood shadow */}
      <ellipse cx="100" cy="80" rx="30" ry="22" fill="#0f3d21" />

      {/* Eyes */}
      <g className="mascot-eye">
        <ellipse cx="88" cy="78" rx="5" ry="6" fill="#4ade80" />
        <ellipse cx="112" cy="78" rx="5" ry="6" fill="#4ade80" />
        {/* Pupil highlights */}
        <circle cx="90" cy="76" r="1.5" fill="#bbf7d0" />
        <circle cx="114" cy="76" r="1.5" fill="#bbf7d0" />
      </g>

      {/* Arms reaching forward */}
      <path
        d="M70 150 Q55 165, 60 185 Q65 190, 72 185"
        fill="none"
        stroke="#166534"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M130 150 Q145 165, 140 185 Q135 190, 128 185"
        fill="none"
        stroke="#166534"
        strokeWidth="8"
        strokeLinecap="round"
      />

      {/* Hands (small circles) */}
      <circle cx="68" cy="185" r="6" fill="#15803d" />
      <circle cx="132" cy="185" r="6" fill="#15803d" />

      {/* Plant / seedling held by right hand */}
      <g className="mascot-plant">
        {/* Stem */}
        <line
          x1="140"
          y1="190"
          x2="140"
          y2="160"
          stroke="#22c55e"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Left leaf */}
        <ellipse cx="132" cy="168" rx="8" ry="5" fill="#4ade80" transform="rotate(-30 132 168)" />
        {/* Right leaf */}
        <ellipse cx="148" cy="172" rx="8" ry="5" fill="#4ade80" transform="rotate(25 148 172)" />
        {/* Top sprout */}
        <ellipse cx="140" cy="158" rx="5" ry="8" fill="#86efac" transform="rotate(5 140 158)" />
      </g>

      {/* Cloak hem detail */}
      <path
        d="M50 240 Q75 230, 100 240 Q125 230, 150 240"
        fill="none"
        stroke="#14532d"
        strokeWidth="2"
      />

      {/* Sparkle particles (mystical) */}
      <circle cx="55" cy="110" r="2" fill="#bbf7d0" opacity="0.6">
        <animate attributeName="opacity" values="0.6;0.1;0.6" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx="150" cy="100" r="1.5" fill="#bbf7d0" opacity="0.4">
        <animate attributeName="opacity" values="0.4;0.1;0.4" dur="3.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="80" cy="45" r="1.8" fill="#bbf7d0" opacity="0.5">
        <animate attributeName="opacity" values="0.5;0.1;0.5" dur="3s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}
