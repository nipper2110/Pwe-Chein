import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { LANGUAGE_STORAGE_KEY, detectLanguage, isLanguage, type Language } from './languages'
import en from './locales/en.json'
import my from './locales/my.json'
import th from './locales/th.json'

void i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, my: { translation: my }, th: { translation: th } },
  lng: detectLanguage(),
  fallbackLng: 'en', // a missing Burmese/Thai string shows English instead of a raw key
  supportedLngs: ['en', 'my', 'th'],
  interpolation: { escapeValue: false }, // React already escapes text
  initAsync: false, // load right away, so the first paint is already in the right language
  react: { useSuspense: false },
})

// Keep <html lang> in step with the language: screen readers pick the right voice and the
// browser picks the right fonts and hyphenation from it.
document.documentElement.lang = i18n.language
i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng
})

/** Switch language and remember it on this device. */
export function applyLanguage(language: Language): void {
  void i18n.changeLanguage(language)
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
  } catch {
    /* private mode: the choice just will not be remembered */
  }
}

export const currentLanguage = (): Language => (isLanguage(i18n.language) ? i18n.language : 'en')

export default i18n
