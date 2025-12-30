import { useState, useEffect } from 'react';
import { getCountdown, getMatchTime, formatCountdown } from '../utils/time';
import './MatchCard.css';

export function MatchCard({ match, score, fixtureData }) {
  const [countdown, setCountdown] = useState(null);
  const [matchTime, setMatchTime] = useState(null);

  useEffect(() => {
    const updateTime = () => {
      const cd = getCountdown(match.startTime);
      setCountdown(cd);
      
      if (cd.isLive) {
        const mt = getMatchTime(match.startTime, score);
        setMatchTime(mt);
      } else {
        setMatchTime(null);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [match.startTime, score]);

  if (!score) {
    score = { home: 0, away: 0 };
  }

  // Use API's elapsed time if available (from fixtures/live endpoint)
  // fixtureData is the same as score, but we check both for safety
  const apiElapsed = fixtureData?.elapsed ?? score?.elapsed;
  const apiStatus = fixtureData?.statusShort ?? score?.statusShort;
  const isLiveFromAPI = fixtureData?.isLive ?? score?.isLive ?? false;

  // Format elapsed time from API (e.g., 45 -> "45'", 90+3 -> "90+3'")
  const formatApiElapsed = (elapsed, statusShort) => {
    if (elapsed === null || elapsed === undefined) {
      if (statusShort === 'HT') return 'HT';
      if (statusShort === 'FT') return 'FT';
      return statusShort || null;
    }
    
    if (statusShort === 'HT') {
      return 'HT';
    }
    
    if (statusShort === 'FT') {
      return 'FT';
    }
    
    if (elapsed > 90) {
      const injuryTime = elapsed - 90;
      return `90+${injuryTime}'`;
    }
    return `${elapsed}'`;
  };

  // Match is live if:
  // 1. API says it's live (isLiveFromAPI), OR
  // 2. Start time passed AND (score is not 0-0 OR we have elapsed time from API), OR
  // 3. Start time passed AND statusShort indicates match is in progress
  const hasElapsedTime = apiElapsed !== null && apiElapsed !== undefined;
  const statusIndicatesLive = apiStatus && ['1H', 'HT', '2H', 'ET', 'P', 'BT'].includes(apiStatus);
  const hasScore = (score?.home > 0 || score?.away > 0);
  
  const matchIsLive = isLiveFromAPI || 
                      (countdown?.isLive && (hasScore || hasElapsedTime || statusIndicatesLive));

  // Display time/status
  let displayTime = null;
  
  // Priority 1: Use API's elapsed time if available (even if not marked as live)
  if (hasElapsedTime) {
    displayTime = formatApiElapsed(apiElapsed, apiStatus);
  }
  // Priority 2: Use API status if it indicates match is in progress
  else if (statusIndicatesLive && apiStatus) {
    displayTime = formatApiElapsed(null, apiStatus);
  }
  // Priority 3: Use calculated time if match start time passed
  else if (countdown?.isLive && matchTime) {
    displayTime = matchTime;
  }

  // Determine what to show
  let displayContent = null;
  
  // If match is live and we have display time, show live indicator
  if (matchIsLive && displayTime) {
    displayContent = (
      <div className="match-time-live">
        <span className="live-indicator">●</span>
        {displayTime}
      </div>
    );
  } 
  // If countdown exists and match hasn't started
  else if (countdown && !countdown.isLive) {
    // Show countdown timer
    displayContent = (
      <div className="match-countdown">
        {formatCountdown(countdown)}
      </div>
    );
  }
  // If start time passed but match not live yet (show "Започва сега" only if very recent)
  else if (countdown && countdown.isLive && !matchIsLive) {
    // Only show "Започва сега" if start time passed within last 5 minutes
    const now = new Date();
    const startTime = new Date(match.startTime);
    const minutesSinceStart = (now - startTime) / (1000 * 60);
    
    if (minutesSinceStart < 5) {
      displayContent = (
        <div className="match-countdown">
          Започва сега
        </div>
      );
    } else {
      // Match started but no live data yet - show calculated time or "В процес"
      displayContent = (
        <div className="match-time-live">
          <span className="live-indicator">●</span>
          {matchTime || 'В процес'}
        </div>
      );
    }
  } 
  else {
    displayContent = (
      <div className="match-status">Очаква се</div>
    );
  }

  return (
    <div className="match-card">
      <div className="match-teams">
        <div className="team home-team">
          <span className="team-name">{match.homeTeam}</span>
          <span className="team-score">{score.home}</span>
        </div>
        <div className="score-separator">-</div>
        <div className="team away-team">
          <span className="team-score">{score.away}</span>
          <span className="team-name">{match.awayTeam}</span>
        </div>
      </div>
      <div className="match-info">
        {displayContent}
      </div>
    </div>
  );
}

