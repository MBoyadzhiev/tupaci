/**
 * Get current time utilities
 * Use this to help set match times correctly
 */

/**
 * Get current time in ISO format (UTC)
 */
export function getCurrentTimeUTC() {
  return new Date().toISOString();
}

/**
 * Get current time in Bulgarian time (EET/EEST)
 * Returns formatted string
 */
export function getCurrentTimeBulgarian() {
  const now = new Date();
  return now.toLocaleString('bg-BG', {
    timeZone: 'Europe/Sofia',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

/**
 * Convert Bulgarian time to UTC ISO string
 * @param {string} bulgarianTime - Format: "2025-01-20 17:00" (YYYY-MM-DD HH:mm)
 * @returns {string} ISO string in UTC
 */
export function bulgarianTimeToUTC(bulgarianTime) {
  // Bulgarian time is UTC+2 (winter) or UTC+3 (summer)
  // This is a simple converter - adjust based on DST
  const [datePart, timePart] = bulgarianTime.split(' ');
  const [year, month, day] = datePart.split('-');
  const [hour, minute] = timePart.split(':');
  
  // Create date in Bulgarian timezone
  const date = new Date(`${year}-${month}-${day}T${hour}:${minute}:00+02:00`);
  
  // Convert to UTC
  return date.toISOString();
}

/**
 * Log current time info (for debugging)
 */
export function logCurrentTime() {
  const utc = getCurrentTimeUTC();
  const bg = getCurrentTimeBulgarian();
  console.log('Current UTC time:', utc);
  console.log('Current Bulgarian time:', bg);
  console.log('Use this to set match start times!');
  return { utc, bg };
}

