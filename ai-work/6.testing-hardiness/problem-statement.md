# Milestone 6: Testing Hardiness

## Problem
While we have solid unit and component tests via Vitest + React Testing Library, we lack:
1. **End-to-end browser tests** that verify real user flows (scan → save → browse → plan → layout)
2. **Interactive Storybook tests** with `play()` functions that simulate user interactions (clicks, form fills, modal flows)
3. **Accessibility testing** to catch a11y violations systematically

## Approach
- **Cypress** for E2E tests running against the actual Next.js dev server — tests the full stack including API routes, navigation, and data persistence
- **Storybook interaction tests** using `@storybook/test` play functions — faster than Cypress, tests component behavior in isolation with real user events
- **Storybook a11y addon** — automated accessibility audits on every story
