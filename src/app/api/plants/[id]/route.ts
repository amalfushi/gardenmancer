import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { z } from 'zod/v4'
import { plantStore } from '@/lib/stores/plant-store'

const plantUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  species: z.string().optional(),
  spacing: z.number().positive().optional(),
  sunNeeds: z.enum(['full', 'partial', 'shade']).optional(),
  daysToMaturity: z.number().positive().int().optional(),
  heightCategory: z.enum(['ground', 'short', 'medium', 'tall', 'vine']).optional(),
  waterNeeds: z.enum(['low', 'medium', 'high']).optional(),
  companionPlants: z.array(z.string()).optional(),
  zones: z.array(z.number().int().min(1).max(13)).optional(),
  plantingWindows: z
    .object({
      startIndoors: z.string().optional(),
      transplant: z.string().optional(),
      directSow: z.string().optional(),
    })
    .optional(),
  source: z.enum(['seed', 'scan', 'manual']).optional(),
})

type RouteParams = { params: Promise<{ id: string }> }

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params
  const plant = await plantStore.getById(id)

  if (!plant) {
    return NextResponse.json({ error: 'Plant not found' }, { status: 404 })
  }

  return NextResponse.json(plant)
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params

  try {
    const body = await request.json()
    const parsed = plantUpdateSchema.parse(body)
    const updated = await plantStore.update(id, parsed)

    if (!updated) {
      return NextResponse.json({ error: 'Plant not found' }, { status: 404 })
    }

    return NextResponse.json(updated)
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

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params
  const removed = await plantStore.remove(id)

  if (!removed) {
    return NextResponse.json({ error: 'Plant not found' }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}
