import { NextResponse } from 'next/server'
import { gardenStore } from '@/lib/stores/garden-store'
import { plantStore } from '@/lib/stores/plant-store'
import { optimizeGardenLayout } from '@/lib/claude'

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const garden = await gardenStore.getById(id)

    if (!garden) {
      return NextResponse.json({ error: 'Garden not found' }, { status: 404 })
    }

    const allPlants = await plantStore.getAll()
    const placedPlants = garden.layout.map((placement) => {
      const plant = allPlants.find((p) => p.id === placement.plantId)
      return { ...placement, plant }
    })

    const result = await optimizeGardenLayout({
      garden: {
        id: garden.id,
        name: garden.name,
        width: garden.width,
        length: garden.length,
        rotationDegrees: garden.rotationDegrees,
        type: garden.type,
      },
      placements: placedPlants,
    })

    return NextResponse.json(result)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Optimization failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
