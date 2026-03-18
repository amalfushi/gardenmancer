'use client'

import { Stack, Paper, Group, Text, Badge, Title } from '@mantine/core'
import type { PlantingDates } from '@/lib/calendar'

export interface CalendarPlantEntry {
  plantName: string
  dates: PlantingDates
}

interface CalendarViewProps {
  plants: CalendarPlantEntry[]
  zone: number
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const EVENT_COLORS: Record<string, string> = {
  startIndoors: 'violet',
  transplant: 'green',
  directSow: 'orange',
}

const EVENT_LABELS: Record<string, string> = {
  startIndoors: '🏠 Start Indoors',
  transplant: '🌱 Transplant',
  directSow: '🌰 Direct Sow',
}

function getMonthIndex(date: Date): number {
  return date.getMonth()
}

function getEventsForMonth(
  plants: CalendarPlantEntry[],
  monthIndex: number,
): { plantName: string; event: string; color: string }[] {
  const events: { plantName: string; event: string; color: string }[] = []

  for (const plant of plants) {
    const entries: [string, Date | undefined][] = [
      ['startIndoors', plant.dates.startIndoors],
      ['transplant', plant.dates.transplant],
      ['directSow', plant.dates.directSow],
    ]

    for (const [key, date] of entries) {
      if (date && getMonthIndex(date) === monthIndex) {
        events.push({
          plantName: plant.plantName,
          event: EVENT_LABELS[key],
          color: EVENT_COLORS[key],
        })
      }
    }
  }

  return events
}

export function CalendarView({ plants, zone }: CalendarViewProps) {
  if (plants.length === 0) {
    return (
      <Paper p="lg" withBorder radius="md">
        <Text c="dimmed" ta="center">
          No plants to display. Add plants to your garden to see the calendar.
        </Text>
      </Paper>
    )
  }

  return (
    <Stack gap="xs">
      <Title order={4}>Zone {zone} Planting Calendar</Title>
      {MONTHS.map((month, monthIndex) => {
        const events = getEventsForMonth(plants, monthIndex)
        return (
          <Paper key={month} p="sm" withBorder radius="sm">
            <Group gap="sm" wrap="wrap" align="flex-start">
              <Text fw={700} w={40} size="sm">
                {month}
              </Text>
              {events.length > 0 ? (
                <Group gap={4} wrap="wrap" style={{ flex: 1 }}>
                  {events.map((ev, i) => (
                    <Badge
                      key={`${ev.plantName}-${ev.event}-${i}`}
                      color={ev.color}
                      size="sm"
                      variant="light"
                    >
                      {ev.event}: {ev.plantName}
                    </Badge>
                  ))}
                </Group>
              ) : (
                <Text size="xs" c="dimmed">
                  —
                </Text>
              )}
            </Group>
          </Paper>
        )
      })}
    </Stack>
  )
}
