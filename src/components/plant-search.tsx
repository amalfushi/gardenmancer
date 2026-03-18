'use client'

import { TextInput, Select, Group } from '@mantine/core'

interface PlantSearchProps {
  search: string
  onSearchChange: (value: string) => void
  sunFilter: string | null
  onSunFilterChange: (value: string | null) => void
}

const sunOptions = [
  { value: 'full', label: '☀️ Full Sun' },
  { value: 'partial', label: '⛅ Partial Shade' },
  { value: 'shade', label: '🌑 Shade' },
]

export function PlantSearch({
  search,
  onSearchChange,
  sunFilter,
  onSunFilterChange,
}: PlantSearchProps) {
  return (
    <Group grow gap="sm" align="flex-end">
      <TextInput
        placeholder="Search plants..."
        value={search}
        onChange={(e) => onSearchChange(e.currentTarget.value)}
        aria-label="Search plants"
      />
      <Select
        placeholder="Sun needs"
        data={sunOptions}
        value={sunFilter}
        onChange={onSunFilterChange}
        clearable
        aria-label="Filter by sun needs"
      />
    </Group>
  )
}
