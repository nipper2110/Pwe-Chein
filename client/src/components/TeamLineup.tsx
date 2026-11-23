import type { Lineup, LineupPlayer } from '../types/match'

function PlayerList({ title, players }: { title: string; players: LineupPlayer[] }) {
  return (
    <div>
      <h4 className="mb-1 text-xs uppercase text-slate-500">{title}</h4>
      <ul>
        {players.map(({ player }) => (
          <li key={player.id} className="flex items-center gap-2 py-1 text-sm">
            <span className="w-6 text-right font-mono text-xs text-slate-400">{player.number ?? ''}</span>
            <span className="flex-1 truncate">{player.name}</span>
            <span className="text-xs text-slate-500">{player.pos}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function TeamLineup({ lineup }: { lineup: Lineup }) {
  return (
    <div className="space-y-3 rounded-xl bg-surface p-4">
      <header className="flex items-center gap-2">
        <img src={lineup.team.logo} alt="" className="h-6 w-6 object-contain" />
        <h3 className="flex-1 font-semibold">{lineup.team.name}</h3>
        {lineup.formation && <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-xs">{lineup.formation}</span>}
      </header>
      {lineup.coach.name && <p className="text-xs text-slate-400">Coach: {lineup.coach.name}</p>}
      <PlayerList title="Starting XI" players={lineup.startXI} />
      <PlayerList title="Substitutes" players={lineup.substitutes} />
    </div>
  )
}
