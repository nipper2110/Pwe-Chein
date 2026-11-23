import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { LEAGUES, leagueLogo } from '../utils/leagues'

export default function LeagueSwitcher({ activeId }: { activeId: number }) {
  const scrollRef = useRef<HTMLElement>(null)
  const [canScrollMore, setCanScrollMore] = useState(false)

  // Show the fade only while there is more to scroll to on the right.
  const update = () => {
    const el = scrollRef.current
    if (el) setCanScrollMore(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }

  useEffect(() => {
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return (
    <div className="relative">
      {/* Mobile: one scrolling row. Desktop (md+): wraps so all 6 leagues are visible. */}
      <nav
        ref={scrollRef}
        onScroll={update}
        aria-label="Choose league"
        className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:overflow-visible md:px-0"
      >
        {LEAGUES.map((l) => (
          <Link
            key={l.id}
            to={`/league/${l.id}`}
            aria-current={l.id === activeId ? 'page' : undefined}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition md:text-[13px] ${
              l.id === activeId ? 'bg-pitch text-base' : 'bg-surface text-slate-300 hover:bg-slate-800'
            }`}
          >
            <img src={leagueLogo(l.id)} alt="" className="h-4 w-4 rounded-sm bg-white/90 object-contain p-px" />
            {l.name}
          </Link>
        ))}
      </nav>
      {canScrollMore && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-4 top-0 h-full w-12 bg-gradient-to-l from-base to-transparent md:hidden"
        />
      )}
    </div>
  )
}
