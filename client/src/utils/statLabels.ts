// Friendly names for the statistic types API-Football sends (keys are lower-case).
const LABELS: Record<string, string> = {
  'ball possession': 'Possession',
  expected_goals: 'Expected goals (xG)',
  goals_prevented: 'Goals prevented',
  'total shots': 'Total shots',
  'shots on goal': 'Shots on target',
  'shots off goal': 'Shots off target',
  'shots insidebox': 'Shots inside box',
  'shots outsidebox': 'Shots outside box',
  'blocked shots': 'Blocked shots',
  'corner kicks': 'Corner kicks',
  offsides: 'Offsides',
  fouls: 'Fouls',
  'yellow cards': 'Yellow cards',
  'red cards': 'Red cards',
  'goalkeeper saves': 'Goalkeeper saves',
  'total passes': 'Total passes',
  'passes accurate': 'Accurate passes',
  'passes %': 'Pass accuracy',
  'free kicks': 'Free kicks',
}

/** Unknown types still look decent: "some_new_stat" -> "Some new stat". */
export function statLabel(type: string): string {
  const known = LABELS[type.toLowerCase()]
  if (known) return known
  const text = type.replace(/_/g, ' ').trim()
  return text.charAt(0).toUpperCase() + text.slice(1)
}

// For these a LOWER number is better, so the lower side gets highlighted.
const LOWER_IS_BETTER = new Set(['fouls', 'yellow cards', 'red cards', 'offsides'])

export const isLowerBetter = (type: string): boolean => LOWER_IS_BETTER.has(type.toLowerCase())
