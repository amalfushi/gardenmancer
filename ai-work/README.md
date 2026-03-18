# AI Work Tracking

## Purpose

The `ai-work/` directory contains tracking documents for AI agents working on this project. It provides context, progress tracking, and milestone-specific details so agents can quickly understand what's been done and what needs doing.

## Structure

```
ai-work/
├── context.md              # Project-wide context, decisions, constraints
├── progress.md             # Overall milestone progress tracker
├── 0.non-negotiables/      # M0: Project setup and tooling
├── 1.foundation/           # M1: Data models, stores, base UI
├── 2.seed-scanner/         # M2: Seed packet scanning feature
├── 3.plants-calendar/      # M3: Plant database + planting calendar
├── 4.garden-layout/        # M4: Garden layout editor
└── 5.polish/               # M5: PWA, performance, polish
```

## How Agents Should Use These Docs

1. **Before starting:** Read `progress.md` and `context.md` to understand current state.
2. **During work:** Refer to the milestone-specific sub-folder for detailed requirements.
3. **After completing work:** Update `progress.md` with what was accomplished.

## Milestone Hierarchy

Each milestone folder may contain:

- **`README.md`** — Milestone overview and goals
- **`tasks.md`** — Detailed task breakdown
- **`progress.md`** — Sub-milestone progress tracking
- **`decisions.md`** — Design decisions and rationale
