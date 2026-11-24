import { ChevronDown, Languages } from 'lucide-react'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../hooks/useLanguage'
import { LANGUAGES, isLanguage } from '../i18n/languages'

/**
 * A compact language picker for the header (shown to logged-out visitors).
 * Below lg it shrinks to just the globe icon (the select still works, its text is just invisible);
 * from lg up it also shows the current language's name.
 * It is a real <select>, so the keyboard, screen readers and phone pickers all just work.
 * Each language is written in its own script.
 */
export default function LanguageSelect({ className = '' }: { className?: string }) {
  const { t } = useTranslation()
  const { language, setLanguage } = useLanguage()
  const id = useId()

  return (
    <div className={`relative ${className}`}>
      <label htmlFor={id} className="sr-only">
        {t('language.label')}
      </label>
      <Languages size={16} aria-hidden="true" className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
      <select
        id={id}
        value={language}
        onChange={(e) => {
          if (isLanguage(e.target.value)) setLanguage(e.target.value)
        }}
        className="h-9 w-9 cursor-pointer appearance-none rounded-full bg-transparent py-1 text-sm font-medium text-transparent transition hover:bg-slate-800 lg:w-auto lg:pl-8 lg:pr-7 lg:text-slate-300 lg:hover:text-white"
      >
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code} lang={l.code} className="bg-surface text-slate-200">
            {l.name}
          </option>
        ))}
      </select>
      <ChevronDown size={14} aria-hidden="true" className="pointer-events-none absolute right-2.5 hidden lg:block top-1/2 -translate-y-1/2 text-slate-400" />
    </div>
  )
}
