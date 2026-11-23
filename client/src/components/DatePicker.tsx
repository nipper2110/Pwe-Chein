import { addDays, toISODate } from '../utils/dates'

interface Props {
  value: string
  now: number
  onChange: (date: string) => void
}

export default function DatePicker({ value, now, onChange }: Props) {
  const today = new Date(now)
  const options = [
    { label: 'Yesterday', date: toISODate(addDays(today, -1)) },
    { label: 'Today', date: toISODate(today) },
    { label: 'Tomorrow', date: toISODate(addDays(today, 1)) },
  ]

  return (
    <div className="flex gap-2" role="group" aria-label="Choose day">
      {options.map((o) => (
        <button
          key={o.date}
          type="button"
          onClick={() => onChange(o.date)}
          aria-pressed={value === o.date}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
            value === o.date ? 'bg-pitch text-base' : 'bg-surface text-slate-300 hover:bg-slate-800'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
