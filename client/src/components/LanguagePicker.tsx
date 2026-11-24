import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../hooks/useLanguage'
import { LANGUAGES } from '../i18n/languages'

/** Three big buttons, one per language, for the Account page. The chosen one is marked with aria-pressed. */
export default function LanguagePicker() {
  const { t } = useTranslation()
  const { language, setLanguage } = useLanguage()
  const titleId = useId()

  return (
    <section aria-labelledby={titleId}>
      <h2 id={titleId} className="mb-2 text-sm font-semibold text-slate-300">
        {t('language.label')}
      </h2>
      <div role="group" aria-labelledby={titleId} className="grid grid-cols-3 gap-2">
        {LANGUAGES.map((l) => (
          <button
            key={l.code}
            type="button"
            lang={l.code}
            aria-pressed={language === l.code}
            onClick={() => setLanguage(l.code)}
            className={`rounded-xl px-3 py-3 text-sm font-medium transition ${
              language === l.code ? 'bg-pitch text-on-pitch' : 'bg-surface text-slate-300 hover:text-white'
            }`}
          >
            {l.name}
          </button>
        ))}
      </div>
    </section>
  )
}
