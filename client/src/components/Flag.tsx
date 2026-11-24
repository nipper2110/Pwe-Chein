import { useId } from 'react'
import type { Language } from '../i18n/languages'

// Tiny inline SVG flags. (Emoji flags do not show up on Windows, where they appear as letters like "GB".)
// Each one is drawn on the same 3:2 canvas (90 x 60).

/** A 5-point star as SVG polygon points. */
function star(cx: number, cy: number, outer: number, inner: number): string {
  return Array.from({ length: 10 }, (_, i) => {
    const angle = -Math.PI / 2 + (i * Math.PI) / 5
    const radius = i % 2 === 0 ? outer : inner
    return `${(cx + radius * Math.cos(angle)).toFixed(2)},${(cy + radius * Math.sin(angle)).toFixed(2)}`
  }).join(' ')
}
const MYANMAR_STAR = star(45, 31, 17, 6.5)

/** The Union Jack (United Kingdom), used for English. Drawn 2:1 and centred in the 3:2 box. */
function UnionJack({ clipId }: { clipId: string }) {
  return (
    <svg viewBox="0 0 60 30" preserveAspectRatio="xMidYMid slice" width="90" height="60">
      <clipPath id={clipId}>
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>
      <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" clipPath={`url(#${clipId})`} stroke="#C8102E" strokeWidth="4" />
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  )
}

/** The flag for a language. Decorative: the language's name is always written next to it. */
export default function Flag({ code, className = 'h-4 w-6' }: { code: Language; className?: string }) {
  const clipId = `flag-${useId().replace(/:/g, '')}` // ids from useId contain ":", which url(#...) does not like

  return (
    <svg
      viewBox="0 0 90 60"
      aria-hidden="true"
      focusable="false"
      className={`shrink-0 rounded-[3px] ring-1 ring-black/20 ${className}`}
    >
      {code === 'en' && <UnionJack clipId={clipId} />}
      {code === 'my' && (
        <>
          <rect width="90" height="20" fill="#FECB00" />
          <rect y="20" width="90" height="20" fill="#34B233" />
          <rect y="40" width="90" height="20" fill="#EA2839" />
          <polygon points={MYANMAR_STAR} fill="#fff" />
        </>
      )}
      {code === 'th' && (
        <>
          <rect width="90" height="60" fill="#A51931" />
          <rect y="10" width="90" height="40" fill="#F4F5F8" />
          <rect y="20" width="90" height="20" fill="#2D2A4A" />
        </>
      )}
    </svg>
  )
}
