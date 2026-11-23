import type { MatchDetail } from '../types/match'
import EmptyState from './EmptyState'
import StatRow from './StatRow'

// Most interesting statistics first; anything else follows in the API's order.
const ORDER = [
  'ball possession', 'expected_goals', 'total shots', 'shots on goal', 'shots off goal', 'shots insidebox',
  'shots outsidebox', 'blocked shots', 'corner kicks', 'offsides', 'fouls', 'yellow cards', 'red cards',
  'goalkeeper saves', 'total passes', 'passes accurate', 'passes %',
]

const rank = (type: string): number => {
  const i = ORDER.indexOf(type.toLowerCase())
  return i === -1 ? ORDER.length : i
}

const prettify = (type: string): string => {
  const text = type.replace(/_/g, ' ')
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export default function StatisticsBars({ match }: { match: MatchDetail }) {
  const [home, away] = [match.statistics[0], match.statistics[1]]
  if (!home || !away) return <EmptyState text="Statistics are not available for this match yet." />

  const rows = [...home.statistics].sort((a, b) => rank(a.type) - rank(b.type))

  return (
    <div className="overflow-hidden rounded-xl bg-surface">
      <div className="flex justify-between px-3 pt-3 text-xs font-semibold">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-pitch" /> {home.team.name}
        </span>
        <span className="flex items-center gap-1.5">
          {away.team.name} <span className="h-2 w-2 rounded-full bg-sky-500" />
        </span>
      </div>
      <ul>
        {rows.map((s) => (
          <StatRow
            key={s.type}
            label={prettify(s.type)}
            home={s.value}
            away={away.statistics.find((x) => x.type === s.type)?.value ?? null}
          />
        ))}
      </ul>
    </div>
  )
}
