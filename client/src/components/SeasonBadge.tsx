import { useSeason } from '../hooks/useSeason'

/** Shows e.g. "Season 2024/25" so users know which season the stats are from. */
export default function SeasonBadge() {
  const season = useSeason()
  if (!season) return null

  return (
    <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-xs text-slate-300">
      Season {season}/{String(season + 1).slice(-2)}
    </span>
  )
}
