'use client'

import { Group, Switch, Badge } from '@mantine/core'

export interface CalendarFilterProps {
  /** Whether to show only plants from user's gardens */
  showMyPlantsOnly: boolean
  /** Callback when filter changes */
  onToggle: (value: boolean) => void
  /** Number of plants shown after filter */
  filteredCount: number
  /** Total number of plants */
  totalCount: number
}

export function CalendarFilter({
  showMyPlantsOnly,
  onToggle,
  filteredCount,
  totalCount,
}: CalendarFilterProps) {
  return (
    <Group gap="sm" wrap="wrap" role="group" aria-label="Calendar plant filter">
      <Switch
        label="My Garden Plants Only"
        checked={showMyPlantsOnly}
        onChange={(event) => onToggle(event.currentTarget.checked)}
        color="green"
        aria-label={
          showMyPlantsOnly
            ? 'Showing only plants from your gardens. Toggle to show all plants.'
            : 'Showing all plants. Toggle to show only plants from your gardens.'
        }
      />
      <Badge
        color={showMyPlantsOnly ? 'green' : 'gray'}
        variant="light"
        size="md"
        aria-live="polite"
      >
        {showMyPlantsOnly
          ? `Showing: ${filteredCount} Garden Plant${filteredCount !== 1 ? 's' : ''}`
          : `Showing: All ${totalCount} Plant${totalCount !== 1 ? 's' : ''}`}
      </Badge>
    </Group>
  )
}
