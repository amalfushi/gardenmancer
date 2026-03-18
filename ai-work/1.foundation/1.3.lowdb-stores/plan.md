# 1.3 lowdb Stores — Plan

Install lowdb and create typed TypeScript store wrappers for each entity: `PlantStore`, `GardenStore`, and `ScanStore`. Each wrapper provides type-safe CRUD methods (getAll, getById, create, update, delete) backed by a shared `db.json` file, with interfaces defined in `src/lib/types/` for `Plant`, `Garden`, `GardenPlant`, and `Scan`.
