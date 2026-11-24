import { useTranslation } from 'react-i18next'
import type { Lineup, LineupPlayer } from '../types/match'

function PlayerList({ title, players }: { title: string; players: LineupPlayer[] }) {
  return (
    <div>
      <h4 className="mb-1 text-xs uppercase text-slate-400">{title}</h4>
      <ul>
        {players.map(({ player }) => (
          <li key={player.id} className="flex items-center gap-2 py-1 text-sm">
            <span className="w-6 text-right font-mono text-xs text-slate-400">{player.number ?? ''}</span>
            <span className="flex-1 truncate">{player.name}</span>
            <span className="text-xs text-slate-400">{player.pos}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function TeamLineup({ lineup }: { lineup: Lineup }) {
  const { t } = useTranslation()
  return (
    <div className="space-y-3 rounded-xl bg-surface p-4">
      <header className="flex items-center gap-2">
        <img src={lineup.team.logo} alt="" className="h-6 w-6 object-contain" />
        <h3 className="flex-1 font-semibold">{lineup.team.name}</h3>
        {lineup.formation && <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-xs">{lineup.formation}</span>}
      </header>
      {lineup.coach.name && <p className="text-xs text-slate-400">{t('match.coach', { name: lineup.coach.name })}</p>}
      <PlayerList title={t('match.startingXI')} players={lineup.startXI} />
      <PlayerList title={t('match.substitutes')} players={lineup.substitutes} />
    </div>
  )
}
