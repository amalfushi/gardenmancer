# 2.2 Scan API (Claude) — Plan

Create a Next.js API route (`/api/scan`) that accepts a base64-encoded image, constructs a structured prompt instructing Claude Opus 4.6 to extract plant data fields (name, variety, spacing, sun, water, zones, days to harvest, planting instructions) from the seed packet image, sends it via the Anthropic SDK, and returns the raw response. When `MOCK_AI=true`, bypass the API call and return a fixture response with realistic plant data.
