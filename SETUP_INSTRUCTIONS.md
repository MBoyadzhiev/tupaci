# Setup Instructions

## 📸 Adding Player Photos

1. Add player photos to the `public/photos/` folder:

   - `kemchev.jpg` - Photo of Nikolay Kemchev
   - `daniel.jpg` - Photo of Daniel Lyubomirov
   - `jose.jpg` - Photo of Жозе Сисиньо
   - `dimitar.jpg` - Photo of Dimitar Lazarov
   - `martin.jpg` - Photo of Martin Boyadzhiev

2. Photo requirements:

   - Format: JPG or PNG
   - Size: Recommended 200x200px or larger (square)
   - The app will automatically crop to circle

3. If photos are missing, the app will use placeholder avatars automatically.

## ⏰ Setting Match Start Times

Update match start times in `src/data/players.js`:

```javascript
export const matches = [
  {
    id: "burnley-newcastle",
    homeTeam: "Burnley",
    awayTeam: "Newcastle",
    startTime: "2024-01-20T15:00:00Z", // Update this!
  },
  // ... other matches
];
```

**Time Format:**

- Use ISO 8601 format: `YYYY-MM-DDTHH:mm:ssZ`
- Example: `'2024-01-20T15:00:00Z'` = January 20, 2024 at 3:00 PM UTC
- For Bulgarian time (EET/EEST), subtract 2-3 hours from UTC

**Example:**

- Match starts at 5:00 PM Bulgarian time (EET = UTC+2)
- Use: `'2024-01-20T15:00:00Z'` (3:00 PM UTC)

## 🎯 How It Works

### Countdown Timer

- Shows time remaining until match starts
- Updates every second
- Format: "2ч 30м 15с" or "45м 20с" or "30с"

### Match Time Display

- When match starts, shows live game time
- Format: "45'" (first half), "HT" (half time), "67'" (second half), "90+3'" (injury time)
- Red pulsing dot indicates live status

### Standings

- Updates automatically as scores change
- Shows base score + match points
- Sorted by total score

## 🚀 Quick Test

1. Update match times to a few minutes in the future
2. Run `npm run dev`
3. Watch countdown timer
4. When timer reaches 0, match time will appear
5. Update scores in `src/utils/api.js` to test scoring
