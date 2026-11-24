import { useSyncExternalStore } from 'react'

/**
 * Which API answers on the current page came from "saved data" (the server sets the header `X-Data-Stale: true`
 * when API-Football is unavailable and it falls back to an expired cache entry).
 * We remember it per URL: a later normal answer for the same URL removes the mark.
 */
const staleUrls = new Set<string>()
// Pages that show several lists but only one at a time (the Home date picker) narrow down which URLs count.
let inScope: (url: string) => boolean = () => true
const listeners = new Set<() => void>()
const notify = () => listeners.forEach((listener) => listener())

export function recordResponse(url: string, stale: boolean): void {
  if (stale === staleUrls.has(url)) return
  if (stale) staleUrls.add(url)
  else staleUrls.delete(url)
  notify()
}

/** Forget everything, e.g. when the visitor moves to another page. */
export function clearStale(): void {
  inScope = () => true
  if (staleUrls.size === 0) return
  staleUrls.clear()
  notify()
}

/** Only answers whose URL passes `filter` count for the note (e.g. only the day being shown). */
export function setStaleScope(filter: (url: string) => boolean): void {
  inScope = filter
  notify()
}

const hasStale = (): boolean => [...staleUrls].some(inScope)

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/** True while any answer shown on the page is saved (possibly out-of-date) data. */
export const useHasStaleData = (): boolean => useSyncExternalStore(subscribe, hasStale)
