# Milestone 0: Non-Negotiables — Implementation Plan

## Approach

- **0.1–0.3 (Structure & Docs):** Create the ai-work folder hierarchy, write agent instruction files defining coding standards and workflow expectations, and author READMEs for the root project and each major directory explaining purpose and conventions.
- **0.4–0.5 (Code Quality & Testing):** Configure ESLint (with Next.js and TypeScript rules) and Prettier with a shared config, then set up Vitest with React Testing Library including coverage thresholds at 80% and example test patterns.
- **0.6–0.7 (Hooks & Mocking):** Install and configure Husky with a pre-commit hook that runs lint-staged (ESLint + Prettier + Vitest on changed files), then build the MOCK_AI environment variable infrastructure with mock response fixtures and a service abstraction layer that routes to real or mock implementations.

## Dependencies

- This milestone has no dependencies — it is the foundation for all others.
- Milestones 1–5 all depend on this milestone being complete.

## Acceptance Criteria

- All ai-work directories and files exist with meaningful content
- Agent instructions are comprehensive enough for an agent to start any milestone
- ESLint, Prettier, Vitest, and Husky are configured and functional
- `MOCK_AI=true` bypasses API calls with deterministic responses
- All READMEs are written and accurate
