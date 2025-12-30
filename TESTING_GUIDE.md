# Testing Guide - Countdown Timer & Match Time

## 🧪 Quick Test Method 1: Manual Time Setting

**Easiest way to test countdown and match time:**

1. Open `src/data/players.js`
2. Set a match start time to **2-3 minutes in the future**:

```javascript
{
  id: 'burnley-newcastle',
  homeTeam: 'Burnley',
  awayTeam: 'Newcastle',
  startTime: new Date(Date.now() + 2 * 60 * 1000).toISOString(), // 2 minutes from now
},
```

Or use a specific time:

```javascript
// Example: Match starts in 5 minutes
const now = new Date();
const in5Minutes = new Date(now.getTime() + 5 * 60 * 1000);
startTime: in5Minutes.toISOString(),
```

3. Run `npm run dev`
4. Watch the countdown timer count down
5. When it reaches 0, the match time will appear (45', 67', etc.)

## 🎮 Quick Test Method 2: Use Current Time (Instant Live)

Set match time to **1 minute ago** to see it as "live":

```javascript
{
  id: 'burnley-newcastle',
  homeTeam: 'Burnley',
  awayTeam: 'Newcastle',
  startTime: new Date(Date.now() - 60 * 1000).toISOString(), // 1 minute ago
},
```

This will show:

- Match time: "1'" (or current elapsed time)
- Red pulsing dot (live indicator)
- "В ПРОЦЕС" status

## 🌐 Test Method 3: Use Real Live Match (Free API)

### Option A: TheSportsDB (No API Key Needed)

1. Create a test match in `src/data/players.js` with a real live match
2. Use TheSportsDB to find a live match: https://www.thesportsdb.com/api/v1/json/3/livescore.php?l=4328 (Premier League)

### Option B: Manual Test with Real Match

1. Find a live match on livescore.com or flashscore.com
2. Update one of your matches in `src/data/players.js`:
   - Change team names to match the live game
   - Set `startTime` to the actual match start time (or a few minutes before current time)
   - Update scores in `src/utils/api.js` → `getMockScores()` to match live scores

Example:

```javascript
// In src/data/players.js
{
  id: 'test-match',
  homeTeam: 'Real Madrid', // Change to actual live match
  awayTeam: 'Barcelona',
  startTime: '2024-01-20T18:00:00Z', // Actual match start time
}

// In src/utils/api.js → getMockScores()
return {
  'test-match': { home: 2, away: 1 }, // Update with live score
  // ... other matches
};
```

## 📝 Step-by-Step Test Scenario

### Test Countdown Timer:

1. Set match time to 5 minutes in the future
2. Open app → See countdown: "5м 0с"
3. Wait and watch it count down
4. At 0, it should switch to match time

### Test Match Time Display:

1. Set match time to 30 minutes ago
2. Open app → Should show "30'" (first half)
3. Update to 50 minutes ago → Should show "50'"
4. Update to 47 minutes ago → Should show "HT" (half time)
5. Update to 70 minutes ago → Should show "68'" (second half)
6. Update to 93 minutes ago → Should show "90+3'" (injury time)

### Test Live Indicator:

1. Set match time to past (match started)
2. Update score in `getMockScores()` to non-zero: `{ home: 1, away: 0 }`
3. Should see red pulsing dot (●) and match time

## 🔧 Quick Test Script

Add this to `src/data/players.js` for easy testing:

```javascript
// Helper function for testing
function getTestTime(minutesFromNow) {
  return new Date(Date.now() + minutesFromNow * 60 * 1000).toISOString();
}

// Then use:
startTime: getTestTime(5), // 5 minutes from now (countdown)
startTime: getTestTime(-30), // 30 minutes ago (live match at 30')
```

## ✅ What to Verify

- [ ] Countdown shows correct time remaining
- [ ] Countdown updates every second
- [ ] When countdown reaches 0, match time appears
- [ ] Match time shows correct minutes (45', 67', etc.)
- [ ] Half time shows "HT"
- [ ] Injury time shows "90+X'"
- [ ] Red dot pulses when match is live
- [ ] Status changes from countdown to "В ПРОЦЕС"

## 🐛 Troubleshooting

**Countdown not updating?**

- Check browser console for errors
- Verify `startTime` is valid ISO string
- Make sure `MatchCard` component is re-rendering (check React DevTools)

**Match time not showing?**

- Verify match has started (time is in the past)
- Check that score is not 0:0 (or update score in `getMockScores()`)
- Verify `getMatchTime()` function is working (check console)

**Times look wrong?**

- Remember: times are in UTC
- Bulgarian time = UTC + 2 (winter) or UTC + 3 (summer)
- Use a time converter: https://www.timeanddate.com/worldclock/converter.html
