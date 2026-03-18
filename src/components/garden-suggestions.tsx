'use client'

import { Alert, Stack, Text, Title } from '@mantine/core'
import type { Suggestion } from '@/lib/garden-utils'

export interface GardenSuggestionsProps {
  suggestions: Suggestion[]
}

const severityConfig: Record<string, { color: string; icon: string }> = {
  info: { color: 'blue', icon: 'ℹ️' },
  warning: { color: 'yellow', icon: '⚠️' },
  success: { color: 'green', icon: '✅' },
}

const typeLabels: Record<string, string> = {
  height: 'Height Layout',
  sun: 'Sun Exposure',
  spacing: 'Plant Spacing',
  companion: 'Companion Planting',
  antagonist: 'Plant Antagonism',
  shade: 'Shade Zones',
  density: 'Planting Density',
}

export function GardenSuggestions({ suggestions }: GardenSuggestionsProps) {
  if (suggestions.length === 0) {
    return (
      <Alert color="green" variant="light" title="All Good!">
        <Text size="sm">No layout issues detected. Your garden looks great!</Text>
      </Alert>
    )
  }

  return (
    <Stack gap="xs">
      <Title order={3}>
        <span role="img" aria-hidden="true">
          💡
        </span>{' '}
        Layout Suggestions
      </Title>
      {suggestions.map((suggestion, idx) => {
        const config = severityConfig[suggestion.severity] ?? severityConfig.info
        return (
          <Alert
            key={idx}
            color={config.color}
            variant="light"
            title={`${config.icon} ${typeLabels[suggestion.type] ?? suggestion.type}`}
          >
            <Text size="sm">{suggestion.message}</Text>
          </Alert>
        )
      })}
    </Stack>
  )
}
