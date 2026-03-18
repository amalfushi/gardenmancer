'use client'

import { Center, Loader, Skeleton, Stack } from '@mantine/core'
import { Mascot } from './mascot'

export interface LoadingStateProps {
  variant?: 'page' | 'card' | 'inline'
}

export function LoadingState({ variant = 'page' }: LoadingStateProps) {
  if (variant === 'inline') {
    return (
      <Center py="sm" role="status" aria-label="Loading">
        <Loader color="green" size="sm" />
      </Center>
    )
  }

  if (variant === 'card') {
    return (
      <Stack gap="sm" p="md" role="status" aria-label="Loading content" aria-busy="true">
        <Skeleton height={20} width="70%" />
        <Skeleton height={14} width="40%" />
        <Skeleton height={14} width="90%" />
        <Skeleton height={32} width="50%" mt="xs" />
      </Stack>
    )
  }

  // page variant
  return (
    <Center py="xl" role="status" aria-label="Loading page">
      <Stack align="center" gap="md">
        <Mascot size="sm" aria-label="Loading" />
        <Loader color="green" size="lg" />
        <Skeleton height={20} width={200} />
        <Skeleton height={14} width={300} />
      </Stack>
    </Center>
  )
}
