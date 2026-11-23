import type { Fixture } from './fixture'

export interface TeamDetail {
  team: { id: number; name: string; code: string | null; country: string | null; founded: number | null; logo: string }
  venue: { name: string | null; city: string | null; capacity: number | null; image: string | null }
  season: number
  recent: Fixture[] // newest first
  upcoming: Fixture[] // soonest first
}
