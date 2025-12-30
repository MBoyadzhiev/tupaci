# API-Football Setup Instructions

## Step 1: Get Your API Key

1. Go to https://dashboard.api-football.com/
2. Sign up or log in
3. Go to "API Keys" section in the dashboard
4. Copy your API key (it will look like: `abc123def456...`)

## Step 2: Create .env File

1. In the root directory of your project (same folder as `package.json`)
2. Create a new file named `.env`
3. Add this line (replace with your actual API key):

```
VITE_API_FOOTBALL_KEY=your_actual_api_key_here
```

**Example:**

```
VITE_API_FOOTBALL_KEY=abc123def456ghi789jkl012mno345pqr678
```

## Step 3: Restart Dev Server

After creating the `.env` file:

1. Stop your current dev server (Ctrl+C)
2. Start it again: `npm run dev`
3. The app will now use your API key!

## Step 4: Verify It's Working

1. Open browser console (F12)
2. You should see API responses in the console
3. If you see "No API key found" warning, check:
   - `.env` file exists in root directory
   - File is named exactly `.env` (not `.env.txt`)
   - API key is correct
   - Dev server was restarted after creating `.env`

## Troubleshooting

**"No API key found" warning:**

- Make sure `.env` file is in the root directory (same level as `package.json`)
- File must be named exactly `.env` (not `.env.txt` or `.env.local`)
- Restart dev server after creating/editing `.env`
- Check that the key starts with `VITE_API_FOOTBALL_KEY=`

**API errors in console:**

- Check your API key is valid
- Check API-Football dashboard for rate limits
- Free tier: ~100 requests/day
- Make sure you have requests remaining

**Matches not showing:**

- API only returns matches scheduled for today
- If matches are tomorrow, they won't appear until that day
- Check browser console for API response data

## API Limits

- **Free tier**: ~100 requests/day
- **Refresh interval**: Currently set to 60 seconds
- **Daily limit**: ~1440 requests/day (if running 24/7)

If you hit the limit, the app will fall back to mock data.

## Notes

- The `.env` file is already in `.gitignore` (won't be committed to Git)
- Never share your API key publicly
- For production (Vercel), add the environment variable in Vercel dashboard
