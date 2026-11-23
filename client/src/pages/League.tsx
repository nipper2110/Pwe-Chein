import { Navigate, useParams } from 'react-router-dom'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import LeagueLogo from '../components/LeagueLogo'
import LeagueSwitcher from '../components/LeagueSwitcher'
import SeasonBadge from '../components/SeasonBadge'
import SiteHeader from '../components/SiteHeader'
import StandingsTable from '../components/StandingsTable'
import TableSkeleton from '../components/TableSkeleton'
import TopScorersList from '../components/TopScorersList'
import { useStandings, useTopScorers } from '../hooks/useLeague'
import { LEAGUES, isSupportedLeague, leagueLogo } from '../utils/leagues'

export default function League() {
  const { id } = useParams()
  const leagueId = Number(id)
  if (!isSupportedLeague(leagueId)) return <Navigate to="/league" replace />
  return <LeagueView leagueId={leagueId} />
}

function LeagueView({ leagueId }: { leagueId: number }) {
  const standings = useStandings(leagueId)
  const scorers = useTopScorers(leagueId)
  const league = LEAGUES.find((l) => l.id === leagueId)

  return (
    <main className="mx-auto max-w-3xl space-y-5 p-4">
      <SiteHeader />
      <LeagueSwitcher activeId={leagueId} />

      <div className="flex items-center gap-3">
        <LeagueLogo src={leagueLogo(leagueId)} size="lg" />
        <h1 className="text-xl font-bold">{league?.name}</h1>
        <SeasonBadge />
      </div>

      <section aria-labelledby="standings-title" className="space-y-2">
        <h2 id="standings-title" className="font-semibold">Standings</h2>
        {standings.isPending && <TableSkeleton />}
        {standings.isError && <ErrorState message={standings.error.message} onRetry={() => void standings.refetch()} />}
        {standings.isSuccess && standings.data.length === 0 && <EmptyState text="No standings available yet." />}
        {standings.isSuccess &&
          standings.data.map((group, i) => (
            <div key={group[0]?.group ?? i} className="space-y-1">
              {standings.data.length > 1 && <h3 className="text-xs text-slate-400">{group[0]?.group}</h3>}
              <StandingsTable rows={group} />
            </div>
          ))}
      </section>

      <section aria-labelledby="scorers-title" className="space-y-2">
        <h2 id="scorers-title" className="font-semibold">Top scorers</h2>
        {scorers.isPending && <TableSkeleton rows={6} />}
        {scorers.isError && <ErrorState message={scorers.error.message} onRetry={() => void scorers.refetch()} />}
        {scorers.isSuccess && scorers.data.length === 0 && <EmptyState text="No scorers available yet." />}
        {scorers.isSuccess && scorers.data.length > 0 && <TopScorersList scorers={scorers.data} />}
      </section>
    </main>
  )
}
