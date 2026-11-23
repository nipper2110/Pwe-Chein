import type { Fixture, Team } from '../types/fixture'
import { formatKickoff } from '../utils/dates'
import { isFinished, isLive, isNotStarted } from '../utils/fixtureStatus'
import LiveBadge from './LiveBadge'

function TeamName({ team, align }: { team: Team; align: 'left' | 'right' }) {
  return (
    <div className={`flex flex-1 items-center gap-2 ${align === 'right' ? 'flex-row-reverse text-right' : ''}`}>
      <img src={team.logo} alt="" loading="lazy" className="h-6 w-6 shrink-0 object-contain" />
      <span className="truncate text-sm">{team.name}</span>
    </div>
  )
}

export default function MatchCard({ match }: { match: Fixture }) {
  const { status } = match.fixture
  const live = isLive(match)

  return (
    <div className="flex items-center gap-3 border-t border-slate-800 px-4 py-3 first:border-t-0">
      <TeamName team={match.teams.home} align="left" />

      <div className="flex w-20 shrink-0 flex-col items-center gap-1">
        {isNotStarted(match) ? (
          <span className="font-mono text-sm text-slate-300">{formatKickoff(match.fixture.date)}</span>
        ) : (
          <span className={`font-mono text-lg font-bold ${live ? 'text-live' : ''}`}>
            {match.goals.home ?? 0} - {match.goals.away ?? 0}
          </span>
        )}
        {live && <LiveBadge minute={status.elapsed} />}
        {!live && !isNotStarted(match) && (
          <span className="text-[10px] uppercase text-slate-500">{isFinished(match) ? 'FT' : status.long}</span>
        )}
      </div>

      <TeamName team={match.teams.away} align="right" />
    </div>
  )
}
