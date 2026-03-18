import scanFixture from './__mocks__/claude-scan.json'
import optimizeFixture from './__mocks__/claude-optimize.json'

const isMockMode = () => process.env.MOCK_AI === 'true'

export async function scanSeedPacket(_imageBase64: string): Promise<unknown> {
  if (isMockMode()) {
    // Simulate API latency
    await new Promise((resolve) => setTimeout(resolve, 500))
    return scanFixture
  }

  // Real Claude API call - to be implemented in M2
  throw new Error('Claude API integration not yet implemented. Set MOCK_AI=true for development.')
}

export async function optimizeGardenLayout(_gardenData: unknown): Promise<unknown> {
  if (isMockMode()) {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return optimizeFixture
  }

  throw new Error('Claude API integration not yet implemented. Set MOCK_AI=true for development.')
}
