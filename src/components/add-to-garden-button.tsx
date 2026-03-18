'use client'

import { useState, useEffect } from 'react'
import { Button, Modal, Select, Stack, Text } from '@mantine/core'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import type { Garden } from '@/types'

interface AddToGardenButtonProps {
  plantId: string
  zone?: number
  onAdded?: () => void
}

export function AddToGardenButton({ plantId, zone, onAdded }: AddToGardenButtonProps) {
  const [opened, { open, close }] = useDisclosure(false)
  const [gardens, setGardens] = useState<Garden[]>([])
  const [selectedGarden, setSelectedGarden] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const isMobile = useMediaQuery('(max-width: 768px)')

  useEffect(() => {
    if (opened) {
      fetch('/api/gardens')
        .then((res) => res.json())
        .then((data) => setGardens(Array.isArray(data) ? data : []))
        .catch(() => setGardens([]))
    }
  }, [opened])

  const handleAdd = async () => {
    if (!selectedGarden) return
    setLoading(true)
    try {
      await fetch('/api/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plantId,
          gardenId: selectedGarden,
          zone: zone ?? 6,
        }),
      })
      onAdded?.()
      close()
    } finally {
      setLoading(false)
      setSelectedGarden(null)
    }
  }

  const gardenOptions = gardens.map((g) => ({ value: g.id, label: g.name }))

  return (
    <>
      <Button onClick={open} color="green" variant="filled" fullWidth={!!isMobile}>
        <span role="img" aria-hidden="true">
          🌱
        </span>{' '}
        Add to Garden
      </Button>

      <Modal opened={opened} onClose={close} title="Add to Garden" centered fullScreen={!!isMobile}>
        <Stack gap="md">
          {gardenOptions.length === 0 ? (
            <Text c="dimmed" size="sm">
              No gardens found. Create a garden first.
            </Text>
          ) : (
            <>
              <Select
                label="Select Garden"
                placeholder="Choose a garden"
                data={gardenOptions}
                value={selectedGarden}
                onChange={setSelectedGarden}
              />
              <Button
                onClick={handleAdd}
                loading={loading}
                disabled={!selectedGarden}
                color="green"
                fullWidth
              >
                Add Plant
              </Button>
            </>
          )}
        </Stack>
      </Modal>
    </>
  )
}
