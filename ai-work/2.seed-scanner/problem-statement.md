# Milestone 2: Seed Scanner

## Problem Statement

The seed packet scanner is Gardenmancer's signature feature — it lets users photograph a seed packet and instantly extract structured plant data using AI vision. This milestone builds the complete scanning pipeline from camera input to saved plant data, making it effortless to add new plants to the database without manual data entry.

The pipeline has five stages: a mobile-first camera/upload UI that captures seed packet photos, an API route that sends the image to Claude Opus 4.6's Vision API (with a mock fallback for development), a response parser that transforms Claude's natural language response into typed Plant data, a results UI where users can review and edit the extracted data before saving, and finally the save flow that persists the scanned plant to the lowdb store.

Each stage must handle failure gracefully — the camera may not be available (fall back to file upload), the API may fail or return garbage (show a user-friendly error with retry), the parser may not extract all fields (highlight missing data for manual entry), and the save may conflict with existing data (offer merge or overwrite). The mock mode (`MOCK_AI=true`) must produce realistic responses that exercise the full pipeline, so development and testing never require a real API key.
