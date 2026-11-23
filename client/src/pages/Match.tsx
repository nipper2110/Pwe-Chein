import { Link, useParams, useSearchParams } from 'react-router-dom'
import ErrorState from '../components/ErrorState'
import EventsTimeline from '../components/EventsTimeline'
import LineupsView from '../components/LineupsView'
import MatchHeader from '../components/MatchHeader'
import MatchTabs, { type MatchTab } from '../components/MatchTabs'
import SiteHeader from '../components/SiteHeader'
import StatisticsBars from '../components/StatisticsBars'
import TableSkeleton from '../components/TableSkeleton'
import { useMatch } from '../hooks/useMatch'

export default function Match() {
  const { id } = useParams()
  const matchId = Number(id)
  if (!Number.isInteger(matchId) || matchId <= 0) return <MatchShell><ErrorState message="Invalid match id" onRetry={() => history.back()} /></MatchShell>
  return <MatchView matchId={matchId} />
}

function MatchShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-3xl space-y-5 p-4">
      <SiteHeader />
      <Link to="/" className="inline-block text-sm text-slate-400 hover:text-slate-200">← All matches</Link>
      {children}
    </main>
  )
}

function MatchView({ matchId }: { matchId: number }) {
  const match = useMatch(matchId)
  // The active tab lives in the URL (?tab=lineups), so each tab is linkable.
  const [params, setParams] = useSearchParams()
  const tab: MatchTab = params.get('tab') === 'lineups' ? 'lineups' : params.get('tab') === 'stats' ? 'stats' : 'events'
  const setTab = (next: MatchTab) => setParams(next === 'events' ? {} : { tab: next }, { replace: true })

  return (
    <MatchShell>
      {match.isPending && <TableSkeleton rows={8} />}
      {match.isError && <ErrorState message={match.error.message} onRetry={() => void match.refetch()} />}
      {match.isSuccess && (
        <>
          <MatchHeader match={match.data} />
          <MatchTabs active={tab} onChange={setTab} />
          <div id="match-panel" role="tabpanel" aria-labelledby={`tab-${tab}`}>
            {tab === 'events' && <EventsTimeline match={match.data} />}
            {tab === 'lineups' && <LineupsView match={match.data} />}
            {tab === 'stats' && <StatisticsBars match={match.data} />}
          </div>
        </>
      )}
    </MatchShell>
  )
}
