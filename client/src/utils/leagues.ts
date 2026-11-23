// The 6 supported leagues (ids from CLAUDE.md). Logos come from API-Football's image server,
// so showing them costs no API requests.
export const LEAGUES = [
  { id: 39, name: 'Premier League' },
  { id: 140, name: 'La Liga' },
  { id: 135, name: 'Serie A' },
  { id: 78, name: 'Bundesliga' },
  { id: 61, name: 'Ligue 1' },
  { id: 2, name: 'Champions League' },
] as const

export const DEFAULT_LEAGUE_ID = 39

export const leagueLogo = (id: number): string => `https://media.api-sports.io/football/leagues/${id}.png`
export const isSupportedLeague = (id: number): boolean => LEAGUES.some((l) => l.id === id)
