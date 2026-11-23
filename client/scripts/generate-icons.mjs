// Generates the favicon and app icons from the SAME pixel map the logo component uses.
// Run it with:  npm run icons     (no extra libraries: it writes the PNG files by hand)
import { writeFileSync } from 'node:fs'
import { crc32, deflateSync } from 'node:zlib'
import { fileURLToPath } from 'node:url'
import { BALL_FIRST_COLUMN, MAP_HEIGHT, MAP_WIDTH, PIXEL_COLORS, PIXEL_MAP, pixelRuns } from '../src/components/pixelLogoMap.ts'

const BACKGROUND = '#020617' // the "Stadium Night" page colour, so the icon looks right on light and dark tab bars
const BALL_COLUMNS = MAP_WIDTH - BALL_FIRST_COLUMN // 12 (the ball without its motion lines)
const publicDir = fileURLToPath(new URL('../public/', import.meta.url))

const hexToRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))

// ---------- SVG favicon: 16x16 grid, the 12x12 ball with a 2-cell margin ----------
function buildSvg() {
  const rects = pixelRuns(BALL_FIRST_COLUMN, BALL_COLUMNS)
    .map((r) => `<rect x="${r.x}" y="${r.y}" width="${r.width}" height="1" fill="${PIXEL_COLORS[r.key]}"/>`)
    .join('')
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">` +
    `<rect width="16" height="16" rx="3" fill="${BACKGROUND}"/>` +
    `<g transform="translate(2 2)" shape-rendering="crispEdges">${rects}</g>` +
    `</svg>\n`
  )
}

// ---------- PNG icons ----------
/** Draws the ball on a square background. `scale` = screen pixels per map pixel (whole numbers keep it crisp). */
function renderIcon({ size, scale, margin, radius }) {
  const rgba = Buffer.alloc(size * size * 4) // starts fully transparent
  const bg = hexToRgb(BACKGROUND)
  const put = (x, y, [r, g, b]) => rgba.set([r, g, b, 255], (y * size + x) * 4)

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      // Hard-edged rounded corners (no smoothing, matching the pixel style).
      const dx = Math.max(radius - (x + 0.5), x + 0.5 - (size - radius), 0)
      const dy = Math.max(radius - (y + 0.5), y + 0.5 - (size - radius), 0)
      if (dx * dx + dy * dy <= radius * radius) put(x, y, bg)
    }
  }
  PIXEL_MAP.forEach((row, my) => {
    for (let mx = BALL_FIRST_COLUMN; mx < MAP_WIDTH; mx++) {
      const key = row[mx]
      if (key === '.') continue
      for (let py = 0; py < scale; py++)
        for (let px = 0; px < scale; px++)
          put(margin + (mx - BALL_FIRST_COLUMN) * scale + px, margin + my * scale + py, hexToRgb(PIXEL_COLORS[key]))
    }
  })
  return encodePng(size, size, rgba)
}

function chunk(type, data) {
  const body = Buffer.concat([Buffer.from(type), data])
  const length = Buffer.alloc(4)
  length.writeUInt32BE(data.length)
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body))
  return Buffer.concat([length, body, crc])
}

function encodePng(width, height, rgba) {
  const header = Buffer.alloc(13)
  header.writeUInt32BE(width, 0)
  header.writeUInt32BE(height, 4)
  header.set([8, 6, 0, 0, 0], 8) // 8 bits per channel, RGBA, no interlacing
  const rows = Buffer.alloc((width * 4 + 1) * height) // each row starts with filter byte 0 ("none")
  for (let y = 0; y < height; y++) rgba.copy(rows, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4)
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', header),
    chunk('IDAT', deflateSync(rows, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

writeFileSync(publicDir + 'favicon.svg', buildSvg())
// 32px: ball at 2x = 24px, centred with a 4px margin, with rounded corners.
writeFileSync(publicDir + 'favicon-32.png', renderIcon({ size: 32, scale: 2, margin: 4, radius: 6 }))
// 180px (iPhone home screen): ball at 12x = 144px, 18px margin. Square corners: iOS rounds them itself.
writeFileSync(publicDir + 'apple-touch-icon.png', renderIcon({ size: 180, scale: 12, margin: 18, radius: 0 }))
console.log(`Wrote favicon.svg, favicon-32.png and apple-touch-icon.png from the ${MAP_WIDTH}x${MAP_HEIGHT} pixel map.`)
