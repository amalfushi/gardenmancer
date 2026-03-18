# Milestone 1: Foundation

## Problem Statement

Gardenmancer needs a fully configured Next.js application with all core infrastructure in place before any features can be built. This milestone transforms the empty repository into a running application with a UI framework, a database layer, seed data, and a navigable app shell — the base that every feature milestone builds upon.

The foundation work includes initializing a Next.js 16 project with TypeScript and pnpm, integrating Mantine as the UI component library with a garden-themed configuration, setting up lowdb with typed TypeScript store wrappers for type-safe JSON persistence, populating the database with approximately 50 common garden plants as seed data, building the mobile-first app shell with navigation between the three main sections (Scanner, Plants/Calendar, Garden Layout), and ensuring the database initializes correctly on first run.

Getting this milestone right is critical because every subsequent milestone assumes these pieces exist and work correctly. The plant seed data enables the calendar and garden layout features to have content from day one. The typed lowdb stores define the data contracts that the scanner will write to and the garden editor will read from. The app shell provides the navigation skeleton that features plug into. A broken foundation means every downstream milestone inherits those problems.
