import type { ReactNode } from 'react'
import BottomTabBar from './BottomTabBar'
import SiteFooter from './SiteFooter'
import SiteHeader from './SiteHeader'

interface Props {
  children: ReactNode
  /** Spacing between the sections of the page. */
  className?: string
}

/**
 * The frame every page shares: sticky header on top, the page content in <main>, and the tab bar
 * on phones. <main id="main"> is where the "Skip to content" link jumps, and where focus moves
 * after navigation. The extra bottom padding on small screens keeps content clear of the tab bar.
 */
export default function PageLayout({ children, className = 'space-y-5' }: Props) {
  return (
    <>
      <SiteHeader />
      <div className="mx-auto max-w-3xl p-4 pb-24 md:pb-8">
        <main id="main" tabIndex={-1} className={className}>
          {children}
        </main>
        <SiteFooter />
      </div>
      <BottomTabBar />
    </>
  )
}
