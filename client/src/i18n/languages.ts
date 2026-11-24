/** The three languages of the site. `name` is always shown in its own script. */
export const LANGUAGES = [
  { code: 'en', name: 'English', intl: 'en' },
  { code: 'my', name: 'မြန်မာ', intl: 'my-u-nu-latn' },
  // th-TH-u-ca-gregory = Thai words, but the normal (Gregorian) year, not the Buddhist year (2026, not 2569).
  // nu-latn = Western digits 0-9 in every language, so dates match the scores, minutes and statistics.
  { code: 'th', name: 'ไทย', intl: 'th-TH-u-ca-gregory-nu-latn' },
] as const

export type Language = (typeof LANGUAGES)[number]['code']

export const LANGUAGE_STORAGE_KEY = 'pwechein-lang'

export const isLanguage = (value: unknown): value is Language => LANGUAGES.some((l) => l.code === value)

export const intlLocale = (language: string): string => LANGUAGES.find((l) => l.code === language)?.intl ?? 'en'

/**
 * Which language to start in:
 * 1. the choice saved on this device, otherwise
 * 2. the first language in the browser's preference list that we translate, otherwise
 * 3. English.
 * (A logged-in user's saved profile language is applied on top of this once we know who they are.)
 */
export function detectLanguage(): Language {
  try {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY)
    if (isLanguage(saved)) return saved
  } catch {
    /* private mode: no saved choice */
  }
  for (const tag of navigator.languages?.length ? navigator.languages : [navigator.language]) {
    const base = tag.toLowerCase().split(/[-_;]/)[0] // "th-TH" -> "th" (also tolerates "th;q=0.8")
    if (base === 'my' || base === 'mya' || base === 'bur') return 'my'
    if (base === 'th' || base === 'tha') return 'th'
    if (base === 'en') return 'en'
  }
  return 'en'
}
