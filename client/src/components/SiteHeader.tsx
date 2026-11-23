import { Link, NavLink } from 'react-router-dom'
import { useLogout, useUser } from '../hooks/useAuth'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-full px-3 py-1 text-sm font-medium ${isActive ? 'bg-slate-800 text-pitch' : 'text-slate-400 hover:text-slate-200'}`

export default function SiteHeader() {
  const user = useUser()
  const logout = useLogout()

  return (
    <header className="flex flex-wrap items-center justify-between gap-2">
      <Link to="/" className="block">
        <span className="font-burmese text-3xl font-bold text-pitch">ပွဲချိန်</span>
        <span className="block text-sm text-slate-400">Live Football Scores & Stats</span>
      </Link>
      <nav className="flex flex-wrap items-center gap-1" aria-label="Main">
        <NavLink to="/" end className={linkClass}>
          Matches
        </NavLink>
        <NavLink to="/league" className={linkClass}>
          Leagues
        </NavLink>
        {user.data ? (
          <>
            <NavLink to="/dashboard" className={linkClass}>
              Dashboard
            </NavLink>
            <button
              type="button"
              onClick={() => logout.mutate()}
              disabled={logout.isPending}
              className="rounded-full px-3 py-1 text-sm font-medium text-slate-400 hover:text-slate-200"
            >
              Log out
            </button>
          </>
        ) : (
          // While we are still asking the server who is logged in, show nothing to avoid a flicker.
          user.isSuccess && (
            <>
              <NavLink to="/login" className={linkClass}>
                Log in
              </NavLink>
              <Link to="/register" className="rounded-full bg-pitch px-3 py-1 text-sm font-semibold text-base">
                Sign up
              </Link>
            </>
          )
        )}
      </nav>
    </header>
  )
}
