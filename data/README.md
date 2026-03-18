# Data Directory

## Files

### `seed-plants.json` (planned)

A static catalog of common garden plants with their attributes:

```json
{
  "plants": [
    {
      "name": "Cherry Tomato",
      "species": "Solanum lycopersicum",
      "spacing": 24,
      "sunNeeds": "full",
      "daysToMaturity": 65,
      "zones": [3, 4, 5, 6, 7, 8, 9, 10]
    }
  ]
}
```

This file is checked into version control and serves as the default plant database.

### `db.json` (runtime, gitignored)

The lowdb runtime database file. Created automatically on first run. Contains user-created plants, gardens, and layout data. This file is **not** committed to version control — each developer has their own local copy.
