import { useQuery } from '@tanstack/react-query'
import { fetchHealth } from '../api/health'

/** The season our server uses for standings and top scorers (set by SEASON in server/.env). */
export function useSeason(): number | undefined {
  const { data } = useQuery({ queryKey: ['health'], queryFn: fetchHealth, staleTime: Infinity })
  return data?.season
}
