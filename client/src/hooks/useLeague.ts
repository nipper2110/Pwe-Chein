import { useQuery } from '@tanstack/react-query'
import { fetchStandings, fetchTopScorers } from '../api/leagues'

// Our server caches these for 6 hours, so the browser can keep them for an hour without asking.
const STALE_MS = 60 * 60_000

export const useStandings = (leagueId: number) =>
  useQuery({ queryKey: ['standings', leagueId], queryFn: () => fetchStandings(leagueId), staleTime: STALE_MS })

export const useTopScorers = (leagueId: number) =>
  useQuery({ queryKey: ['topscorers', leagueId], queryFn: () => fetchTopScorers(leagueId), staleTime: STALE_MS })
