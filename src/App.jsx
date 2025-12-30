import { useState, useEffect } from 'react';
import { MatchCard } from './components/MatchCard';
import { Standings } from './components/Standings';
import { players, matches as initialMatches } from './data/players';
import { fetchLiveScores, fetchMatchData, extractMatchStartTimes } from './utils/api';
import { calculateStandings } from './utils/scoring';
import { getCurrentTimeUTC, getCurrentTimeBulgarian } from './utils/currentTime';
import './App.css';

function App() {
  const [liveScores, setLiveScores] = useState({});
  const [matches, setMatches] = useState(initialMatches);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(null);

  // Log current time on mount (for debugging)
  useEffect(() => {
    const utc = getCurrentTimeUTC();
    const bg = getCurrentTimeBulgarian();
    setCurrentTime({ utc, bg });
    console.log('Current UTC time:', utc);
    console.log('Current Bulgarian time:', bg);
  }, []);

  // Fetch match data (scores + start times) on mount and every 60 seconds
  useEffect(() => {
    const loadData = async () => {
      try {
        setError(null);
        
        // Fetch scores
        const scores = await fetchLiveScores();
        setLiveScores(scores);
        
        // TEST: Log live match data to console
        console.log('=== LIVE MATCH DATA ===');
        console.log('All scores:', scores);
        Object.keys(scores).forEach(matchId => {
          const matchData = scores[matchId];
          console.log(`Match ${matchId}:`, matchData);
          if (matchData && matchData.isLive) {
            console.log(`✓ LIVE: ${matchId}`, {
              score: `${matchData.home}-${matchData.away}`,
              elapsed: `${matchData.elapsed}'`,
              status: matchData.statusLong || matchData.statusShort,
            });
          }
        });
        console.log('======================');
        
        // Fetch match data to get start times
        const matchData = await fetchMatchData();
        if (matchData && matchData.length > 0) {
          const startTimes = extractMatchStartTimes(matchData);
          
          // Update matches with real start times from API
          setMatches(prevMatches => 
            prevMatches.map(match => ({
              ...match,
              startTime: startTimes[match.id] || match.startTime, // Use API time if available
            }))
          );
        }
        
        setLoading(false);
      } catch (err) {
        setError('Грешка при зареждане на резултати');
        console.error(err);
        setLoading(false);
      }
    };

    loadData();
    const interval = setInterval(loadData, 60000); // Refresh every 60 seconds

    return () => clearInterval(interval);
  }, []);

  const standings = calculateStandings(players, liveScores);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Лига на Тъпаците Resurrection - Финал</h1>
      </header>

      <main className="app-main">
        <section className="matches-section">
          <h2 className="section-title">Мачове на живо</h2>
          {loading ? (
            <div className="loading">Зареждане на мачове...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : (
            matches.map(match => (
              <MatchCard
                key={match.id}
                match={match}
                score={liveScores[match.id]}
                fixtureData={liveScores[match.id]} // Pass full fixture data including status
              />
            ))
          )}
        </section>

        <section className="standings-section">
          <Standings standings={standings} />
        </section>
      </main>

      <footer className="app-footer">
        <p>Автоматично обновяване на всеки 60 секунди</p>
        {currentTime && (
          <p style={{ fontSize: '10px', opacity: 0.7, marginTop: '4px' }}>
            Текущо време: {currentTime.bg} (UTC: {currentTime.utc.slice(11, 19)})
          </p>
        )}
      </footer>
    </div>
  );
}

export default App;

