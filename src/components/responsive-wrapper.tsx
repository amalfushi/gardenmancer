'use client'

import { Box } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'

export interface ResponsiveWrapperProps {
  children: React.ReactNode
  /** Additional padding on desktop */
  desktopPadding?: number
}

/** Wrapper that adjusts layout based on screen size */
export function ResponsiveWrapper({ children, desktopPadding = 0 }: ResponsiveWrapperProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  return (
    <Box
      px={isDesktop ? desktopPadding : 0}
      style={{ width: '100%', maxWidth: '100vw', overflow: 'hidden' }}
    >
      {children}
    </Box>
  )
}
