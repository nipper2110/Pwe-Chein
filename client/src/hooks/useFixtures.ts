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
 * - the last answer still contained live matches.
 * This protects our 100 requests/day.
 */
export function useLiveFixtures(soon: boolean) {
  const queryClient = useQueryClient()
  const hasLive = (queryClient.getQueryData<Fixture[]>(LIVE_KEY)?.length ?? 0) > 0

  return useQuery({
    queryKey: LIVE_KEY,
    queryFn: fetchLiveFixtures,
    enabled: soon || hasLive,
    refetchInterval: 60_000,
  })
}
