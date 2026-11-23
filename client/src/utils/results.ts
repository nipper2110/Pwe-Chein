import type { Fixture } from '../types/fixture'

export type Result = 'W' | 'D' | 'L'

/** Did the given team win, draw or lose this finished match? */
export function resultFor(teamId: number, f: Fixture): Result | null {
  const { home, away } = f.goals
  if (home === null || away === null) return null
  if (home === away) return 'D'
  const homeWon = home > away
  return (f.teams.home.id === teamId) === homeWon ? 'W' : 'L'
}
