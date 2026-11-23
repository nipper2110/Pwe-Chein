import type { StandingRow, TopScorer } from '../types/league'
import { request } from './http'

export const fetchStandings = (leagueId: number): Promise<StandingRow[][]> =>
  request<StandingRow[][]>(`/api/leagues/${leagueId}/standings`)

export const fetchTopScorers = (leagueId: number): Promise<TopScorer[]> =>
  request<TopScorer[]>(`/api/leagues/${leagueId}/topscorers`)
