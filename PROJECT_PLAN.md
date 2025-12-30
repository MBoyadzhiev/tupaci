# Simple Betting App - Minimal Plan

## Goal

**One-screen mobile-optimized web app** showing 3 live matches, 5 players' predictions, and real-time standings.

## Stack Decision

**✅ React + Vite** - Fast web app, mobile-optimized, deployable on Vercel instantly.

## Core Features (One Screen)

### 1. Live Matches Section

- Display 3 matches with live scores
- Format: `Team A 2-1 Team B`
- Auto-refresh every 60 seconds

### 2. Standings Section

- Show 5 players ranked by points (with base scores)
- Format: `1. Nikolay Kemchev - 114 точки`
- Updates live as matches progress

## Data Structure

### Hardcoded Predictions & Base Scores

**5 Players:**

1. Nikolay Kemchev - 114 точки (base)
2. Daniel Lyubomirov - 113 точки (base)
3. Жозе Сисиньо - 113 точки (base)
4. Dimitar Lazarov - 112 точки (base)
5. Martin Boyadzhiev - 112 точки (base)

**3 Matches:**

- Burnley - Newcastle
- Arsenal - Aston Villa
- Manchester United - Wolves/Wolverhampton

**Predictions:**

- Жозе: 1:2, 1:0, 4:1
- Мартин: 0:2, 3:1, 2:0
- Дани: 1:2, 1:0, 2:0
- Димитър: 1:2, 2:1, 2:0
- Кемчев: 1:2, 2:1, 2:0

### Scoring Logic

**Rules:**

- Correct outcome (win): **1 point**
- Exact score match: **3 points** (not 1+3, just 3)

```javascript
function calculateScore(pred, live) {
  // Exact score: 3 points
  if (pred.home === live.home && pred.away === live.away) {
    return 3;
  }
  // Correct outcome (W/D/L): 1 point
  if (Math.sign(pred.home - pred.away) === Math.sign(live.home - live.away)) {
    return 1;
  }
  // Wrong: 0 points
  return 0;
}
```

**Live Updates:**

- As scores change, standings update in real-time
- Example: Match starts 0:0 → Newcastle scores → All who predicted Newcastle win get 1pt
- Score becomes 2:1 → Those who predicted 1:2 get 3pts, others with correct outcome get 1pt

## API Integration

- **API-Football** (RapidAPI) - Free tier sufficient for 3 matches
- Poll every 60 seconds
- Handle loading/error states

## Project Structure (Minimal)

```
tupaci/
├── index.html
├── src/
│   ├── App.jsx          # Single screen app
│   ├── main.jsx
│   ├── components/
│   │   ├── MatchCard.jsx
│   │   └── Standings.jsx
│   ├── utils/
│   │   ├── api.js       # Fetch live scores
│   │   └── scoring.js   # Calculate points
│   └── data/
│       └── players.js    # Hardcoded players & predictions
├── package.json
└── vercel.json          # Vercel config
```

## Implementation Steps

1. **Setup React + Vite** (5 min)

   - `npm create vite@latest`
   - Install dependencies

2. **API Integration** (15 min)

   - Set up API service
   - Fetch 3 live matches
   - Display raw scores

3. **Scoring Logic** (15 min)

   - Add predictions object
   - Implement calculateScore function
   - Calculate totals per player

4. **UI & Standings** (15 min)

   - Build one-screen layout
   - Display matches
   - Display sorted standings

5. **Polish** (10 min)
   - Auto-refresh
   - Loading states
   - Basic styling

## What We're NOT Building

- ❌ Authentication
- ❌ Payments
- ❌ Data persistence
- ❌ Multiple screens
- ❌ User input forms
- ❌ Backend

## Success Criteria

- ✅ Shows 3 live matches (Burnley-Newcastle, Arsenal-Aston Villa, Man Utd-Wolves)
- ✅ Shows 5 players' standings with base scores
- ✅ Updates automatically as scores change
- ✅ Mobile-optimized UI
- ✅ Deployed on Vercel
- ✅ Simple, fast, clean UI

## Deployment

- **Vercel** - Instant deployment
- Connect GitHub repo or deploy via CLI

---

**Ready to build! Let's start with Expo setup.**
