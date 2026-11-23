import type { StandingRow } from '../types/league'
import { buildZones } from '../utils/standingsZones'
import FormDots from './FormDots'
import StandingsLegend from './StandingsLegend'

export default function StandingsTable({ rows }: { rows: StandingRow[] }) {
  const zones = buildZones(rows)

  return (
    <div className="space-y-2">
      <div className="overflow-x-auto rounded-xl bg-surface">
        <table className="w-full text-sm">
          <caption className="sr-only">League standings</caption>
          <thead className="text-xs text-slate-400">
            <tr>
              <th scope="col" className="py-2 pl-3 text-left">#</th>
              <th scope="col" className="px-2 text-left">Team</th>
              <th scope="col" className="px-2" title="Played">P</th>
              <th scope="col" className="hidden px-2 sm:table-cell" title="Won">W</th>
              <th scope="col" className="hidden px-2 sm:table-cell" title="Drawn">D</th>
              <th scope="col" className="hidden px-2 sm:table-cell" title="Lost">L</th>
              <th scope="col" className="px-2" title="Goal difference">GD</th>
              <th scope="col" className="px-2 text-right" title="Points">Pts</th>
              <th scope="col" className="hidden pr-3 text-left md:table-cell" title="Last 5 results">Form</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const zone = r.description ? zones.get(r.description) : undefined
              return (
                <tr key={r.team.id} className="border-t border-slate-800">
                  <td
                    className={`border-l-4 py-2 pl-2 font-mono ${zone?.border ?? 'border-transparent'}`}
                    title={r.description ?? undefined}
                  >
                    {r.rank}
                  </td>
                  <td className="px-2">
                    <span className="flex items-center gap-2">
                      <img src={r.team.logo} alt="" loading="lazy" className="h-5 w-5 shrink-0 object-contain" />
                      <span className="truncate">{r.team.name}</span>
                    </span>
                  </td>
                  <td className="px-2 text-center font-mono">{r.all.played}</td>
                  <td className="hidden px-2 text-center font-mono sm:table-cell">{r.all.win}</td>
                  <td className="hidden px-2 text-center font-mono sm:table-cell">{r.all.draw}</td>
                  <td className="hidden px-2 text-center font-mono sm:table-cell">{r.all.lose}</td>
                  <td className="px-2 text-center font-mono">{r.goalsDiff > 0 ? `+${r.goalsDiff}` : r.goalsDiff}</td>
                  <td className="px-2 text-right font-mono font-bold">{r.points}</td>
                  <td className="hidden pr-3 md:table-cell">
                    <FormDots form={r.form} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <StandingsLegend zones={[...zones.values()]} />
    </div>
  )
}
