import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchFavorites, followTeam, unfollowTeam, type Favorite } from '../api/favorites'
import { useUser } from './useAuth'

// The user's id is part of the key, so one account's teams can never show up for another.
export const favoritesKey = (userId: string | undefined) => ['favorites', userId]

/** The logged-in user's followed teams. Does nothing while logged out. */
export function useFavorites() {
  const user = useUser()
  return useQuery({
    queryKey: favoritesKey(user.data?.id),
    queryFn: fetchFavorites,
    enabled: Boolean(user.data),
    staleTime: Infinity, // only changes when the user follows or unfollows
  })
}

function useFavoriteMutation(action: (teamId: number) => Promise<Favorite[]>) {
  const queryClient = useQueryClient()
  const user = useUser()
  return useMutation({
    mutationFn: action,
    onSuccess: (favorites) => queryClient.setQueryData(favoritesKey(user.data?.id), favorites),
  })
}

export const useFollowTeam = () => useFavoriteMutation(followTeam)
export const useUnfollowTeam = () => useFavoriteMutation(unfollowTeam)
