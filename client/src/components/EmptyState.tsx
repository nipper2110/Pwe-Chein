export default function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-xl bg-surface p-8 text-center">
      <p className="mb-1 text-3xl">⚽</p>
      <p className="text-sm text-slate-400">{text}</p>
    </div>
  )
}
