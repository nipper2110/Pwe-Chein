import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { ApiError } from '../api/http'

type Translate = (key: string, options?: Record<string, unknown>) => string

/**
 * Turns any error into a friendly message in the user's language.
 * It never shows the server's English text: it uses the error CODE to find a translation.
 */
export function useErrorText() {
  const { t, i18n } = useTranslation()
  // Keys here are built from codes at run time, so the compile-time key check cannot see them.
  const translate = t as unknown as Translate

  const errorText = useCallback(
    (error: unknown): string => {
      if (error instanceof ApiError) {
        if (error.status === 0) return translate('errors.network')
        if (error.code === 'RATE_LIMITED') {
          const scope = String(error.params.scope ?? 'api')
          const reason = i18n.exists(`errors.rateLimited.${scope}`) ? translate(`errors.rateLimited.${scope}`) : translate('errors.rateLimited.api')
          const minutes = Math.max(1, Number(error.params.retryAfterMinutes ?? 1))
          return `${reason} ${translate('errors.rateLimited.retry', { count: minutes })}`
        }
        if (error.code && i18n.exists(`errors.${error.code}`)) return translate(`errors.${error.code}`, error.params)
      }
      return translate('errors.generic')
    },
    [translate, i18n],
  )

  /** A validation code such as "invalid_email" -> its translated message. */
  const fieldText = useCallback(
    (code: string | undefined): string | undefined => {
      if (!code) return undefined
      return i18n.exists(`validation.${code}`) ? translate(`validation.${code}`) : translate('errors.VALIDATION')
    },
    [translate, i18n],
  )

  return { errorText, fieldText }
}
