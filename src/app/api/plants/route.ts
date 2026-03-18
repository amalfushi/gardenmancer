import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { z } from 'zod/v4'
import { plantStore } from '@/lib/stores/plant-store'

const plantCreateSchema = z.object({
  name: z.string().min(1),
  species: z.string().optional(),
  spacing: z.number().positive(),
  sunNeeds: z.enum(['full', 'partial', 'shade']),
  daysToMaturity: z.number().positive().int(),
  heightCategory: z.enum(['ground', 'short', 'medium', 'tall', 'vine']),
  waterNeeds: z.enum(['low', 'medium', 'high']),
  companionPlants: z.array(z.string()),
  zones: z.array(z.number().int().min(1).max(13)),
  plantingWindows: z.object({
    startIndoors: z.string().optional(),
    transplant: z.string().optional(),
    directSow: z.string().optional(),
  }),
  source: z.enum(['seed', 'scan', 'manual']),
})

export async function GET(request: NextRequest) {
  const search = request.nextUrl.searchParams.get('search')

  if (search) {
    const results = await plantStore.search(search)
    return NextResponse.json(results)
  }

  const plants = await plantStore.getAll()
  return NextResponse.json(plants)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = plantCreateSchema.parse(body)
    const plant = await plantStore.add(parsed)
    return NextResponse.json(plant, { status: 201 })
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
