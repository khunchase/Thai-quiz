import { useMemo } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { BUILT_IN_EXERCISES, STARTER_ROUTINES } from '../data/exercises'
import { uid } from '../lib/id'
import { lastPerformance } from '../lib/stats'
import type { Exercise, ExerciseKind, Muscle, Routine, SetEntry, Unit, Workout, WorkoutExercise } from '../types'

interface Rest { endsAt: number; total: number }

interface State {
  routines: Routine[]
  history: Workout[] // newest first
  active: Workout | null
  rest: Rest | null
  customExercises: Exercise[]
  unit: Unit
  defaultRest: number

  saveRoutine: (r: Routine) => void
  deleteRoutine: (id: string) => void

  startWorkout: (routineId?: string) => void
  renameActive: (name: string) => void
  addExercise: (exerciseId: string) => void
  removeExercise: (weId: string) => void
  moveExercise: (weId: string, dir: -1 | 1) => void
  setExerciseRest: (weId: string, sec: number) => void
  addSet: (weId: string) => void
  removeSet: (weId: string, setId: string) => void
  updateSet: (weId: string, setId: string, patch: Partial<SetEntry>) => void
  toggleSet: (weId: string, setId: string) => void
  finishWorkout: () => Workout | null
  discardWorkout: () => void
  deleteWorkout: (id: string) => void

  startRest: (sec: number) => void
  adjustRest: (deltaSec: number) => void
  clearRest: () => void

  addCustomExercise: (name: string, muscle: Muscle, kind: ExerciseKind) => Exercise
  setUnit: (u: Unit) => void
  setDefaultRest: (sec: number) => void
  importData: (data: Partial<Pick<State, 'routines' | 'history' | 'customExercises' | 'unit' | 'defaultRest'>>) => void
  resetAll: () => void
}

const initial = {
  routines: STARTER_ROUTINES,
  history: [] as Workout[],
  active: null as Workout | null,
  rest: null as Rest | null,
  customExercises: [] as Exercise[],
  unit: 'kg' as Unit,
  defaultRest: 90,
}

/** Prefill sets from last time you did this exercise, else from the routine target. */
function buildSets(history: Workout[], exerciseId: string, count: number, reps: number | null, weight: number | null): SetEntry[] {
  const prev = lastPerformance(history, exerciseId)
  return Array.from({ length: count }, (_, i) => {
    const p = prev?.[Math.min(i, prev.length - 1)]
    return { id: uid(), reps: p?.reps ?? reps, weight: p?.weight ?? weight, done: false }
  })
}

const mapActive = (s: State, weId: string, fn: (we: WorkoutExercise) => WorkoutExercise) =>
  s.active ? { active: { ...s.active, exercises: s.active.exercises.map((we) => (we.id === weId ? fn(we) : we)) } } : {}

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      ...initial,

      saveRoutine: (r) =>
        set((s) => ({ routines: s.routines.some((x) => x.id === r.id) ? s.routines.map((x) => (x.id === r.id ? r : x)) : [...s.routines, r] })),
      deleteRoutine: (id) => set((s) => ({ routines: s.routines.filter((r) => r.id !== id) })),

      startWorkout: (routineId) => {
        const { routines, history, active } = get()
        if (active) return
        const routine = routines.find((r) => r.id === routineId)
        const hour = new Date().getHours()
        const name = routine?.name ?? (hour < 12 ? 'Morning Workout' : hour < 17 ? 'Afternoon Workout' : 'Evening Workout')
        set({
          rest: null,
          active: {
            id: uid(), name, routineId: routine?.id ?? null, startedAt: Date.now(), finishedAt: null,
            exercises: (routine?.exercises ?? []).map((re) => ({
              id: uid(), exerciseId: re.exerciseId, restSec: re.restSec,
              sets: buildSets(history, re.exerciseId, re.sets, re.reps, re.weight),
            })),
          },
        })
      },
      renameActive: (name) => set((s) => (s.active ? { active: { ...s.active, name } } : {})),
      addExercise: (exerciseId) =>
        set((s) =>
          s.active
            ? { active: { ...s.active, exercises: [...s.active.exercises, { id: uid(), exerciseId, restSec: s.defaultRest, sets: buildSets(s.history, exerciseId, 3, null, null) }] } }
            : {},
        ),
      removeExercise: (weId) => set((s) => (s.active ? { active: { ...s.active, exercises: s.active.exercises.filter((x) => x.id !== weId) } } : {})),
      moveExercise: (weId, dir) =>
        set((s) => {
          if (!s.active) return {}
          const list = [...s.active.exercises]
          const i = list.findIndex((x) => x.id === weId)
          const j = i + dir
          if (i < 0 || j < 0 || j >= list.length) return {}
          ;[list[i], list[j]] = [list[j], list[i]]
          return { active: { ...s.active, exercises: list } }
        }),
      setExerciseRest: (weId, sec) => set((s) => mapActive(s, weId, (we) => ({ ...we, restSec: sec }))),
      addSet: (weId) =>
        set((s) =>
          mapActive(s, weId, (we) => {
            const last = we.sets[we.sets.length - 1]
            return { ...we, sets: [...we.sets, { id: uid(), reps: last?.reps ?? null, weight: last?.weight ?? null, done: false }] }
          }),
        ),
      removeSet: (weId, setId) => set((s) => mapActive(s, weId, (we) => ({ ...we, sets: we.sets.filter((x) => x.id !== setId) }))),
      updateSet: (weId, setId, patch) =>
        set((s) => mapActive(s, weId, (we) => ({ ...we, sets: we.sets.map((x) => (x.id === setId ? { ...x, ...patch } : x)) }))),
      toggleSet: (weId, setId) => {
        const we = get().active?.exercises.find((x) => x.id === weId)
        const target = we?.sets.find((x) => x.id === setId)
        if (!we || !target) return
        const nowDone = !target.done
        get().updateSet(weId, setId, { done: nowDone })
        if (nowDone && we.restSec > 0) get().startRest(we.restSec)
      },
      finishWorkout: () => {
        const { active, history } = get()
        if (!active) return null
        const exercises = active.exercises
          .map((we) => ({ ...we, sets: we.sets.filter((x) => x.done) }))
          .filter((we) => we.sets.length > 0)
        if (!exercises.length) {
          set({ active: null, rest: null })
          return null
        }
        const done: Workout = { ...active, exercises, finishedAt: Date.now() }
        set({ active: null, rest: null, history: [done, ...history] })
        return done
      },
      discardWorkout: () => set({ active: null, rest: null }),
      deleteWorkout: (id) => set((s) => ({ history: s.history.filter((w) => w.id !== id) })),

      startRest: (sec) => set({ rest: { endsAt: Date.now() + sec * 1000, total: sec } }),
      adjustRest: (d) =>
        set((s) => {
          if (!s.rest) return {}
          const endsAt = s.rest.endsAt + d * 1000
          if (endsAt <= Date.now()) return { rest: null }
          return { rest: { endsAt, total: Math.max(1, s.rest.total + d) } }
        }),
      clearRest: () => set({ rest: null }),

      addCustomExercise: (name, muscle, kind) => {
        const ex: Exercise = { id: `custom-${uid()}`, name: name.trim(), muscle, kind, custom: true }
        set((s) => ({ customExercises: [...s.customExercises, ex] }))
        return ex
      },
      setUnit: (unit) => set({ unit }),
      setDefaultRest: (defaultRest) => set({ defaultRest }),
      importData: (data) =>
        set((s) => ({
          routines: Array.isArray(data.routines) ? data.routines : s.routines,
          history: Array.isArray(data.history) ? data.history : s.history,
          customExercises: Array.isArray(data.customExercises) ? data.customExercises : s.customExercises,
          unit: data.unit === 'lb' || data.unit === 'kg' ? data.unit : s.unit,
          defaultRest: typeof data.defaultRest === 'number' ? data.defaultRest : s.defaultRest,
        })),
      resetAll: () => set({ ...initial }),
    }),
    { name: 'rep-workout-v1', version: 1 },
  ),
)

const BUILT_IN_MAP = new Map(BUILT_IN_EXERCISES.map((x) => [x.id, x]))

export function useExercises(): Exercise[] {
  const custom = useStore((s) => s.customExercises)
  return useMemo(() => [...BUILT_IN_EXERCISES, ...custom], [custom])
}

export function useLookup(): (id: string) => Exercise | undefined {
  const custom = useStore((s) => s.customExercises)
  return useMemo(() => {
    const m = new Map(BUILT_IN_MAP)
    for (const c of custom) m.set(c.id, c)
    return (id: string) => m.get(id)
  }, [custom])
}

/* --- UI navigation (not persisted) --- */
export type Tab = 'home' | 'routines' | 'timer' | 'history' | 'progress'

interface Nav {
  tab: Tab
  workoutOpen: boolean
  summary: Workout | null
  setTab: (t: Tab) => void
  setWorkoutOpen: (o: boolean) => void
  setSummary: (w: Workout | null) => void
}

export const useNav = create<Nav>((set) => ({
  tab: 'home',
  workoutOpen: false,
  summary: null,
  setTab: (tab) => set({ tab }),
  setWorkoutOpen: (workoutOpen) => set({ workoutOpen }),
  setSummary: (summary) => set({ summary }),
}))
