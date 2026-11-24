import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { formatBurmeseDate } from '../i18n/burmeseDate'
import { intlLocale } from '../i18n/languages'

/**
 * Dates, times and numbers in the chosen language.
 *
 * IMPORTANT: none of these pass a `timeZone`. The browser then uses the DEVICE's time zone, so
 * changing the language can never shift a kick-off time. (Our API requests send the device time
 * zone separately, see utils/timezone.ts.)
 */
export function useFormat() {
  const { i18n } = useTranslation()
  const language = i18n.language
  const locale = intlLocale(language)
  // Does this browser really know the locale? (If not, Intl silently answers in English.)
  const hasLocaleData = useMemo(() => Intl.DateTimeFormat.supportedLocalesOf([locale]).length > 0, [locale])

  return useMemo(
    () => ({
      /** e.g. "Mon, Nov 23, 2026" / "จ. 23 พ.ย. 2026" */
      date: (value: Date | string, options: Intl.DateTimeFormatOptions): string => {
        const d = new Date(value)
        if (language === 'my' && !hasLocaleData) {
          const burmese = formatBurmeseDate(d, options) // this browser has no Burmese data, so do it ourselves
          if (burmese) return burmese
        }
        return new Intl.DateTimeFormat(locale, options).format(d)
      },
      /** 24-hour clock in every language, e.g. "19:45". Football fixtures read the same everywhere. */
      time: (value: Date | string): string =>
        new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date(value)),
      /** Thousands separators, always with Western digits. */
      number: (value: number): string => new Intl.NumberFormat(locale).format(value),
    }),
    [language, locale, hasLocaleData],
  )
}
