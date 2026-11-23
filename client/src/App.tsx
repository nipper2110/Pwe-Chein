import { useQuery } from '@tanstack/react-query'
import { fetchHealth } from './api/health'
import { fetchStatus } from './api/status'

// Temporary Phase 1 page: proves the proxy and both API routes work.
function App() {
  const health = useQuery({ queryKey: ['health'], queryFn: fetchHealth })
  const status = useQuery({ queryKey: ['status'], queryFn: fetchStatus })

  return (
    <main className="mx-auto max-w-xl p-6">
      <h1 className="font-burmese text-3xl font-bold text-pitch">ပွဲချိန်</h1>
      <p className="mb-6 text-sm text-slate-400">Live Football Scores & Stats</p>

      <section className="space-y-3 rounded-xl bg-surface p-4">
        <h2 className="font-semibold">Setup check</h2>

        <p>
          Server:{' '}
          {health.isPending && <span className="animate-pulse text-slate-400">checking…</span>}
          {health.isError && <span className="text-slate-300">❌ {health.error.message}</span>}
          {health.isSuccess && <span className="text-pitch">✅ running (season {health.data.season})</span>}
        </p>

        <p>
          API-Football:{' '}
          {status.isPending && <span className="animate-pulse text-slate-400">checking…</span>}
          {status.isError && <span className="text-slate-300">❌ {status.error.message}</span>}
          {status.isSuccess && (
            <span className="text-pitch">
              ✅ {status.data.plan} plan —{' '}
              <span className="font-mono">
                {status.data.requestsRemaining}/{status.data.requestsLimit}
              </span>{' '}
              requests left today
            </span>
          )}
        </p>
      </section>
    </main>
  )
}

export default App
