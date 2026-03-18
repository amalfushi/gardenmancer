# 4.6 AI Optimization — Plan

Build the AI garden optimization feature: serialize the current garden layout (plant positions, types, spacing, garden dimensions, sun direction) into a structured prompt, send it to Claude Opus 4.6 for analysis, parse the response into actionable suggestions (move plant X to position Y, add companion plant Z, remove conflicting pair A-B), and render suggestions as a visual overlay on the canvas with accept/dismiss controls per suggestion.
