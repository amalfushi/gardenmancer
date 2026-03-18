import { NextResponse } from 'next/server'
import { z } from 'zod/v4'
import { gardenStore } from '@/lib/stores/garden-store'
import { migrateGarden } from '@/types'

const updateGardenSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  type: z.enum(['raised', 'flat', 'terraced', 'container']).optional(),
  width: z.number().min(1).max(100).optional(),
  length: z.number().min(1).max(100).optional(),
  rotationDegrees: z.number().min(0).max(360).optional(),
  hemisphere: z.enum(['northern', 'southern']).optional(),
  layout: z
    .array(
      z.object({
        plantId: z.string(),
        gridX: z.number(),
        gridY: z.number(),
        plantedDate: z.string().optional(),
      }),
    )
    .optional(),
  shadeZones: z
    .array(
      z.object({
        id: z.string(),
        x: z.number(),
        y: z.number(),
        width: z.number().min(1),
        height: z.number().min(1),
        intensity: z.enum(['partial', 'full']),
      }),
    )
    .optional(),
})

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const garden = await gardenStore.getById(id)
  if (!garden) {
    return NextResponse.json({ error: 'Garden not found' }, { status: 404 })
  }
  return NextResponse.json(migrateGarden(garden as unknown as Record<string, unknown>))
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const parsed = updateGardenSchema.parse(body)
    const garden = await gardenStore.update(id, parsed)
    if (!garden) {
      return NextResponse.json({ error: 'Garden not found' }, { status: 404 })
    }
    return NextResponse.json(garden)
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

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const deleted = await gardenStore.remove(id)
  if (!deleted) {
    return NextResponse.json({ error: 'Garden not found' }, { status: 404 })
  }
  return NextResponse.json({ success: true })
}
