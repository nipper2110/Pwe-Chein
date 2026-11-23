import type { MatchDetail } from '../types/match'
import EmptyState from './EmptyState'
import EventRow from './EventRow'

export default function EventsTimeline({ match }: { match: MatchDetail }) {
  if (match.events.length === 0) return <EmptyState text="No events yet. They appear once the match starts." />

  return (
    <ol className="overflow-hidden rounded-xl bg-surface">
      {match.events.map((e, i) => (
        <EventRow key={i} event={e} isHome={e.team.id === match.teams.home.id} />
      ))}
    </ol>
  )
}
