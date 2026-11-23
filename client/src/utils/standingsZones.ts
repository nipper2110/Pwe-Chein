import type { StandingRow } from '../types/league'

export interface Zone {
  description: string
  border: string
  bg: string
}

// Full class names (not built dynamically) so Tailwind can see them.
// Red is reserved for live/goals, so relegation uses amber.
const PALETTE = [
  { border: 'border-pitch', bg: 'bg-pitch' },
  { border: 'border-sky-500', bg: 'bg-sky-500' },
  { border: 'border-violet-500', bg: 'bg-violet-500' },
  { border: 'border-slate-400', bg: 'bg-slate-400' },
]
const RELEGATION = { border: 'border-amber-500', bg: 'bg-amber-500' }

/**
 * Builds one colour per distinct `description` in the table, in order of first appearance.
 * Everything comes from the API data, so it stays correct for every league.
 */
export function buildZones(rows: StandingRow[]): Map<string, Zone> {
  const zones = new Map<string, Zone>()
  let next = 0
  for (const row of rows) {
    const description = row.description
    if (!description || zones.has(description)) continue
    const colour = /relegation/i.test(description) ? RELEGATION : PALETTE[Math.min(next++, PALETTE.length - 1)]
    zones.set(description, { description, ...colour })
  }
  return zones
}
