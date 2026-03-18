import type { ReactNode } from 'react'

interface ExampleButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
}

export function ExampleButton({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
}: ExampleButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: size === 'sm' ? '4px 8px' : size === 'lg' ? '12px 24px' : '8px 16px',
        backgroundColor: variant === 'primary' ? '#228be6' : '#868e96',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: size === 'sm' ? '12px' : size === 'lg' ? '18px' : '14px',
      }}
    >
      {children}
    </button>
  )
}
