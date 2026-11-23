/** The browser's IANA time zone, e.g. "Asia/Yangon". Falls back to UTC if it cannot be detected. */
export function detectTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
  } catch {
    return 'UTC'
  }
}

// A user's time zone does not change while the page is open, so detect it once.
export const TIME_ZONE = detectTimeZone()
