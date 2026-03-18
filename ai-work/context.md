# Gardenmancer — Architecture & Tech Decisions

## Tech Stack

| Layer           | Technology                     | Notes                                                 |
| --------------- | ------------------------------ | ----------------------------------------------------- |
| Framework       | Next.js 16                     | App Router, TypeScript, pnpm                          |
| UI Library      | Mantine                        | Component library — no Tailwind                       |
| Database        | lowdb (JSON)                   | File-based, document-shaped data in `db.json`         |
| Canvas          | react-konva                    | Garden layout editor with interactive 2D rendering    |
| AI              | Claude Opus 4.6 API            | Seed packet scanning (Vision) and garden optimization |
| Testing         | Vitest + React Testing Library | 80% coverage target, Husky pre-commit enforcement     |
| Package Manager | pnpm                           | Strict, fast, disk-efficient                          |

## Storage Architecture

- **lowdb** with typed TypeScript store wrappers — no SQL, no ORM
- All data lives in a single `db.json` file (document-shaped)
- Store wrappers provide type-safe read/write access per entity (plants, gardens, scans)
- Schema validation happens at the wrapper level, not the DB level

## UI Decisions

- **Mantine** is the sole component library — no Tailwind, no custom CSS framework
- Mobile-first responsive design using Mantine's responsive props
- App shell pattern: bottom navigation on mobile, sidebar on desktop
- Color scheme: garden/nature theme built on Mantine's theming system

## Canvas / Garden Editor

- **react-konva** provides the 2D canvas for the garden layout editor
- Grid overlay with configurable cell size (default 1 sq ft)
- Drag-and-drop plant placement with snap-to-grid
- Visual indicators for spacing requirements, height layers, and sun exposure
- AI-powered layout optimization suggestions via Claude Opus 4.6

## AI Integration

- **Claude Opus 4.6** handles two key features:
  1. **Seed Packet Scanning:** Send a photo via the Vision API, extract plant data (name, variety, spacing, sun, water, days to harvest, zones, planting instructions)
  2. **Garden Optimization:** Analyze a garden layout and suggest improvements for companion planting, spacing, sun exposure, and succession planting
- **Mocking:** Set `MOCK_AI=true` environment variable for local development without API keys
  - Mock responses return realistic but static plant data
  - All AI call sites check the env var and route to mock implementations

## Testing Strategy

- **Vitest** for unit and integration tests
- **React Testing Library** for component tests
- **80% coverage** enforced via CI and pre-commit hooks
- **Husky** pre-commit hook runs lint + test on staged files
- Test files co-located with source: `Component.test.tsx` next to `Component.tsx`

## Mocking & Environment

- `MOCK_AI=true` — bypasses all Claude API calls with deterministic mock responses
- `.env.local` for local secrets (never committed)
- `.env.example` documents all required/optional env vars
- Mock data fixtures live in `src/test/fixtures/`

## Parallel Agent Workflow

- Each milestone gets its own **git worktree** for parallel development
- Branch naming: `milestone-N/description` (e.g., `milestone-1/foundation`)
- Agents should read this `context.md` and their milestone's `problem-statement.md` before starting work
- After completing work, agents update their milestone's `progress.md`

### ⛔ MANDATORY: Pull Request Workflow — No Exceptions

**NEVER merge directly into `main`.** Every change to `main` MUST go through a pull request.

**Required steps for every milestone:**

1. Create a worktree + branch from latest `main`
2. Do all work on the milestone branch
3. Push the branch to origin
4. **Create a pull request** into `main` — this is the ONLY way changes reach `main`
5. Wait for PR review and approval before merging

**Explicitly prohibited:**

- `git checkout main && git merge <branch>` — bypasses PR review
- `git push origin main` — main is only updated via merged PRs
- Any local merge of milestone branches into `main`
- Using `git pull origin <branch>` on main to fast-forward

If instructed to "merge", always create a pull request instead of performing a local git merge.
