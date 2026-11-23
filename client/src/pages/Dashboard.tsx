import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import FollowedTeams from '../components/FollowedTeams'
import LeagueSection from '../components/LeagueSection'
import MatchListSkeleton from '../components/MatchListSkeleton'
import SiteHeader from '../components/SiteHeader'
import TableSkeleton from '../components/TableSkeleton'
import { useUser } from '../hooks/useAuth'
import { useFavorites } from '../hooks/useFavorites'
import { useFollowedMatches } from '../hooks/useFollowedMatches'
import { useNow } from '../hooks/useNow'

function FollowedMatches({ teamIds }: { teamIds: Set<number> }) {
  const now = useNow(60_000)
  const { days, isPending, error, refetch } = useFollowedMatches(teamIds, now)
  const withMatches = days.filter((d) => d.matches.length > 0)

  if (isPending) return <MatchListSkeleton />
  if (error) return <ErrorState message={error.message} onRetry={refetch} />
  if (withMatches.length === 0) {
    return <EmptyState text="None of your teams play from yesterday to tomorrow." />
  }
  return (
    <div className="space-y-4">
      {withMatches.map((d) => (
        <LeagueSection
          key={d.date}
          title={`${d.label} · ${new Date(`${d.date}T12:00:00`).toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' })}`}
          matches={d.matches}
          showCompetition
        />
      ))}
    </div>
  )
}

export default function Dashboard() {
  const user = useUser()
  const favorites = useFavorites()
  const teamIds = useMemo(() => new Set((favorites.data ?? []).map((f) => f.teamId)), [favorites.data])

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-4">
      <SiteHeader />
      <h1 className="text-xl font-bold">Welcome, {user.data?.name}</h1>

      {favorites.isPending && <TableSkeleton rows={3} />}
      {favorites.isError && <ErrorState message={favorites.error.message} onRetry={() => void favorites.refetch()} />}

      {favorites.isSuccess && favorites.data.length === 0 && (
        <div className="rounded-xl bg-surface p-8 text-center">
          <p className="mb-1 text-3xl">☆</p>
          <p className="mb-4 text-sm text-slate-400">You are not following any teams yet.</p>
          <Link to="/league" className="rounded-full bg-pitch px-4 py-1.5 text-sm font-semibold text-base">
            Find a team
          </Link>
          <p className="mt-3 text-xs text-slate-500">Open a league, click a team, and press Follow.</p>
        </div>
      )}

      {favorites.isSuccess && favorites.data.length > 0 && (
        <>
          <section aria-labelledby="teams-title" className="space-y-2">
            <h2 id="teams-title" className="font-semibold">Teams you follow</h2>
            <FollowedTeams teams={favorites.data} />
          </section>

          <section aria-labelledby="matches-title" className="space-y-2">
            <h2 id="matches-title" className="font-semibold">Your teams' matches</h2>
            <FollowedMatches teamIds={teamIds} />
          </section>
        </>
      )}
    </main>
  )
}
