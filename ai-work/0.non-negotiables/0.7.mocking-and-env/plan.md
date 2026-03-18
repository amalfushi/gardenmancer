# 0.7 Mocking & Environment — Plan

Build the `MOCK_AI=true` infrastructure: create an AI service abstraction layer that checks the environment variable and routes to either the real Claude API client or a mock implementation returning deterministic fixture data. Set up `.env.example` documenting all variables, `.env.local` for secrets (gitignored), and mock fixture files in `src/test/fixtures/` with realistic plant scan responses.
