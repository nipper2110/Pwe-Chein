import { useQuery } from '@tanstack/react-query'
import { fetchTeam } from '../api/teams'

export function useTeam(id: number) {
  return useQuery({
    queryKey: ['team', id],
    queryFn: () => fetchTeam(id),
    staleTime: 60 * 60_000, // our server caches team data for 24 hours
  })
}
