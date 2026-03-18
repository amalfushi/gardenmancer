# Gardenmancer 🌱

A mobile-first web app to plan, organize, and track your garden. Scan seed packets with AI, manage your plant database, view planting calendars, and design garden layouts with drag-and-drop.

## ✅ Features

| Feature                 | Status         | Description                                                             |
| ----------------------- | -------------- | ----------------------------------------------------------------------- |
| 📸 Seed Packet Scanning | ✅ Implemented | Photograph seed packets — AI extracts plant data (mock mode)            |
| 🌿 Plant Database       | ✅ Implemented | Browse, search, and filter 50+ garden plants                            |
| 📅 Planting Calendar    | ✅ Implemented | Zone-aware timeline with indoor start, transplant, and direct sow dates |
| 🏡 Garden Layout Editor | ✅ Implemented | Drag-and-drop canvas with grid, spacing visualization, conflict checks  |
| 🤖 AI Optimization      | ✅ Implemented | Layout suggestions for height, sun zones, and companion planting        |
| 📊 Dashboard            | ✅ Implemented | Home page stats — plant count, garden count, next planting date         |
| 📱 Responsive Design    | ✅ Implemented | Mobile-first with adaptive navbar, modals, and grid layouts             |
| ⚠️ Error Handling       | ✅ Implemented | Loading, empty, and error states with retry across all pages            |

## Screenshots

| Page              | Description                                                                                    |
| ----------------- | ---------------------------------------------------------------------------------------------- |
| **Home**          | Dashboard with key stats (plants, gardens, next planting date) and feature cards               |
| **Plants**        | Searchable plant grid (1 col mobile, 2 tablet, 3 desktop) with sun/height badges               |
| **Plant Detail**  | Full plant info with growing requirements, companion plants, zones, and "Add to Garden" button |
| **Calendar**      | Zone selector (USDA 3–10) with 12-month timeline for indoor start, transplant, direct sow      |
| **Gardens**       | Garden list with type badges, dimensions, orientation, and plant counts                        |
| **Garden Editor** | Interactive react-konva canvas with grid, plant palette, spacing circles, and AI suggestions   |
| **Scan**          | Seed packet scanner stub (camera UI placeholder for future Claude API integration)             |

## Tech Stack

| Layer       | Technology                      |
| ----------- | ------------------------------- |
| Framework   | Next.js 16 (App Router)         |
| Language    | TypeScript (strict mode)        |
| UI          | Mantine UI v8                   |
| Database    | lowdb (JSON file-based)         |
| Canvas      | react-konva                     |
| AI          | Claude Opus 4.6 (mocked in dev) |
| Testing     | Vitest + React Testing Library  |
| Stories     | Storybook 10                    |
| Package Mgr | pnpm                            |

## Getting Started

```bash
# 1. Clone and install
git clone <repo-url>
cd gardenmancer
pnpm install

# 2. Set up environment
cp .env.example .env.local
# Leave MOCK_AI=true for development (no API key needed)

# 3. Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command                | Description                             |
| ---------------------- | --------------------------------------- |
| `pnpm dev`             | Start dev server on :3000               |
| `pnpm build`           | Production build                        |
| `pnpm start`           | Run production server                   |
| `pnpm test`            | Run all tests                           |
| `pnpm test:watch`      | Run tests in watch mode                 |
| `pnpm test:coverage`   | Run tests with coverage (80% threshold) |
| `pnpm lint`            | Lint with ESLint                        |
| `pnpm format`          | Format with Prettier                    |
| `pnpm storybook`       | Component showcase on :6006             |
| `pnpm build-storybook` | Build static Storybook                  |
| `pnpm db:seed`         | Seed database with sample plants        |

## Project Structure

```
gardenmancer/
├── src/
│   ├── app/                  # Next.js App Router pages and API routes
│   │   ├── api/              # RESTful API (plants, gardens, calendar)
│   │   ├── plants/           # Plant browser and detail pages
│   │   ├── gardens/          # Garden list, create, and editor pages
│   │   ├── calendar/         # Planting calendar page
│   │   └── scan/             # Seed packet scanner page
│   ├── components/           # Reusable React components (Mantine-based)
│   │   ├── *.tsx             # Component implementations
│   │   └── *.stories.tsx     # Storybook stories (every component)
│   ├── lib/                  # Core business logic
│   │   ├── db.ts             # lowdb database instance
│   │   ├── calendar.ts       # Frost dates and planting date computation
│   │   ├── garden-utils.ts   # Grid, spacing, conflict detection, suggestions
│   │   ├── claude.ts         # AI integration (mock mode)
│   │   └── stores/           # Data access layer (plant, garden, calendar)
│   ├── types/                # TypeScript interfaces
│   └── __tests__/            # Test files (unit & component)
├── data/                     # Static data (plant catalog, runtime DB)
├── ai-work/                  # Milestone tracking and progress docs
└── [config files]            # ESLint, Prettier, Vitest, Storybook, Husky
```

## Mock Mode

Set `MOCK_AI=true` in your `.env.local` to develop without an Anthropic API key. The app returns realistic fixture data for all AI-powered features (seed scanning, layout optimization).

## License

Internal project.
