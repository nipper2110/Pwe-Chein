const DOT: Record<string, { className: string; label: string }> = {
  W: { className: 'bg-pitch', label: 'Win' },
  D: { className: 'bg-slate-500', label: 'Draw' },
  L: { className: 'bg-amber-500', label: 'Loss' }, // amber, because red is only for live/goals
}

/**
 * Last results as small coloured dots, in the API's order:
 * oldest on the left, most recent on the right (e.g. "WWDLW").
 */
export default function FormDots({ form }: { form: string | null }) {
  if (!form) return <span className="text-slate-600">–</span>
  const results = [...form].filter((c) => c in DOT)
  const summary = results.map((c) => DOT[c].label.toLowerCase()).join(', ')

  return (
    <span className="inline-flex gap-1.5" role="img" aria-label={`Last ${results.length}, oldest to latest: ${summary}`}>
      {results.map((c, i) => (
        <span key={i} title={DOT[c].label} className={`h-3 w-3 rounded-full ${DOT[c].className}`} />
      ))}
    </span>
  )
}
