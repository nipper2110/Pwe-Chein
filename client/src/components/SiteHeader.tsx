import { Star, Trophy } from 'lucide-react'
import type { ComponentType } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useUser } from '../hooks/useAuth'
import BrandMark from './BrandMark'
import PixelBallIcon from './PixelBallIcon'
import ThemeToggle from './ThemeToggle'
import UserMenu from './UserMenu'

// Lucide icons and our pixel ball all accept a `size`, so they fit the same slot.
type NavIcon = ComponentType<{ size?: number; 'aria-hidden'?: boolean }>

const NAV: { to: string; label: string; icon: NavIcon; end?: boolean }[] = [
  { to: '/', label: 'Matches', icon: PixelBallIcon, end: true },
  { to: '/league', label: 'Leagues', icon: Trophy },
  { to: '/dashboard', label: 'My teams', icon: Star },
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
  const user = useUser()

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-surface/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-4xl items-center gap-3 px-4">
        <Link to="/" className="shrink-0 rounded-md">
          <BrandMark />
        </Link>

        {/* Sits next to the logo (not centred), so it never shifts when the right side changes. */}
        <nav aria-label="Main" className="ml-3 hidden items-center gap-1 md:flex">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={navClass}>
              <Icon size={16} aria-hidden={true} />
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
                <Link to="/login" className="whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white">
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="hidden whitespace-nowrap rounded-full bg-pitch px-3.5 py-1.5 text-sm font-semibold text-on-pitch md:inline-flex"
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
