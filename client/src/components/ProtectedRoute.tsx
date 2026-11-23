import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useUser } from '../hooks/useAuth'
import SiteHeader from './SiteHeader'
import TableSkeleton from './TableSkeleton'

/** Wraps pages that need a login. Logged-out visitors are sent to /login, then back here afterwards. */
export default function ProtectedRoute() {
  const user = useUser()
  const location = useLocation()

  if (user.isPending) {
    return (
      <main className="mx-auto max-w-3xl space-y-5 p-4">
        <SiteHeader />
        <TableSkeleton rows={4} />
      </main>
    )
  }
  if (!user.data) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return <Outlet />
}
