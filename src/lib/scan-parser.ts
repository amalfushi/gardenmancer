import { z } from 'zod/v4'
import { nanoid } from 'nanoid'
import type { Plant } from '@/types'

const scanResponseSchema = z.object({
  name: z.string().min(1),
  species: z.string().optional(),
  spacing: z.number().positive().default(12),
  sunNeeds: z.enum(['full', 'partial', 'shade']).default('full'),
  daysToMaturity: z.number().positive().int().default(60),
  heightCategory: z.enum(['ground', 'short', 'medium', 'tall', 'vine']).default('medium'),
  waterNeeds: z.enum(['low', 'medium', 'high']).default('medium'),
  companionPlants: z.array(z.string()).default([]),
  zones: z.array(z.number().int().min(1).max(13)).default([5, 6, 7]),
  plantingWindows: z
    .object({
      startIndoors: z
        .string()
        .nullable()
        .optional()
        .transform((v) => v ?? undefined),
      transplant: z
        .string()
        .nullable()
        .optional()
        .transform((v) => v ?? undefined),
      directSow: z
        .string()
        .nullable()
        .optional()
        .transform((v) => v ?? undefined),
    })
    .default({} as { startIndoors: undefined; transplant: undefined; directSow: undefined }),
  source: z.enum(['seed', 'scan', 'manual']).optional(),
})

export function parseScanResponse(raw: unknown): Plant {
  const parsed = scanResponseSchema.parse(raw)

  return {
    id: nanoid(),
    name: parsed.name,
    species: parsed.species,
    spacing: parsed.spacing,
    sunNeeds: parsed.sunNeeds,
    daysToMaturity: parsed.daysToMaturity,
    heightCategory: parsed.heightCategory,
    waterNeeds: parsed.waterNeeds,
    companionPlants: parsed.companionPlants,
    zones: parsed.zones,
    plantingWindows: parsed.plantingWindows,
    source: 'scan',
  }
}
