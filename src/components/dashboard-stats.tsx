'use client'

import { SimpleGrid, Paper, Text, ThemeIcon, Stack, Group, Skeleton } from '@mantine/core'

export interface DashboardStatsProps {
  totalPlants: number
  totalGardens: number
  nextPlantingDate: string | null
  loading?: boolean
}

interface StatCardProps {
  icon: string
  label: string
  value: string
  color: string
}

function StatCard({ icon, label, value, color }: StatCardProps) {
  return (
    <Paper shadow="xs" p="md" radius="md" withBorder role="group" aria-label={`${label}: ${value}`}>
      <Group gap="sm">
        <ThemeIcon size="lg" radius="md" variant="light" color={color} aria-hidden="true">
          <Text size="lg">{icon}</Text>
        </ThemeIcon>
        <Stack gap={2}>
          <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
            {label}
          </Text>
          <Text fw={700} size="lg">
            {value}
          </Text>
        </Stack>
      </Group>
    </Paper>
  )
}

export function DashboardStats({
  totalPlants,
  totalGardens,
  nextPlantingDate,
  loading,
}: DashboardStatsProps) {
  if (loading) {
    return (
      <SimpleGrid
        cols={{ base: 1, xs: 3 }}
        spacing="md"
        aria-busy="true"
        aria-label="Loading dashboard statistics"
      >
        {[1, 2, 3].map((i) => (
          <Paper key={i} shadow="xs" p="md" radius="md" withBorder>
            <Group gap="sm">
              <Skeleton circle height={40} width={40} />
              <Stack gap={4}>
                <Skeleton height={12} width={60} />
                <Skeleton height={20} width={40} />
              </Stack>
            </Group>
          </Paper>
        ))}
      </SimpleGrid>
    )
  }

  return (
    <SimpleGrid cols={{ base: 1, xs: 3 }} spacing="md">
      <StatCard
        icon="🌿"
        label="Plants"
        value={totalPlants === 0 ? 'None yet' : String(totalPlants)}
        color="green"
      />
      <StatCard
        icon="🏡"
        label="Gardens"
        value={totalGardens === 0 ? 'None yet' : String(totalGardens)}
        color="blue"
      />
      <StatCard
        icon="📅"
        label="Next Planting"
        value={nextPlantingDate ?? 'No dates'}
        color="orange"
      />
    </SimpleGrid>
  )
}
