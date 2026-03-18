# Milestone 7: Garden Intelligence

## Problem

The garden layout optimizer needs real horticultural logic — hemisphere-aware sun paths, shade zone support, raised bed density rules, and a proper auto-optimize algorithm that uses all of this together.

## Approach

Build the foundational data models first (hemisphere, shade zones, raised bed density multiplier), then implement the auto-optimize algorithm that leverages all of them.

## Sub-milestones

1. **7.1 Hemisphere Support** — Northern/southern hemisphere setting, mirror sun path and frost dates
2. **7.2 Shade Zones** — Mark areas of a garden as partial/full shade, canvas overlay
3. **7.3 Raised Bed Density** — Apply 0.7-0.75x spacing multiplier for raised bed gardens
4. **7.4 Auto-Optimize** — Algorithm: tall plants on sun-blocking side, companion clusters, shade-aware placement, density-adjusted spacing
