import type { StandingRow, TopScorer } from '../types/league'

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null
    throw new Error(body?.error ?? `Server responded with HTTP ${res.status}`)
  }
  return (await res.json()) as T
}

export const fetchStandings = (leagueId: number): Promise<StandingRow[][]> =>
  getJson<StandingRow[][]>(`/api/leagues/${leagueId}/standings`)

export const fetchTopScorers = (leagueId: number): Promise<TopScorer[]> =>
  getJson<TopScorer[]>(`/api/leagues/${leagueId}/topscorers`)
