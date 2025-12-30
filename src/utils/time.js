/**
 * Calculate countdown to match start
 * @param {string} startTime - ISO string of match start time
 * @returns {Object} { hours, minutes, seconds, isLive }
 */
export function getCountdown(startTime) {
  const now = new Date();
  const start = new Date(startTime);
  const diff = start - now;

  if (diff <= 0) {
    return { hours: 0, minutes: 0, seconds: 0, isLive: true };
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { hours, minutes, seconds, isLive: false };
}

/**
 * Calculate match time (like "45'", "90+2'")
 * @param {string} startTime - ISO string of match start time
 * @param {Object} score - Current score { home, away }
 * @returns {string} Match time string
 */
export function getMatchTime(startTime, score) {
  const now = new Date();
  const start = new Date(startTime);
  const diff = now - start;

  if (diff < 0) {
    return null; // Match hasn't started
  }

  // Calculate minutes elapsed
  const minutesElapsed = Math.floor(diff / (1000 * 60));

  // First half: 0-45 minutes
  if (minutesElapsed <= 45) {
    return `${minutesElapsed}'`;
  }

  // Half time: 45-47 minutes (approximate)
  if (minutesElapsed <= 47) {
    return 'HT';
  }

  // Second half: 47-90 minutes
  if (minutesElapsed <= 90) {
    const secondHalf = minutesElapsed - 47;
    return `${45 + secondHalf}'`;
  }

  // Injury time: 90+ minutes (max 90+5 for display)
  const injuryTime = Math.min(minutesElapsed - 90, 5);
  return `90+${injuryTime}'`;
}

/**
 * Format countdown string
 * @param {Object} countdown - Countdown object
 * @returns {string} Formatted countdown
 */
export function formatCountdown(countdown) {
  // If isLive is true, it means time has passed
  // But we still want to show countdown format (negative time)
  // So we'll handle it in the component instead
  
  const { hours, minutes, seconds } = countdown;
  
  // Handle negative time (time has passed)
  if (countdown.isLive) {
    // Time has passed, show as 0 or "Започва сега" handled in component
    return 'Започва сега';
  }
  
  if (hours > 0) {
    return `${hours}ч ${minutes}м ${seconds}с`;
  }
  
  if (minutes > 0) {
    return `${minutes}м ${seconds}с`;
  }
  
  return `${seconds}с`;
}

