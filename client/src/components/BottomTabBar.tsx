import { Star, Trophy, UserRound } from 'lucide-react'
import type { ComponentType } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import PixelBallIcon from './PixelBallIcon'

type TabIcon = ComponentType<{ size?: number; 'aria-hidden'?: boolean }>

// `paths`: the pages where the tab counts as "current". Login and Sign up belong to the Account tab.
const TABS: { to: string; label: 'nav.matches' | 'nav.leagues' | 'nav.myTeams' | 'nav.account'; icon: TabIcon; size: number; paths: string[] }[] = [
  { to: '/', label: 'nav.matches', icon: PixelBallIcon, size: 24, paths: ['/'] },
  { to: '/league', label: 'nav.leagues', icon: Trophy, size: 20, paths: ['/league'] },
  { to: '/dashboard', label: 'nav.myTeams', icon: Star, size: 20, paths: ['/dashboard'] },
  { to: '/account', label: 'nav.account', icon: UserRound, size: 20, paths: ['/account', '/login', '/register'] },
]

const isCurrent = (pathname: string, paths: string[]): boolean =>
  paths.some((p) => (p === '/' ? pathname === '/' : pathname === p || pathname.startsWith(`${p}/`)))

/** Fixed tab bar at the bottom of the screen on phones. Hidden from md up, where the header has the nav. */
export default function BottomTabBar() {
  const { t } = useTranslation()
  const { pathname } = useLocation()

  return (
    <nav
      aria-label={t('nav.mobile')}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-800 bg-surface/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
    >
      <ul className="mx-auto grid max-w-3xl grid-cols-4">
        {TABS.map(({ to, label, icon: Icon, size, paths }) => {
          const current = isCurrent(pathname, paths)
          return (
            <li key={to}>
              <Link
                to={to}
                aria-current={current ? 'page' : undefined}
                className={`group flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition ${
                  current ? 'text-pitch' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon size={size} aria-hidden={true} />
                {t(label)}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
