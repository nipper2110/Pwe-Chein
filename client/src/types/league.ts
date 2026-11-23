import type { Team } from './fixture'

export interface StandingRow {
  rank: number
  team: Team
  points: number
  goalsDiff: number
  group: string
  form: string | null
  description: string | null
  all: { played: number; win: number; draw: number; lose: number; goals: { for: number; against: number } }
}

export interface TopScorer {
  player: { id: number; name: string; photo: string }
  statistics: {
    team: Team
    games: { appearences: number | null }
    goals: { total: number | null; assists: number | null }
  }[]
}
