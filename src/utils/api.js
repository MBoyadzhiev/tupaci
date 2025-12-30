// API-Football integration - Optimized to save API calls
// Get your API key from: https://dashboard.api-football.com/
// Using fixtures/live endpoint for live matches (saves API calls)

// Mock live scores for development/testing (fallback)
export const mockLiveScores = {
  'burnley-newcastle': { home: 0, away: 0 },
  'arsenal-aston-villa': { home: 0, away: 0 },
  'man-utd-wolves': { home: 0, away: 0 },
};

// Team IDs for our 3 matches (Premier League)
// These can be cached and updated weekly
const TEAM_IDS = {
  burnley: 44,
  newcastle: 34,
  arsenal: 42,
  astonVilla: 66,
  manUnited: 33,
  wolves: 39,
};

/**
 * Fetch live scores from API-Football
 * Strategy: Use fixtures/live for live matches, fixtures/date for upcoming
 */
export async function fetchLiveScores() {
  // Always get mock scores first (includes test match)
  const mockScores = getMockScores();
  
  const API_KEY = import.meta.env.VITE_API_FOOTBALL_KEY;
  
  if (!API_KEY) {
    console.warn('No API key found. Using mock data.');
    console.warn('Add VITE_API_FOOTBALL_KEY to your .env file');
    return mockScores;
  }

  try {
    // Step 1: Try fixtures/live endpoint first (saves API calls for live matches)
    const liveResponse = await fetch(
      'https://v3.football.api-sports.io/fixtures?live=all',
      {
        headers: {
          'x-apisports-key': API_KEY,
        },
      }
    );

    if (liveResponse.ok) {
      const liveData = await liveResponse.json();
      
      if (liveData.errors && liveData.errors.length > 0) {
        console.error('API Errors (live):', liveData.errors);
      } else if (liveData.response && liveData.response.length > 0) {
        // Check if any of our matches are live
        const liveScores = mapApiResponseToScores(liveData.response);
        
        // If we found any of our matches live, merge with mock data
        const foundMatches = Object.keys(liveScores).length;
        if (foundMatches > 0) {
          console.log(`Found ${foundMatches} live match(es) from API`);
          // Fill in missing matches with upcoming data, then merge with mock
          const apiScores = await fillMissingMatches(liveScores, API_KEY);
          return {
            ...mockScores, // Mock data (test match) first
            ...apiScores,  // API data overrides where available
          };
        }
      }
    }

    // Step 2: No live matches, fetch today's fixtures
    const todayScores = await fetchTodayFixtures(API_KEY);
    
    // Merge: mock data first (for test match), then API data
    return {
      ...mockScores, // Mock data (test match) takes priority
      ...todayScores, // API data for other matches
    };
  } catch (error) {
    console.error('API Error:', error);
    return mockScores; // Fallback to mock data
  }
}

/**
 * Fetch today's fixtures for our 3 specific matches
 */
async function fetchTodayFixtures(API_KEY) {
  try {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const leagueId = 39; // Premier League
    
    const response = await fetch(
      `https://v3.football.api-sports.io/fixtures?date=${today}&league=${leagueId}`,
      {
        headers: {
          'x-apisports-key': API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.errors && data.errors.length > 0) {
      console.error('API Errors:', data.errors);
      return getMockScores();
    }

    return mapApiResponseToScores(data.response || []);
  } catch (error) {
    console.error('Error fetching today fixtures:', error);
    return getMockScores();
  }
}

/**
 * Fill in missing matches by fetching upcoming fixtures
 */
async function fillMissingMatches(foundScores, API_KEY) {
  const allMatchIds = ['burnley-newcastle', 'arsenal-aston-villa', 'man-utd-wolves'];
  const missingMatches = allMatchIds.filter(id => !foundScores[id]);
  
  if (missingMatches.length === 0) {
    return foundScores; // All matches found
  }

  // Fetch today's fixtures to get missing matches
  const todayScores = await fetchTodayFixtures(API_KEY);
  
  // Merge: live scores take priority, then today's scores
  return {
    ...todayScores,
    ...foundScores, // Live scores override
  };
}

/**
 * Fetch match data including start times from API-Football
 * Uses fixtures/live for live matches, fixtures/date for upcoming
 */
export async function fetchMatchData() {
  const API_KEY = import.meta.env.VITE_API_FOOTBALL_KEY;
  
  if (!API_KEY) {
    return null;
  }

  try {
    // Try live fixtures first
    const liveResponse = await fetch(
      'https://v3.football.api-sports.io/fixtures?live=all',
      {
        headers: {
          'x-apisports-key': API_KEY,
        },
      }
    );

    if (liveResponse.ok) {
      const liveData = await liveResponse.json();
      
      if (liveData.response && liveData.response.length > 0) {
        const matches = filterOurMatches(liveData.response);
        if (matches.length > 0) {
          // Fill in missing matches from today's fixtures
          const today = await fetchTodayMatchData(API_KEY);
          return [...matches, ...today.filter(t => 
            !matches.some(m => m.fixture.id === t.fixture.id)
          )];
        }
      }
    }

    // No live matches, fetch today's fixtures
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
    const leagueId = 39; // Premier League
    
    const response = await fetch(
      `https://v3.football.api-sports.io/fixtures?date=${today}&league=${leagueId}`,
      {
        headers: {
          'x-apisports-key': API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.errors && data.errors.length > 0) {
      console.error('API Errors:', data.errors);
      return [];
    }

    return filterOurMatches(data.response || []);
  } catch (error) {
    console.error('Error fetching today match data:', error);
    return [];
  }
}

/**
 * Filter fixtures to only our 3 matches
 */
function filterOurMatches(fixtures) {
  return fixtures.filter(fixture => {
    const homeId = fixture.teams?.home?.id;
    const awayId = fixture.teams?.away?.id;
    
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
 * Map API-Football response to our match format
 * Returns scores with fixture status and elapsed time
 */
export function mapApiResponseToScores(apiData) {
  const scores = {};
  
  // Filter to only our 3 matches
  const ourMatches = filterOurMatches(apiData);

  ourMatches.forEach(fixture => {
    const homeId = fixture.teams?.home?.id;
    const awayId = fixture.teams?.away?.id;
    
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
      
      // Get fixture status from API
      const status = fixture.fixture?.status;
      const elapsed = status?.elapsed || null;
      const statusShort = status?.short || null;
      const statusLong = status?.long || null;
      
      let homeScore, awayScore;
      
      if (matchId === 'burnley-newcastle') {
        homeScore = isHomeBurnley ? (fixture.goals?.home || 0) : (fixture.goals?.away || 0);
        awayScore = isHomeBurnley ? (fixture.goals?.away || 0) : (fixture.goals?.home || 0);
      } else if (matchId === 'arsenal-aston-villa') {
        homeScore = isHomeArsenal ? (fixture.goals?.home || 0) : (fixture.goals?.away || 0);
        awayScore = isHomeArsenal ? (fixture.goals?.away || 0) : (fixture.goals?.home || 0);
      } else if (matchId === 'man-utd-wolves') {
        homeScore = isHomeManUtd ? (fixture.goals?.home || 0) : (fixture.goals?.away || 0);
        awayScore = isHomeManUtd ? (fixture.goals?.away || 0) : (fixture.goals?.home || 0);
      }
      
      scores[matchId] = {
        home: homeScore,
        away: awayScore,
        elapsed: elapsed,
        statusShort: statusShort,
        statusLong: statusLong,
        // Check if match is live (1H, HT, 2H, ET, P, BT)
        isLive: statusShort && ['1H', 'HT', '2H', 'ET', 'P', 'BT'].includes(statusShort),
      };
    }
  });

  return scores;
}

/**
 * Extract match start times from API-Football response
 */
export function extractMatchStartTimes(apiData) {
  const startTimes = {};
  
  const ourMatches = filterOurMatches(apiData);

  ourMatches.forEach(fixture => {
    const homeId = fixture.teams?.home?.id;
    const awayId = fixture.teams?.away?.id;
    
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

    if (matchId && fixture.fixture?.date) {
      // API returns date in ISO format, convert to UTC
      startTimes[matchId] = new Date(fixture.fixture.date).toISOString();
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
