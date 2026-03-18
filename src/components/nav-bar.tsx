'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Group, UnstyledButton, Text, Stack } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'

const navItems = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/scan', label: 'Scan', icon: '📷' },
  { href: '/plants', label: 'Plants', icon: '🌿' },
  { href: '/calendar', label: 'Calendar', icon: '📅' },
  { href: '/gardens', label: 'Gardens', icon: '🏡' },
]

export function NavBar() {
  const pathname = usePathname()
  const isMobile = useMediaQuery('(max-width: 480px)')

  return (
    <Group
      justify="space-around"
      py="xs"
      px="md"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        borderTop: '1px solid var(--mantine-color-gray-3)',
        backgroundColor: 'var(--mantine-color-body)',
        zIndex: 100,
      }}
    >
      {navItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <UnstyledButton key={item.href} component={Link} href={item.href} aria-label={item.label}>
            <Stack align="center" gap={2}>
              <Text size={isMobile ? 'lg' : 'xl'}>{item.icon}</Text>
              {!isMobile && (
                <Text size="xs" fw={isActive ? 700 : 400} c={isActive ? 'green' : 'dimmed'}>
                  {item.label}
                </Text>
              )}
            </Stack>
          </UnstyledButton>
        )
      })}
    </Group>
  )
}
