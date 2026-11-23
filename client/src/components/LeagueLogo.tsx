// League logos can be dark (e.g. Ligue 1), so they always sit on a small white rounded background.
const SIZES = {
  sm: 'h-4 w-4 rounded-sm p-px',
  md: 'h-5 w-5 rounded p-0.5',
  lg: 'h-10 w-10 rounded p-1',
} as const

interface Props {
  src: string
  size?: keyof typeof SIZES
}

export default function LeagueLogo({ src, size = 'md' }: Props) {
  return <img src={src} alt="" loading="lazy" className={`shrink-0 bg-white/90 object-contain ${SIZES[size]}`} />
}
