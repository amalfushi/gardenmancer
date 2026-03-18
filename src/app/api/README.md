# API Routes

## Overview

All API routes live under `src/app/api/` using the Next.js App Router convention. Each route is a `route.ts` file inside a directory that defines the URL path.

## How Routing Works

```
src/app/api/scan/route.ts    →  POST /api/scan
src/app/api/plants/route.ts  →  GET/POST /api/plants
src/app/api/gardens/route.ts →  GET/POST /api/gardens
src/app/api/optimize/route.ts → POST /api/optimize
```

Each `route.ts` exports named functions for HTTP methods: `GET`, `POST`, `PUT`, `DELETE`, etc.

## Mock Mode

Routes that depend on the Claude AI check `process.env.MOCK_AI`. When set to `'true'`, routes return fixture data from `src/lib/__mocks__/` instead of calling the real API. This allows full local development without an Anthropic API key.

## Error Handling

All routes follow a consistent error response pattern:

- **400** — Validation error (invalid request body, missing fields)
- **404** — Resource not found
- **500** — Internal server error

Error responses always return JSON:

```json
{ "error": "Human-readable error message" }
```

Request bodies are validated with `zod` schemas before processing.
