import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGoogleLogin } from '../hooks/useAuth'
import { useErrorText } from '../hooks/useErrorText'
import { useTheme } from '../hooks/useTheme'
import { currentLanguage } from '../i18n'
import { loadGoogleScript } from '../utils/googleScript'

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim() ?? ''

// Google wants initialize() called once. Its callback goes to whichever button is on screen right now.
let initialized = false
let onCredential: (credential: string) => void = () => {}

/**
 * "or" + the official Google sign-in button. It draws nothing at all when:
 *  - VITE_GOOGLE_CLIENT_ID is not set (Google sign-in is switched off), or
 *  - Google's script cannot load (offline, or blocked by a privacy extension).
 * The button follows the site's language and its light/dark theme.
 */
export default function GoogleSignIn({ mode }: { mode: 'signin' | 'signup' }) {
  const { t, i18n } = useTranslation()
  const { theme } = useTheme()
  const { errorText } = useErrorText()
  const google = useGoogleLogin()
  const wrapper = useRef<HTMLDivElement>(null) // full width of the form: we measure this one
  const holder = useRef<HTMLDivElement>(null) // Google draws the button in here
  const [failed, setFailed] = useState(false)
  const [width, setWidth] = useState(0) // measured width in whole pixels (0 = not measured yet)

  // Keep `width` equal to the form's width. Google's iframe sits inside `wrapper` and is never wider than 400px,
  // so it cannot change the wrapper's width: no feedback loop. setWidth with the same number does nothing.
  useEffect(() => {
    const el = wrapper.current
    if (!el) return
    const measure = () => setWidth(Math.floor(el.getBoundingClientRect().width))
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Point Google's callback at the current mutation (done in an effect, not during rendering).
  useEffect(() => {
    onCredential = (credential) => google.mutate({ credential, language: currentLanguage() })
  })

  // (Re)draw the button whenever the language or theme changes: Google draws it inside its own iframe.
  useEffect(() => {
    if (!CLIENT_ID || width === 0) return
    let cancelled = false
    let stopWatching = () => {}
    loadGoogleScript()
      .then(() => {
        const el = holder.current
        if (cancelled || !el || !window.google) return
        if (!initialized) {
          window.google.accounts.id.initialize({
            client_id: CLIENT_ID,
            callback: (response) => onCredential(response.credential),
            ux_mode: 'popup',
          })
          initialized = true
        }
        el.replaceChildren()
        // Google writes the iframe's accessible title itself (in whatever language it picks), so we set it ourselves
        // to match the site's language. The iframe appears a moment after renderButton() returns.
        const title = mode === 'signup' ? t('auth.googleSignUp') : t('auth.googleSignIn')
        const observer = new MutationObserver(() => {
          const frame = el.querySelector('iframe')
          if (frame && frame.title !== title) frame.title = title
        })
        observer.observe(el, { childList: true, subtree: true, attributes: true, attributeFilter: ['title'] })
        stopWatching = () => observer.disconnect()
        window.google.accounts.id.renderButton(el, {
          type: 'standard',
          theme: theme === 'dark' ? 'filled_black' : 'outline',
          size: 'large',
          text: mode === 'signup' ? 'signup_with' : 'signin_with',
          shape: 'pill',
          logo_alignment: 'left',
          width: Math.min(400, Math.max(200, width)), // Google needs a pixel width between 200 and 400
          locale: i18n.language, // "en", "my" or "th": the button's own text is written by Google in this language
        })
      })
      .catch(() => {
        if (!cancelled) setFailed(true)
      })
    return () => {
      cancelled = true
      stopWatching()
    }
  }, [theme, i18n.language, mode, t, width])

  if (!CLIENT_ID || failed) return null

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 text-xs text-slate-400">
        <span className="h-px flex-1 bg-slate-800" />
        {t('auth.or')}
        <span className="h-px flex-1 bg-slate-800" />
      </div>
      {/* min-h keeps the card from jumping when Google's button appears */}
      {/* color-scheme: light stops the iframe from getting an opaque white box in dark mode (only this wrapper, not the page) */}
      <div ref={wrapper} className="w-full" style={{ colorScheme: 'light' }}>
        <div ref={holder} className="flex min-h-11 justify-center" />
      </div>
      {google.isError && (
        <p role="alert" className="text-sm text-amber-500">
          {errorText(google.error)}
        </p>
      )}
      {google.isPending && <p className="text-center text-xs text-slate-400">{t('auth.loggingIn')}</p>}
    </div>
  )
}
