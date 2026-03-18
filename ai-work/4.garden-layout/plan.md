# Milestone 4: Garden Layout Editor — Implementation Plan

## Approach

- **4.1–4.2 (Foundation):** Implement garden CRUD (create, rename, resize, delete garden beds with lowdb persistence), then set up the react-konva Stage/Layer with a configurable grid overlay, zoom/pan controls, and responsive canvas sizing.
- **4.3–4.5 (Interaction & Visualization):** Build drag-and-drop plant placement with snap-to-grid, touch support, and undo/redo, then add spacing visualization (circles showing plant footprints with red overlap warnings), and height/sun hint layers (color-coded height bands, sun direction indicator).
- **4.6 (AI Optimization):** Create the AI optimization feature that serializes the current layout to a prompt, sends it to Claude Opus 4.6 for analysis, parses suggestions (move plant X, add companion Y, remove conflicting Z), and renders them as an accept/dismiss overlay on the canvas.

## Dependencies

- Depends on Milestone 1 (lowdb stores, app shell) and Milestone 3 (plant data with spacing/sun/height metadata, add-to-garden flow).
- This is the most complex milestone and may benefit from starting 4.1–4.2 in parallel with Milestone 3.

## Acceptance Criteria

- Users can create and manage multiple garden beds
- Canvas renders a grid with zoom, pan, and responsive sizing
- Plants can be dragged onto the grid with snap behavior
- Spacing conflicts are visually highlighted
- AI optimization provides actionable, visual suggestions
