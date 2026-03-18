'use client'

import { Button, NumberInput, Select, Slider, Stack, Text, TextInput, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import type { Garden } from '@/types'

export interface GardenFormValues {
  name: string
  type: string
  width: number
  length: number
  rotationDegrees: number
  hemisphere: string
}

export interface GardenFormProps {
  initialValues?: Partial<GardenFormValues>
  onSubmit: (values: GardenFormValues) => void
  loading?: boolean
  title?: string
}

const gardenTypes = [
  { value: 'raised', label: 'Raised Bed' },
  { value: 'flat', label: 'Flat Garden' },
  { value: 'terraced', label: 'Terraced' },
  { value: 'container', label: 'Container' },
]

const ROTATION_MARKS = [
  { value: 0, label: 'N' },
  { value: 90, label: 'E' },
  { value: 180, label: 'S' },
  { value: 270, label: 'W' },
]

const hemispheres = [
  { value: 'northern', label: 'Northern Hemisphere' },
  { value: 'southern', label: 'Southern Hemisphere' },
]

export function GardenForm({ initialValues, onSubmit, loading, title }: GardenFormProps) {
  const form = useForm<GardenFormValues>({
    initialValues: {
      name: initialValues?.name ?? '',
      type: initialValues?.type ?? 'raised',
      width: initialValues?.width ?? 4,
      length: initialValues?.length ?? 8,
      rotationDegrees: initialValues?.rotationDegrees ?? 0,
      hemisphere: initialValues?.hemisphere ?? 'northern',
    },
    validate: {
      name: (v) => (v.trim().length < 1 ? 'Name is required' : null),
      type: (v) => (v ? null : 'Type is required'),
      width: (v) => (v < 1 ? 'Width must be at least 1 foot' : null),
      length: (v) => (v < 1 ? 'Length must be at least 1 foot' : null),
      rotationDegrees: (v) => (v < 0 || v > 360 ? 'Rotation must be between 0° and 360°' : null),
      hemisphere: (v) => (v ? null : 'Hemisphere is required'),
    },
  })

  return (
    <form onSubmit={form.onSubmit(onSubmit)} aria-label="Garden form">
      <Stack gap="md">
        {title && <Title order={3}>{title}</Title>}

        <TextInput
          label="Garden Name"
          placeholder="My Raised Bed"
          required
          {...form.getInputProps('name')}
        />

        <Select label="Garden Type" data={gardenTypes} required {...form.getInputProps('type')} />

        <NumberInput
          label="Width (feet)"
          min={1}
          max={100}
          required
          {...form.getInputProps('width')}
        />

        <NumberInput
          label="Length (feet)"
          min={1}
          max={100}
          required
          {...form.getInputProps('length')}
        />

        <div>
          <Text size="sm" fw={500} mb={4}>
            Rotation ({form.values.rotationDegrees}°)
          </Text>
          <Text size="xs" c="dimmed" mb="xs">
            Which direction does the top of the garden face? 0° = North
          </Text>
          <Slider
            min={0}
            max={360}
            step={1}
            marks={ROTATION_MARKS}
            label={(v) => `${v}°`}
            aria-label="Rotation degrees"
            {...form.getInputProps('rotationDegrees')}
          />
        </div>

        <Select
          label="Hemisphere"
          description="Affects sun path and planting seasons"
          data={hemispheres}
          required
          aria-label="Hemisphere"
          {...form.getInputProps('hemisphere')}
        />

        <Button type="submit" loading={loading} fullWidth mt="sm">
          {initialValues?.name ? 'Update Garden' : 'Create Garden'}
        </Button>
      </Stack>
    </form>
  )
}

/** Helper to convert a Garden to GardenFormValues */
export function gardenToFormValues(garden: Garden): GardenFormValues {
  return {
    name: garden.name,
    type: garden.type,
    width: garden.width,
    length: garden.length,
    rotationDegrees: garden.rotationDegrees,
    hemisphere: garden.hemisphere ?? 'northern',
  }
}
