// Checks the translation files. Run with:  npm run i18n:check   (no extra libraries needed)
//  1. en / my / th have exactly the same keys (plural forms may differ: Burmese and Thai have only "other")
//  2. no string is empty
//  3. {{placeholders}} match between languages (a missing {{name}} would show a blank)
//  4. every translation key used in the source code exists in en.json
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const load = (code) => JSON.parse(readFileSync(join(root, `src/i18n/locales/${code}.json`), 'utf8'))
const langs = { en: load('en'), my: load('my'), th: load('th') }

const flatten = (obj, prefix = '') =>
  Object.entries(obj).flatMap(([k, v]) => (typeof v === 'object' ? flatten(v, `${prefix}${k}.`) : [[`${prefix}${k}`, v]]))

// "team.usedIn_one" and "team.usedIn_other" are two forms of the same message
const PLURAL = /_(zero|one|two|few|many|other)$/
const baseKey = (k) => k.replace(PLURAL, '')
const placeholders = (text) => [...text.matchAll(/{{\s*(\w+)\s*}}/g)].map((m) => m[1])

const flat = Object.fromEntries(Object.entries(langs).map(([c, o]) => [c, new Map(flatten(o))]))
const bases = Object.fromEntries(Object.entries(flat).map(([c, m]) => [c, new Set([...m.keys()].map(baseKey))]))

let problems = 0
const fail = (msg) => { problems++; console.log('  ✗', msg) }

console.log('Key parity')
for (const code of ['my', 'th']) {
  for (const k of bases.en) if (!bases[code].has(k)) fail(`${code}.json is missing "${k}"`)
  for (const k of bases[code]) if (!bases.en.has(k)) fail(`${code}.json has an extra key "${k}" that en.json does not have`)
}

console.log('Empty strings')
for (const [code, m] of Object.entries(flat)) for (const [k, v] of m) if (!String(v).trim()) fail(`${code}.json "${k}" is empty`)

console.log('Placeholders')
const vars = (code, base) => new Set([...flat[code]].filter(([k]) => baseKey(k) === base).flatMap(([, v]) => placeholders(v)))
for (const base of bases.en) {
  const en = [...vars('en', base)].sort().join(',')
  for (const code of ['my', 'th']) {
    const other = [...vars(code, base)].sort().join(',')
    // plural messages: Burmese/Thai may skip {{count}}-less forms, but the variable names must still agree
    if (en !== other) fail(`"${base}": en uses {{${en}}} but ${code} uses {{${other}}}`)
  }
}

console.log('Keys used in the source code')
const files = []
const walk = (dir) => {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f)
    if (statSync(p).isDirectory()) walk(p)
    else if (/\.(ts|tsx)$/.test(f) && !f.endsWith('.d.ts')) files.push(p)
  }
}
walk(join(root, 'src'))
const topLevel = new Set(Object.keys(langs.en))
const KEY = /['"`]([a-z][A-Za-z]*\.[A-Za-z0-9_.]+)['"`]/g
let used = 0
for (const file of files) {
  const text = readFileSync(file, 'utf8')
  for (const m of text.matchAll(KEY)) {
    const key = m[1]
    if (!topLevel.has(key.split('.')[0])) continue // something like "stats.map", not a translation key
    used++
    if (!bases.en.has(key) && !bases.en.has(baseKey(key))) fail(`${file.replace(root, '')}: key "${key}" does not exist in en.json`)
  }
}
console.log(`  checked ${used} key references in ${files.length} files`)

console.log(problems === 0 ? '\n✓ Translations are consistent' : `\n✗ ${problems} problem(s) found`)
process.exit(problems === 0 ? 0 : 1)
