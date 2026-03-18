# 6.2 Cypress E2E Flows

Four E2E test suites using `cy.prompt()` for natural language test steps where possible (self-healing, resilient to UI changes):

- **Scan flow**: upload image → see results → edit → confirm → verify in plant list
- **Plants flow**: browse → search → view detail → add to garden → verify calendar
- **Garden flow**: create garden → place plants → check spacing → view suggestions
- **Navigation**: all nav links, 404 handling, empty states, back/forward

Prefer `cy.prompt()` for interaction steps (e.g., `cy.prompt('click the Scan button and upload an image')`) with traditional assertions for verification.
