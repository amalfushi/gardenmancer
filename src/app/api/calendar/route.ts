import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { z } from 'zod/v4'
import { calendarStore } from '@/lib/stores/calendar-store'

const calendarEntrySchema = z.object({
  plantId: z.string().min(1, 'Plant ID is required'),
  gardenId: z.string().optional(),
  zone: z.number().int().min(3).max(10),
  startIndoors: z.string().optional(),
  transplantDate: z.string().optional(),
  harvestDate: z.string().optional(),
})

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const zone = searchParams.get('zone')

  let entries = await calendarStore.getAll()

  if (zone) {
    const zoneNum = parseInt(zone)
    if (!isNaN(zoneNum)) {
      entries = entries.filter((e) => e.zone === zoneNum)
    }
  }

  return NextResponse.json(entries)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = calendarEntrySchema.parse(body)
    const entry = await calendarStore.add(parsed)
    return NextResponse.json(entry, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', issues: error.issues },
        { status: 400 },
      )
    }
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
