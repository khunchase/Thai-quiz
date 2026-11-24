import { ask } from '../components/Dialog'
import { useState } from 'react'
import { ExercisePicker } from '../components/ExercisePicker'
import { IconCheck, IconDown, IconPlus, IconTrash, IconUp, IconX } from '../components/icons'
import { fmtClock } from '../lib/format'
import { unlockAudio } from '../lib/sound'
import { lastPerformance } from '../lib/stats'
import { useNow } from '../lib/useNow'
import { useLookup, useNav, useStore } from '../store/workout'
import type { Exercise, SetEntry, WorkoutExercise } from '../types'

const REST_OPTIONS = [0, 30, 45, 60, 90, 120, 150, 180, 240, 300]

const numOrNull = (v: string) => {
  if (v.trim() === '') return null
  const n = Number(v)
  return Number.isFinite(n) && n >= 0 ? n : null
}

function prevLabel(ex: Exercise, s: SetEntry | undefined, unit: string) {
  if (!s) return '—'
  if (ex.kind === 'time') return `${s.reps ?? 0}s`
  if (ex.kind === 'bodyweight') return s.weight ? `+${s.weight}${unit} × ${s.reps}` : `${s.reps ?? 0}`
  return `${s.weight ?? 0} × ${s.reps ?? 0}`
}

function ExerciseBlock({ we, index, total }: { we: WorkoutExercise; index: number; total: number }) {
  const lookup = useLookup()
  const history = useStore((s) => s.history)
  const unit = useStore((s) => s.unit)
  const { updateSet, toggleSet, addSet, removeSet, removeExercise, moveExercise, setExerciseRest } = useStore()
  const [menu, setMenu] = useState(false)
  const ex = lookup(we.exerciseId)
  if (!ex) return null
  const prev = lastPerformance(history, we.exerciseId)
  const showWeight = ex.kind !== 'time'
  const repsLabel = ex.kind === 'time' ? 'sec' : 'reps'
  const weightLabel = ex.kind === 'bodyweight' ? `+${unit}` : unit
  const cols = showWeight ? 'grid-cols-[28px_1fr_64px_64px_44px]' : 'grid-cols-[28px_1fr_80px_44px]'

  return (
    <section className="rounded-2xl border border-line bg-card">
      <div className="flex items-start justify-between gap-2 px-4 pt-3.5">
        <div className="min-w-0">
          <h3 className="truncate text-[17px] font-semibold text-accent">{ex.name}</h3>
          <p className="text-xs text-tx-3">{ex.muscle}</p>
        </div>
        <div className="flex items-center gap-1">
          <select
            aria-label="Rest timer"
            value={we.restSec}
            onChange={(e) => setExerciseRest(we.id, Number(e.target.value))}
            className="h-8 rounded-lg bg-card-2 px-2 text-xs text-rest"
          >
            {REST_OPTIONS.map((r) => <option key={r} value={r}>{r ? `Rest ${fmtClock(r)}` : 'No rest'}</option>)}
          </select>
          <button onClick={() => setMenu((m) => !m)} className="h-8 w-8 rounded-lg bg-card-2 text-tx-2" aria-label="Exercise options">⋯</button>
        </div>
      </div>
      {menu && (
        <div className="mx-4 mt-2 flex gap-2">
          <button disabled={index === 0} onClick={() => moveExercise(we.id, -1)} className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-card-2 py-2 text-sm disabled:opacity-30"><IconUp size={16} />Up</button>
          <button disabled={index === total - 1} onClick={() => moveExercise(we.id, 1)} className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-card-2 py-2 text-sm disabled:opacity-30"><IconDown size={16} />Down</button>
          <button onClick={() => removeExercise(we.id)} className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-danger/15 py-2 text-sm text-danger"><IconTrash size={16} />Remove</button>
        </div>
      )}

      <div className="px-2 pb-2 pt-3">
        <div className={`grid ${cols} items-center gap-2 px-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-tx-3`}>
          <span>Set</span><span>Previous</span>
          {showWeight && <span className="text-center">{weightLabel}</span>}
          <span className="text-center">{repsLabel}</span><span />
        </div>
        {we.sets.map((s, i) => (
          <div key={s.id} className={`group grid ${cols} items-center gap-2 rounded-xl px-2 py-1 transition-colors ${s.done ? 'bg-ok/10' : ''}`}>
            <button onClick={() => removeSet(we.id, s.id)} title="Remove set" className="tabular h-8 rounded-md text-sm font-semibold text-tx-2 hover:bg-danger/20 hover:text-danger">{i + 1}</button>
            <span className="tabular truncate text-sm text-tx-3">{prevLabel(ex, prev?.[i], unit)}</span>
            {showWeight && (
              <input
                inputMode="decimal" type="number" step="any"
                value={s.weight ?? ''}
                placeholder="–"
                onChange={(e) => updateSet(we.id, s.id, { weight: numOrNull(e.target.value) })}
                className="tabular h-9 w-full rounded-lg bg-card-2 text-center font-semibold outline-none focus:ring-2 focus:ring-accent/60 placeholder:text-tx-3"
              />
            )}
            <input
              inputMode="numeric" type="number"
              value={s.reps ?? ''}
              placeholder="–"
              onChange={(e) => updateSet(we.id, s.id, { reps: numOrNull(e.target.value) })}
              className="tabular h-9 w-full rounded-lg bg-card-2 text-center font-semibold outline-none focus:ring-2 focus:ring-accent/60 placeholder:text-tx-3"
            />
            <button
              onClick={() => { unlockAudio(); toggleSet(we.id, s.id) }}
              aria-label={s.done ? 'Mark set not done' : 'Complete set'}
              className={`flex h-9 w-full items-center justify-center rounded-lg transition-colors ${s.done ? 'bg-ok text-[#06240f]' : 'bg-card-2 text-tx-3'}`}
            >
              <IconCheck size={18} />
            </button>
          </div>
        ))}
        <button onClick={() => addSet(we.id)} className="mt-1 flex w-full items-center justify-center gap-1 rounded-xl py-2.5 text-sm font-medium text-tx-2 hover:bg-card-2">
          <IconPlus size={16} /> Add set
        </button>
      </div>
    </section>
  )
}

export function WorkoutPage() {
  const active = useStore((s) => s.active)
  const { renameActive, addExercise, finishWorkout, discardWorkout } = useStore()
  const { setWorkoutOpen, setSummary } = useNav()
  const [picker, setPicker] = useState(false)
  const now = useNow(1000)

  if (!active) return null
  const total = active.exercises.reduce((n, we) => n + we.sets.length, 0)
  const done = active.exercises.reduce((n, we) => n + we.sets.filter((s) => s.done).length, 0)

  const finish = async () => {
    if (done === 0) {
      if (await ask({ message: 'No sets completed yet. Discard this workout?', confirmLabel: 'Discard', danger: true })) {
        discardWorkout()
        setWorkoutOpen(false)
      }
      return
    }
    if (done < total && !(await ask({ message: `${total - done} unfinished set${total - done === 1 ? '' : 's'} will be dropped. Finish workout?`, confirmLabel: 'Finish' }))) return
    const w = finishWorkout()
    setWorkoutOpen(false)
    if (w) setSummary(w)
  }

  return (
    <div className="fixed inset-0 z-30 overflow-y-auto bg-bg">
      <div className="mx-auto max-w-md px-3 pb-40">
        <header className="pt-safe sticky top-0 z-10 -mx-3 border-b border-line bg-bg/90 px-3 py-3 backdrop-blur">
          <div className="flex items-center gap-2">
            <button onClick={() => setWorkoutOpen(false)} className="rounded-full p-2 text-tx-2 hover:bg-card" aria-label="Minimize workout">
              <IconDown />
            </button>
            <div className="min-w-0 flex-1 text-center">
              <div className="tabular text-lg font-bold">{fmtClock((now - active.startedAt) / 1000)}</div>
              <div className="text-xs text-tx-3">{done}/{total} sets</div>
            </div>
            <button onClick={finish} className="rounded-xl bg-accent px-4 py-2 font-semibold text-on-accent active:scale-95">Finish</button>
          </div>
          <div className="mt-3 h-1 overflow-hidden rounded-full bg-card-2">
            <div className="h-full bg-accent transition-all" style={{ width: `${total ? (done / total) * 100 : 0}%` }} />
          </div>
        </header>

        <input
          value={active.name}
          onChange={(e) => renameActive(e.target.value)}
          className="mt-4 w-full bg-transparent px-1 text-2xl font-bold outline-none"
          aria-label="Workout name"
        />

        <div className="mt-3 space-y-3">
          {active.exercises.map((we, i) => (
            <ExerciseBlock key={we.id} we={we} index={i} total={active.exercises.length} />
          ))}
        </div>

        {active.exercises.length === 0 && (
          <p className="mt-10 text-center text-tx-2">Empty workout — add your first exercise.</p>
        )}

        <button onClick={() => setPicker(true)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-accent/10 py-3.5 font-semibold text-accent">
          <IconPlus size={18} /> Add exercise
        </button>
        <button
          onClick={async () => { if (await ask({ message: 'Discard this workout? Nothing will be saved.', confirmLabel: 'Discard', danger: true })) { discardWorkout(); setWorkoutOpen(false) } }}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-medium text-danger"
        >
          <IconX size={16} /> Discard workout
        </button>
      </div>
      <ExercisePicker open={picker} onClose={() => setPicker(false)} onPick={addExercise} />
    </div>
  )
}
