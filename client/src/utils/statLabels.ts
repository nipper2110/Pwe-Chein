// API-Football's statistic names (lower-case) -> our translation key under "stats.".
export const STAT_KEYS: Record<string, string> = {
  'ball possession': 'possession',
  expected_goals: 'expectedGoals',
  goals_prevented: 'goalsPrevented',
  'total shots': 'totalShots',
  'shots on goal': 'shotsOnTarget',
  'shots off goal': 'shotsOffTarget',
  'shots insidebox': 'shotsInsideBox',
  'shots outsidebox': 'shotsOutsideBox',
  'blocked shots': 'blockedShots',
  'corner kicks': 'cornerKicks',
  offsides: 'offsides',
  fouls: 'fouls',
  'yellow cards': 'yellowCards',
  'red cards': 'redCards',
  'goalkeeper saves': 'goalkeeperSaves',
  'total passes': 'totalPasses',
  'passes accurate': 'accuratePasses',
  'passes %': 'passAccuracy',
  'free kicks': 'freeKicks',
}

/** A statistic we have no translation for still looks decent: "some_new_stat" -> "Some new stat" (English). */
export function prettifyStat(type: string): string {
  const text = type.replace(/_/g, ' ').trim()
  return text.charAt(0).toUpperCase() + text.slice(1)
}

// For these a LOWER number is better, so the lower side gets highlighted.
const LOWER_IS_BETTER = new Set(['fouls', 'yellow cards', 'red cards', 'offsides'])

export const isLowerBetter = (type: string): boolean => LOWER_IS_BETTER.has(type.toLowerCase())
