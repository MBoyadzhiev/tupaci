/**
 * Test helper functions for countdown and match time testing
 */

/**
 * Get a time X minutes from now (for testing countdown)
 * @param {number} minutesFromNow - Positive for future, negative for past
 * @returns {string} ISO string
 */
export function getTestTime(minutesFromNow) {
  return new Date(Date.now() + minutesFromNow * 60 * 1000).toISOString();
}

/**
 * Get current time (for instant live match testing)
 * @returns {string} ISO string
 */
export function getNowTime() {
  return new Date().toISOString();
}

/**
 * Get time X minutes ago (for testing live match)
 * @param {number} minutesAgo - Minutes in the past
 * @returns {string} ISO string
 */
export function getPastTime(minutesAgo) {
  return new Date(Date.now() - minutesAgo * 60 * 1000).toISOString();
}

/**
 * Example usage in src/data/players.js:
 * 
 * import { getTestTime, getPastTime } from '../utils/testHelpers';
 * 
 * // Countdown test (5 minutes from now)
 * startTime: getTestTime(5),
 * 
 * // Live match test (30 minutes ago, showing 30')
 * startTime: getPastTime(30),
 * 
 * // Instant live (just started)
 * startTime: getNowTime(),
 */

