import { useMemo, useState } from 'react'
import DatePicker from '../components/DatePicker'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import LeagueSection from '../components/LeagueSection'
import MatchListSkeleton from '../components/MatchListSkeleton'
import SeasonBadge from '../components/SeasonBadge'
import SiteHeader from '../components/SiteHeader'
import { useFixtures, useLiveFixtures } from '../hooks/useFixtures'
import { useNow } from '../hooks/useNow'
import type { Fixture } from '../types/fixture'
import { toISODate } from '../utils/dates'
import { mayBeLiveSoon } from '../utils/fixtureStatus'

// Display order of leagues (ids from CLAUDE.md).
const LEAGUE_ORDER = [39, 140, 135, 78, 61, 2]

function groupByLeague(fixtures: Fixture[]): { league: Fixture['league']; matches: Fixture[] }[] {
  const groups = new Map<number, { league: Fixture['league']; matches: Fixture[] }>()
  for (const f of fixtures) {
    const group = groups.get(f.league.id) ?? { league: f.league, matches: [] }
    group.matches.push(f)
    groups.set(f.league.id, group)
  }
  return [...groups.values()]
    .sort((a, b) => LEAGUE_ORDER.indexOf(a.league.id) - LEAGUE_ORDER.indexOf(b.league.id))
    .map((g) => ({ ...g, matches: g.matches.sort((a, b) => a.fixture.date.localeCompare(b.fixture.date)) }))
}

export default function Home() {
  const [date, setDate] = useState(() => toISODate(new Date()))
  const now = useNow(60_000)
  const isToday = date === toISODate(new Date(now))

  const day = useFixtures(date)

  // Only poll live scores when it can actually matter (saves our 100 requests/day).
  const soon = isToday && (day.data ?? []).some((f) => mayBeLiveSoon(f, now))
  const live = useLiveFixtures(soon)
  const liveMatches = useMemo(() => (isToday ? (live.data ?? []) : []), [isToday, live.data])

  const groups = useMemo(() => {
    const liveIds = new Set(liveMatches.map((f) => f.fixture.id))
    return groupByLeague((day.data ?? []).filter((f) => !liveIds.has(f.fixture.id)))
  }, [day.data, liveMatches])

  return (
    <main className="mx-auto max-w-2xl space-y-5 p-4">
      <SiteHeader />
      <p className="flex items-center gap-2 text-xs text-slate-500">
        <SeasonBadge /> Standings and top scorers use this season (free API plan limit).
      </p>

      <DatePicker value={date} now={now} onChange={setDate} />

      {day.isPending && <MatchListSkeleton />}
      {day.isError && <ErrorState message={day.error.message} onRetry={() => void day.refetch()} />}

      {day.isSuccess && (
        <>
          {liveMatches.length > 0 && <LeagueSection title="🔴 Live now" matches={liveMatches} />}
          {groups.length === 0 && liveMatches.length === 0 && (
            <EmptyState text="No matches in our 6 leagues on this day." />
          )}
          {groups.map((g) => (
            <LeagueSection key={g.league.id} title={g.league.name} logo={g.league.logo} matches={g.matches} />
          ))}
        </>
      )}
    </main>
  )
}
