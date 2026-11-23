import { request } from './http'

export interface Favorite {
  teamId: number
  name: string
  logo: string
}

// Every call returns the user's full, updated list, so the UI can simply replace its copy.
export const fetchFavorites = async (): Promise<Favorite[]> =>
  (await request<{ favorites: Favorite[] }>('/api/favorites')).favorites

export const followTeam = async (teamId: number): Promise<Favorite[]> =>
  (await request<{ favorites: Favorite[] }>(`/api/favorites/${teamId}`, { method: 'PUT' })).favorites

export const unfollowTeam = async (teamId: number): Promise<Favorite[]> =>
  (await request<{ favorites: Favorite[] }>(`/api/favorites/${teamId}`, { method: 'DELETE' })).favorites
