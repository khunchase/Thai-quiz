const pad = (n: number) => String(n).padStart(2, '0')

/** 75 → "1:15", 3725 → "1:02:05" */
export function fmtClock(totalSec: number): string {
  const s = Math.max(0, Math.ceil(totalSec))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const r = s % 60
  return h ? `${h}:${pad(m)}:${pad(r)}` : `${m}:${pad(r)}`
}

/** milliseconds → "1h 5m" / "42m" */
export function fmtDuration(ms: number): string {
  const mins = Math.max(1, Math.round(ms / 60000))
  const h = Math.floor(mins / 60)
  return h ? `${h}h ${mins % 60}m` : `${mins}m`
}

export const fmtDate = (ts: number) =>
  new Date(ts).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })

export const fmtShortDate = (ts: number) =>
  new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })

export const fmtNum = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 1 })

export function fmtCompact(n: number): string {
  if (n >= 1_000_000) return `${fmtNum(n / 1_000_000)}M`
  if (n >= 10_000) return `${fmtNum(n / 1000)}k`
  return fmtNum(n)
}
