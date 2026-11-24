import { useTranslation } from 'react-i18next'
import type { TeamSummary } from '../types/team'
import LeagueLogo from './LeagueLogo'

interface TileProps {
  label: string
  value: string | number
  hint?: string
  valueClass?: string
}

function Tile({ label, value, hint, valueClass = '' }: TileProps) {
  return (
    <div className="rounded-lg bg-slate-900/60 px-3 py-2">
      <dt className="text-[10px] uppercase text-slate-400">{label}</dt>
      <dd>
        <span className={`block font-mono text-xl font-bold ${valueClass}`}>{value}</span>
        {hint && <span className="block text-[10px] text-slate-400">{hint}</span>}
      </dd>
    </div>
  )
}

export default function SeasonSummary({ summary }: { summary: TeamSummary }) {
  const { t } = useTranslation()
  const diff = summary.goalsFor - summary.goalsAgainst

  return (
    <section aria-labelledby="summary-title" className="space-y-3 rounded-xl bg-surface p-4">
      <h2 id="summary-title" className="flex items-center gap-2 font-semibold">
        <LeagueLogo src={summary.league.logo} />
        {t('team.summaryTitle')}
        <span className="text-xs font-normal text-slate-400">{summary.league.name}</span>
      </h2>
      <dl className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Tile label={t('team.played')} value={summary.played} />
        {/* Amber for losses, because red is only for live/goals. */}
        <Tile label={t('team.won')} value={summary.wins} valueClass="text-pitch" />
        <Tile label={t('team.drawn')} value={summary.draws} valueClass="text-slate-300" />
        <Tile label={t('team.lost')} value={summary.losses} valueClass="text-amber-500" />
        <Tile
          label={t('team.goalsForAgainst')}
          value={`${summary.goalsFor} - ${summary.goalsAgainst}`}
          hint={t('team.difference', { value: `${diff > 0 ? '+' : ''}${diff}` })}
        />
        <Tile label={t('team.cleanSheets')} value={summary.cleanSheets} />
        <Tile
          label={t('team.topFormation')}
          value={summary.formation ?? '–'}
          hint={summary.formation ? t('team.usedIn', { count: summary.formationPlayed }) : undefined}
        />
      </dl>
    </section>
  )
}
