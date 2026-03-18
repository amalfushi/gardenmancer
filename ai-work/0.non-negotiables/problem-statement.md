# Milestone 0: Non-Negotiables

## Problem Statement

Before any feature code is written, the project needs a rock-solid foundation of tooling, quality gates, and developer experience infrastructure. This milestone establishes the non-negotiable standards that every subsequent milestone depends on — without these, parallel agent development would produce inconsistent, untestable, and unmaintainable code.

The non-negotiables include: the ai-work tracking structure itself (so agents know where to find their instructions and report progress), comprehensive agent instructions (so every agent operates consistently), READMEs at every level (so any developer or agent can orient quickly), code quality enforcement via ESLint and Prettier (so all code follows the same style), a testing framework with Vitest and React Testing Library (so every feature ships with tests), git hooks via Husky (so broken code never reaches the repository), and a mocking infrastructure (so development can proceed without real API keys).

These seven sub-milestones are intentionally ordered: the tracking structure comes first because agents need it to operate, then agent instructions define how agents should work, then READMEs document the project, then code quality and testing ensure correctness, git hooks enforce the rules, and finally mocking enables offline development. Completing this milestone means any agent can pick up any subsequent milestone and immediately know what to do, how to do it, and how to verify their work.
