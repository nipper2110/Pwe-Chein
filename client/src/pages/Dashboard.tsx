import EmptyState from '../components/EmptyState'
import SiteHeader from '../components/SiteHeader'
import { useUser } from '../hooks/useAuth'

// Placeholder for Phase 8, which adds followed teams and their matches.
export default function Dashboard() {
  const user = useUser()

  return (
    <main className="mx-auto max-w-3xl space-y-5 p-4">
      <SiteHeader />
      <h1 className="text-xl font-bold">Welcome, {user.data?.name}</h1>
      <EmptyState text="Your followed teams and their matches will appear here soon." />
    </main>
  )
}
