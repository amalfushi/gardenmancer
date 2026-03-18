# Gardenmancer — AI Agent Guide

## Project Overview

Gardenmancer is a mobile-first garden planning web app. Users scan seed packets, manage a plant database, view planting calendars, and design garden layouts with drag-and-drop.

## Tech Stack

- **Framework:** Next.js 16 (App Router, TypeScript strict)
- **UI:** Mantine UI component library
- **Database:** lowdb (JSON file-based)
- **Canvas:** react-konva for garden layout editor
- **AI:** Claude Opus 4.6 via Anthropic SDK (with mock mode)
- **Testing:** Vitest + React Testing Library
- **Component Dev:** Storybook (every UI component MUST have stories)
- **Package Manager:** pnpm

## Getting Started

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

## Commands

| Command               | Description                             |
| --------------------- | --------------------------------------- |
| `pnpm dev`            | Start dev server                        |
| `pnpm build`          | Production build                        |
| `pnpm test`           | Run tests once                          |
| `pnpm test:watch`     | Run tests in watch mode                 |
| `pnpm test:coverage`  | Run tests with coverage (80% threshold) |
| `pnpm storybook`      | Launch Storybook dev server             |
| `pnpm test:storybook` | Run Storybook test runner               |
| `pnpm lint`           | Lint with ESLint                        |
| `pnpm lint:fix`       | Lint and auto-fix                       |
| `pnpm format`         | Format with Prettier                    |
| `pnpm format:check`   | Check formatting                        |

## Before You Start

1. Read `ai-work/progress.md` — current milestone status and what's done.
2. Read `ai-work/context.md` — project-wide context, decisions, and constraints.
3. Check the relevant milestone folder in `ai-work/` for sub-milestone details.

## After Completing Work

- Update `ai-work/progress.md` with what was accomplished.
- Update the relevant milestone sub-folder's tracking files.

## Git Workflow

- **Worktrees:** Each milestone uses a separate worktree (e.g., `gardenmancer-m0`, `gardenmancer-m1`).
- **Branch naming:** `milestone-N/description` (e.g., `milestone-0/non-negotiables`).
- **Commits:** Use [Conventional Commits](https://www.conventionalcommits.org/) format.
- **Co-author trailer:** Always include in every commit:
  ```
  Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>
  ```
- **NEVER use `--no-verify`** on `git commit` or `git push`. Git hooks (pre-commit lint/format, pre-push tests) exist to enforce quality and must ALWAYS run. If hooks fail, fix the underlying issue — do not bypass them. Only the user can grant explicit permission to skip hooks.

### ⛔ MANDATORY: Pull Request Workflow — No Exceptions

**NEVER merge directly into `main`.** Every change to `main` MUST go through a pull request. This is a hard rule with zero exceptions.

The required workflow for every milestone (or any unit of work):

1. **Create a worktree** from the latest `main`: `git worktree add ../gardenmancer-mN milestone-N/description`
2. **Do all work** on the milestone branch in its worktree
3. **Push the branch** to origin: `git push origin milestone-N/description`
4. **Create a pull request** from the milestone branch into `main`
5. **Wait for the PR to be reviewed and approved** before merging
6. **NEVER** run `git merge` or `git checkout main` to merge branches locally
7. **NEVER** push directly to `main`

Agents must NOT:

- Run `git checkout main && git merge <branch>` — this bypasses PR review
- Run `git push origin main` — main is protected and only updated via merged PRs
- Merge milestone branches into each other or into main directly
- Use `git pull origin <branch>` on main to fast-forward merge

If asked to "merge" something, the correct action is to **create a pull request**, not to perform a local git merge.

## File Ownership by Milestone

| Milestone | Owns                                         |
| --------- | -------------------------------------------- |
| M0        | Project setup, tooling, CI                   |
| M1        | `src/lib/`, `src/app/api/`, core data models |
| M2        | `src/app/scan/` — seed packet scanning       |
| M3        | `src/app/plants/`, `src/app/calendar/`       |
| M4        | `src/app/gardens/` — layout editor           |
| M5        | Polish, PWA, performance                     |

## Mock Mode

Set `MOCK_AI=true` in `.env.local` to develop without an Anthropic API key. Mock fixtures live in `src/lib/__mocks__/` and return realistic sample data for scan and optimize endpoints.

## Code Style

- **TypeScript strict mode** — no `any` unless absolutely necessary.
- **Mantine components** — use Mantine primitives instead of raw HTML elements.
- **Validation** — use `zod` schemas for runtime validation of API inputs and data.
- **Testing** — every feature needs tests. Target 80% coverage across lines, branches, functions, and statements.
- **Storybook** — every component must have a `.stories.tsx` file. Use `pnpm storybook` for development, `pnpm test:storybook` for CI.
- **Mobile-first** — design for 375px viewport width, then scale up.
