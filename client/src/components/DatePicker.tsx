import { useTranslation } from 'react-i18next'
import { addDays, toISODate } from '../utils/dates'

interface Props {
  value: string
  now: number
  onChange: (date: string) => void
}

export default function DatePicker({ value, now, onChange }: Props) {
  const { t } = useTranslation()
  const today = new Date(now)
  const options = [
    { label: t('date.yesterday'), date: toISODate(addDays(today, -1)) },
    { label: t('date.today'), date: toISODate(today) },
    { label: t('date.tomorrow'), date: toISODate(addDays(today, 1)) },
  ]

  return (
    <div className="flex gap-2" role="group" aria-label={t('date.chooseDay')}>
      {options.map((o) => (
        <button
          key={o.date}
          type="button"
          onClick={() => onChange(o.date)}
          aria-pressed={value === o.date}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
            value === o.date ? 'bg-pitch text-on-pitch' : 'bg-surface text-slate-300 hover:bg-slate-800'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
