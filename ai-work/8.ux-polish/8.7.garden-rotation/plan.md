# 8.7 Arbitrary Garden Rotation

Replace the cardinal direction orientation dropdown (N/S/E/W) with free 0-360° rotation:

1. **Remove** orientation dropdown from garden creation form
2. **Add** rotation control to garden canvas editor (drag handle or angle input, 0-360°)
3. **North is always screen-top** — the garden rotates relative to north, not the other way around
4. **Update data model** — replace `orientation: 'north' | 'south' | 'east' | 'west'` with `rotationDegrees: number` (0 = long side faces north)
5. **Update auto-optimize** — use rotation angle to determine which edge faces south for sun calculations
6. **Persist** rotation in garden JSON, allow editing after creation
