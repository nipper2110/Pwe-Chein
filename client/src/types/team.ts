import type { Fixture } from './fixture'

export interface TeamSummary {
  league: { id: number; name: string; logo: string }
  played: number
  wins: number
  draws: number
  losses: number
  goalsFor: number
  goalsAgainst: number
  cleanSheets: number
  formation: string | null
  formationPlayed: number
}

export interface TeamDetail {
  team: { id: number; name: string; code: string | null; country: string | null; founded: number | null; logo: string }
  venue: { name: string | null; city: string | null; capacity: number | null; image: string | null }
  season: number
  summary: TeamSummary | null
  recent: Fixture[] // newest first
  upcoming: Fixture[] // soonest first
}
