import { Goal, Star, Trophy, type LucideIcon } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import { useUser } from '../hooks/useAuth'
import ThemeToggle from './ThemeToggle'
import UserMenu from './UserMenu'

const NAV: { to: string; label: string; icon: LucideIcon; end?: boolean }[] = [
  { to: '/', label: 'Matches', icon: Goal, end: true }, // Lucide has no football, so a goal net stands in
  { to: '/league', label: 'Leagues', icon: Trophy },
  { to: '/dashboard', label: 'My teams', icon: Star },
]

const navClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition ${
    isActive ? 'bg-pitch/15 text-pitch' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
  }`

/**
 * Sticky top bar. Desktop: logo, three nav items, theme button and the account area.
 * Mobile (below md): just the logo and the account area; navigation moves to the bottom tab bar.
 */
export default function SiteHeader() {
  const user = useUser()

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-surface/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-3xl items-center gap-3 px-4">
        <Link to="/" className="flex items-center gap-3 rounded-md">
          <span lang="my" className="font-burmese text-xl font-bold leading-none text-pitch">
            ပွဲချိန်
          </span>
          <span aria-hidden="true" className="hidden h-4 w-px bg-slate-700 md:block" />
          <span className="hidden text-xs text-slate-400 md:block">Live football</span>
        </Link>

        {/* Sits next to the logo (not centred), so it never shifts when the right side changes. */}
        <nav aria-label="Main" className="ml-3 hidden items-center gap-1 md:flex">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={navClass}>
              <Icon size={16} aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          {/* On mobile the theme button moves into the account menu / Account page. */}
          <ThemeToggle className="hidden md:inline-flex" />
          {user.data ? (
            <UserMenu user={user.data} />
          ) : (
            // While we are still asking the server who is logged in, show nothing to avoid a flicker.
            user.isSuccess && (
              <>
                <Link to="/login" className="rounded-full px-3 py-1.5 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white">
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="hidden rounded-full bg-pitch px-3.5 py-1.5 text-sm font-semibold text-on-pitch md:inline-flex"
                >
                  Sign up
                </Link>
              </>
            )
          )}
        </div>
      </div>
    </header>
  )
}
