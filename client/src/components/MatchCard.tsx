import { Link } from 'react-router-dom'
import type { Fixture, Team } from '../types/fixture'
import { formatKickoff } from '../utils/dates'
import { isFinished, isLive, isNotStarted } from '../utils/fixtureStatus'
import { resultFor } from '../utils/results'
import LiveBadge from './LiveBadge'

function TeamName({ team, align }: { team: Team; align: 'left' | 'right' }) {
  return (
    <div className={`flex flex-1 items-center gap-2 ${align === 'right' ? 'flex-row-reverse text-right' : ''}`}>
      <img src={team.logo} alt="" loading="lazy" className="h-6 w-6 shrink-0 object-contain" />
      <span className="truncate text-sm">{team.name}</span>
    </div>
  )
}

// Left edge colour on a team's page. Amber for losses, because red is only for live/goals.
const RESULT_STYLE = {
  W: { border: 'border-l-pitch', label: 'Win' },
  D: { border: 'border-l-slate-500', label: 'Draw' },
  L: { border: 'border-l-amber-500', label: 'Loss' },
} as const

interface Props {
  match: Fixture
  /** Show the match date (for lists that span many days, like a team's results). */
  showDate?: boolean
  /** Colour the card by this team's result (win/draw/loss). */
  resultForTeamId?: number
}

export default function MatchCard({ match, showDate = false, resultForTeamId }: Props) {
  const { status } = match.fixture
  const live = isLive(match)
  const result = resultForTeamId ? resultFor(resultForTeamId, match) : null
  const style = result ? RESULT_STYLE[result] : null

  return (
    <Link
      to={`/match/${match.fixture.id}`}
      className={`flex items-center gap-3 border-t border-slate-800 px-4 py-3 transition first:border-t-0 hover:bg-slate-800/60 ${
        style ? `border-l-4 ${style.border}` : ''
      }`}
    >
      <TeamName team={match.teams.home} align="left" />

      <div className={`flex shrink-0 flex-col items-center gap-1 ${showDate ? 'w-24' : 'w-20'}`}>
        {showDate && (
          <span className="whitespace-nowrap text-[10px] text-slate-500">
            {new Date(match.fixture.date).toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        )}
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
        {style && <span className="sr-only">{style.label}</span>}
      </div>

      <TeamName team={match.teams.away} align="right" />
    </Link>
  )
}
