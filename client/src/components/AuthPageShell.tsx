import type { ReactNode } from 'react'
import SiteHeader from './SiteHeader'

export default function AuthPageShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main className="mx-auto max-w-3xl space-y-5 p-4">
      <SiteHeader />
      <div className="mx-auto max-w-sm space-y-4 rounded-xl bg-surface p-6">
        <h1 className="text-xl font-bold">{title}</h1>
        {children}
      </div>
    </main>
  )
}
