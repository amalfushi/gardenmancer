'use client'

import { Alert, Button, Stack, Text } from '@mantine/core'

export interface ErrorStateProps {
  title?: string
  message: string
  onRetry?: () => void
}

export function ErrorState({ title = 'Something went wrong', message, onRetry }: ErrorStateProps) {
  return (
    <div role="alert">
      <Alert color="red" variant="light" title={title} radius="md">
        <Stack gap="sm">
          <Text size="sm">{message}</Text>
          {onRetry && (
            <Button
              variant="light"
              color="red"
              size="xs"
              onClick={onRetry}
              style={{ alignSelf: 'flex-start' }}
            >
              Try Again
            </Button>
          )}
        </Stack>
      </Alert>
    </div>
  )
}
