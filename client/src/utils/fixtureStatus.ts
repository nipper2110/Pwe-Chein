import type { Fixture } from '../types/fixture'

const LIVE = new Set(['1H', 'HT', '2H', 'ET', 'BT', 'P', 'LIVE', 'INT'])
const FINISHED = new Set(['FT', 'AET', 'PEN'])
const NOT_STARTED = new Set(['NS', 'TBD'])

export const isLive = (f: Fixture): boolean => LIVE.has(f.fixture.status.short)
export const isFinished = (f: Fixture): boolean => FINISHED.has(f.fixture.status.short)
export const isNotStarted = (f: Fixture): boolean => NOT_STARTED.has(f.fixture.status.short)

const MINUTE = 60_000

/** True when a match is live or about to start, so polling live scores makes sense. */
export function mayBeLiveSoon(f: Fixture, now: number): boolean {
  if (isLive(f)) return true
  if (!isNotStarted(f)) return false
  const kickoff = new Date(f.fixture.date).getTime()
  return now >= kickoff - 5 * MINUTE && now <= kickoff + 15 * MINUTE
}
