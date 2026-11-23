import type { ReactNode } from 'react'
import SiteHeader from './SiteHeader'

interface Props {
  children: ReactNode
  /** Spacing between the sections of the page. */
  className?: string
}

/**
 * The frame every page shares: header on top, then the page content in <main>.
 * <main id="main"> is where the "Skip to content" link jumps, and where focus moves after navigation.
 */
export default function PageLayout({ children, className = 'space-y-5' }: Props) {
  return (
    <div className="mx-auto max-w-3xl space-y-5 p-4">
      <SiteHeader />
      <main id="main" tabIndex={-1} className={className}>
        {children}
      </main>
    </div>
  )
}
