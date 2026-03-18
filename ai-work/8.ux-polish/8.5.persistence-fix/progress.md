## Progress

Status: Complete

### Changes

1. **`src/lib/db.ts`** — Moved the `Low` singleton from a module-level `let` to `globalThis`. Module-level variables are reset during Next.js HMR (webpack/turbopack re-evaluates modules on each code change), which discarded the cached instance and forced unnecessary disk reads with potential race conditions. Storing on `globalThis` survives HMR. Added `resetDb()` helper for testing.

2. **`src/lib/seed.ts`** — Added `--force` flag support so `db:seed --force` can re-seed on demand. Added console log when skipping ("already seeded"). Added recovery for corrupt JSON files.

3. **`scripts/seed.ts`** — Passes `--force` CLI argument through to `seedDatabase()`.

4. **`package.json`** — Added `db:seed:force` convenience script.

5. **`src/test-setup.ts`** — Guarded `window.matchMedia` mock with `typeof window !== 'undefined'` so tests using `@vitest-environment node` don't crash.

6. **`src/lib/db-persistence.test.ts`** — 7 tests covering:
   - Singleton returns same instance on repeated calls
   - Singleton survives simulated HMR (module re-evaluation)
   - `resetDb()` creates fresh instance
   - Seed skips when data exists
   - Seed writes when db.json missing
   - Seed re-seeds with `force: true`
   - Seed handles corrupt JSON gracefully
