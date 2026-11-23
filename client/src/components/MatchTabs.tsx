export type MatchTab = 'events' | 'lineups' | 'stats'

const TABS: { id: MatchTab; label: string }[] = [
  { id: 'events', label: 'Events' },
  { id: 'lineups', label: 'Lineups' },
  { id: 'stats', label: 'Statistics' },
]

interface Props {
  active: MatchTab
  onChange: (tab: MatchTab) => void
}

export default function MatchTabs({ active, onChange }: Props) {
  return (
    <div role="tablist" aria-label="Match details" className="flex gap-2">
      {TABS.map((t) => (
        <button
          key={t.id}
          type="button"
          role="tab"
          id={`tab-${t.id}`}
          aria-selected={active === t.id}
          aria-controls="match-panel"
          onClick={() => onChange(t.id)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
            active === t.id ? 'bg-pitch text-base' : 'bg-surface text-slate-300 hover:bg-slate-800'
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}
