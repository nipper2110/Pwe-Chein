// Some browsers (for example this Chrome build) have no Burmese data in Intl and quietly show English
// month and weekday names. For those, we format Burmese dates ourselves. The names below come from the
// official CLDR data (what Safari, Firefox and Node use), and a test checks this file against Intl.

const MONTHS_SHORT = ['ဇန်', 'ဖေ', 'မတ်', 'ဧ', 'မေ', 'ဇွန်', 'ဇူ', 'ဩ', 'စက်', 'အောက်', 'နို', 'ဒီ']
// Sunday first, like Date.getDay()
const WEEKDAYS_SHORT = ['တနင်္ဂနွေ', 'တနင်္လာ', 'အင်္ဂါ', 'ဗုဒ္ဓဟူး', 'ကြာသပတေး', 'သောကြာ', 'စနေ']

/**
 * Burmese order is: year, month, day, weekday  (e.g. "2026 နို 22 တနင်္ဂနွေ"), with Western digits.
 * Supports only the shapes the app uses (short month, short weekday, numeric day and year).
 * Returns null for anything else, so the caller can fall back to Intl.
 * Uses the device's time zone: Date's own getters are local.
 */
export function formatBurmeseDate(date: Date, options: Intl.DateTimeFormatOptions): string | null {
  const { weekday, day, month, year, ...others } = options
  const supported =
    Object.keys(others).length === 0 &&
    (weekday === undefined || weekday === 'short') &&
    (day === undefined || day === 'numeric') &&
    (month === undefined || month === 'short') &&
    (year === undefined || year === 'numeric')
  if (!supported) return null

  const parts: string[] = []
  if (year) parts.push(String(date.getFullYear()))
  if (month) parts.push(MONTHS_SHORT[date.getMonth()])
  if (day) parts.push(String(date.getDate()))
  if (weekday) parts.push(WEEKDAYS_SHORT[date.getDay()])
  return parts.join(' ')
}
