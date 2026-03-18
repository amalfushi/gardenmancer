# API Routes — Agent Guide

## Pattern

All API routes use Next.js App Router conventions. Each route lives in its own directory with a `route.ts` file:

```
src/app/api/
├── scan/
│   └── route.ts      # POST /api/scan — scan a seed packet image
├── plants/
│   └── route.ts      # GET/POST /api/plants — plant CRUD
├── gardens/
│   └── route.ts      # GET/POST /api/gardens — garden CRUD
└── optimize/
    └── route.ts      # POST /api/optimize — garden layout optimization
```

## Request Validation

Use `zod` to validate all incoming request bodies:

```typescript
import { z } from 'zod'

const ScanRequestSchema = z.object({
  image: z.string().min(1, 'Image data is required'),
})

export async function POST(request: Request) {
  const body = await request.json()
  const parsed = ScanRequestSchema.safeParse(body)

  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 })
  }
  // ... handle request
}
```

## Error Handling

Always return proper HTTP status codes with JSON error bodies:

| Status | When |
| ------ | ------------------------------------------- |
| 200 | Success |
| 400 | Validation error (bad request body) |
| 404 | Resource not found |
| 500 | Internal server error (catch-all for throws) |

Error response shape:

```json
{ "error": "Human-readable error message" }
```

## Mock Mode

Check `process.env.MOCK_AI` at the start of AI-dependent routes:

```typescript
import scanFixture from '@/lib/__mocks__/claude-scan.json'

export async function POST(request: Request) {
  if (process.env.MOCK_AI === 'true') {
    return Response.json(scanFixture)
  }
  // ... real implementation
}
```

Fixture files live in `src/lib/__mocks__/`.

## Testing

Test each route with Vitest. Mock the data stores and external dependencies:

```typescript
import { POST } from './route'

describe('POST /api/scan', () => {
  it('returns scan results in mock mode', async () => {
    process.env.MOCK_AI = 'true'
    const request = new Request('http://localhost/api/scan', {
      method: 'POST',
      body: JSON.stringify({ image: 'base64data' }),
    })
    const response = await POST(request)
    const data = await response.json()
    expect(data.name).toBeDefined()
  })
})
```
