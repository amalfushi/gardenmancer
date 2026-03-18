# 8.7 Garden Rotation — Progress

## Status: ✅ Complete

## Features Delivered

- **Free 0-360° rotation slider** — Replaced cardinal direction dropdown with continuous slider (N/E/S/W marks)
- **Visual canvas rotation** — Garden canvas visually rotates via Konva Group transform to match `rotationDegrees`
- **Bounding box calculation** — Canvas computes rotated bounding box (`|W·cos(θ)| + |H·sin(θ)|`) to fit garden at any angle
- **Post-creation rotation editing** — Mantine Slider on garden detail page allows changing rotation after creation
- **Rotation-aware auto-optimize** — `sunAwayScore()` projection function combines rotation angle and hemisphere for tall-plant placement
- **Backward-compatible migration** — `migrateGarden()` converts legacy cardinal directions to degree values

## Changes Made

### Data Model (`src/types/index.ts`)

- Replaced `orientation: 'north' | 'south' | 'east' | 'west'` with `rotationDegrees: number` (0-360°)
- Added `CardinalDirection` type alias for backward compat
- Added `cardinalToDegrees()` and `migrateGarden()` helpers for legacy data migration

### Garden Form (`src/components/garden-form.tsx`)

- Removed cardinal direction `<Select>` dropdown
- Added `<Slider>` (0-360°) with N/E/S/W marks and degree label
- Updated `GardenFormValues` interface: `orientation` → `rotationDegrees`

### North Arrow (`src/components/north-arrow.tsx`)

- Changed prop from `orientation: CardinalDirection` to `rotationDegrees: number`
- Arrow rotation = `-rotationDegrees` (counter-rotate to show true north)

### Garden Canvas (`src/components/garden-canvas.tsx`)

- Changed prop from `orientation` to `rotationDegrees`
- Canvas visually rotates garden via Konva Group transform
- Computes rotated bounding box to size canvas correctly at any angle
- Updated aria-label to show rotation degrees

### Garden Card (`src/components/garden-card.tsx`)

- Display changed from "Faces north" to "0° rotation"

### Garden Detail Page (`src/app/gardens/[id]/page.tsx`)

- Updated to pass `rotationDegrees` prop to canvas
- Added Mantine Slider for editing rotation after garden creation
- Updated subtitle text

### Auto-Optimize (`src/lib/garden-utils.ts`)

- `getHeightSuggestions()` now uses trigonometric projection for arbitrary angles
- `sunAwayScore()` projects plant position onto north-south axis using rotation angle
- Properly combines rotation angle with hemisphere setting for correct tall-plant placement
- Works continuously rather than only at 4 cardinal points

### API Routes

- `POST /api/gardens` — schema uses `rotationDegrees: z.number().min(0).max(360)`
- `PUT /api/gardens/[id]` — same
- `GET` endpoints wrap responses with `migrateGarden()` for legacy compat
- Optimize route passes `rotationDegrees` instead of `orientation`

### Tests Updated

- `garden-form.test.tsx` — slider field, new defaults test
- `north-arrow.test.tsx` — degree-based rotation, arbitrary angles
- `garden-card.test.tsx` — rotation display text
- `gardens.test.ts` — API schema changes
- `optimize.test.ts` — mock data
- `garden-utils.test.ts` — rotation-based height suggestions + arbitrary angle test
- `garden-store.test.ts` — mock data

### Stories Updated

- `garden-form.stories.tsx` — `rotationDegrees` in initialValues
- `north-arrow.stories.tsx` — degree-based stories with 0°/45°/90°/180°/270°/315°
- `garden-card.stories.tsx` — `rotationDegrees` in base garden

## Test Results

- 320 tests passing (31 test files)
