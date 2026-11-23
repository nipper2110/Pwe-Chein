import type { TopScorer } from '../types/league'

export default function TopScorersList({ scorers }: { scorers: TopScorer[] }) {
  return (
    <ol className="overflow-hidden rounded-xl bg-surface">
      {scorers.map((s, i) => {
        const stats = s.statistics[0]
        return (
          <li key={s.player.id} className="flex items-center gap-3 border-t border-slate-800 px-3 py-2 first:border-t-0">
            <span className="w-5 text-center font-mono text-sm text-slate-400">{i + 1}</span>
            <img src={s.player.photo} alt="" loading="lazy" className="h-9 w-9 shrink-0 rounded-full bg-slate-800 object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{s.player.name}</p>
              <p className="flex items-center gap-1 truncate text-xs text-slate-400">
                {stats && <img src={stats.team.logo} alt="" loading="lazy" className="h-3.5 w-3.5 object-contain" />}
                {stats?.team.name}
                {stats?.goals.assists ? ` · ${stats.goals.assists} assists` : ''}
              </p>
            </div>
            <span className="font-mono text-lg font-bold text-pitch" title="Goals">
              {stats?.goals.total ?? 0}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
