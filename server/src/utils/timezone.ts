// IANA names look like "Asia/Yangon", "America/Argentina/Buenos_Aires" or "UTC".
const SHAPE = /^[A-Za-z0-9_+-]+(\/[A-Za-z0-9_+-]+){0,2}$/;

/** True only for real IANA time zone names. Rejects junk before it can reach the API or the cache key. */
export function isValidTimeZone(tz: string): boolean {
  if (tz.length > 64 || !SHAPE.test(tz)) return false;
  try {
    new Intl.DateTimeFormat("en", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

/** The calendar date (YYYY-MM-DD) it is right now in the given time zone. */
export function todayIn(tz: string, now: Date = new Date()): string {
  return now.toLocaleDateString("en-CA", { timeZone: tz });
}

/**
 * Time zones were renamed over the years, and browsers disagree on which spelling to report
 * (Chrome says "Asia/Rangoon" on a Myanmar device, newer browsers say "Europe/Kyiv").
 * API-Football only knows ONE spelling of each and silently falls back to UTC for the others,
 * which would group matches into the wrong days. So before calling it we rename these few.
 * (Checked against API-Football's own /timezone list.)
 */
const API_ZONE_ALIASES: Record<string, string> = {
  "Asia/Rangoon": "Asia/Yangon",
  "Asia/Katmandu": "Asia/Kathmandu",
  "Europe/Kyiv": "Europe/Kiev",
};

/** The spelling of a time zone that API-Football understands. */
export function toApiTimeZone(tz: string): string {
  return API_ZONE_ALIASES[tz] ?? tz;
}
