'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Container, Stack } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { GardenForm, type GardenFormValues } from '@/components/garden-form'

export default function NewGardenPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (values: GardenFormValues) => {
    setLoading(true)
    try {
      const res = await fetch('/api/gardens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to create garden')
      }

      const garden = await res.json()
      notifications.show({
        title: 'Garden created!',
        message: `${garden.name} has been created.`,
        color: 'green',
      })
      router.push(`/gardens/${garden.id}`)
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to create garden',
        color: 'red',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container size="xs" py="xl">
      <Stack gap="lg">
        <GardenForm title="🌱 Create New Garden" onSubmit={handleSubmit} loading={loading} />
      </Stack>
    </Container>
  )
}
