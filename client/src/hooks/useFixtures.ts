import { useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchFixtures, fetchLiveFixtures } from '../api/fixtures'
import type { Fixture } from '../types/fixture'
import { TIME_ZONE } from '../utils/timezone'

const LIVE_KEY = ['fixtures', 'live']

export function useFixtures(date: string) {
  return useQuery({
    queryKey: ['fixtures', date, TIME_ZONE],
    queryFn: () => fetchFixtures(date, TIME_ZONE),
    staleTime: 5 * 60_000, // our server caches for 1h, so no need to ask again quickly
  })
}

/**
 * Polls live scores every 60s, but only while it matters:
 * - `soon`: a match is live or about to kick off, or
 * - the last answer still contained a live match that `relevant` accepts.
 * This protects our 100 requests/day.
 *
 * The Home page and the Dashboard both use this hook with the SAME query key, so they share one
 * request and one cache entry. `relevant` lets the Dashboard care only about followed teams.
 */
export function useLiveFixtures(soon: boolean, relevant: (match: Fixture) => boolean = () => true) {
  const queryClient = useQueryClient()
  const hasLive = (queryClient.getQueryData<Fixture[]>(LIVE_KEY) ?? []).some(relevant)

  return useQuery({
    queryKey: LIVE_KEY,
    queryFn: fetchLiveFixtures,
    enabled: soon || hasLive,
    refetchInterval: 60_000,
  })
}
