import PixelLogo from './PixelLogo'

interface Props {
  size?: number
  className?: string
  'aria-hidden'?: boolean
}

/**
 * The pixel ball as a nav icon. It takes the same `size` prop as the Lucide icons, so the nav can use both.
 * Slightly faded unless its parent link has the "group" class and is the current page.
 */
export default function PixelBallIcon({ size = 18, className = '' }: Props) {
  return (
    <PixelLogo
      variant="ball"
      height={size}
      className={`shrink-0 opacity-70 transition-opacity group-hover:opacity-100 group-aria-[current=page]:opacity-100 ${className}`}
    />
  )
}
