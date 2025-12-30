// Base scores and predictions for 5 players
export const players = [
  {
    id: 'kemchev',
    name: 'Nikolay Kemchev',
    photo: '/photos/kemcho.jfif',
    baseScore: 114,
    predictions: [
      { matchId: 'burnley-newcastle', home: 1, away: 2 },
      { matchId: 'arsenal-aston-villa', home: 2, away: 1 },
      { matchId: 'man-utd-wolves', home: 2, away: 0 },
    ],
  },
  {
    id: 'daniel',
    name: 'Daniel Lyubomirov',
    photo: '/photos/dani.jfif',
    baseScore: 113,
    predictions: [
      { matchId: 'burnley-newcastle', home: 1, away: 2 },
      { matchId: 'arsenal-aston-villa', home: 1, away: 0 },
      { matchId: 'man-utd-wolves', home: 2, away: 0 },
    ],
  },
  {
    id: 'jose',
    name: 'Жозе Сисиньо',
    photo: '/photos/joze.jfif',
    baseScore: 113,
    predictions: [
      { matchId: 'burnley-newcastle', home: 1, away: 2 },
      { matchId: 'arsenal-aston-villa', home: 1, away: 0 },
      { matchId: 'man-utd-wolves', home: 4, away: 1 },
    ],
  },
  {
    id: 'dimitar',
    name: 'Dimitar Lazarov',
    photo: '/photos/lazarov.jfif',
    baseScore: 112,
    predictions: [
      { matchId: 'burnley-newcastle', home: 1, away: 2 },
      { matchId: 'arsenal-aston-villa', home: 2, away: 1 },
      { matchId: 'man-utd-wolves', home: 2, away: 0 },
    ],
  },
  {
    id: 'martin',
    name: 'Martin Boyadzhiev',
    photo: '/photos/martin.jpg', // Add martin.jfif to public/photos/ folder
    baseScore: 112,
    predictions: [
      { matchId: 'burnley-newcastle', home: 0, away: 2 },
      { matchId: 'arsenal-aston-villa', home: 3, away: 1 },
      { matchId: 'man-utd-wolves', home: 2, away: 0 },
    ],
  },
];

// Match information with start times (ISO format)
// Hardcoded match start times in Bulgarian time, converted to UTC
// Bulgarian time (EET = UTC+2 in winter, EEST = UTC+3 in summer)
// Times: Burnley-Newcastle: 21:30, Arsenal-Aston Villa: 22:15, Man Utd-Wolves: 22:15

/**
 * Get today's date in YYYY-MM-DD format
 */
function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Convert Bulgarian time to UTC ISO string
 * @param {string} time - Time in format "HH:mm" (Bulgarian time)
 * @returns {string} ISO string in UTC
 */
function bulgarianTimeToUTC(time) {
  const today = getTodayDate();
  const [hours, minutes] = time.split(':');
  
  // Bulgarian time is UTC+2 (winter) or UTC+3 (summer)
  // Using UTC+2 for now (winter time)
  // Create date in Bulgarian timezone (UTC+2)
  const bgDate = new Date(`${today}T${hours}:${minutes}:00+02:00`);
  
  // Convert to UTC ISO string
  return bgDate.toISOString();
}

export const matches = [
  {
    id: 'burnley-newcastle',
    homeTeam: 'Burnley',
    awayTeam: 'Newcastle',
    startTime: bulgarianTimeToUTC('21:30'), // 21:30 Bulgarian = 19:30 UTC
  },
  {
    id: 'arsenal-aston-villa',
    homeTeam: 'Arsenal',
    awayTeam: 'Aston Villa',
    startTime: bulgarianTimeToUTC('22:15'), // 22:15 Bulgarian = 20:15 UTC
  },
  {
    id: 'man-utd-wolves',
    homeTeam: 'Manchester United',
    awayTeam: 'Wolves',
    startTime: bulgarianTimeToUTC('22:15'), // 22:15 Bulgarian = 20:15 UTC
  },
];

