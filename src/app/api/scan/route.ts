import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { scanSeedPacket } from '@/lib/claude'
import { parseScanResponse } from '@/lib/scan-parser'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('image')

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString('base64')

    const rawResult = await scanSeedPacket(base64)
    const plant = parseScanResponse(rawResult)

    return NextResponse.json(plant)
  } catch (error) {
    console.error('Scan error:', error)
    const message = error instanceof Error ? error.message : 'Scan failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
