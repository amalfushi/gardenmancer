'use client'

import { Alert, Button, Group, Stack, Text, Title, Badge } from '@mantine/core'
import { useMemo, useState } from 'react'
import type { OptimizationResult, OptimizationSuggestion } from '@/types'

export interface AutoOptimizeButtonProps {
  onOptimize: () => OptimizationResult | null
  onApply: (result: OptimizationResult) => void
}

const severityConfig: Record<string, { color: string; icon: string }> = {
  info: { color: 'blue', icon: 'ℹ️' },
  warning: { color: 'yellow', icon: '⚠️' },
  success: { color: 'green', icon: '✅' },
}

/** Deduplicate suggestions: one summary per type+plant combination, merge cells/need info */
function deduplicateSuggestions(suggestions: OptimizationSuggestion[]): OptimizationSuggestion[] {
  const seen = new Map<string, OptimizationSuggestion>()

  for (const s of suggestions) {
    // Build a dedup key from type + sorted plant names mentioned in the message
    const plantNames = s.message.match(/^([A-Z][a-z]+(?:\s[A-Z][a-z]+)*)/)?.[1] ?? ''
    const key = `${s.type}:${plantNames}`

    if (!seen.has(key)) {
      seen.set(key, { ...s })
    } else {
      // Merge: combine spacing details (e.g., "X cells, need Y") into existing entry
      const existing = seen.get(key)!
      if (
        s.type === 'spacing' &&
        existing.type === 'spacing' &&
        !existing.message.includes(' | ')
      ) {
        // Already have one spacing entry for these plants — skip duplicate
      }
      // Keep the higher severity
      const severityRank: Record<string, number> = { success: 0, info: 1, warning: 2 }
      if ((severityRank[s.severity] ?? 0) > (severityRank[existing.severity] ?? 0)) {
        existing.severity = s.severity
      }
    }
  }

  return Array.from(seen.values())
}

export function AutoOptimizeButton({ onOptimize, onApply }: AutoOptimizeButtonProps) {
  const [result, setResult] = useState<OptimizationResult | null>(null)
  const [showResults, setShowResults] = useState(false)

  const handleOptimize = () => {
    const optimized = onOptimize()
    if (optimized) {
      setResult(optimized)
      setShowResults(true)
    }
  }

  const handleApply = () => {
    if (result) {
      onApply(result)
      setShowResults(false)
    }
  }

  const handleDismiss = () => {
    setShowResults(false)
    setResult(null)
  }

  const dedupedSuggestions = useMemo(
    () => (result ? deduplicateSuggestions(result.suggestions) : []),
    [result],
  )

  return (
    <Stack gap="sm">
      <Button
        onClick={handleOptimize}
        variant="gradient"
        gradient={{ from: 'green', to: 'teal' }}
        fullWidth
        aria-label="Auto-optimize layout"
      >
        🤖 Auto-Optimize Layout
      </Button>

      {showResults && result && (
        <Stack gap="xs" aria-label="Optimization results">
          <Group justify="space-between" align="center">
            <Title order={4}>Optimization Results</Title>
            <Badge
              color={result.score >= 80 ? 'green' : result.score >= 50 ? 'yellow' : 'red'}
              size="lg"
              variant="filled"
              aria-label={`Layout score: ${result.score}`}
            >
              Score: {result.score}/100
            </Badge>
          </Group>

          <Group gap="xs">
            <Button
              size="xs"
              color="green"
              onClick={handleApply}
              aria-label="Apply optimized layout"
            >
              Apply Layout
            </Button>
            <Button
              size="xs"
              variant="subtle"
              color="gray"
              onClick={handleDismiss}
              aria-label="Dismiss optimization results"
            >
              Dismiss
            </Button>
          </Group>

          {dedupedSuggestions.map((suggestion, idx) => {
            const config = severityConfig[suggestion.severity] ?? severityConfig.info
            return (
              <Alert key={idx} color={config.color} variant="light" p="xs">
                <Text size="xs">
                  {config.icon} {suggestion.message}
                </Text>
              </Alert>
            )
          })}
        </Stack>
      )}
    </Stack>
  )
}
