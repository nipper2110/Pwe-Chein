import { useQuery } from '@tanstack/react-query'
import { fetchMatch } from '../api/matches'
import { isLive } from '../utils/fixtureStatus'

export function useMatch(id: number) {
  return useQuery({
    queryKey: ['match', id],
    queryFn: () => fetchMatch(id),
    staleTime: 60_000,
    // Refresh every 60s only while this match is actually live (protects our request quota).
    refetchInterval: (query) => (query.state.data && isLive(query.state.data) ? 60_000 : false),
  })
}
