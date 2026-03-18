'use client'

import {
  Paper,
  TextInput,
  NumberInput,
  Select,
  TagsInput,
  MultiSelect,
  Button,
  Group,
  Stack,
  Title,
  Text,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import type { Plant } from '@/types'

export interface ScanResultFormProps {
  plant: Plant
  onSave: (plant: Plant) => void
  onDiscard: () => void
}

const SUN_OPTIONS = [
  { value: 'full', label: 'Full Sun' },
  { value: 'partial', label: 'Partial Shade' },
  { value: 'shade', label: 'Shade' },
]

const HEIGHT_OPTIONS = [
  { value: 'ground', label: 'Ground Cover' },
  { value: 'short', label: 'Short' },
  { value: 'medium', label: 'Medium' },
  { value: 'tall', label: 'Tall' },
  { value: 'vine', label: 'Vine' },
]

const WATER_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
]

const ZONE_OPTIONS = Array.from({ length: 13 }, (_, i) => ({
  value: String(i + 1),
  label: `Zone ${i + 1}`,
}))

export function ScanResultForm({ plant, onSave, onDiscard }: ScanResultFormProps) {
  const form = useForm({
    initialValues: {
      name: plant.name,
      species: plant.species ?? '',
      spacing: plant.spacing,
      sunNeeds: plant.sunNeeds,
      daysToMaturity: plant.daysToMaturity,
      heightCategory: plant.heightCategory,
      waterNeeds: plant.waterNeeds,
      companionPlants: plant.companionPlants,
      zones: plant.zones.map(String),
    },
  })

  const handleSubmit = form.onSubmit((values) => {
    const updatedPlant: Plant = {
      ...plant,
      name: values.name,
      species: values.species || undefined,
      spacing: values.spacing,
      sunNeeds: values.sunNeeds as Plant['sunNeeds'],
      daysToMaturity: values.daysToMaturity,
      heightCategory: values.heightCategory as Plant['heightCategory'],
      waterNeeds: values.waterNeeds as Plant['waterNeeds'],
      companionPlants: values.companionPlants,
      zones: values.zones.map(Number),
    }
    onSave(updatedPlant)
  })

  return (
    <Paper shadow="sm" p="lg" radius="md" withBorder>
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <Title order={3}>
            <span role="img" aria-hidden="true">
              🌱
            </span>{' '}
            Scan Results
          </Title>
          <Text size="sm" c="dimmed">
            Review and edit the scanned plant information before saving.
          </Text>

          <TextInput label="Plant Name" required {...form.getInputProps('name')} />

          <TextInput
            label="Species"
            placeholder="e.g., Solanum lycopersicum"
            {...form.getInputProps('species')}
          />

          <Group grow>
            <NumberInput
              label="Spacing (inches)"
              min={1}
              required
              {...form.getInputProps('spacing')}
            />
            <NumberInput
              label="Days to Maturity"
              min={1}
              required
              {...form.getInputProps('daysToMaturity')}
            />
          </Group>

          <Group grow>
            <Select
              label="Sun Needs"
              data={SUN_OPTIONS}
              required
              {...form.getInputProps('sunNeeds')}
            />
            <Select
              label="Height Category"
              data={HEIGHT_OPTIONS}
              required
              {...form.getInputProps('heightCategory')}
            />
          </Group>

          <Select
            label="Water Needs"
            data={WATER_OPTIONS}
            required
            {...form.getInputProps('waterNeeds')}
          />

          <TagsInput
            label="Companion Plants"
            placeholder="Add companion plants"
            {...form.getInputProps('companionPlants')}
          />

          <MultiSelect
            label="Growing Zones"
            data={ZONE_OPTIONS}
            placeholder="Select zones"
            {...form.getInputProps('zones')}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="outline" color="red" onClick={onDiscard}>
              Discard
            </Button>
            <Button type="submit">Confirm &amp; Save</Button>
          </Group>
        </Stack>
      </form>
    </Paper>
  )
}
