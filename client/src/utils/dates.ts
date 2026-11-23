/** Local date as YYYY-MM-DD (the format our API expects). */
export function toISODate(date: Date): string {
  return date.toLocaleDateString('en-CA')
}

export function addDays(date: Date, days: number): Date {
  const copy = new Date(date)
  copy.setDate(copy.getDate() + days)
  return copy
}

export function formatKickoff(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
