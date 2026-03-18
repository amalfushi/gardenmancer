'use client'

import { useState } from 'react'
import { Container, Title, Text, Stack, Alert } from '@mantine/core'
import { CameraCapture } from '@/components/camera-capture'
import { ScanResultForm } from '@/components/scan-result-form'
import type { Plant } from '@/types'

export default function ScanPage() {
  const [error, setError] = useState<string | null>(null)
  const [scanning, setScanning] = useState(false)
  const [scannedPlant, setScannedPlant] = useState<Plant | null>(null)
  const [saved, setSaved] = useState(false)

  const handleCapture = async (file: File) => {
    setError(null)
    setScanning(true)
    try {
      const formData = new FormData()
      formData.append('image', file)

      const res = await fetch('/api/scan', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: 'Scan failed' }))
        throw new Error(data.error ?? 'Scan failed')
      }

      const plant: Plant = await res.json()
      setScannedPlant(plant)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to scan seed packet')
    } finally {
      setScanning(false)
    }
  }

  const handleSave = async (plant: Plant) => {
    setError(null)
    try {
      const res = await fetch('/api/plants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(plant),
      })

      if (!res.ok) {
        throw new Error('Failed to save plant')
      }

      setSaved(true)
      setScannedPlant(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save plant')
    }
  }

  const handleDiscard = () => {
    setScannedPlant(null)
  }

  return (
    <Container size="sm" py="xl">
      <Stack gap="md">
        <Title order={2}>📷 Scan Seed Packet</Title>
        <Text c="dimmed">
          Take a photo or upload an image of a seed packet to automatically extract planting
          information.
        </Text>

        {error && (
          <Alert color="red" variant="light" title="Error" radius="md">
            <Text size="sm">{error}</Text>
          </Alert>
        )}

        {saved && (
          <Alert color="green" variant="light" title="Plant Saved!" radius="md">
            <Text size="sm">Your scanned plant has been added to your collection.</Text>
          </Alert>
        )}

        {scannedPlant ? (
          <ScanResultForm plant={scannedPlant} onSave={handleSave} onDiscard={handleDiscard} />
        ) : (
          <CameraCapture onCapture={handleCapture} isLoading={scanning} />
        )}
      </Stack>
    </Container>
  )
}
