'use client'

import { Select } from '@mantine/core'
import { SUPPORTED_ZONES } from '@/lib/calendar'

interface ZoneSelectorProps {
  value: string | null
  onChange: (value: string | null) => void
}

const zoneOptions = SUPPORTED_ZONES.map((z) => ({
  value: String(z),
  label: `Zone ${z}`,
}))

export function ZoneSelector({ value, onChange }: ZoneSelectorProps) {
  return (
    <Select
      label="USDA Hardiness Zone"
      placeholder="Select your zone"
      data={zoneOptions}
      value={value}
      onChange={onChange}
      clearable
      searchable
      aria-label="USDA Hardiness Zone"
      styles={{ root: { maxWidth: 240 } }}
    />
  )
}
