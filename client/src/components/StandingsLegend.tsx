import { useTranslation } from 'react-i18next'
import { useLabels } from '../hooks/useLabels'
import type { Zone } from '../utils/standingsZones'

export default function StandingsLegend({ zones }: { zones: Zone[] }) {
  const { t } = useTranslation()
  const labels = useLabels()
  if (zones.length === 0) return null
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1 px-1 text-xs text-slate-400" aria-label={t('standings.legend')}>
      {zones.map((z) => (
        <li key={z.description} className="flex items-center gap-1.5">
          <span className={`h-2.5 w-2.5 rounded-sm ${z.bg}`} />
          {labels.zone(z.description)}
        </li>
      ))}
    </ul>
  )
}
