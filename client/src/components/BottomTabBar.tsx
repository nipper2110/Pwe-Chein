import { Goal, Star, Trophy, UserRound, type LucideIcon } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

// `paths`: the pages where the tab counts as "current". Login and Sign up belong to the Account tab.
const TABS: { to: string; label: string; icon: LucideIcon; paths: string[] }[] = [
  { to: '/', label: 'Matches', icon: Goal, paths: ['/'] },
  { to: '/league', label: 'Leagues', icon: Trophy, paths: ['/league'] },
  { to: '/dashboard', label: 'My teams', icon: Star, paths: ['/dashboard'] },
  { to: '/account', label: 'Account', icon: UserRound, paths: ['/account', '/login', '/register'] },
]

const isCurrent = (pathname: string, paths: string[]): boolean =>
  paths.some((p) => (p === '/' ? pathname === '/' : pathname === p || pathname.startsWith(`${p}/`)))

/** Fixed tab bar at the bottom of the screen on phones. Hidden from md up, where the header has the nav. */
export default function BottomTabBar() {
  const { pathname } = useLocation()

  return (
    <nav
      aria-label="Mobile"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-800 bg-surface/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
    >
      <ul className="mx-auto grid max-w-3xl grid-cols-4">
        {TABS.map(({ to, label, icon: Icon, paths }) => {
          const current = isCurrent(pathname, paths)
          return (
            <li key={to}>
              <Link
                to={to}
                aria-current={current ? 'page' : undefined}
                className={`flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition ${
                  current ? 'text-pitch' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon size={20} aria-hidden="true" />
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
