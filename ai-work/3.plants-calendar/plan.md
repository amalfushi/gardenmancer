# Milestone 3: Plants & Calendar — Implementation Plan

## Approach

- **3.1–3.3 (Plant Data & UI):** Create Next.js API routes for CRUD operations on the plant store, build a searchable/filterable plant list page with Mantine cards and search input, and implement plant detail pages showing all metadata (spacing, sun, water, zones, instructions) with a clean, mobile-friendly layout.
- **3.4–3.5 (Calendar):** Implement the zone-aware calendar logic engine that calculates planting windows (indoor start, transplant, direct sow, harvest) from a plant's requirements and the user's last frost date, then build the calendar UI with month/week views showing color-coded planting activities.
- **3.6 (Garden Bridge):** Add an "Add to Garden" action on plant detail pages that lets users select a garden, specify quantity, and queue the plant for placement in the garden layout editor.

## Dependencies

- Depends on Milestone 1 (lowdb stores, plant seed data, app shell).
- Milestone 4 uses the "add to garden" data created here.

## Acceptance Criteria

- Users can browse, search, and filter the full plant database
- Plant detail pages show comprehensive growing information
- Calendar shows zone-correct planting windows for the user's location
- Users can add plants to their gardens from the detail view
