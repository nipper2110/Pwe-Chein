export default function TableSkeleton({ rows = 10 }: { rows?: number }) {
  return (
    <div className="animate-pulse space-y-2 rounded-xl bg-surface p-4" aria-busy="true" aria-label="Loading">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="h-6 rounded bg-slate-800" />
      ))}
    </div>
  )
}
