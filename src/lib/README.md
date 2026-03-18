# Core Libraries (`src/lib/`)

## Overview

This directory contains the core logic shared across the application:

- **`claude.ts`** — Claude AI integration (seed packet scanning, garden optimization)
- **`db.ts`** — lowdb database setup and access (planned for M1)
- **`stores/`** — Data store modules for plants, gardens, etc. (planned for M1)

## Mock Mode Architecture

The `claude.ts` module checks `process.env.MOCK_AI` at runtime:

- When `MOCK_AI=true`, functions return fixture data from `__mocks__/` with a simulated delay.
- When `MOCK_AI` is not set or `false`, functions call the real Anthropic Claude API.

### Mock Fixtures

- `__mocks__/claude-scan.json` — Sample seed packet scan response (Cherry Tomato)
- `__mocks__/claude-optimize.json` — Sample garden optimization response with suggestions

## Utility Functions

General-purpose utilities (date formatting, validation helpers, etc.) will be added here as the project grows.
