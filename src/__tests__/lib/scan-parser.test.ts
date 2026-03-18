import { describe, it, expect } from 'vitest'
import { parseScanResponse } from '@/lib/scan-parser'

const validResponse = {
  name: 'Cherry Tomato',
  species: 'Solanum lycopersicum',
  spacing: 24,
  sunNeeds: 'full',
  daysToMaturity: 65,
  heightCategory: 'medium',
  waterNeeds: 'medium',
  companionPlants: ['basil', 'carrots', 'parsley'],
  zones: [3, 4, 5, 6, 7, 8, 9, 10],
  plantingWindows: {
    startIndoors: '6-8 weeks before last frost',
    transplant: 'After last frost date',
    directSow: null,
  },
  source: 'scan',
}

describe('parseScanResponse', () => {
  it('parses a valid complete response', () => {
    const plant = parseScanResponse(validResponse)

    expect(plant.name).toBe('Cherry Tomato')
    expect(plant.species).toBe('Solanum lycopersicum')
    expect(plant.spacing).toBe(24)
    expect(plant.sunNeeds).toBe('full')
    expect(plant.daysToMaturity).toBe(65)
    expect(plant.heightCategory).toBe('medium')
    expect(plant.waterNeeds).toBe('medium')
    expect(plant.companionPlants).toEqual(['basil', 'carrots', 'parsley'])
    expect(plant.zones).toEqual([3, 4, 5, 6, 7, 8, 9, 10])
    expect(plant.plantingWindows.startIndoors).toBe('6-8 weeks before last frost')
    expect(plant.source).toBe('scan')
    expect(plant.id).toBeTruthy()
  })

  it('generates a unique ID for each parse', () => {
    const plant1 = parseScanResponse(validResponse)
    const plant2 = parseScanResponse(validResponse)
    expect(plant1.id).not.toBe(plant2.id)
  })

  it('always sets source to scan regardless of input', () => {
    const withManualSource = { ...validResponse, source: 'manual' }
    const plant = parseScanResponse(withManualSource)
    expect(plant.source).toBe('scan')
  })

  it('parses a partial response with defaults', () => {
    const partial = {
      name: 'Basil',
    }
    const plant = parseScanResponse(partial)

    expect(plant.name).toBe('Basil')
    expect(plant.spacing).toBe(12)
    expect(plant.sunNeeds).toBe('full')
    expect(plant.daysToMaturity).toBe(60)
    expect(plant.heightCategory).toBe('medium')
    expect(plant.waterNeeds).toBe('medium')
    expect(plant.companionPlants).toEqual([])
    expect(plant.zones).toEqual([5, 6, 7])
    expect(plant.plantingWindows).toEqual({})
    expect(plant.source).toBe('scan')
  })

  it('throws on invalid data — wrong types', () => {
    const invalid = {
      name: 123,
      spacing: 'not a number',
    }
    expect(() => parseScanResponse(invalid)).toThrow()
  })

  it('throws on empty response', () => {
    expect(() => parseScanResponse({})).toThrow()
    expect(() => parseScanResponse(null)).toThrow()
    expect(() => parseScanResponse(undefined)).toThrow()
  })

  it('throws when name is empty string', () => {
    expect(() => parseScanResponse({ name: '' })).toThrow()
  })

  it('handles missing optional species', () => {
    const noSpecies = { ...validResponse }
    delete (noSpecies as Record<string, unknown>).species
    const plant = parseScanResponse(noSpecies)
    expect(plant.species).toBeUndefined()
  })

  it('rejects invalid sunNeeds value', () => {
    const invalid = { ...validResponse, sunNeeds: 'bright' }
    expect(() => parseScanResponse(invalid)).toThrow()
  })

  it('rejects invalid heightCategory', () => {
    const invalid = { ...validResponse, heightCategory: 'huge' }
    expect(() => parseScanResponse(invalid)).toThrow()
  })
})
