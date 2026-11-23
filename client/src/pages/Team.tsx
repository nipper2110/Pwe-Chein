import { Link, useParams } from 'react-router-dom'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import FormDots from '../components/FormDots'
import LeagueSection from '../components/LeagueSection'
import SeasonBadge from '../components/SeasonBadge'
import SeasonSummary from '../components/SeasonSummary'
import PageLayout from '../components/PageLayout'
import TableSkeleton from '../components/TableSkeleton'
import TeamHeader from '../components/TeamHeader'
import { useTeam } from '../hooks/useTeam'
import { usePageMeta } from '../hooks/usePageMeta'
import { ApiError } from '../api/http'
import NotFoundState from '../components/NotFoundState'
import { resultFor } from '../utils/results'

function TeamShell({ children }: { children: React.ReactNode }) {
  return (
    <PageLayout>
      <Link to="/league" className="inline-block text-sm text-slate-400 hover:text-slate-200">← Leagues</Link>
      {children}
    </PageLayout>
  )
}

export default function Team() {
  const { id } = useParams()
  const teamId = Number(id)
  if (!Number.isInteger(teamId) || teamId <= 0) {
    return <TeamShell><ErrorState message="Invalid team id" onRetry={() => history.back()} /></TeamShell>
  }
  return <TeamView teamId={teamId} />
}

function TeamView({ teamId }: { teamId: number }) {
  const team = useTeam(teamId)
  const data = team.data
  const notFound = team.error instanceof ApiError && team.error.status === 404
  usePageMeta({
    title: data ? data.team.name : notFound ? 'Team not found' : 'Team',
    description: data
      ? `${data.team.name}: season summary, recent results and stats for the ${data.season}/${String(data.season + 1).slice(-2)} season.`
      : undefined,
    noindex: !data,
  })

  return (
    <TeamShell>
      {team.isPending && <TableSkeleton rows={8} />}
      {notFound && <NotFoundState title="Team not found" message="That team doesn't exist." />}
      {team.isError && !notFound && <ErrorState message={team.error.message} onRetry={() => void team.refetch()} />}
      {team.isSuccess && (
        <>
          <TeamHeader data={team.data} />

          <p className="flex items-center gap-2 text-xs text-slate-400">
            <SeasonBadge /> Results and stats come from this season (free API plan limit).
          </p>

          {team.data.summary && <SeasonSummary summary={team.data.summary} />}

          <section aria-labelledby="recent-title" className="space-y-2">
            <div className="flex items-center gap-3">
              <h2 id="recent-title" className="font-semibold">Recent results</h2>
              {/* FormDots expects most recent first, which is how `recent` is already sorted. */}
              <FormDots form={team.data.recent.map((f) => resultFor(teamId, f) ?? '').join('')} />
            </div>
            {team.data.recent.length === 0 ? (
              <EmptyState text="No results found for this season." />
            ) : (
              <LeagueSection title="Last 5 matches" matches={team.data.recent} showDate showCompetition resultForTeamId={teamId} />
            )}
          </section>

          {/* Only shown when there are upcoming matches (the free plan usually has none). */}
          {team.data.upcoming.length > 0 && (
            <section aria-labelledby="next-title" className="space-y-2">
              <h2 id="next-title" className="font-semibold">Next fixtures</h2>
              <LeagueSection title="Upcoming" matches={team.data.upcoming} showDate showCompetition />
            </section>
          )}
        </>
      )}
    </TeamShell>
  )
}
