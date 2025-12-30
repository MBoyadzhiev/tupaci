# Quick Test Example

## Test Countdown Timer (5 minutes)

Edit `src/data/players.js`:

```javascript
import { getTestTime } from "../utils/testHelpers";

export const matches = [
  {
    id: "burnley-newcastle",
    homeTeam: "Burnley",
    awayTeam: "Newcastle",
    startTime: getTestTime(5), // 5 minutes from now - watch countdown!
  },
  // ... other matches
];
```

Run `npm run dev` and watch the countdown!

## Test Live Match (30 minutes in)

Edit `src/data/players.js`:

```javascript
import { getPastTime } from "../utils/testHelpers";

export const matches = [
  {
    id: "burnley-newcastle",
    homeTeam: "Burnley",
    awayTeam: "Newcastle",
    startTime: getPastTime(30), // Match started 30 minutes ago
  },
  // ... other matches
];
```

Edit `src/utils/api.js` → `getMockScores()`:

```javascript
function getMockScores() {
  return {
    "burnley-newcastle": { home: 1, away: 2 }, // Live score!
    "arsenal-aston-villa": { home: 0, away: 0 },
    "man-utd-wolves": { home: 0, away: 0 },
  };
}
```

You'll see:

- Match time: "30'"
- Red pulsing dot (●)
- Live scores updating

## Test with Real Live Match

1. Go to https://www.livescore.com
2. Find a match that's currently live
3. Update `src/data/players.js`:
   ```javascript
   {
     id: 'real-match',
     homeTeam: 'Real Madrid', // Actual team names
     awayTeam: 'Barcelona',
     startTime: '2024-01-20T18:00:00Z', // Actual start time (or use getPastTime(45))
   }
   ```
4. Update `src/utils/api.js` → `getMockScores()`:
   ```javascript
   'real-match': { home: 2, away: 1 }, // Actual live score
   ```

Now you're testing with a real live match!
