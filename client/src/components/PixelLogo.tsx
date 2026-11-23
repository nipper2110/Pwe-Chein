import { BALL_FIRST_COLUMN, MAP_HEIGHT, MAP_WIDTH, pixelRuns, type PixelKey } from './pixelLogoMap'

// Colours come from CSS variables (see index.css), so the logo can adapt to the light theme.
const FILL: Record<PixelKey, string> = {
  X: 'var(--pixel-x)',
  W: 'var(--pixel-w)',
  B: 'var(--pixel-b)',
  L: 'var(--pixel-l)',
}

const BALL_COLUMNS = MAP_WIDTH - BALL_FIRST_COLUMN
const FULL_RUNS = pixelRuns()
const BALL_RUNS = pixelRuns(BALL_FIRST_COLUMN, BALL_COLUMNS)

interface Props {
  /** "full" = ball with motion lines (18x12). "ball" = just the ball (12x12). */
  variant?: 'full' | 'ball'
  className?: string
  /** Height in CSS pixels; the width follows the shape. For crisp pixels use a multiple of 12. */
  height?: number
}

/** The pixel-art football logo, drawn as an SVG (one rectangle per run of same-coloured pixels). */
export default function PixelLogo({ variant = 'full', className, height }: Props) {
  const isBall = variant === 'ball'
  const columns = isBall ? BALL_COLUMNS : MAP_WIDTH
  const runs = isBall ? BALL_RUNS : FULL_RUNS
  const style = height ? { height, width: (height * columns) / MAP_HEIGHT } : undefined

  return (
    // crispEdges = no smoothing, so every pixel stays a sharp square. Decorative: the brand name is real text.
    <svg
      viewBox={`0 0 ${columns} ${MAP_HEIGHT}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
      className={className}
      style={style}
    >
      {runs.map((r) => (
        <rect key={`${r.x}-${r.y}`} x={r.x} y={r.y} width={r.width} height={1} data-pixel={r.key} style={{ fill: FILL[r.key] }} />
      ))}
    </svg>
  )
}
