# Milestone 1: Foundation — Implementation Plan

## Approach

- **1.1–1.2 (Project & UI):** Initialize Next.js 16 with TypeScript and pnpm, then install and configure Mantine with a custom garden theme (greens, earth tones), including the app-level MantineProvider and CSS setup in the root layout.
- **1.3–1.4 (Data Layer):** Create typed lowdb store wrappers for plants, gardens, and scans with full TypeScript interfaces, then populate a seed data file with ~50 common garden plants including zone info, spacing, sun requirements, and planting schedules.
- **1.5–1.6 (Shell & Init):** Build the responsive app shell with a bottom navigation bar (mobile) and sidebar (desktop) linking to Scanner, Plants, and Garden sections, then implement database initialization logic that seeds `db.json` on first run if it doesn't exist.

## Dependencies

- Depends on Milestone 0 (code quality, testing, and mocking must be in place).
- Milestones 2–5 all depend on this milestone.

## Acceptance Criteria

- `pnpm dev` starts a working Next.js app with Mantine styling
- lowdb stores are typed and can read/write plants, gardens, and scans
- ~50 plants are seeded into the database on first run
- App shell renders with working navigation between three sections
- All tests pass with coverage above 80%
