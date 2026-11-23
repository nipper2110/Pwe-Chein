import type { ReactNode } from 'react'
import BrandMark from './BrandMark'
import PageLayout from './PageLayout'

export default function AuthPageShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <PageLayout>
      <div className="flex justify-center pt-2">
        <BrandMark size="lg" />
      </div>
      <div className="mx-auto max-w-sm space-y-4 rounded-xl bg-surface p-6">
        <h1 className="text-xl font-bold">{title}</h1>
        {children}
      </div>
    </PageLayout>
  )
}
