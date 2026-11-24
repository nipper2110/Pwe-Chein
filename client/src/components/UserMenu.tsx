import { ChevronDown, LogOut, Moon, Star, Sun } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import type { User } from '../api/auth'
import { useLogout } from '../hooks/useAuth'
import { useMenu } from '../hooks/useMenu'
import { useTheme } from '../hooks/useTheme'
import Avatar from './Avatar'

const ITEM =
  'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-slate-300 hover:bg-slate-800 hover:text-white focus-visible:bg-slate-800 focus-visible:text-white'

/** The avatar button and its dropdown (see useMenu for the keyboard pattern). */
export default function UserMenu({ user }: { user: User }) {
  const { t } = useTranslation()
  const { open, setOpen, close, rootRef, buttonRef, menuRef, menuId, rootProps } = useMenu()
  const logout = useLogout()
  const { theme, toggle: toggleTheme } = useTheme()
  const themeLabel = theme === 'dark' ? t('theme.toLight') : t('theme.toDark')
  const ThemeIcon = theme === 'dark' ? Sun : Moon

  return (
    <div ref={rootRef} className="relative" {...rootProps}>
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 rounded-full p-0.5 transition hover:bg-slate-800"
      >
        <Avatar name={user.name} />
        {/* The button's name. (An aria-label would not match the visible initials, which breaks voice control.) */}
        <span className="sr-only">{t('auth.menuFor', { name: user.name })}</span>
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
          className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border border-slate-800 bg-surface p-1.5 shadow-xl outline-none"
        >
          <div className="px-3 py-2">
            <p className="truncate text-sm font-semibold text-white">{user.name}</p>
            <p className="truncate text-xs text-slate-400">{user.email}</p>
          </div>
          <div role="separator" className="my-1 h-px bg-slate-800" />
          <div ref={menuRef} role="menu" aria-label={t('auth.menuLabel')}>
            <Link to="/dashboard" role="menuitem" tabIndex={-1} onClick={() => close(false)} className={ITEM}>
              <Star size={16} aria-hidden="true" />
              {t('nav.myTeams')}
            </Link>
            {/* On desktop the theme button lives in the header; on mobile it is only here. */}
            <button
              type="button"
              role="menuitem"
              tabIndex={-1}
              onClick={() => {
                toggleTheme()
                close(true)
              }}
              className={`${ITEM} md:hidden`}
            >
              <ThemeIcon size={16} aria-hidden="true" />
              {themeLabel}
            </button>
            <button
              type="button"
              role="menuitem"
              tabIndex={-1}
              disabled={logout.isPending}
              onClick={() => {
                logout.mutate()
                close(false)
              }}
              className={ITEM}
            >
              <LogOut size={16} aria-hidden="true" />
              {t('auth.logout')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
