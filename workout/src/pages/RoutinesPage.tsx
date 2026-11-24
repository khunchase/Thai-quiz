import { ask } from '../components/Dialog'
import { useState } from 'react'
import { ExercisePicker } from '../components/ExercisePicker'
import { IconDown, IconEdit, IconPlay, IconPlus, IconTrash, IconUp } from '../components/icons'
import { Card, PageHeader, Sheet } from '../components/ui'
import { fmtClock } from '../lib/format'
import { uid } from '../lib/id'
import { useLookup, useNav, useStore } from '../store/workout'
import type { Routine, RoutineExercise } from '../types'

function RoutineEditor({ initial, onClose }: { initial: Routine; onClose: () => void }) {
  const lookup = useLookup()
  const save = useStore((s) => s.saveRoutine)
  const del = useStore((s) => s.deleteRoutine)
  const exists = useStore((s) => s.routines.some((r) => r.id === initial.id))
  const defaultRest = useStore((s) => s.defaultRest)
  const unit = useStore((s) => s.unit)
  const [r, setR] = useState<Routine>(initial)
  const [picker, setPicker] = useState(false)

  const patch = (i: number, p: Partial<RoutineExercise>) =>
    setR((x) => ({ ...x, exercises: x.exercises.map((e, j) => (j === i ? { ...e, ...p } : e)) }))
  const move = (i: number, d: -1 | 1) =>
    setR((x) => {
      const list = [...x.exercises]
      const j = i + d
      if (j < 0 || j >= list.length) return x
      ;[list[i], list[j]] = [list[j], list[i]]
      return { ...x, exercises: list }
    })
  const num = (v: string) => Math.max(0, Number(v) || 0)

  return (
    <>
      <div className="space-y-3 p-4">
        <input
          value={r.name}
          onChange={(e) => setR({ ...r, name: e.target.value })}
          placeholder="Routine name"
          className="h-12 w-full rounded-xl bg-card-2 px-4 text-lg font-semibold outline-none focus:ring-2 focus:ring-accent/60"
        />
        {r.exercises.map((re, i) => {
          const ex = lookup(re.exerciseId)
          return (
            <div key={`${re.exerciseId}-${i}`} className="rounded-2xl bg-card-2 p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate font-semibold">{ex?.name ?? 'Unknown'}</span>
                <div className="flex shrink-0 gap-1 text-tx-2">
                  <button onClick={() => move(i, -1)} disabled={i === 0} className="rounded p-1 disabled:opacity-30" aria-label="Move up"><IconUp size={18} /></button>
                  <button onClick={() => move(i, 1)} disabled={i === r.exercises.length - 1} className="rounded p-1 disabled:opacity-30" aria-label="Move down"><IconDown size={18} /></button>
                  <button onClick={() => setR({ ...r, exercises: r.exercises.filter((_, j) => j !== i) })} className="rounded p-1 text-danger" aria-label="Remove"><IconTrash size={18} /></button>
                </div>
              </div>
              <div className="mt-2 grid grid-cols-4 gap-2 text-center">
                {([
                  ['Sets', 'sets', re.sets],
                  [ex?.kind === 'time' ? 'Sec' : 'Reps', 'reps', re.reps],
                ] as const).map(([label, key, val]) => (
                  <label key={key} className="text-[11px] text-tx-3">
                    {label}
                    <input type="number" inputMode="numeric" value={val} onChange={(e) => patch(i, { [key]: num(e.target.value) })} className="tabular mt-0.5 h-9 w-full rounded-lg bg-line text-center text-sm font-semibold text-tx outline-none" />
                  </label>
                ))}
                <label className="text-[11px] text-tx-3">
                  {ex?.kind === 'weight' ? unit : ex?.kind === 'bodyweight' ? `+${unit}` : '—'}
                  <input
                    type="number" inputMode="decimal" step="any" disabled={ex?.kind === 'time'}
                    value={re.weight ?? ''} placeholder="auto"
                    onChange={(e) => patch(i, { weight: e.target.value === '' ? null : num(e.target.value) })}
                    className="tabular mt-0.5 h-9 w-full rounded-lg bg-line text-center text-sm font-semibold text-tx outline-none placeholder:text-tx-3 disabled:opacity-30"
                  />
                </label>
                <label className="text-[11px] text-tx-3">
                  Rest
                  <select value={re.restSec} onChange={(e) => patch(i, { restSec: Number(e.target.value) })} className="mt-0.5 h-9 w-full rounded-lg bg-line text-center text-sm font-semibold text-tx">
                    {[0, 30, 45, 60, 90, 120, 150, 180, 240, 300].map((x) => <option key={x} value={x}>{x ? fmtClock(x) : 'none'}</option>)}
                  </select>
                </label>
              </div>
            </div>
          )
        })}
        <button onClick={() => setPicker(true)} className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-line py-3 font-medium text-tx-2">
          <IconPlus size={18} /> Add exercise
        </button>
        <p className="px-1 text-xs text-tx-3">Weight left on “auto” is filled from the last time you did that exercise.</p>
      </div>
      <div className="sticky bottom-0 flex gap-2 border-t border-line bg-card p-4">
        {exists && (
          <button onClick={async () => { if (await ask({ message: `Delete “${r.name}”?`, confirmLabel: 'Delete', danger: true })) { del(r.id); onClose() } }} className="rounded-xl bg-danger/15 px-4 font-semibold text-danger">
            Delete
          </button>
        )}
        <button
          disabled={!r.name.trim() || r.exercises.length === 0}
          onClick={() => { save({ ...r, name: r.name.trim() }); onClose() }}
          className="h-12 flex-1 rounded-xl bg-accent font-semibold text-on-accent disabled:opacity-40"
        >
          Save routine
        </button>
      </div>
      <ExercisePicker
        open={picker}
        onClose={() => setPicker(false)}
        onPick={(id) => {
          const kind = lookup(id)?.kind
          setR((x) => ({ ...x, exercises: [...x.exercises, { exerciseId: id, sets: 3, reps: kind === 'time' ? 30 : 10, weight: null, restSec: defaultRest }] }))
        }}
      />
    </>
  )
}

export function RoutinesPage() {
  const routines = useStore((s) => s.routines)
  const active = useStore((s) => s.active)
  const startWorkout = useStore((s) => s.startWorkout)
  const { setWorkoutOpen } = useNav()
  const lookup = useLookup()
  const [editing, setEditing] = useState<Routine | null>(null)

  return (
    <>
      <PageHeader
        title="Routines"
        subtitle="Reusable workout templates"
        right={
          <button onClick={() => setEditing({ id: uid(), name: '', exercises: [], createdAt: Date.now() })} className="flex items-center gap-1 rounded-xl bg-accent px-3 py-2 text-sm font-semibold text-on-accent">
            <IconPlus size={16} /> New
          </button>
        }
      />
      <div className="mt-3 space-y-3">
        {routines.length === 0 && <Card className="p-6 text-center text-sm text-tx-2">No routines yet. Create one to start workouts in one tap.</Card>}
        {routines.map((r) => {
          const totalSets = r.exercises.reduce((n, x) => n + x.sets, 0)
          return (
            <Card key={r.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold">{r.name}</h3>
                  <p className="text-xs text-tx-3">{r.exercises.length} exercises · {totalSets} sets</p>
                </div>
                <button onClick={() => setEditing(r)} className="rounded-lg p-2 text-tx-2 hover:bg-card-2" aria-label={`Edit ${r.name}`}><IconEdit size={18} /></button>
              </div>
              <ul className="mt-2 space-y-0.5 text-sm text-tx-2">
                {r.exercises.map((x, i) => (
                  <li key={i} className="flex justify-between gap-2">
                    <span className="truncate">{lookup(x.exerciseId)?.name ?? 'Unknown'}</span>
                    <span className="tabular shrink-0 text-tx-3">{x.sets} × {x.reps}{lookup(x.exerciseId)?.kind === 'time' ? 's' : ''}</span>
                  </li>
                ))}
              </ul>
              <button
                disabled={!!active}
                onClick={() => { startWorkout(r.id); setWorkoutOpen(true) }}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-card-2 py-2.5 font-semibold text-accent disabled:opacity-40"
              >
                <IconPlay size={14} /> {active ? 'Workout in progress' : 'Start workout'}
              </button>
            </Card>
          )
        })}
      </div>
      <Sheet open={!!editing} onClose={() => setEditing(null)} title={editing && routines.some((x) => x.id === editing.id) ? 'Edit routine' : 'New routine'} full>
        {editing && <RoutineEditor key={editing.id} initial={editing} onClose={() => setEditing(null)} />}
      </Sheet>
    </>
  )
}
