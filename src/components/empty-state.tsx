'use client'

import { Button, Stack, Text } from '@mantine/core'
import { Mascot } from './mascot'

export interface EmptyStateProps {
  icon?: string
  title: string
  message: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({
  icon = '📭',
  title,
  message,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <Stack align="center" gap="sm" py="xl">
      <Mascot size="sm" />
      <Text size="3rem" role="img" aria-label={icon}>
        {icon}
      </Text>
      <Text fw={600} size="lg">
        {title}
      </Text>
      <Text c="dimmed" size="sm" ta="center" maw={320}>
        {message}
      </Text>
      {actionLabel && onAction && (
        <Button variant="light" color="green" mt="xs" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Stack>
  )
}
