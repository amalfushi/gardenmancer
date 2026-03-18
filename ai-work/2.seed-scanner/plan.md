# Milestone 2: Seed Scanner — Implementation Plan

## Approach

- **2.1–2.2 (Input & API):** Build the camera/upload UI component with HTML5 capture attribute for mobile and file picker fallback, then create the Next.js API route that sends base64-encoded images to Claude Opus 4.6 Vision API with a structured prompt for plant data extraction (and mock implementation for `MOCK_AI=true`).
- **2.3–2.4 (Processing & Display):** Implement a response parser that extracts plant name, variety, spacing, sun, water, days to harvest, zones, and planting instructions from Claude's response into a typed Plant interface, then build the scan results UI with editable fields, validation indicators, and a confidence display.
- **2.5 (Persistence):** Create the save flow that validates the parsed/edited plant data, checks for duplicates in the lowdb store, and persists the new plant with appropriate feedback (success, duplicate warning, or error).

## Dependencies

- Depends on Milestone 1 (Next.js app, Mantine UI, lowdb stores, and plant type definitions must exist).
- Milestone 3 benefits from this (scanned plants appear in the plant list).

## Acceptance Criteria

- Users can photograph or upload a seed packet image
- Claude Vision API extracts plant data (or mock returns realistic data)
- Parsed results are displayed in an editable form
- Users can save scanned plants to the database
- Full pipeline works in mock mode without API keys
