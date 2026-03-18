import { NextResponse } from 'next/server'
import { z } from 'zod/v4'
import { gardenStore } from '@/lib/stores/garden-store'
import { migrateGarden } from '@/types'

const createGardenSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  type: z.enum(['raised', 'flat', 'terraced', 'container']),
  width: z.number().min(1, 'Width must be at least 1 foot').max(100),
  length: z.number().min(1, 'Length must be at least 1 foot').max(100),
  rotationDegrees: z.number().min(0).max(360).default(0),
  hemisphere: z.enum(['northern', 'southern']).optional().default('northern'),
})

export async function GET() {
  const gardens = await gardenStore.getAll()
  return NextResponse.json(
    gardens.map((g) => migrateGarden(g as unknown as Record<string, unknown>)),
  )
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = createGardenSchema.parse(body)
    const garden = await gardenStore.create(parsed)
    return NextResponse.json(garden, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', issues: error.issues },
        { status: 400 },
      )
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
