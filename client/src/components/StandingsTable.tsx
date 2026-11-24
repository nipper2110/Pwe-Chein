import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useLabels } from '../hooks/useLabels'
import type { StandingRow } from '../types/league'
import { buildZones } from '../utils/standingsZones'
import FormDots from './FormDots'
import StandingsLegend from './StandingsLegend'

export default function StandingsTable({ rows }: { rows: StandingRow[] }) {
  const { t } = useTranslation()
  const labels = useLabels()
  const zones = buildZones(rows)

  return (
    <div className="space-y-2">
      <div className="overflow-x-auto rounded-xl bg-surface">
        <table className="w-full text-sm">
          <caption className="sr-only">{t('standings.caption')}</caption>
          <thead className="text-xs text-slate-400">
            <tr>
              <th scope="col" className="py-2 pl-3 text-left">#</th>
              <th scope="col" className="px-2 text-left">{t('standings.team')}</th>
              <th scope="col" className="px-2" title={t('standings.played')}>{t('standings.pShort')}</th>
              <th scope="col" className="hidden px-2 sm:table-cell" title={t('standings.won')}>{t('standings.wShort')}</th>
              <th scope="col" className="hidden px-2 sm:table-cell" title={t('standings.drawn')}>{t('standings.dShort')}</th>
              <th scope="col" className="hidden px-2 sm:table-cell" title={t('standings.lost')}>{t('standings.lShort')}</th>
              <th scope="col" className="px-2" title={t('standings.goalDifference')}>{t('standings.gdShort')}</th>
              <th scope="col" className="hidden px-4 text-left md:table-cell" title={t('standings.form')}>{t('standings.formShort')}</th>
              <th scope="col" className="py-2 pl-2 pr-3 text-right" title={t('standings.points')}>{t('standings.ptsShort')}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const zone = r.description ? zones.get(r.description) : undefined
              return (
                <tr key={r.team.id} className="border-t border-slate-800">
                  <td
                    className={`border-l-4 py-2 pl-2 font-mono ${zone?.border ?? 'border-transparent'}`}
                    title={r.description ? labels.zone(r.description) : undefined}
                  >
                    {r.rank}
                  </td>
                  <td className="px-2">
                    <Link to={`/team/${r.team.id}`} className="flex items-center gap-2 hover:text-pitch">
                      <img src={r.team.logo} alt="" loading="lazy" className="h-5 w-5 shrink-0 object-contain" />
                      <span className="truncate">{r.team.name}</span>
                    </Link>
                  </td>
                  <td className="px-2 text-center font-mono">{r.all.played}</td>
                  <td className="hidden px-2 text-center font-mono sm:table-cell">{r.all.win}</td>
                  <td className="hidden px-2 text-center font-mono sm:table-cell">{r.all.draw}</td>
                  <td className="hidden px-2 text-center font-mono sm:table-cell">{r.all.lose}</td>
                  <td className="px-2 text-center font-mono">{r.goalsDiff > 0 ? `+${r.goalsDiff}` : r.goalsDiff}</td>
                  <td className="hidden px-4 md:table-cell">
                    <FormDots form={r.form} />
                  </td>
                  <td className="py-2 pl-2 pr-3 text-right font-mono font-bold">{r.points}</td>
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
