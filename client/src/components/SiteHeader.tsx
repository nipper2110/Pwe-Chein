import { Star, Trophy } from 'lucide-react'
import type { ComponentType } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, NavLink } from 'react-router-dom'
import { useUser } from '../hooks/useAuth'
import BrandMark from './BrandMark'
import LanguageMenu from './LanguageMenu'
import PixelBallIcon from './PixelBallIcon'
import ThemeToggle from './ThemeToggle'
import UserMenu from './UserMenu'

// Lucide icons and our pixel ball all accept a `size`, so they fit the same slot.
type NavIcon = ComponentType<{ size?: number; 'aria-hidden'?: boolean }>

const NAV: { to: string; label: 'nav.matches' | 'nav.leagues' | 'nav.myTeams'; icon: NavIcon; end?: boolean }[] = [
  { to: '/', label: 'nav.matches', icon: PixelBallIcon, end: true },
  { to: '/league', label: 'nav.leagues', icon: Trophy },
  { to: '/dashboard', label: 'nav.myTeams', icon: Star },
]

const navClass = ({ isActive }: { isActive: boolean }) =>
  `group flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition ${
    isActive ? 'bg-pitch/15 text-pitch' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
  }`

/**
 * Sticky top bar. Desktop: logo, three nav items, theme button and the account area.
 * Mobile (below md): just the logo and the account area; navigation moves to the bottom tab bar.
 */
export default function SiteHeader() {
  const { t } = useTranslation()
  const user = useUser()

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-surface/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-4">
        <Link to="/" className="shrink-0 rounded-md">
          <BrandMark />
        </Link>

        {/* Sits next to the logo (not centred), so it never shifts when the right side changes. */}
        <nav aria-label={t('nav.main')} className="ml-3 hidden items-center gap-1 md:flex">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={navClass}>
              <Icon size={16} aria-hidden={true} />
              {t(label)}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <LanguageMenu />
          {/* On mobile the theme button moves into the account menu / Account page. */}
          <ThemeToggle className="hidden md:inline-flex" />
          {user.data ? (
            <UserMenu user={user.data} />
          ) : (
            // While we are still asking the server who is logged in, show nothing to avoid a flicker.
            user.isSuccess && (
              <>
                {/* Below lg there is no room for Sign up here (Burmese words are long); the login page and Account tab link to it. */}
                <Link to="/login" className="whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white">
                  {t('auth.login')}
                </Link>
                <Link
                  to="/register"
                  className="hidden whitespace-nowrap rounded-full bg-pitch px-3.5 py-1.5 text-sm font-semibold text-on-pitch lg:inline-flex"
                >
                  {t('auth.signup')}
                </Link>
              </>
            )
          )}
        </div>
      </div>
    </header>
  )
}
