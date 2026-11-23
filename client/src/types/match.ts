import type { Fixture, Team } from './fixture'

export interface MatchEvent {
  time: { elapsed: number; extra: number | null }
  team: Team
  player: { id: number | null; name: string | null }
  // For substitutions: `player` is going OFF and `assist` is coming ON.
  assist: { id: number | null; name: string | null }
  type: string // "Goal" | "Card" | "subst" | "Var"
  detail: string
}

export interface LineupPlayer {
  player: { id: number; name: string; number: number | null; pos: string | null }
}

export interface Lineup {
  team: Team
  coach: { id: number | null; name: string | null }
  formation: string | null
  startXI: LineupPlayer[]
  substitutes: LineupPlayer[]
}

export interface TeamStatistics {
  team: Team
  statistics: { type: string; value: number | string | null }[]
}

export interface MatchDetail extends Fixture {
  fixture: Fixture['fixture'] & { venue: { name: string | null; city: string | null }; referee: string | null }
  league: Fixture['league'] & { round: string }
  events: MatchEvent[]
  lineups: Lineup[]
  statistics: TeamStatistics[]
}
