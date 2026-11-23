import type { MatchEvent } from '../types/match'

function minute(e: MatchEvent): string {
  return `${e.time.elapsed}${e.time.extra ? `+${e.time.extra}` : ''}'`
}

function EventIcon({ event }: { event: MatchEvent }) {
  if (event.type === 'Goal') return <span title={event.detail}>⚽</span>
  if (event.type === 'Card') return <span title={event.detail}>{event.detail.includes('Red') ? '🟥' : '🟨'}</span>
  if (event.type === 'subst') return <span title="Substitution">🔁</span>
  return <span title={event.detail}>📺</span> // VAR
}

function EventText({ event }: { event: MatchEvent }) {
  if (event.type === 'subst') {
    return (
      <span className="text-sm">
        <span className="text-pitch">▲ {event.assist.name}</span>
        <span className="block text-xs text-slate-400">▼ {event.player.name}</span>
      </span>
    )
  }
  const note = event.type === 'Goal' && event.detail !== 'Normal Goal' ? event.detail : event.type === 'Var' ? event.detail : null
  return (
    <span className="text-sm">
      {event.player.name}
      {event.type === 'Goal' && event.assist.name && (
        <span className="block text-xs text-slate-400">assist: {event.assist.name}</span>
      )}
      {note && <span className="block text-xs text-slate-400">{note}</span>}
    </span>
  )
}

/** One timeline row: home events on the left, away events on the right, minute in the middle. */
export default function EventRow({ event, isHome }: { event: MatchEvent; isHome: boolean }) {
  const content = (
    <div className={`flex items-center gap-2 ${isHome ? 'flex-row-reverse text-right' : ''}`}>
      <EventIcon event={event} />
      <EventText event={event} />
    </div>
  )
  return (
    <li className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 border-t border-slate-800 px-3 py-2 first:border-t-0">
      <div className="flex justify-end">{isHome && content}</div>
      <span className={`w-12 text-center font-mono text-xs ${event.type === 'Goal' ? 'font-bold text-live-text' : 'text-slate-400'}`}>
        {minute(event)}
      </span>
      <div>{!isHome && content}</div>
    </li>
  )
}
