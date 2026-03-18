# Milestone 8: UX Polish — Progress

| #   | Sub-milestone   | Status      | Notes                                                                                    |
| --- | --------------- | ----------- | ---------------------------------------------------------------------------------------- |
| 8.1 | North Arrow     | ✅ Complete | Compass on garden canvas                                                                 |
| 8.2 | Photo Upload    | ✅ Complete | File upload on scan tab                                                                  |
| 8.3 | Calendar Filter | ✅ Complete | Filter by garden plants                                                                  |
| 8.4 | Browse Card Fix | ✅ Complete | Dashboard card sizing                                                                    |
| 8.5 | Persistence Fix | ✅ Complete | lowdb persistence across dev restarts                                                    |
| 8.6 | Mascot          | ✅ Complete | Wizard mascot on home/loading/empty                                                      |
| 8.7 | Garden Rotation | ✅ Complete | Free 0-360° rotation, visual canvas rotation, bounding box sizing, post-creation editing |

## Post-feedback Fixes

After the initial M8 implementation, several rounds of user feedback led to additional fixes:

1. **Auto-optimize regression fix** — M7 features (auto-optimize, shade zones, hemisphere, raised bed density) were merged into the M8 branch since M7 and M8 branched independently from M6
2. **Apply/Dismiss buttons at top** — Duplicate buttons added at the top of the optimization results panel for easier access
3. **Visual canvas rotation** — Garden canvas now visually rotates via Konva Group transform to match `rotationDegrees`
4. **Post-creation rotation editing** — Mantine Slider added to garden detail page for changing rotation after garden creation
5. **Canvas bounding box sizing** — Canvas computes a rotated bounding box (`|W·cos(θ)| + |H·sin(θ)|`) to fit the garden at any rotation angle
6. **Rotation-aware optimize algorithm** — `sunAwayScore()` projection function properly combines rotation angle and hemisphere for tall-plant placement

## Summary

- **Completed:** 7 / 7
- All sub-milestones implemented with unit tests
- Includes M7 garden intelligence features via merge (auto-optimize, shade zones, hemisphere, raised bed density)
- 320 unit tests passing (31 test files), build succeeds, lint clean (0 errors)
