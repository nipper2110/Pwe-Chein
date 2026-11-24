import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { saveLanguage } from '../api/auth'
import { applyLanguage, currentLanguage } from '../i18n'
import { isLanguage, type Language } from '../i18n/languages'
import { useUser } from './useAuth'

/** Saves the language in the user's profile (so it follows them to other devices). */
export function useSaveLanguage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: saveLanguage,
    onSuccess: (user) => queryClient.setQueryData(['me'], user),
  })
}

/** The current language and a function to change it. The choice goes to localStorage, and to the profile if logged in. */
export function useLanguage() {
  const { i18n } = useTranslation()
  const user = useUser()
  const save = useSaveLanguage()
  const language: Language = isLanguage(i18n.language) ? i18n.language : currentLanguage()

  const setLanguage = (next: Language) => {
    applyLanguage(next)
    if (user.data) save.mutate(next)
  }

  return { language, setLanguage }
}
