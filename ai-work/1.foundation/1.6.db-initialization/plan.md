# 1.6 DB Initialization — Plan

Implement a database initialization routine that runs on application startup: check if `db.json` exists and contains valid data, and if not, seed it with the ~50 plants from the seed data file and empty collections for gardens and scans. Expose this as both a startup check and a CLI command (`pnpm db:seed`) for manual re-seeding during development.
