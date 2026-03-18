'use client'

import { useState, useRef } from 'react'
import { Paper, Button, Text, Image, Stack, Group, Box } from '@mantine/core'

export interface CameraCaptureProps {
  onCapture: (file: File) => void
  isLoading: boolean
}

export function CameraCapture({ onCapture, isLoading }: CameraCaptureProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setSelectedFile(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleScan = () => {
    if (selectedFile) {
      onCapture(selectedFile)
    }
  }

  const handleClear = () => {
    setPreview(null)
    setSelectedFile(null)
    if (cameraInputRef.current) {
      cameraInputRef.current.value = ''
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <Paper shadow="sm" p="lg" radius="md" withBorder>
      <Stack gap="md">
        <Text fw={600} size="lg">
          📷 Capture Seed Packet
        </Text>
        <Text size="sm" c="dimmed">
          Take a photo or upload an image of a seed packet to scan planting information.
        </Text>

        {/* Hidden camera input (mobile camera capture) */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          data-testid="camera-input"
          aria-label="Take a photo of seed packet"
        />

        {/* Hidden file input (gallery/disk upload) */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          data-testid="file-input"
          aria-label="Upload seed packet image from gallery"
        />

        {preview ? (
          <Box>
            <Image src={preview} alt="Seed packet preview" radius="md" mah={300} fit="contain" />
          </Box>
        ) : (
          <Paper
            withBorder
            p="xl"
            radius="md"
            style={{
              borderStyle: 'dashed',
              textAlign: 'center',
              cursor: 'pointer',
            }}
            onClick={() => fileInputRef.current?.click()}
            role="button"
            aria-label="Click to select an image"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                fileInputRef.current?.click()
              }
            }}
          >
            <Stack align="center" gap="xs">
              <Text size="xl">📸</Text>
              <Text size="sm" c="dimmed">
                Tap to take a photo or choose an image
              </Text>
            </Stack>
          </Paper>
        )}

        <Group grow>
          {preview ? (
            <>
              <Button variant="outline" onClick={handleClear} disabled={isLoading}>
                Clear
              </Button>
              <Button onClick={handleScan} loading={isLoading}>
                Scan Packet
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="light"
                color="green"
                onClick={() => cameraInputRef.current?.click()}
                disabled={isLoading}
                aria-label="Take a photo"
              >
                📷 Take Photo
              </Button>
              <Button
                variant="filled"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                aria-label="Upload an image"
              >
                📁 Upload Image
              </Button>
            </>
          )}
        </Group>
      </Stack>
    </Paper>
  )
}
