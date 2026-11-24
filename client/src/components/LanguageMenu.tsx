import { Check, ChevronDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../hooks/useLanguage'
import { useMenu } from '../hooks/useMenu'
import { LANGUAGES } from '../i18n/languages'
import Flag from './Flag'

const ITEM =
  'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-slate-300 hover:bg-slate-800 hover:text-white focus-visible:bg-slate-800 focus-visible:text-white'

/**
 * The language button in the header: the current flag and a short code ("EN"), opening a small menu of
 * the three languages. It is shown to everybody. On phones only the flag is visible.
 * It uses the same menu-button pattern as the avatar menu (see useMenu).
 */
export default function LanguageMenu() {
  const { t } = useTranslation()
  const { language, setLanguage } = useLanguage()
  const { open, setOpen, close, rootRef, buttonRef, menuRef, menuId, rootProps } = useMenu()
  const current = LANGUAGES.find((l) => l.code === language) ?? LANGUAGES[0]

  return (
    <div ref={rootRef} className="relative" {...rootProps}>
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((o) => !o)}
        className="flex h-9 items-center gap-1.5 rounded-full px-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white md:px-2.5"
      >
        <Flag code={current.code} />
        {/* The code is visible text, so it is part of the button's name, followed by the full name below. */}
        <span className="hidden md:inline">{current.code.toUpperCase()}</span>
        <span className="sr-only">{t('language.current', { name: current.name })}</span>
        <ChevronDown
          size={14}
          aria-hidden="true"
          className={`hidden text-slate-400 transition md:block ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        // tabIndex -1 lets clicks inside the panel keep focus here instead of closing the menu.
        <div
          id={menuId}
          tabIndex={-1}
          className="absolute right-0 top-full z-50 mt-2 w-48 rounded-xl border border-slate-800 bg-surface p-1.5 shadow-xl outline-none"
        >
          <div ref={menuRef} role="menu" aria-label={t('language.label')}>
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                type="button"
                role="menuitemradio"
                aria-checked={language === l.code}
                lang={l.code}
                tabIndex={-1}
                onClick={() => {
                  setLanguage(l.code)
                  close(true)
                }}
                className={ITEM}
              >
                <Flag code={l.code} />
                <span className="flex-1">{l.name}</span>
                <Check size={16} aria-hidden="true" className={language === l.code ? 'text-pitch' : 'invisible'} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
