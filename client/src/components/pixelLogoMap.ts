// The pixel-art logo, one character per pixel. This is the ONLY place the art is defined:
// the <PixelLogo /> component, favicon.svg and the PNG icons are all generated from it.
//   X = outline   W = white of the ball   B = dark patches   L = motion lines   . = transparent
export const PIXEL_MAP = [
  '..........XXXX....',
  '........XXWWWWXX..',
  'LLL....XWWWBBWWWX.',
  '.......XWWBBBBWWX.',
  '..LLLLXWWWBBBBWWWX',
  '......XBWWWBBWWWBX',
  'LLLL..XBBWWWWWWBBX',
  '......XWBWWWWWWBWX',
  '..LLL..XWWWBBWWWX.',
  '.......XWWBBBBWWX.',
  '........XXWBBWXX..',
  '..........XXXX....',
] as const

export const MAP_WIDTH = 18
export const MAP_HEIGHT = 12
/** The ball alone (no motion lines) is the 12 right-most columns of the map. */
export const BALL_FIRST_COLUMN = 6

export type PixelKey = 'X' | 'W' | 'B' | 'L'

/** Colours for the dark theme, which are the ones from the design. The app's light theme overrides them in CSS. */
export const PIXEL_COLORS: Record<PixelKey, string> = {
  X: '#10b981',
  W: '#f8fafc',
  B: '#0f172a',
  L: '#34d399',
}

export interface PixelRun {
  x: number
  y: number
  width: number
  key: PixelKey
}

/** Merges neighbouring pixels of the same colour in a row into one rectangle (fewer shapes, same picture). */
export function pixelRuns(firstColumn = 0, columns = MAP_WIDTH): PixelRun[] {
  const runs: PixelRun[] = []
  PIXEL_MAP.forEach((row, y) => {
    let x = firstColumn
    while (x < firstColumn + columns) {
      const ch = row[x]
      if (ch === '.') {
        x++
        continue
      }
      let end = x
      while (end + 1 < firstColumn + columns && row[end + 1] === ch) end++
      runs.push({ x: x - firstColumn, y, width: end - x + 1, key: ch as PixelKey })
      x = end + 1
    }
  })
  return runs
}
