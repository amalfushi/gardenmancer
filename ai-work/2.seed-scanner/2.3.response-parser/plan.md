# 2.3 Response Parser — Plan

Implement a parser that transforms Claude's natural language response into a typed `Plant` object, handling variations in how Claude formats data (e.g., "12 inches" vs "12in" vs "12\"" for spacing). Include confidence scoring for each extracted field and gracefully handle missing or ambiguous data by marking fields as requiring user review.
