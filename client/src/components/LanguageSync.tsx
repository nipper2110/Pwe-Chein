import { useEffect, useRef } from 'react'
import { applyLanguage, currentLanguage } from '../i18n'
import { useUser } from '../hooks/useAuth'
import { useSaveLanguage } from '../hooks/useLanguage'

/**
 * Keeps the language and the logged-in user's profile in step. It renders nothing.
 * - Profile has a language -> use it (the profile wins when you log in on a new device).
 * - Profile has none yet (older account) -> save the language we are using right now.
 * It acts once per user, so it never overrides a language you pick afterwards.
 */
export default function LanguageSync() {
  const user = useUser()
  const save = useSaveLanguage()
  const handledUser = useRef<string | null>(null)

  useEffect(() => {
    const me = user.data
    if (!me || handledUser.current === me.id) return
    handledUser.current = me.id
    if (me.language) {
      if (me.language !== currentLanguage()) applyLanguage(me.language)
    } else {
      save.mutate(currentLanguage())
    }
  }, [user.data, save])

  return null
}
