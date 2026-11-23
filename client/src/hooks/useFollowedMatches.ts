import { useFixtures } from './useFixtures'
import type { Fixture } from '../types/fixture'
import { addDays, toISODate } from '../utils/dates'

export interface DayMatches {
  label: string
  date: string
  matches: Fixture[]
}

/**
 * Followed teams' matches from yesterday, today and tomorrow (in the user's time zone).
 * It reuses the same cached day lists as the Home page, so it adds no new kinds of API requests:
 * the free plan cannot fetch a team's current-season fixtures, but it can fetch fixtures by date.
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

  const result: DayMatches[] = days.map((day, i) => ({
    ...day,
    matches: (queries[i].data ?? [])
      .filter((f) => teamIds.has(f.teams.home.id) || teamIds.has(f.teams.away.id))
      .sort((a, b) => a.fixture.date.localeCompare(b.fixture.date)),
  }))

  return {
    days: result,
    isPending: queries.some((q) => q.isPending),
    error: queries.find((q) => q.isError)?.error ?? null,
    refetch: () => queries.forEach((q) => void q.refetch()),
  }
}
