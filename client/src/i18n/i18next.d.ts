import type en from './locales/en.json'

// Tells TypeScript which translation keys exist, so t('nav.matchs') is a compile error, not a blank label.
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation'
    resources: { translation: typeof en }
  }
}
