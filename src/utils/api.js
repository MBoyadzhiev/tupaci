// football-data.org API integration
// Get your free API key from: https://www.football-data.org/
// Free tier: 50 requests per minute

// Mock live scores for development/testing (fallback)
export const mockLiveScores = {
  'burnley-newcastle': { home: 0, away: 0 },
  'arsenal-aston-villa': { home: 0, away: 0 },
  'man-utd-wolves': { home: 0, away: 0 },
};

// Team IDs for our 3 matches (Premier League) - football-data.org IDs
// These can be cached and updated weekly
const TEAM_IDS = {
  burnley: 328,      // Burnley FC
  newcastle: 67,     // Newcastle United
  arsenal: 57,       // Arsenal FC
  astonVilla: 58,    // Aston Villa
  manUnited: 66,     // Manchester United
  wolves: 76,        // Wolverhampton Wanderers
};

// Premier League competition ID
const PREMIER_LEAGUE_ID = 2021; // Premier League

// Use proxy in development to avoid CORS, direct API in production
const API_BASE_URL = import.meta.env.DEV 
  ? '/api'  // Vite proxy in development
  : 'https://api.football-data.org/v4';  // Direct API in production

/**
 * Fetch live scores from football-data.org
 * Strategy: Use matches?status=LIVE for live matches, competitions/{id}/matches for today
 */
export async function fetchLiveScores() {
  // Always get mock scores first (fallback)
  const mockScores = getMockScores();
  
  const API_KEY = import.meta.env.VITE_FOOTBALL_DATA_KEY;
  
  if (!API_KEY) {
    console.warn('No API key found. Using mock data.');
    console.warn('Add VITE_FOOTBALL_DATA_KEY to your .env file');
    console.warn('Get your free API key from: https://www.football-data.org/');
    return mockScores;
  }

  try {
    // Step 1: Try live matches endpoint first
    const liveResponse = await fetch(
      `${API_BASE_URL}/matches?status=LIVE`,
      {
        headers: {
          'X-Auth-Token': API_KEY,
        },
      }
    );

    if (liveResponse.ok) {
      const liveData = await liveResponse.json();
      
      if (liveData.matches && liveData.matches.length > 0) {
        // Log raw live response for debugging
        console.log('[API] Live matches response:', {
          totalMatches: liveData.matches.length,
          ourMatches: filterOurMatches(liveData.matches).length,
        });
        
        // Check if any of our matches are live
        const liveScores = mapApiResponseToScores(liveData.matches);
        
        // If we found any of our matches live, merge with mock data
        const foundMatches = Object.keys(liveScores).length;
        if (foundMatches > 0) {
          console.log(`Found ${foundMatches} live match(es) from API`);
          // Fill in missing matches with today's data, then merge with mock
          const apiScores = await fillMissingMatches(liveScores, API_KEY);
          return {
            ...mockScores, // Mock data first
            ...apiScores,  // API data overrides where available
          };
        } else {
          console.log('[API] No live matches found in matches?status=LIVE endpoint');
        }
      } else {
        console.log('[API] No live matches in response');
      }
    } else {
      console.error('[API] Live matches request failed:', liveResponse.status, liveResponse.statusText);
    }

    // Step 2: Always fetch today's matches (they might be live but not in LIVE endpoint yet)
    const todayScores = await fetchTodayMatches(API_KEY);
    
    // Check if any matches from today are actually live
    const liveFromToday = Object.keys(todayScores).filter(
      matchId => todayScores[matchId]?.isLive
    );
    
    if (liveFromToday.length > 0) {
      console.log(`[API] Found ${liveFromToday.length} live match(es) from today's matches:`, liveFromToday);
    }
    
    // Merge: mock data first, then API data
    return {
      ...mockScores, // Mock data takes priority
      ...todayScores, // API data for other matches (includes live matches from today)
    };
  } catch (error) {
    console.error('API Error:', error);
    return mockScores; // Fallback to mock data
  }
}

/**
 * Fetch today's matches for our 3 specific matches
 */
async function fetchTodayMatches(API_KEY) {
  try {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    // Fetch Premier League matches for today
    const response = await fetch(
      `${API_BASE_URL}/competitions/${PREMIER_LEAGUE_ID}/matches?dateFrom=${today}&dateTo=${today}`,
      {
        headers: {
          'X-Auth-Token': API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    
    // Log raw API response for debugging
    console.log('[API] Today matches response:', {
      totalMatches: data.matches?.length || 0,
      ourMatches: filterOurMatches(data.matches || []).length,
    });

    return mapApiResponseToScores(data.matches || []);
  } catch (error) {
    console.error('Error fetching today matches:', error);
    return getMockScores();
  }
}

/**
 * Fill in missing matches by fetching today's matches
 */
async function fillMissingMatches(foundScores, API_KEY) {
  const allMatchIds = ['burnley-newcastle', 'arsenal-aston-villa', 'man-utd-wolves'];
  const missingMatches = allMatchIds.filter(id => !foundScores[id]);
  
  if (missingMatches.length === 0) {
    return foundScores; // All matches found
  }

  // Fetch today's matches to get missing matches
  const todayScores = await fetchTodayMatches(API_KEY);
  
  // Merge: live scores take priority, then today's scores
  return {
    ...todayScores,
    ...foundScores, // Live scores override
  };
}

/**
 * Fetch match data including start times from football-data.org
 * Uses matches?status=LIVE for live matches, competitions/{id}/matches for today
 */
export async function fetchMatchData() {
  const API_KEY = import.meta.env.VITE_FOOTBALL_DATA_KEY;
  
  if (!API_KEY) {
    return null;
  }

  try {
    // Try live matches first
    const liveResponse = await fetch(
      `${API_BASE_URL}/matches?status=LIVE`,
      {
        headers: {
          'X-Auth-Token': API_KEY,
        },
      }
    );

    if (liveResponse.ok) {
      const liveData = await liveResponse.json();
      
      if (liveData.matches && liveData.matches.length > 0) {
        const matches = filterOurMatches(liveData.matches);
        if (matches.length > 0) {
          // Fill in missing matches from today's matches
          const today = await fetchTodayMatchData(API_KEY);
          return [...matches, ...today.filter(t => 
            !matches.some(m => m.id === t.id)
          )];
        }
      }
    }

    // No live matches, fetch today's matches
    return await fetchTodayMatchData(API_KEY);
  } catch (error) {
    console.error('API Error fetching match data:', error);
    return null;
  }
}

/**
 * Fetch today's match data
 */
async function fetchTodayMatchData(API_KEY) {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const response = await fetch(
      `${API_BASE_URL}/competitions/${PREMIER_LEAGUE_ID}/matches?dateFrom=${today}&dateTo=${today}`,
      {
        headers: {
          'X-Auth-Token': API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    
    return filterOurMatches(data.matches || []);
  } catch (error) {
    console.error('Error fetching today match data:', error);
    return [];
  }
}

/**
 * Filter matches to only our 3 matches
 */
function filterOurMatches(matches) {
  return matches.filter(match => {
    const homeId = match.homeTeam?.id;
    const awayId = match.awayTeam?.id;
    
    // Check if this is one of our matches
    return (
      // Burnley vs Newcastle
      (homeId === TEAM_IDS.burnley && awayId === TEAM_IDS.newcastle) ||
      (homeId === TEAM_IDS.newcastle && awayId === TEAM_IDS.burnley) ||
      // Arsenal vs Aston Villa
      (homeId === TEAM_IDS.arsenal && awayId === TEAM_IDS.astonVilla) ||
      (homeId === TEAM_IDS.astonVilla && awayId === TEAM_IDS.arsenal) ||
      // Man Utd vs Wolves
      (homeId === TEAM_IDS.manUnited && awayId === TEAM_IDS.wolves) ||
      (homeId === TEAM_IDS.wolves && awayId === TEAM_IDS.manUnited)
    );
  });
}

/**
 * Map football-data.org response to our match format
 * Returns scores with fixture status and elapsed time
 */
export function mapApiResponseToScores(apiData) {
  const scores = {};
  
  // Filter to only our 3 matches
  const ourMatches = filterOurMatches(apiData);

  ourMatches.forEach(match => {
    const homeId = match.homeTeam?.id;
    const awayId = match.awayTeam?.id;
    
    // Determine match ID based on team IDs
    let matchId = null;
    
    if (
      (homeId === TEAM_IDS.burnley && awayId === TEAM_IDS.newcastle) ||
      (homeId === TEAM_IDS.newcastle && awayId === TEAM_IDS.burnley)
    ) {
      matchId = 'burnley-newcastle';
    } else if (
      (homeId === TEAM_IDS.arsenal && awayId === TEAM_IDS.astonVilla) ||
      (homeId === TEAM_IDS.astonVilla && awayId === TEAM_IDS.arsenal)
    ) {
      matchId = 'arsenal-aston-villa';
    } else if (
      (homeId === TEAM_IDS.manUnited && awayId === TEAM_IDS.wolves) ||
      (homeId === TEAM_IDS.wolves && awayId === TEAM_IDS.manUnited)
    ) {
      matchId = 'man-utd-wolves';
    }

    if (matchId) {
      // Determine which team is home/away
      const isHomeBurnley = homeId === TEAM_IDS.burnley;
      const isHomeArsenal = homeId === TEAM_IDS.arsenal;
      const isHomeManUtd = homeId === TEAM_IDS.manUnited;
      
      // Get match status from API
      // football-data.org uses: SCHEDULED, LIVE, IN_PLAY, PAUSED, FINISHED, POSTPONED, SUSPENDED, CANCELED
      const status = match.status;
      const score = match.score;
      const fullTime = score?.fullTime;
      const halfTime = score?.halfTime;
      
      // Get elapsed time from minute (if available)
      const minute = match.minute || null;
      
      // Map status to our format
      let statusShort = null;
      let elapsed = null;
      
      if (status === 'LIVE' || status === 'IN_PLAY') {
        if (minute !== null) {
          elapsed = minute;
          if (minute <= 45) {
            statusShort = '1H';
          } else if (minute === 45 || (minute > 45 && minute < 90)) {
            statusShort = '2H';
          } else {
            statusShort = '2H';
          }
        } else {
          statusShort = 'LIVE';
        }
      } else if (status === 'PAUSED') {
        statusShort = 'HT';
        elapsed = 45;
      } else if (status === 'FINISHED') {
        statusShort = 'FT';
        elapsed = 90;
      } else if (status === 'SCHEDULED') {
        statusShort = 'NS'; // Not Started
      }
      
      let homeScore, awayScore;
      
      if (matchId === 'burnley-newcastle') {
        homeScore = isHomeBurnley ? (fullTime?.home || 0) : (fullTime?.away || 0);
        awayScore = isHomeBurnley ? (fullTime?.away || 0) : (fullTime?.home || 0);
      } else if (matchId === 'arsenal-aston-villa') {
        homeScore = isHomeArsenal ? (fullTime?.home || 0) : (fullTime?.away || 0);
        awayScore = isHomeArsenal ? (fullTime?.away || 0) : (fullTime?.home || 0);
      } else if (matchId === 'man-utd-wolves') {
        homeScore = isHomeManUtd ? (fullTime?.home || 0) : (fullTime?.away || 0);
        awayScore = isHomeManUtd ? (fullTime?.away || 0) : (fullTime?.home || 0);
      }
      
      // For live matches, use current score if available
      if ((status === 'LIVE' || status === 'IN_PLAY') && score) {
        const currentScore = score?.current || score?.fullTime;
        if (currentScore) {
          if (matchId === 'burnley-newcastle') {
            homeScore = isHomeBurnley ? (currentScore.home || homeScore) : (currentScore.away || homeScore);
            awayScore = isHomeBurnley ? (currentScore.away || awayScore) : (currentScore.home || awayScore);
          } else if (matchId === 'arsenal-aston-villa') {
            homeScore = isHomeArsenal ? (currentScore.home || homeScore) : (currentScore.away || homeScore);
            awayScore = isHomeArsenal ? (currentScore.away || awayScore) : (currentScore.home || awayScore);
          } else if (matchId === 'man-utd-wolves') {
            homeScore = isHomeManUtd ? (currentScore.home || homeScore) : (currentScore.away || homeScore);
            awayScore = isHomeManUtd ? (currentScore.away || awayScore) : (currentScore.home || awayScore);
          }
        }
      }
      
      // Check if match is live
      const isLiveStatus = status === 'LIVE' || status === 'IN_PLAY' || status === 'PAUSED';
      const hasElapsedTime = elapsed !== null && elapsed !== undefined;
      
      // Match is live if status indicates it OR if it has elapsed time
      const isLive = isLiveStatus || hasElapsedTime;
      
      // Log for debugging
      if (matchId === 'burnley-newcastle') {
        console.log(`[API DEBUG] ${matchId}:`, {
          status,
          statusShort,
          elapsed,
          minute,
          homeScore,
          awayScore,
          isLiveStatus,
          hasElapsedTime,
          isLive,
          fullMatch: match
        });
      }
      
      scores[matchId] = {
        home: homeScore,
        away: awayScore,
        elapsed: elapsed,
        statusShort: statusShort,
        statusLong: status,
        isLive: isLive,
      };
    }
  });

  return scores;
}

/**
 * Extract match start times from football-data.org response
 */
export function extractMatchStartTimes(apiData) {
  const startTimes = {};
  
  const ourMatches = filterOurMatches(apiData);

  ourMatches.forEach(match => {
    const homeId = match.homeTeam?.id;
    const awayId = match.awayTeam?.id;
    
    let matchId = null;
    
    if (
      (homeId === TEAM_IDS.burnley && awayId === TEAM_IDS.newcastle) ||
      (homeId === TEAM_IDS.newcastle && awayId === TEAM_IDS.burnley)
    ) {
      matchId = 'burnley-newcastle';
    } else if (
      (homeId === TEAM_IDS.arsenal && awayId === TEAM_IDS.astonVilla) ||
      (homeId === TEAM_IDS.astonVilla && awayId === TEAM_IDS.arsenal)
    ) {
      matchId = 'arsenal-aston-villa';
    } else if (
      (homeId === TEAM_IDS.manUnited && awayId === TEAM_IDS.wolves) ||
      (homeId === TEAM_IDS.wolves && awayId === TEAM_IDS.manUnited)
    ) {
      matchId = 'man-utd-wolves';
    }

    if (matchId && match.utcDate) {
      // API returns date in ISO format (UTC)
      startTimes[matchId] = new Date(match.utcDate).toISOString();
    }
  });

  return startTimes;
}

/**
 * Mock scores for development/testing
 */
function getMockScores() {
  return {
    'burnley-newcastle': { home: 0, away: 0, elapsed: null, statusShort: null, isLive: false },
    'arsenal-aston-villa': { home: 0, away: 0, elapsed: null, statusShort: null, isLive: false },
    'man-utd-wolves': { home: 0, away: 0, elapsed: null, statusShort: null, isLive: false },
  };
}
