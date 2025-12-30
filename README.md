# Live Betting Standings App

A fast, mobile-optimized web app that tracks live football match scores and calculates real-time standings for 5 players based on their predictions.

## Features

- 📊 **Live Match Scores** - Displays 3 live matches with real-time score updates
- 🏆 **Real-time Standings** - Calculates and displays player rankings as matches progress
- 📱 **Mobile-Optimized** - Responsive design for Android and iOS
- ⚡ **Auto-refresh** - Updates every 60 seconds automatically

## Scoring Rules

- **Correct Outcome (Win/Loss/Draw)**: 1 point
- **Exact Score Match**: 3 points

Example:

- If actual score is 1-0 and player predicted 2-1 → 1 point (correct outcome: home win)
- If actual score is 1-0 and player predicted 1-0 → 3 points (exact match)

## Players & Current Standings

1. Nikolay Kemchev - 114 точки
2. Daniel Lyubomirov - 113 точки
3. Жозе Сисиньо - 113 точки
4. Dimitar Lazarov - 112 точки
5. Martin Boyadzhiev - 112 точки

## Matches

- Burnley - Newcastle
- Arsenal - Aston Villa
- Manchester United - Wolves

## Setup

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

## API Integration

The app uses **football-data.org** API (free tier: 50 requests per minute).

### Setup API Key

1. Create a `.env` file in the root directory:

```bash
VITE_FOOTBALL_DATA_KEY=your_api_key_here
```

2. Replace `your_api_key_here` with your actual API token from [football-data.org](https://www.football-data.org/)

3. For **local development**, the `.env` file will be automatically loaded by Vite.

4. For **Vercel deployment**, add the environment variable:
   - Go to your Vercel project settings
   - Navigate to "Environment Variables"
   - Add: `VITE_FOOTBALL_DATA_KEY` = `your_api_key_here`
   - Redeploy your app

### API Endpoints Used

- Live matches: `GET /matches?status=LIVE`
- Today's matches: `GET /competitions/2021/matches?dateFrom={today}&dateTo={today}`

The app automatically fetches live scores every 60 seconds.

## Deployment to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Vercel will auto-detect Vite and deploy

Or use Vercel CLI:

```bash
npm i -g vercel
vercel
```

## Project Structure

```
tupaci/
├── src/
│   ├── components/      # React components
│   ├── data/           # Player data and predictions
│   ├── utils/          # API and scoring logic
│   ├── App.jsx         # Main app component
│   └── main.jsx        # Entry point
├── index.html
├── package.json
└── vercel.json         # Vercel config
```

## Technologies

- React 18
- Vite
- CSS3 (Mobile-first responsive design)
