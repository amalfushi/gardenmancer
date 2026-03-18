# Gardenmancer — Implementation Plan

## Problem Statement

Build a mobile-first web app that helps gardeners plan, organize, and manage their gardens. Users should be able to photograph seed packets to extract planting info, build a planting calendar, browse a plant database, and create optimized garden layouts.

**Target: Hackathon MVP** — end-to-end working features, pragmatic shortcuts where needed.

---

## 0. Non-Negotiables (Pre-Milestone Work)

These are foundational requirements that must be completed **before any feature code is written**.

### 0a. AI Work Tracking Structure (`ai-work/`)

A structured folder at the repo root to maintain context across agents and sessions. Each milestone is broken into sub-milestones for manageable, independently-assignable chunks of work:

```
ai-work/
├── progress.md                          # Overall milestone tracker
├── context.md                           # Key decisions, architecture notes for agent onboarding
│
├── 0.non-negotiables/
│   ├── problem-statement.md
│   ├── plan.md
│   ├── progress.md
│   ├── 0.1.ai-work-structure/
│   │   ├── plan.md
│   │   └── progress.md
│   ├── 0.2.agents-instructions/
│   │   ├── plan.md
│   │   └── progress.md
│   ├── 0.3.readmes/
│   │   ├── plan.md
│   │   └── progress.md
│   ├── 0.4.code-quality/
│   │   ├── plan.md
│   │   └── progress.md
│   ├── 0.5.testing-framework/
│   │   ├── plan.md
│   │   └── progress.md
│   ├── 0.6.git-hooks/
│   │   ├── plan.md
│   │   └── progress.md
│   └── 0.7.mocking-and-env/
│       ├── plan.md
│       └── progress.md
│
├── 1.foundation/
│   ├── problem-statement.md
│   ├── plan.md
│   ├── progress.md
│   ├── 1.1.nextjs-init/
│   │   ├── plan.md
│   │   └── progress.md
│   ├── 1.2.mantine-setup/
│   │   ├── plan.md
│   │   └── progress.md
│   ├── 1.3.lowdb-stores/
│   │   ├── plan.md
│   │   └── progress.md
│   ├── 1.4.plant-seed-data/
│   │   ├── plan.md
│   │   └── progress.md
│   ├── 1.5.app-shell/
│   │   ├── plan.md
│   │   └── progress.md
│   └── 1.6.db-initialization/
│       ├── plan.md
│       └── progress.md
│
├── 2.seed-scanner/
│   ├── problem-statement.md
│   ├── plan.md
│   ├── progress.md
│   ├── 2.1.camera-upload-ui/
│   │   ├── plan.md
│   │   └── progress.md
│   ├── 2.2.scan-api-claude/
│   │   ├── plan.md
│   │   └── progress.md
│   ├── 2.3.response-parser/
│   │   ├── plan.md
│   │   └── progress.md
│   ├── 2.4.scan-results-ui/
│   │   ├── plan.md
│   │   └── progress.md
│   └── 2.5.save-scanned-plant/
│       ├── plan.md
│       └── progress.md
│
├── 3.plants-calendar/
│   ├── problem-statement.md
│   ├── plan.md
│   ├── progress.md
│   ├── 3.1.plant-api/
│   │   ├── plan.md
│   │   └── progress.md
│   ├── 3.2.plant-list-ui/
│   │   ├── plan.md
│   │   └── progress.md
│   ├── 3.3.plant-detail-ui/
│   │   ├── plan.md
│   │   └── progress.md
│   ├── 3.4.calendar-logic/
│   │   ├── plan.md
│   │   └── progress.md
│   ├── 3.5.calendar-ui/
│   │   ├── plan.md
│   │   └── progress.md
│   └── 3.6.add-to-garden-flow/
│       ├── plan.md
│       └── progress.md
│
├── 4.garden-layout/
│   ├── problem-statement.md
│   ├── plan.md
│   ├── progress.md
│   ├── 4.1.garden-crud/
│   │   ├── plan.md
│   │   └── progress.md
│   ├── 4.2.canvas-setup/
│   │   ├── plan.md
│   │   └── progress.md
│   ├── 4.3.drag-and-drop/
│   │   ├── plan.md
│   │   └── progress.md
│   ├── 4.4.spacing-visualization/
│   │   ├── plan.md
│   │   └── progress.md
│   ├── 4.5.height-sun-hints/
│   │   ├── plan.md
│   │   └── progress.md
│   └── 4.6.ai-optimization/
│       ├── plan.md
│       └── progress.md
│
└── 5.polish/
    ├── problem-statement.md
    ├── plan.md
    ├── progress.md
    ├── 5.1.integration/
    │   ├── plan.md
    │   └── progress.md
    ├── 5.2.responsive-design/
    │   ├── plan.md
    │   └── progress.md
    ├── 5.3.error-handling/
    │   ├── plan.md
    │   └── progress.md
    └── 5.4.demo-prep/
        ├── plan.md
        └── progress.md
```

Each milestone folder has:

- `problem-statement.md` — what this milestone accomplishes and why
- `plan.md` — detailed approach for this milestone
- `progress.md` — current status, completed items, blockers

Each sub-milestone folder has:

- `plan.md` — specific implementation plan for this chunk
- `progress.md` — status tracking for this chunk

Sub-milestones are independently assignable to agents and small enough to complete in a focused session.

### 0b. Testing & Code Quality (Git Hooks)

- **ESLint** — strict TypeScript rules, enforced on commit
- **Prettier** — consistent formatting, enforced on commit
- **Vitest** — unit/integration test runner with coverage thresholds
- **React Testing Library** — component testing
- **Husky + lint-staged** — pre-commit hooks that run lint, format check, and tests
- **Coverage gating** — minimum coverage threshold enforced (e.g., 80% for new code)
- All tests must pass before commits are accepted

### 0c. Agent Instructions (`agents.md`)

Agent instruction files that define how AI agents should work with this repo:

```
gardenmancer/
├── agents.md                      # Root-level: repo overview, conventions, workflow
├── src/
│   ├── app/api/
│   │   └── agents.md              # API-specific: route patterns, validation, error handling, mocking
│   └── components/
│       └── agents.md              # UI-specific: component patterns, testing, accessibility
```

Each `agents.md` includes:

- How to read/update `ai-work/` context files
- Coding conventions and patterns to follow
- How to run tests and what coverage is expected
- How to handle mocking for local development
- PR/commit message conventions

#### Parallel Agent Workflow (Git Worktrees)

Multiple agents can work on different milestones simultaneously using git worktrees. The root `agents.md` must include these rules:

**1. Git Worktree Setup**
Each agent working on a milestone must create a dedicated worktree and branch:

```bash
# From the main gardenmancer repo root:
git worktree add ../gardenmancer-m2 -b milestone-2/seed-scanner
git worktree add ../gardenmancer-m3 -b milestone-3/plants-calendar
git worktree add ../gardenmancer-m4 -b milestone-4/garden-layout
```

This creates separate working directories so agents don't conflict with each other's uncommitted changes.

**2. Dependency Installation**
Always run `pnpm install` immediately after switching to or creating a worktree. Worktrees share the git history but NOT `node_modules/`:

```bash
cd ../gardenmancer-m2
pnpm install
```

**3. Branch Naming Convention**

- `milestone-N/short-description` for milestone work (e.g., `milestone-2/seed-scanner`)
- `m0/setup-hooks` for M0 foundational work
- Feature branches off milestone branches for individual todos: `milestone-2/m2-camera-ui`

**4. Conflict Prevention Rules**

- **Shared files are owned by M0/M1.** Files in `src/types/`, `src/lib/db.ts`, `src/lib/stores/`, and `src/app/layout.tsx` should be stabilized in M1 before parallel work begins.
- **Each milestone owns its feature folder.** M2 owns `src/app/scan/`, M3 owns `src/app/plants/` + `src/app/calendar/`, M4 owns `src/app/gardens/`. Agents must NOT modify files outside their owned folders.
- **Shared types:** If an agent needs a new type/interface, add it to `src/types/index.ts` and immediately commit + push so other agents can pull it.
- **API routes:** Each milestone owns its API routes (M2 → `/api/scan`, M3 → `/api/plants` + `/api/calendar`, M4 → `/api/gardens`). No cross-ownership.

**5. Communication via ai-work/**

- Before starting work, read `ai-work/progress.md` and `ai-work/context.md` for current state
- After completing a todo, update the milestone's `progress.md`
- If you create a shared dependency (new type, store method, utility), document it in `ai-work/context.md` so other agents know

**6. Merge Strategy**

- M1 (foundation) merges to `main` first — this is the base all other milestones branch from
- After M1 merges, each milestone branch rebases onto `main`
- Milestone branches merge to `main` via PR when complete
- Agents should rebase frequently: `git fetch origin && git rebase origin/main`

**7. Testing in Worktrees**

- Each agent must run `pnpm test` and `pnpm lint` before committing
- Tests must pass in isolation (no dependency on other milestone branches)
- Use mock mode (`MOCK_AI=true`) for all AI-dependent tests

**8. Lock File Discipline**

- NEVER modify `pnpm-lock.yaml` manually
- If multiple agents add dependencies, the merge to `main` may have lock file conflicts — resolve with `pnpm install` after merge

### 0e. Human-Readable README Files

Every major component must have a `README.md` that explains the component to human reviewers — context, tech decisions, how to run/test, and architecture. These must be kept up-to-date as the code evolves.

```
gardenmancer/
├── README.md                          # Project overview, getting started, tech stack summary
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── README.md              # API overview: routes, request/response formats, mocking
│   │   ├── scan/README.md             # Seed scanner: how it works, Claude integration, mock mode
│   │   ├── plants/README.md           # Plant database: browsing, searching, data model
│   │   ├── calendar/README.md         # Planting calendar: zone logic, date calculations
│   │   └── gardens/README.md          # Garden layout: canvas editor, drag-and-drop, optimization
│   ├── components/
│   │   └── README.md                  # UI components: patterns, Mantine usage, testing approach
│   └── lib/
│       ├── README.md                  # Core libraries: db, stores, Claude client, utilities
│       └── stores/README.md           # Data stores: lowdb architecture, typed access patterns
├── data/
│   └── README.md                      # Data files: plant catalog format, db.json structure
└── ai-work/
    └── README.md                      # AI work tracking: how to use milestone docs, conventions
```

Each README includes:

- **What this component does** (plain English, for humans with zero context)
- **Key tech decisions** and why they were made
- **How to run/test locally** (commands, mock mode, etc.)
- **Architecture notes** (data flow, dependencies, key files)
- **Maintenance rule**: Any PR that changes code in a component must update its README if behavior changes

### 0f. Local Development & Mocking

- Full local dev setup: `pnpm dev` runs everything locally
- **Mock mode** for Claude API: environment variable `MOCK_AI=true` returns fixture responses
- Mock fixtures stored in `src/lib/__mocks__/` for deterministic testing
- All API routes must work with mocks for local testing without API keys
- `.env.example` file with all required env vars documented

---

## 1. Tech Stack — Detailed Alternatives

For each component, 3 alternatives are presented with pros/cons and a recommendation (★).

### 1a. Framework / Meta-Framework

|                    | **Next.js 16 ★**                                                                                                                                                       | **Remix (React Router v7)**                                                                                                                    | **Astro 5+**                                                                                                                    |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **Approach**       | Full-stack React, SSR/SSG/ISR                                                                                                                                          | SSR-first, progressive enhancement                                                                                                             | SSG-first, zero-JS islands                                                                                                      |
| **Pros**           | Single codebase (UI + API routes), largest ecosystem, React Server Components, Vercel integration, massive learning resources                                          | Smallest bundles of the React frameworks, web-standards-first (forms just work), excellent edge deployment, progressive enhancement for mobile | Fastest TTFB (100-200ms), zero JS by default, can use React/Vue/Svelte in one project, best Lighthouse scores                   |
| **Cons**           | Can ship large JS bundles without tuning, steep learning curve for advanced features (RSC, caching)                                                                    | Smaller ecosystem, less community than Next.js, SPA navigation requires manual setup                                                           | Not suited for app-heavy/dashboard experiences, less mature for full-stack (auth, API routes), awkward for interactive features |
| **Best When**      | Complex interactive app with API routes, server-side logic, and rich UI                                                                                                | Forms-heavy app, edge deployment, minimal JS on mobile                                                                                         | Content-heavy/marketing sites with minimal interactivity                                                                        |
| **Recommendation** | **★ Best fit for Gardenmancer** — we need API routes, image upload, interactive canvas, and a single codebase. Next.js handles all of this with the largest ecosystem. |

### 1b. CSS / Styling + Component Library (Combined)

Since a component-library-first approach is preferred over a standalone CSS framework, this section evaluates full component libraries that include their own styling system — **no separate CSS framework dependency needed**.

|                     | **Mantine ★**                                                                                                                                                                                                        | **Chakra UI**                                                            | **shadcn/ui + Tailwind CSS**                                                   |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| **Approach**        | Full component library (120+ components) with built-in CSS Modules + PostCSS theming                                                                                                                                 | Component library with CSS-in-JS (Emotion) theming                       | Copy-paste headless components + Tailwind utility CSS                          |
| **Styling**         | Built-in: CSS Modules + PostCSS, no external CSS framework needed                                                                                                                                                    | Built-in: CSS-in-JS via Emotion, no external CSS framework needed        | Requires Tailwind CSS as a separate dependency                                 |
| **Component Count** | 120+ (buttons, modals, drawers, tables, date pickers, notifications, code highlight, rich text, etc.)                                                                                                                | ~80 (solid coverage of common components)                                | ~40 (core primitives, you build the rest)                                      |
| **Extras**          | Rich hooks library (forms, notifications, hotkeys, clipboard, etc.), built-in dark mode, responsive defaults                                                                                                         | Accessible by default, responsive props, good theming                    | Total code ownership, smallest individual bundles                              |
| **Mobile-First**    | Yes — rem-based, responsive props + breakpoints, adaptive components                                                                                                                                                 | Yes — responsive array/object props                                      | Yes — Tailwind responsive utilities                                            |
| **Bundle Size**     | ~60KB gzipped (core), tree-shakable                                                                                                                                                                                  | ~80KB gzipped, tree-shakable                                             | ~10-20KB per component but Tailwind adds ~10-30KB CSS                          |
| **TypeScript**      | Excellent — full type inference and generics                                                                                                                                                                         | Good                                                                     | Good                                                                           |
| **Cons**            | Smaller ecosystem than MUI, learning its theme system                                                                                                                                                                | Apps can "look like Chakra," bundle can grow, CSS-in-JS runtime overhead | Heavy CSS dependency (Tailwind), more assembly required, utility class clutter |
| **Best When**       | You want batteries-included with modern defaults and no CSS framework dep                                                                                                                                            | You want accessible components with easy theming                         | You want maximum creative control and own all code                             |
| **Recommendation**  | **★ Mantine** — 120+ components, built-in styling (no Tailwind needed), rich hooks, excellent TypeScript, dark mode, responsive out of the box. Best fit for "component-library-first" with no heavy CSS dependency. |

### 1c. Component Library — MERGED INTO 1b above

_(shadcn/ui vs Radix vs Headless UI comparison removed — these are all Tailwind-dependent approaches)_

### 1d. Database / Storage

**What does storage do for Gardenmancer?**
Persists user data: their garden definitions (name, dimensions, type), which plants are placed where (as a JSON layout), their planting calendar entries, and the plant catalog. We do **NOT** store images — seed packet photos are sent to Claude, parsed into structured text, and discarded. The data is mostly document-shaped (a garden is a JSON blob with nested plant positions).

**Do we need SQL / relational storage?**
Honest answer: **not strictly**. Our data is fairly document-oriented:

- A garden is a JSON object with nested plant placements
- A plant catalog is a list of JSON objects
- A calendar is a list of date-keyed entries

However, there are a few queries that benefit from structure:

- "Show all plants that need full sun" (filtering)
- "What plants are in garden X?" (lookup)
- "Show planting calendar for zone 7" (filtering by zone)

These are doable with JSON filtering but more natural with indexed fields.

|                      | **lowdb (JSON file) ★**                                                                                                                                                                                                                                                                          | **SQLite + Prisma**                                                                                                                                                            | **Plain JSON files (fs)**                                                                                                                                            |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **What it is**       | A lightweight JSON file database for Node.js. Reads a `.json` file into memory, provides Lodash-like query API, writes atomically back to disk. TypeScript-native.                                                                                                                               | An embedded SQL database (one `.db` file) with a TypeScript ORM that generates types and manages schema migrations.                                                            | Raw `fs.readFile` / `fs.writeFile` on JSON files. No library, just Node's standard library.                                                                          |
| **How data looks**   | A single `db.json` file: `{ "plants": [...], "gardens": [...], "calendar": [...] }`                                                                                                                                                                                                              | Separate tables with typed columns: `Plant`, `Garden`, `GardenPlant`, `UserCalendar` with foreign keys                                                                         | Separate `.json` files: `plants.json`, `gardens/garden-1.json`, etc.                                                                                                 |
| **Query example**    | `db.data.plants.filter(p => p.sunNeeds === 'full')` — pure JavaScript                                                                                                                                                                                                                            | `prisma.plant.findMany({ where: { sunNeeds: 'full' } })` — typed ORM                                                                                                           | `JSON.parse(fs.readFileSync('plants.json')).filter(p => p.sunNeeds === 'full')` — manual                                                                             |
| **Type safety**      | Good — you define a TypeScript interface for the database shape, lowdb enforces it                                                                                                                                                                                                               | Excellent — auto-generated types from schema, compile-time checked queries                                                                                                     | Manual — you define types yourself, no runtime enforcement                                                                                                           |
| **Setup**            | `pnpm add lowdb` + define your DB shape interface                                                                                                                                                                                                                                                | `pnpm add prisma @prisma/client` + schema file + generate step + migration step                                                                                                | Zero dependencies                                                                                                                                                    |
| **Data evolution**   | Edit the TypeScript interface, add defaults for new fields. No migration files.                                                                                                                                                                                                                  | Formal migration system — generates SQL migration files for every change.                                                                                                      | Edit the interface, manually handle missing fields in existing files.                                                                                                |
| **Pros**             | **Simple and fast.** No SQL, no schema files, no code generation. Data is human-readable JSON you can inspect in any editor. TypeScript interfaces define the shape. Pure JavaScript for queries (filter, find, sort). Atomic writes prevent corruption. Feels natural for document-shaped data. | Best-in-class migrations and tooling. Visual browser (Prisma Studio). Formal schema versioning. Excellent for relational data with foreign keys.                               | Zero dependencies. Total control. Simplest possible approach.                                                                                                        |
| **Cons**             | All data loaded in memory (fine for our scale). No concurrent multi-process writes (fine — single Next.js server). No built-in indexing (fine — small dataset).                                                                                                                                  | **Heavier setup** (schema file, generate step, migrations). SQL is more ceremony than needed for document data. Adds ~1.5MB to bundle. ORM abstraction hides what's happening. | No atomic writes (risk of corruption on crash). No query API — you write all filtering/searching manually. Must handle concurrent writes yourself. More boilerplate. |
| **Scale ceiling**    | ~10MB of data comfortably (we'll have <1MB)                                                                                                                                                                                                                                                      | Millions of rows                                                                                                                                                               | Depends on implementation quality                                                                                                                                    |
| **Gardenmancer fit** | **★ Best fit** — our data is document-shaped (gardens are JSON blobs with nested plants). No relational joins needed. Human-readable storage. Zero-ceremony setup. TypeScript-native.                                                                                                            | Viable but over-engineered for our needs. We don't need migrations, foreign keys, or a visual DB browser for what amounts to a few JSON documents.                             | Too low-level — we'd reinvent atomic writes and query filtering that lowdb provides.                                                                                 |

**Why lowdb wins for Gardenmancer:**

1. **Data is document-shaped** — a garden is a JSON object, not a set of relational tables
2. **Human-readable storage** — open `db.json` in any editor to inspect/debug data
3. **Zero ceremony** — no schema files, no generate steps, no migrations. Define a TypeScript interface and go.
4. **No images stored** — we parse seed packets and discard the image. The resulting data is small text/numbers.
5. **TypeScript-native** — the DB shape is a TypeScript interface, queries are plain JavaScript
6. **Atomic writes** — lowdb handles safe file writing, no corruption risk
7. **Our scale** — 50 plants, 1-5 gardens, ~100 calendar entries = well under 1MB of JSON

**What we lose vs SQL:**

- No formal migration system (but our schema is simple enough to evolve with TypeScript defaults)
- No Prisma Studio visual browser (but the JSON file IS the visual browser)
- No foreign key constraints (but we enforce structure in TypeScript)
- No indexed queries (but filtering 50-100 items in JavaScript is instant)

### 1e. ORM → Data Access Layer

Since we're moving to JSON-based storage, a traditional ORM is no longer needed. Instead, we need a **data access pattern**:

|                    | **lowdb with typed wrapper ★**                                                                                                                                          | **Prisma (ORM)**                                                               | **Custom repository pattern**                                                        |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| **What it is**     | lowdb provides the JSON read/write layer. We write a thin typed wrapper (`PlantStore`, `GardenStore`) with methods like `getPlants()`, `addGarden()`, `updateLayout()`. | A full ORM that auto-generates a typed client from a schema file.              | Custom classes with `fs` operations, implementing the repository pattern manually.   |
| **Code example**   | `const plants = db.data.plants.filter(p => p.zone.includes(7))`                                                                                                         | `const plants = await prisma.plant.findMany({ where: { zones: { has: 7 } } })` | `const data = JSON.parse(await fs.readFile('plants.json')); return data.filter(...)` |
| **Pros**           | Simple, zero-gen, TypeScript interfaces are the schema, easy for agents to read/modify                                                                                  | Best tooling, formal migrations, visual browser                                | Total control, zero dependencies                                                     |
| **Cons**           | No formal migration system, no visual DB browser                                                                                                                        | Over-engineered for JSON-document data, heavier setup                          | Must implement atomic writes, concurrency, error handling manually                   |
| **Recommendation** | **★ Best fit** — thin typed wrappers over lowdb give us clean, testable data access with minimal ceremony.                                                              |

**Data access architecture:**

```typescript
// src/lib/db.ts — database initialization
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'

interface GardenmancerDB {
  plants: Plant[]
  gardens: Garden[] // each garden has a layout: { plants: PlantPlacement[] }
  calendar: CalendarEntry[]
}

const db = new Low<GardenmancerDB>(new JSONFile('db.json'), {
  plants: [],
  gardens: [],
  calendar: [],
})

// src/lib/stores/plant-store.ts — typed data access
export const plantStore = {
  getAll: () => db.data.plants,
  getById: (id: string) => db.data.plants.find((p) => p.id === id),
  add: async (plant: Plant) => {
    db.data.plants.push(plant)
    await db.write()
  },
  search: (query: string) => db.data.plants.filter((p) => p.name.toLowerCase().includes(query)),
}
```

### 1f. Garden Layout Canvas

**What does the canvas do for Gardenmancer?**
The garden layout editor is the most interactive feature: users define a garden bed (e.g., 4ft × 8ft raised bed), then drag plants from a palette onto a grid. Each plant shows its spacing footprint as a circle, and the editor validates spacing conflicts, suggests row arrangements by height, and highlights sun/shade zones. This requires a 2D canvas that supports:

- Drawing a grid overlay
- Rendering plant icons/circles at specific positions
- Drag-and-drop with grid snapping
- Hit detection (clicking on a plant to select/remove it)
- Layered rendering (grid → plants → spacing circles → labels)

|                       | **react-konva ★**                                                                                                                                                                                                                | **Fabric.js**                                                                                                                                                                                                            | **PixiJS**                                                                                                                                                         |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **What it is**        | A React-specific wrapper around Konva.js, a 2D canvas library. You write canvas elements as JSX components: `<Circle x={100} y={100} radius={50} draggable />`. The library handles rendering, events, and the scene graph.      | An object-oriented canvas library focused on graphics manipulation. Objects (shapes, images, text) are first-class with built-in move/resize/rotate handles. Originally designed for image annotation and drawing tools. | A WebGL-accelerated 2D rendering engine. Designed for games and animations where you need to render thousands of sprites at 60fps. Uses the GPU for rendering.     |
| **React integration** | **Native React bindings** — canvas elements are React components. State changes trigger canvas re-renders through React's reconciler. `<Stage> <Layer> <Rect x={plant.x} y={plant.y} /> </Layer> </Stage>`                       | **Imperative API** — you create a canvas instance, then call methods like `canvas.add(new fabric.Rect({ ... }))`. React integration requires `useEffect` + refs + manual syncing between React state and Fabric objects. | **Imperative API** — similar to Fabric.js, requires manual React integration. Community wrappers exist but are less maintained.                                    |
| **Drag-and-drop**     | **Built-in** — add `draggable` prop to any element. Events: `onDragStart`, `onDragMove`, `onDragEnd`. Grid snapping via `dragBoundFunc`.                                                                                         | Built-in — objects are moveable by default.                                                                                                                                                                              | **Manual** — you must implement pointer event tracking, position updates, and drag boundaries yourself.                                                            |
| **Hit detection**     | **Built-in** — `onClick`, `onMouseEnter`, `onTap` events on any shape. Pixel-perfect hit detection.                                                                                                                              | Built-in — click events on objects.                                                                                                                                                                                      | **Manual** — you must implement your own hit testing (point-in-shape calculations).                                                                                |
| **Scene graph**       | Yes — `Stage > Layer > Group > Shape` hierarchy. Layers can be independently cached and re-rendered.                                                                                                                             | Yes — canvas contains objects that can be grouped and layered.                                                                                                                                                           | **No** — you manage draw order yourself.                                                                                                                           |
| **Serialization**     | `stage.toJSON()` → save/restore entire canvas state. Perfect for saving garden layouts to the database.                                                                                                                          | `canvas.toJSON()` → similar serialization.                                                                                                                                                                               | No built-in serialization.                                                                                                                                         |
| **Performance**       | Good for hundreds of objects (Canvas 2D). A garden with 50-100 plants is well within range.                                                                                                                                      | Similar to Konva for moderate object counts. Slightly slower with many objects due to richer object model.                                                                                                               | **Best** — handles thousands of objects via GPU. But this is massive overkill for a garden editor.                                                                 |
| **Cons**              | No SVG export. Canvas 2D only (no GPU acceleration).                                                                                                                                                                             | Less React-friendly (imperative API). Can feel heavy for simple editors.                                                                                                                                                 | **No editor features** — you build everything from scratch (drag, select, resize, snap, hit detection). Significant engineering investment for an editor use case. |
| **Gardenmancer fit**  | **★ Best fit** — React-native JSX syntax means our garden grid, plants, spacing circles, and labels are all React components. Drag-and-drop with grid snapping is one prop. JSON serialization saves layouts to lowdb trivially. | Would work but the imperative API means more code to sync React state ↔ canvas objects. SVG export is nice but not needed.                                                                                               | Massive overkill — we'd spend days building editor infrastructure that Konva provides out of the box.                                                              |

**Why react-konva wins for Gardenmancer:**

1. **React-native** — garden elements are JSX: `<PlantCircle plant={tomato} x={3} y={5} draggable onDragEnd={handleSnap} />`
2. **Built-in drag-and-drop** — `draggable` prop + `dragBoundFunc` for grid snapping. No custom pointer tracking needed.
3. **Hit detection** — click a plant to select it, hover for tooltip. All built-in.
4. **Layers** — render grid on one layer, plants on another, spacing circles on a third. Independent updates = better performance.
5. **JSON serialization** — `stage.toJSON()` saves the entire garden layout. Load it back with `Stage.create(json)`. Store in lowdb as part of the garden object.
6. **Right-sized** — a garden has 10-100 plants. Konva handles this effortlessly without GPU overhead.

### 1g. AI / Vision API

|                    | **Claude Opus 4.6 ★**                                                                                                  | **OpenAI GPT-4o**                                                   | **Azure AI Vision + GPT**                                              |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| **Approach**       | Single API for vision + text generation                                                                                | Single API for vision + text generation                             | Separate vision API + LLM for reasoning                                |
| **Pros**           | Vision support, large context window, your hackathon already uses it, single API for both scanning and optimization    | Proven vision quality, large ecosystem, function calling, JSON mode | Azure ecosystem integration, dedicated vision models, enterprise-grade |
| **Cons**           | Newer vision capabilities, smaller ecosystem than OpenAI                                                               | Requires separate API key/billing, not your hackathon's focus       | Two APIs to integrate, more complexity, Azure subscription required    |
| **Best When**      | Your team already uses Claude, you want one API for everything                                                         | You want the broadest ecosystem and proven vision                   | You're in the Azure ecosystem and need enterprise features             |
| **Recommendation** | **★ Claude Opus 4.6** — your hackathon already uses it, vision support is confirmed, single API simplifies everything. |

---

### Selected Tech Stack Summary

| Layer               | Choice                  | Why                                                                                   |
| ------------------- | ----------------------- | ------------------------------------------------------------------------------------- |
| **Framework**       | Next.js 16 (App Router) | Full-stack, single codebase, largest ecosystem                                        |
| **UI Components**   | Mantine                 | 120+ components, built-in styling, no CSS framework dependency, rich hooks, dark mode |
| **Storage**         | lowdb (JSON file)       | Document-shaped data, zero ceremony, human-readable, TypeScript-native                |
| **Data Access**     | Typed store wrappers    | Thin typed functions over lowdb — clean, testable, no ORM overhead                    |
| **Canvas**          | react-konva             | React-native bindings, drag-and-drop, scene graph                                     |
| **AI**              | Claude Opus 4.6 API     | Vision + text, already in use, single integration                                     |
| **Package Manager** | pnpm                    | Fast, disk-efficient                                                                  |

### Key Libraries

- `@mantine/core` + `@mantine/hooks` + `@mantine/form` — UI components, utilities, form handling
- `@mantine/dates` — date picker components for calendar features
- `@mantine/notifications` — toast notifications
- `lowdb` — JSON file database with atomic writes
- `@anthropic-ai/sdk` — Claude API client
- `react-konva` + `konva` — 2D canvas for garden layout
- `date-fns` — date manipulation for planting calendar
- `zod` — schema validation
- `uuid` or `nanoid` — unique ID generation for entities

### Testing & Quality Libraries

- `vitest` — fast unit/integration test runner (Vite-native)
- `@testing-library/react` + `@testing-library/jest-dom` — component testing
- `msw` (Mock Service Worker) — API mocking for tests and local dev
- `eslint` + `@typescript-eslint/*` — linting
- `prettier` — formatting
- `husky` — git hooks
- `lint-staged` — run linters on staged files only
- `@vitest/coverage-v8` — code coverage reporting
- `storybook` + `@storybook/nextjs` — component development and visual testing
- `@storybook/test-runner` — automated story testing for CI

---

## 2. Limitations & Constraints (Hackathon Scope)

### In Scope (MVP)

- Seed packet photo → AI extraction of plant name, spacing, sun needs, days to maturity, planting dates
- Planting calendar view (month-by-month timeline)
- Static plant database (JSON seed data for ~50 common plants)
- Garden layout editor: drag-and-drop plants onto a grid
- Basic layout optimization hints (spacing violations, height/sun suggestions)
- Mobile-first responsive design
- Local lowdb JSON storage (no cloud DB)

### Out of Scope (Post-Hackathon)

- User authentication / multi-user
- Cloud deployment / hosting infrastructure
- Real-time weather integration
- Advanced AI optimization (automated layout generation)
- Plant disease identification
- Social features / sharing
- Push notifications / reminders
- Offline / PWA support
- CI/CD pipeline

### Known Constraints

- Claude API key required (user provides via `.env`)
- Image analysis quality depends on photo quality
- Plant database is US-focused hardiness zones for MVP
- Garden layout is 2D top-down only

---

## 3. Architecture

```
┌─────────────────────────────────────────────────┐
│                   Browser (Mobile-First)         │
│  ┌───────────┐ ┌──────────┐ ┌────────────────┐  │
│  │ Seed Scan │ │ Calendar │ │ Garden Layout  │  │
│  │   Page    │ │   Page   │ │    Editor      │  │
│  └─────┬─────┘ └────┬─────┘ └───────┬────────┘  │
│        │             │               │            │
│  ┌─────┴─────────────┴───────────────┴─────────┐ │
│  │          React Context (App State)           │ │
│  └──────────────────┬──────────────────────────┘ │
└─────────────────────┼───────────────────────────┘
                      │ fetch / API calls
┌─────────────────────┼───────────────────────────┐
│              Next.js API Routes                  │
│  ┌────────────┐ ┌──────────┐ ┌───────────────┐  │
│  │ /api/scan  │ │/api/plants│ │ /api/gardens  │  │
│  └─────┬──────┘ └────┬─────┘ └───────┬───────┘  │
│        │             │               │            │
│  ┌─────┴─────┐ ┌─────┴──────┐ ┌─────┴────────┐  │
│  │ Claude AI │ │  lowdb     │ │  lowdb      │  │
│  │  (Vision) │ │  (Plants)  │ │  (Gardens)  │  │
│  └───────────┘ └────────────┘ └─────────────┘  │
└──────────────────────────────────────────────────┘
```

### Data Model (JSON Document Structure)

```typescript
interface GardenmancerDB {
  plants: Plant[] // catalog of known plants (seeded + scanned)
  gardens: Garden[] // user's gardens with embedded plant placements
  calendar: CalendarEntry[] // planting schedule entries
}

interface Plant {
  id: string
  name: string
  species?: string
  spacing: number // inches between plants
  sunNeeds: 'full' | 'partial' | 'shade'
  daysToMaturity: number
  heightCategory: 'ground' | 'short' | 'medium' | 'tall' | 'vine'
  waterNeeds: 'low' | 'medium' | 'high'
  companionPlants: string[]
  zones: number[] // USDA hardiness zones
  plantingWindows: { startIndoors?: string; transplant?: string; directSow?: string }
  source: 'seed' | 'scan' | 'manual'
}

interface Garden {
  id: string
  name: string
  type: 'raised' | 'flat' | 'terraced' | 'container'
  width: number // feet
  length: number // feet
  orientation: 'north' | 'south' | 'east' | 'west'
  layout: PlantPlacement[] // embedded — the garden's plant positions
}

interface PlantPlacement {
  plantId: string
  gridX: number
  gridY: number
  plantedDate?: string
}

interface CalendarEntry {
  id: string
  plantId: string
  gardenId?: string
  zone: number
  startIndoors?: string
  transplantDate?: string
  harvestDate?: string
}
```

- **Garden** — name, type (raised/flat/terraced/container), width, length, orientation, layout (embedded plant placements)
- **Plant** — name, species, spacing, sunNeeds, daysToMaturity, heightCategory, waterNeeds, companionPlants, zones, plantingWindows
- **CalendarEntry** — plantId, gardenId, zone, dates for indoor start/transplant/harvest

### API Routes

| Route                        | Method          | Purpose                                                         |
| ---------------------------- | --------------- | --------------------------------------------------------------- |
| `/api/scan`                  | POST            | Upload seed packet image → Claude vision → extracted plant data |
| `/api/plants`                | GET             | List all plants in database                                     |
| `/api/plants/[id]`           | GET             | Get single plant details                                        |
| `/api/plants`                | POST            | Add plant (from scan or manual)                                 |
| `/api/gardens`               | GET/POST        | List or create gardens                                          |
| `/api/gardens/[id]`          | GET/PUT/DELETE  | Garden CRUD                                                     |
| `/api/gardens/[id]/plants`   | GET/POST/DELETE | Manage plants in a garden layout                                |
| `/api/gardens/[id]/optimize` | POST            | Get AI optimization suggestions                                 |
| `/api/calendar`              | GET             | Get planting calendar for user's plants                         |

---

## 4. Milestones

### Milestone 0: Non-Negotiable Foundation (MUST complete first)

- Create `ai-work/` folder structure with per-milestone problem statements, plans, and progress docs
- Create `agents.md` files at repo root and for major components (API, UI)
- Create `README.md` files for every major component (human-readable context for reviewers)
- Set up git hooks (Husky + lint-staged) for lint, test, and coverage on pre-commit
- Configure ESLint, Prettier, Vitest with coverage thresholds
- Set up mock mode for Claude API with fixture responses
- Create `.env.example` with documented env vars

### Milestone 1: Project Scaffolding & Foundation

- Initialize Next.js project with TypeScript, Mantine, pnpm
- Set up lowdb with typed store modules
- Create database schema and seed data
- Build mobile-first layout shell (nav, pages)
- Create static plant database (JSON → lowdb seed)

### Milestone 2: Seed Packet Scanner

- Camera/upload UI component (mobile `capture` attribute)
- API route to send image to Claude Vision API (with mock fallback)
- Parse Claude response into structured plant data
- Save extracted plant to database
- Display scan results with edit/confirm flow
- Unit tests for parser, integration tests for scan flow

### Milestone 3: Plant Database & Planting Calendar

- Browsable/searchable plant list page
- Plant detail view with growing information
- "Add to my garden" flow
- Calendar view showing planting windows by month
- Zone-aware date calculations (frost dates)
- Tests for calendar logic and plant API routes

### Milestone 4: Garden Layout Editor

- Canvas-based garden bed editor
- Configurable garden dimensions and type
- Drag-and-drop plant placement on grid
- Visual spacing indicators (circles showing plant footprint)
- Height-based row suggestions (tall in back, short in front)
- Basic validation: spacing conflicts, sun/shade zones
- Tests for spacing/optimization logic

### Milestone 5: Polish & Integration

- Connect all features end-to-end
- AI optimization suggestions for garden layout
- Responsive design polish
- Error handling and loading states
- Demo-ready walkthrough
- Update ai-work/ progress docs

---

## 5. Implementation Plan (Detailed Todos)

### M0: Non-Negotiables (todos: m0-\*)

- **m0-ai-work**: Create `ai-work/` folder structure with progress.md, context.md, and per-milestone subfolders (problem-statement.md, plan.md, progress.md)
- **m0-agents-root**: Create root `agents.md` — repo overview, conventions, workflow, context management
- **m0-agents-api**: Create `src/app/api/agents.md` — API patterns, validation, error handling, mock usage
- **m0-agents-ui**: Create `src/components/agents.md` — component patterns, testing, accessibility
- **m0-readmes**: Create README.md files for all major components (root, api, scan, plants, calendar, gardens, components, lib, stores, data, ai-work)
- **m0-quality**: Set up ESLint (strict TS), Prettier, and config files
- **m0-testing**: Set up Vitest with coverage-v8, React Testing Library, coverage thresholds (80%)
- **m0-hooks**: Set up Husky + lint-staged for pre-commit hooks (lint, format, test)
- **m0-mocks**: Create mock mode for Claude API (`MOCK_AI=true`), fixture files in `src/lib/__mocks__/`
- **m0-env**: Create `.env.example` with all env vars documented

### M1: Foundation (todos: m1-\*)

- **m1-init**: Initialize Next.js project with TypeScript, Mantine, pnpm
- **m1-mantine**: Install and configure Mantine packages (@mantine/core, hooks, form, dates, notifications)
- **m1-lowdb**: Set up lowdb with typed database interface, initialize db.ts and store modules
- **m1-seed-data**: Create plant seed data JSON (~50 common garden plants)
- **m1-layout**: Build app shell — mobile nav, page routing, theme
- **m1-db-seed**: Write initialization script to populate lowdb from seed-plants.json on first run

### M2: Seed Scanner (todos: m2-\*)

- **m2-camera-ui**: Build camera/upload component with mobile capture
- **m2-scan-api**: Create `/api/scan` route, integrate Claude Vision API
- **m2-scan-parser**: Parse Claude response into Plant schema
- **m2-scan-results**: Build scan results page with edit + confirm flow
- **m2-scan-save**: Save confirmed plant to database

### M3: Plants & Calendar (todos: m3-\*)

- **m3-plant-list**: Build searchable plant list page
- **m3-plant-detail**: Build plant detail view
- **m3-plant-api**: Create plant CRUD API routes
- **m3-calendar-logic**: Implement zone-aware planting date calculations
- **m3-calendar-ui**: Build monthly calendar view component
- **m3-add-to-garden**: "Add to my garden" flow connecting plants → calendar

### M4: Garden Layout (todos: m4-\*)

- **m4-garden-crud**: Garden CRUD API + create/edit garden page
- **m4-canvas**: Set up react-konva canvas with grid overlay
- **m4-drag-drop**: Implement drag-and-drop plant placement
- **m4-spacing**: Visual plant spacing circles + conflict detection
- **m4-height-sun**: Height-based row suggestions + sun/shade zone indicators
- **m4-optimize-api**: AI optimization endpoint using Claude

### M5: Polish (todos: m5-\*)

- **m5-integration**: Connect all features, ensure navigation flows work
- **m5-responsive**: Responsive design pass for all pages
- **m5-errors**: Error handling, loading states, empty states
- **m5-demo**: Demo walkthrough / README update

---

## 6. File Structure (Planned)

```
gardenmancer/
├── ai-work/
│   ├── progress.md                # Overall milestone tracker
│   ├── context.md                 # Architecture decisions, agent onboarding
│   ├── 0.non-negotiables/         # M0 with sub-milestones 0.1–0.7
│   ├── 1.foundation/              # M1 with sub-milestones 1.1–1.6
│   ├── 2.seed-scanner/            # M2 with sub-milestones 2.1–2.5
│   ├── 3.plants-calendar/         # M3 with sub-milestones 3.1–3.6
│   ├── 4.garden-layout/           # M4 with sub-milestones 4.1–4.6
│   └── 5.polish/                  # M5 with sub-milestones 5.1–5.4
├── agents.md                      # Root agent instructions
├── data/
│   ├── README.md                  # Data files: plant catalog format, db.json structure
│   ├── seed-plants.json           # Static plant catalog (~50 plants)
│   └── db.json                    # lowdb database file (gitignored)
├── src/
│   ├── app/
│   │   ├── layout.tsx             # root layout + nav
│   │   ├── page.tsx               # home / dashboard
│   │   ├── scan/
│   │   │   ├── README.md          # Seed scanner: how it works, Claude integration
│   │   │   └── page.tsx           # seed packet scanner
│   │   ├── plants/
│   │   │   ├── README.md          # Plant database: browsing, searching, data model
│   │   │   ├── page.tsx           # plant list
│   │   │   └── [id]/page.tsx      # plant detail
│   │   ├── calendar/
│   │   │   ├── README.md          # Planting calendar: zone logic, date calculations
│   │   │   └── page.tsx           # planting calendar
│   │   ├── gardens/
│   │   │   ├── README.md          # Garden layout: canvas editor, optimization
│   │   │   ├── page.tsx           # garden list
│   │   │   ├── new/page.tsx       # create garden
│   │   │   └── [id]/
│   │   │       ├── page.tsx       # garden detail
│   │   │       └── edit/page.tsx  # layout editor
│   │   └── api/
│   │       ├── README.md          # API overview: routes, formats, mocking
│   │       ├── agents.md          # API agent instructions
│   │       ├── scan/route.ts
│   │       ├── plants/route.ts
│   │       ├── gardens/route.ts
│   │       └── calendar/route.ts
│   ├── components/
│   │   ├── README.md              # UI components: patterns, Mantine usage, testing
│   │   ├── agents.md              # UI agent instructions
│   │   ├── camera-capture.tsx
│   │   ├── plant-card.tsx
│   │   ├── calendar-view.tsx
│   │   ├── garden-canvas.tsx
│   │   └── nav-bar.tsx
│   ├── lib/
│   │   ├── README.md                  # Core libraries: db, stores, Claude client
│   │   ├── db.ts                  # lowdb initialization + typed database
│   │   ├── stores/
│   │   │   ├── README.md          # Data stores: lowdb architecture, typed access
│   │   │   ├── plant-store.ts     # Plant data access layer
│   │   │   ├── garden-store.ts    # Garden data access layer
│   │   │   └── calendar-store.ts  # Calendar data access layer
│   │   ├── claude.ts              # Claude API client (with mock support)
│   │   ├── __mocks__/
│   │   │   ├── claude-scan.json   # Mock scan response fixture
│   │   │   └── claude-optimize.json # Mock optimize response fixture
│   │   ├── plants.ts              # plant utility functions
│   │   └── calendar.ts            # date/zone calculations
│   ├── __tests__/                 # test files mirror src/ structure
│   │   ├── lib/
│   │   ├── api/
│   │   └── components/
│   └── types/
│       └── index.ts               # shared TypeScript types (Plant, Garden, etc.)
├── public/
│   └── icons/                     # plant type icons
├── .env.example                   # Documented env vars template
├── .env.local                     # ANTHROPIC_API_KEY, MOCK_AI (gitignored)
├── .eslintrc.json
├── .prettierrc
├── .husky/
│   └── pre-commit                 # lint-staged hook
├── vitest.config.ts
├── next.config.js
├── postcss.config.js              # required by Mantine
├── tsconfig.json
├── package.json
└── README.md
```

---

## 7. Key Design Decisions

1. **lowdb (JSON) for storage** — Document-shaped data, zero infrastructure, human-readable. No images stored — seed packets are parsed and discarded. Upgrade to a real DB later if needed.
2. **Claude for everything AI** — Single API for both vision (seed packets) and text (optimization advice). Simplifies auth and billing.
3. **react-konva for garden layout** — Mature canvas library with React bindings. Supports drag-and-drop, hit detection, and layered rendering.
4. **Static plant data + AI augmentation** — Ship 50 plants in JSON as a baseline. AI fills gaps from seed packet scans.
5. **No auth for MVP** — Single-user local app. All data lives in a JSON file. Auth can be layered on later.
6. **Grid-based layout** — Plants snap to grid cells sized to smallest spacing increment (6 inches). Simpler than free-form placement.
7. **Mantine for UI** — Component-library-first approach. No separate CSS framework. 120+ components with built-in styling.
