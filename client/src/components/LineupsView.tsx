import type { MatchDetail } from '../types/match'
import EmptyState from './EmptyState'
import TeamLineup from './TeamLineup'

export default function LineupsView({ match }: { match: MatchDetail }) {
  if (match.lineups.length === 0) return <EmptyState text="Lineups are not announced yet. They usually appear about an hour before kick-off." />

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {match.lineups.map((l) => (
        <TeamLineup key={l.team.id} lineup={l} />
      ))}
    </div>
  )
}
