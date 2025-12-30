# Quick Start Guide

## 🚀 Get Running in 2 Minutes

### 1. Install & Run Locally

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser

### 2. Test the Scoring System

To test with different scores, edit `src/utils/api.js`:

```javascript
function getMockScores() {
  return {
    "burnley-newcastle": { home: 1, away: 2 }, // Test: Newcastle wins
    "arsenal-aston-villa": { home: 2, away: 1 }, // Test: Arsenal wins
    "man-utd-wolves": { home: 2, away: 0 }, // Test: Man Utd wins
  };
}
```

**Expected Results:**

- Burnley-Newcastle (1:2): All players predicted Newcastle win → Everyone gets 1pt
- Arsenal-Aston Villa (2:1): Kemchev & Dimitar predicted 2:1 → They get 3pts, others get 1pt
- Man Utd-Wolves (2:0): Most predicted 2:0 → They get 3pts

### 3. Deploy to Vercel

**Fastest way:**

1. Push to GitHub
2. Go to vercel.com
3. Import repo
4. Deploy (takes ~30 seconds)

See `DEPLOYMENT.md` for detailed instructions.

## 📱 Mobile Testing

- Open dev tools (F12)
- Toggle device toolbar (Ctrl+Shift+M)
- Test on iPhone/Android sizes
- Or use your phone: `npm run dev` shows the local network URL

## 🔧 Add Real API (Optional)

1. Get API key from [API-Football](https://www.api-football.com/)
2. Create `.env` file:
   ```
   VITE_API_KEY=your_key_here
   ```
3. Uncomment API code in `src/utils/api.js`
4. Update `mapApiResponseToScores()` to match your API format

## ✅ What's Working

- ✅ 5 players with base scores (114, 113, 113, 112, 112)
- ✅ 3 matches with team names
- ✅ Scoring logic (1pt for outcome, 3pts for exact)
- ✅ Real-time standings calculation
- ✅ Auto-refresh every 60 seconds
- ✅ Mobile-optimized UI
- ✅ Ready for Vercel deployment

## 🎯 Next Steps

1. **Test locally** - Run `npm run dev` and verify everything works
2. **Add API** - Integrate live score API (optional, can use mock data for now)
3. **Deploy** - Push to GitHub and deploy on Vercel
4. **Share** - Send the Vercel URL to your players!
