/**
 * Calculate points for a single match prediction
 * @param {Object} pred - Prediction { home: number, away: number }
 * @param {Object} live - Live score { home: number, away: number }
 * @returns {number} Points: 3 for exact, 1 for correct outcome, 0 otherwise
 */
export function calculateMatchPoints(pred, live) {
  // Exact score match: 3 points
  if (pred.home === live.home && pred.away === live.away) {
    return 3;
  }
  
  // Correct outcome (W/D/L): 1 point
  const predOutcome = Math.sign(pred.home - pred.away);
  const liveOutcome = Math.sign(live.home - live.away);
  
  if (predOutcome === liveOutcome) {
    return 1;
  }
  
  // Wrong: 0 points
  return 0;
}

/**
 * Calculate total points for all matches for a player
 * @param {Array} predictions - Array of predictions
 * @param {Object} liveScores - Object with matchId as key and { home, away } as value
 * @returns {number} Total points from all matches
 */
export function calculateTotalPoints(predictions, liveScores) {
  return predictions.reduce((total, pred) => {
    const live = liveScores[pred.matchId];
    if (!live) return total; // Match not started or no data
    
    return total + calculateMatchPoints(pred, live);
  }, 0);
}

/**
 * Calculate standings with base scores + match points
 * @param {Array} players - Array of player objects
 * @param {Object} liveScores - Live scores for all matches
 * @returns {Array} Sorted players with total scores
 */
export function calculateStandings(players, liveScores) {
  return players
    .map(player => {
      const matchPoints = calculateTotalPoints(player.predictions, liveScores);
      const totalScore = player.baseScore + matchPoints;
      
      return {
        ...player,
        matchPoints,
        totalScore,
      };
    })
    .sort((a, b) => b.totalScore - a.totalScore);
}

