# Milestone 7: Garden Intelligence — Plan

## Dependency chain

7.1 (hemisphere) + 7.2 (shade zones) + 7.3 (raised bed density) can run in parallel → 7.4 (auto-optimize) depends on all three.

## Research Summary

### Sun Path by Hemisphere

- **Northern hemisphere**: sun travels across the southern sky. Tall plants go on the **north** side to avoid shading shorter plants.
- **Southern hemisphere**: sun travels across the northern sky. Tall plants go on the **south** side.

### Raised Bed Density (Square Foot Gardening)

- Raised beds support ~25-30% denser spacing than traditional row planting
- Square Foot Gardening divides beds into 1ft² squares: large plants 1/sq, medium 4/sq, small 9-16/sq
- Better soil, drainage, and no foot compaction enable this density
- Apply spacing multiplier of 0.7-0.75 for raised bed type gardens
- Caveat: some crops (tomatoes, squash) still need standard spacing for airflow

### Auto-Optimize Algorithm

1. Determine sun direction from hemisphere + orientation
2. Sort plants by height category (tall → ground)
3. Place tall plants on the sun-blocking side (north in NH, south in SH)
4. Place shade-tolerant plants in marked shade zones or behind tall plants
5. Group companion plants together (within 2-3 grid cells)
6. Separate antagonist plants (>4 grid cells apart)
7. Apply spacing rules (with raised bed multiplier if applicable)
8. Score the layout and suggest improvements
