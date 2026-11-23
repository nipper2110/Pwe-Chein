// Matches the shape our Express server returns (a trimmed API-Football fixture).
export interface Team {
  id: number
  name: string
  logo: string
}

export interface Fixture {
  fixture: {
    id: number
    date: string
    status: { long: string; short: string; elapsed: number | null }
  }
  league: { id: number; name: string; country: string; logo: string }
  teams: { home: Team; away: Team }
  goals: { home: number | null; away: number | null }
}
