import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useUser } from '../hooks/useAuth'
import PageLayout from './PageLayout'
import TableSkeleton from './TableSkeleton'

/** Wraps pages that need a login. Logged-out visitors are sent to /login, then back here afterwards. */
export default function ProtectedRoute() {
  const user = useUser()
  const location = useLocation()

  if (user.isPending) {
    return (
      <PageLayout>
        <TableSkeleton rows={4} />
      </PageLayout>
    )
  }
  if (!user.data) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return <Outlet />
}
