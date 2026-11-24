import { useTranslation } from 'react-i18next'

export type MatchTab = 'events' | 'lineups' | 'stats'

const TABS = [
  { id: 'events', label: 'match.tabEvents' },
  { id: 'lineups', label: 'match.tabLineups' },
  { id: 'stats', label: 'match.tabStats' },
] as const

interface Props {
  active: MatchTab
  onChange: (tab: MatchTab) => void
}

export default function MatchTabs({ active, onChange }: Props) {
  const { t } = useTranslation()
  return (
    <div role="tablist" aria-label={t('match.tablist')} className="flex gap-2">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          id={`tab-${tab.id}`}
          aria-selected={active === tab.id}
          aria-controls="match-panel"
          onClick={() => onChange(tab.id)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
            active === tab.id ? 'bg-pitch text-on-pitch' : 'bg-surface text-slate-300 hover:bg-slate-800'
          }`}
        >
          {t(tab.label)}
        </button>
      ))}
    </div>
  )
}
