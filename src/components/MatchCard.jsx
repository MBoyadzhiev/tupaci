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
  // 2. Start time passed AND score is not 0-0
  const matchIsLive = isLiveFromAPI || (countdown?.isLive && (score?.home > 0 || score?.away > 0));

  // Display time/status
  let displayTime = null;
  
  // Priority 1: Use API's elapsed time if match is live from API
  if (isLiveFromAPI && (apiElapsed !== null && apiElapsed !== undefined)) {
    displayTime = formatApiElapsed(apiElapsed, apiStatus);
  }
  // Priority 2: Use calculated time if match is live (start time passed + score not 0-0)
  else if (matchIsLive && !isLiveFromAPI) {
    displayTime = matchTime || '0\'';
  }

  // Determine what to show
  let displayContent = null;
  
  // If match is live and we have display time, show live indicator
  if ((isLiveFromAPI || matchIsLive) && displayTime) {
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
  // If start time passed but match not live
  else if (countdown && countdown.isLive && !matchIsLive) {
    displayContent = (
      <div className="match-countdown">
        Започва сега
      </div>
    );
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

