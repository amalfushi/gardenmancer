## Progress

Status: ✅ Complete

### What was done

- Added `Hemisphere` type (`northern` | `southern`) to Garden model
- Added hemisphere selector to GardenForm component
- Implemented `getSunBlockingSide()` and `isOnTallPlantSide()` functions
- Updated `getHeightSuggestions()` to be hemisphere-aware (NH: tall→north, SH: tall→south)
- Added `mirrorMonth()` for southern hemisphere frost date calculation
- Updated `getLastFrostDate()` to accept hemisphere parameter
- Updated API schemas (create + update) to accept hemisphere
- Default hemisphere to 'northern' in garden store
- Unit tests for hemisphere logic and frost date mirroring
