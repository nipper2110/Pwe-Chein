import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import type { MatchDetail, MatchEvent, ScorePair } from '../types/match'
import { isFinished } from '../utils/fixtureStatus'
import EmptyState from './EmptyState'
import EventRow from './EventRow'
import TimelineDivider from './TimelineDivider'

// Statuses that mean the first half is over.
const PAST_HALF_TIME = new Set(['HT', '2H', 'ET', 'BT', 'P', 'FT', 'AET', 'PEN'])

/**
 * True for first-half events. A substitution logged at exactly 45' (no added time)
 * is almost always a half-time change, so it goes after the HT divider.
 */
function isFirstHalf(e: MatchEvent): boolean {
  if (e.time.elapsed < 45) return true
  if (e.time.elapsed === 45) return e.time.extra !== null || e.type !== 'subst'
  return false
}

const formatScore = (s: ScorePair): string | undefined =>
  s.home === null || s.away === null ? undefined : `${s.home}-${s.away}`

export default function EventsTimeline({ match }: { match: MatchDetail }) {
  const { t } = useTranslation()
  if (match.events.length === 0) return <EmptyState text={t('match.noEvents')} />

  const halfTimeReached = PAST_HALF_TIME.has(match.fixture.status.short)
  const firstSecondHalf = match.events.findIndex((e) => !isFirstHalf(e))
  // Put "HT" before the first second-half event, or at the very end if there is none.
  const htIndex = !halfTimeReached ? -1 : firstSecondHalf === -1 ? match.events.length : firstSecondHalf
  const ht = <TimelineDivider key="ht" label={t('timeline.HT')} score={formatScore(match.score.halftime)} />

  return (
    <ol className="overflow-hidden rounded-xl bg-surface">
      {match.events.map((e, i) => (
        <Fragment key={i}>
          {i === htIndex && ht}
          <EventRow event={e} isHome={e.team.id === match.teams.home.id} />
        </Fragment>
      ))}
      {htIndex === match.events.length && ht}
      {isFinished(match) && (
        <TimelineDivider
          label={t(`timeline.${match.fixture.status.short as 'FT' | 'AET' | 'PEN'}`)}
          score={`${match.goals.home ?? 0}-${match.goals.away ?? 0}`}
        />
      )}
    </ol>
  )
}
