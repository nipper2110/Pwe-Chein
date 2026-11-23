import { useFixtures, useLiveFixtures } from './useFixtures'
import type { Fixture } from '../types/fixture'
import { addDays, toISODate } from '../utils/dates'
import { mayBeLiveSoon } from '../utils/fixtureStatus'

export interface DayMatches {
  label: string
  date: string
  matches: Fixture[]
}

const byKickoff = (a: Fixture, b: Fixture): number => a.fixture.date.localeCompare(b.fixture.date)

/**
 * Followed teams' matches from yesterday, today and tomorrow (in the user's time zone).
 * It reuses the same cached day lists as the Home page, so it adds no new kinds of API requests:
 * the free plan cannot fetch a team's current-season fixtures, but it can fetch fixtures by date.
 *
 * Live scores reuse the Home page's live query (same key, same server cache). It only runs while
 * one of the followed teams' matches is live or about to start.
 */
export function useFollowedMatches(teamIds: Set<number>, now: number) {
  const today = new Date(now)
  const days = [
    { label: 'Today', date: toISODate(today) },
    { label: 'Tomorrow', date: toISODate(addDays(today, 1)) },
    { label: 'Yesterday', date: toISODate(addDays(today, -1)) },
  ]
  // Always the same 3 calls in the same order, as React requires.
  const queries = [useFixtures(days[0].date), useFixtures(days[1].date), useFixtures(days[2].date)]

  const isFollowed = (f: Fixture): boolean => teamIds.has(f.teams.home.id) || teamIds.has(f.teams.away.id)

  const followedByDay = days.map((_, i) => (queries[i].data ?? []).filter(isFollowed))
  const soon = followedByDay[0].some((f) => mayBeLiveSoon(f, now))
  const live = useLiveFixtures(soon, isFollowed)

  // Live data is fresher than the day lists, so live matches get their own section
  // and are removed from the day sections to avoid showing them twice.
  const liveMatches = (live.data ?? []).filter(isFollowed).sort(byKickoff)
  const liveIds = new Set(liveMatches.map((f) => f.fixture.id))

  const result: DayMatches[] = days.map((day, i) => ({
    ...day,
    matches: followedByDay[i].filter((f) => !liveIds.has(f.fixture.id)).sort(byKickoff),
  }))

  return {
    liveMatches,
    days: result,
    isPending: queries.some((q) => q.isPending),
    error: queries.find((q) => q.isError)?.error ?? null,
    refetch: () => queries.forEach((q) => void q.refetch()),
  }
}
