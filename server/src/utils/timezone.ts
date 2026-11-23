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
