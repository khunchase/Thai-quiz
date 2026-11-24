import type { Exercise, SetEntry, Workout } from '../types'

export type Lookup = (id: string) => Exercise | undefined

/** Epley estimated one-rep max. */
export const e1rm = (weight: number, reps: number) => (reps <= 1 ? weight : weight * (1 + reps / 30))

export function workoutVolume(w: Workout, lookup: Lookup): number {
  let v = 0
  for (const we of w.exercises) {
    if (lookup(we.exerciseId)?.kind !== 'weight') continue
    for (const s of we.sets) if (s.done) v += (s.weight ?? 0) * (s.reps ?? 0)
  }
  return v
}

export const doneSetCount = (w: Workout) => w.exercises.reduce((n, we) => n + we.sets.filter((s) => s.done).length, 0)

export function startOfWeek(ts: number): number {
  const d = new Date(ts)
  d.setHours(0, 0, 0, 0)
  const day = (d.getDay() + 6) % 7 // Monday = 0
  d.setDate(d.getDate() - day)
  return d.getTime()
}

const WEEK = 7 * 24 * 3600 * 1000

export function weeklySummary(history: Workout[], lookup: Lookup, weeks = 12) {
  const thisWeek = startOfWeek(Date.now())
  const buckets = Array.from({ length: weeks }, (_, i) => {
    const start = thisWeek - (weeks - 1 - i) * WEEK
    return { start, label: new Date(start).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }), volume: 0, workouts: 0 }
  })
  for (const w of history) {
    const idx = Math.round((startOfWeek(w.startedAt) - buckets[0].start) / WEEK)
    if (idx < 0 || idx >= weeks) continue
    buckets[idx].volume += workoutVolume(w, lookup)
    buckets[idx].workouts += 1
  }
  return buckets
}

/** Consecutive weeks (ending this week or last week) with at least one workout. */
export function weekStreak(history: Workout[]): number {
  const weeks = new Set(history.map((w) => startOfWeek(w.startedAt)))
  let cursor = startOfWeek(Date.now())
  if (!weeks.has(cursor)) cursor -= WEEK
  let streak = 0
  while (weeks.has(cursor)) {
    streak++
    cursor = startOfWeek(cursor - WEEK / 2)
  }
  return streak
}

/** Most recent completed sets of an exercise, from history (newest first). */
export function lastPerformance(history: Workout[], exerciseId: string): SetEntry[] | null {
  for (const w of history) {
    const we = w.exercises.find((x) => x.exerciseId === exerciseId)
    if (we) {
      const done = we.sets.filter((s) => s.done)
      if (done.length) return done
    }
  }
  return null
}

export interface SeriesPoint { ts: number; date: string; e1rm: number; top: number; volume: number; reps: number }

/** Per-session progress for one exercise, oldest first. */
export function exerciseSeries(history: Workout[], exerciseId: string): SeriesPoint[] {
  const out: SeriesPoint[] = []
  for (const w of history) {
    const sets = w.exercises.filter((x) => x.exerciseId === exerciseId).flatMap((x) => x.sets.filter((s) => s.done))
    if (!sets.length) continue
    let best = 0, top = 0, volume = 0, reps = 0
    for (const s of sets) {
      const wt = s.weight ?? 0, r = s.reps ?? 0
      best = Math.max(best, e1rm(wt, r))
      top = Math.max(top, wt)
      volume += wt * r
      reps = Math.max(reps, r)
    }
    out.push({
      ts: w.startedAt,
      date: new Date(w.startedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      e1rm: Math.round(best * 10) / 10, top, volume, reps,
    })
  }
  return out.reverse()
}

export interface PR { exerciseId: string; weight: number; reps: number; e1rm: number; ts: number }

/** Best set (by estimated 1RM, or reps/seconds for non-weight moves) per exercise. */
export function personalRecords(history: Workout[], lookup: Lookup): PR[] {
  const best = new Map<string, PR>()
  for (const w of history) {
    for (const we of w.exercises) {
      const kind = lookup(we.exerciseId)?.kind
      for (const s of we.sets) {
        if (!s.done) continue
        const weight = s.weight ?? 0, reps = s.reps ?? 0
        const score = kind === 'weight' ? e1rm(weight, reps) : reps
        const prev = best.get(we.exerciseId)
        if (!prev || score > prev.e1rm || (score === prev.e1rm && w.startedAt < prev.ts)) {
          best.set(we.exerciseId, { exerciseId: we.exerciseId, weight, reps, e1rm: score, ts: w.startedAt })
        }
      }
    }
  }
  return [...best.values()].sort((a, b) => b.ts - a.ts)
}

/** Exercises in `w` that beat every earlier workout's best. */
export function prsInWorkout(w: Workout, history: Workout[], lookup: Lookup): string[] {
  const earlier = history.filter((h) => h.id !== w.id && h.startedAt < w.startedAt)
  const before = new Map(personalRecords(earlier, lookup).map((p) => [p.exerciseId, p.e1rm]))
  const mine = personalRecords([w], lookup)
  return mine.filter((p) => p.e1rm > 0 && p.e1rm > (before.get(p.exerciseId) ?? 0) && before.has(p.exerciseId)).map((p) => p.exerciseId)
}
