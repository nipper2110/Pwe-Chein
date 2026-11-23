import { LogOut, Moon, Star, Sun } from 'lucide-react'
import { Link } from 'react-router-dom'
import Avatar from '../components/Avatar'
import PageLayout from '../components/PageLayout'
import TableSkeleton from '../components/TableSkeleton'
import { useLogout, useUser } from '../hooks/useAuth'
import { usePageMeta } from '../hooks/usePageMeta'
import { useTheme } from '../hooks/useTheme'

const ROW =
  'flex w-full items-center gap-3 rounded-xl bg-surface px-4 py-3 text-left text-sm font-medium text-slate-300 hover:text-white'

/** The "Account" tab on phones: who you are, the theme switch, and log out (or log in / sign up). */
export default function Account() {
  usePageMeta({ title: 'Account', noindex: true })
  const user = useUser()
  const logout = useLogout()
  const { theme, toggle } = useTheme()
  const next = theme === 'dark' ? 'light' : 'dark'
  const ThemeIcon = theme === 'dark' ? Sun : Moon

  return (
    <PageLayout>
      <h1 className="text-xl font-bold">Account</h1>

      {user.isPending && <TableSkeleton rows={3} />}

      {user.data && (
        <div className="flex items-center gap-4 rounded-xl bg-surface p-4">
          <Avatar name={user.data.name} size="lg" />
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold">{user.data.name}</p>
            <p className="truncate text-sm text-slate-400">{user.data.email}</p>
          </div>
        </div>
      )}

      {user.isSuccess && !user.data && (
        <div className="space-y-3 rounded-xl bg-surface p-6 text-center">
          <p className="text-sm text-slate-400">Log in to follow teams and see their matches.</p>
          <div className="flex justify-center gap-2">
            <Link to="/login" className="rounded-full bg-pitch px-5 py-2 text-sm font-semibold text-on-pitch">
              Log in
            </Link>
            <Link to="/register" className="rounded-full bg-slate-800 px-5 py-2 text-sm font-medium text-slate-300 hover:text-white">
              Sign up
            </Link>
          </div>
        </div>
      )}

      {!user.isPending && (
        <ul className="space-y-2">
          {user.data && (
            <li>
              <Link to="/dashboard" className={ROW}>
                <Star size={18} aria-hidden="true" />
                My teams
              </Link>
            </li>
          )}
          <li>
            <button type="button" onClick={toggle} className={ROW}>
              <ThemeIcon size={18} aria-hidden="true" />
              Switch to {next} theme
            </button>
          </li>
          {user.data && (
            <li>
              <button type="button" onClick={() => logout.mutate()} disabled={logout.isPending} className={ROW}>
                <LogOut size={18} aria-hidden="true" />
                Log out
              </button>
            </li>
          )}
        </ul>
      )}
    </PageLayout>
  )
}
