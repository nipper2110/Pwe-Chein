interface Props {
  message: string
  onRetry: () => void
}

export default function ErrorState({ message, onRetry }: Props) {
  return (
    <div role="alert" className="rounded-xl bg-surface p-6 text-center">
      <p className="mb-1 font-semibold">Something went wrong</p>
      <p className="mb-4 text-sm text-slate-400">{message}</p>
      <button type="button" onClick={onRetry} className="rounded-full bg-pitch px-4 py-1.5 text-sm font-medium text-base">
        Try again
      </button>
    </div>
  )
}
