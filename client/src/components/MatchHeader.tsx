import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useFormat } from '../hooks/useFormat'
import { useLabels } from '../hooks/useLabels'
import type { MatchDetail } from '../types/match'
import { isFinished, isLive, isNotStarted } from '../utils/fixtureStatus'
import LeagueLogo from './LeagueLogo'
import LiveBadge from './LiveBadge'

export default function MatchHeader({ match }: { match: MatchDetail }) {
  const { t } = useTranslation()
  const format = useFormat()
  const labels = useLabels()
  const { home, away } = match.teams
  const { status, venue } = match.fixture
  const live = isLive(match)

  return (
    <section className="rounded-xl bg-surface p-4 text-center">
      <h1 className="sr-only">{t('match.versus', { home: home.name, away: away.name })}</h1>
      <Link to={`/league/${match.league.id}`} className="mb-4 inline-flex items-center gap-2 text-xs text-slate-400 hover:text-slate-200">
        <LeagueLogo src={match.league.logo} size="sm" />
        {match.league.name} · {labels.round(match.league.round)}
      </Link>

      <div className="flex items-center justify-center gap-3">
        <Link to={`/team/${home.id}`} className="flex flex-1 flex-col items-center gap-2 hover:text-pitch">
          <img src={home.logo} alt="" className="h-14 w-14 object-contain" />
          <span className="text-sm font-semibold">{home.name}</span>
        </Link>

        <div className="flex w-32 shrink-0 flex-col items-center gap-1">
          {isNotStarted(match) ? (
            <span className="whitespace-nowrap font-mono text-xl font-bold">{format.time(match.fixture.date)}</span>
          ) : (
            <span className={`font-mono text-3xl font-bold ${live ? 'text-live-text' : ''}`}>
              {match.goals.home ?? 0} - {match.goals.away ?? 0}
            </span>
          )}
          {live && <LiveBadge minute={status.elapsed} />}
          {!live && (
            <span className="text-xs uppercase text-slate-400">{isFinished(match) ? t('match.fullTime') : labels.status(status)}</span>
          )}
        </div>

        <Link to={`/team/${away.id}`} className="flex flex-1 flex-col items-center gap-2 hover:text-pitch">
          <img src={away.logo} alt="" className="h-14 w-14 object-contain" />
          <span className="text-sm font-semibold">{away.name}</span>
        </Link>
      </div>

      <p className="mt-4 text-xs text-slate-400">
        {format.date(match.fixture.date, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
        {venue.name ? ` · ${venue.name}${venue.city ? `, ${venue.city}` : ''}` : ''}
        {match.fixture.referee ? ` · ${t('match.referee', { name: match.fixture.referee })}` : ''}
      </p>
    </section>
  )
}
