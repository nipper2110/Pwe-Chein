import type { ReactNode } from 'react'
import PageLayout from './PageLayout'

export default function AuthPageShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <PageLayout>
      <div className="mx-auto max-w-sm space-y-4 rounded-xl bg-surface p-6">
        <h1 className="text-xl font-bold">{title}</h1>
        {children}
      </div>
    </PageLayout>
  )
}
