import { ask } from './Dialog'
import { useState } from 'react'
import { fmtDate, fmtDuration, fmtNum } from '../lib/format'
import { doneSetCount, workoutVolume } from '../lib/stats'
import { useLookup, useStore } from '../store/workout'
import type { Workout } from '../types'
import { IconTrash } from './icons'
import { Card } from './ui'

export function WorkoutCard({ w, deletable = false }: { w: Workout; deletable?: boolean }) {
  const lookup = useLookup()
  const unit = useStore((s) => s.unit)
  const del = useStore((s) => s.deleteWorkout)
  const [open, setOpen] = useState(false)
  const vol = workoutVolume(w, lookup)

  return (
    <Card className="overflow-hidden">
      <button onClick={() => setOpen((o) => !o)} className="w-full px-4 py-3.5 text-left">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="truncate font-semibold">{w.name}</h3>
          <span className="shrink-0 text-xs text-tx-3">{fmtDate(w.startedAt)}</span>
        </div>
        <div className="mt-1 flex gap-4 text-sm text-tx-2">
          {w.finishedAt && <span>{fmtDuration(w.finishedAt - w.startedAt)}</span>}
          <span>{doneSetCount(w)} sets</span>
          {vol > 0 && <span>{fmtNum(vol)} {unit}</span>}
        </div>
        {!open && (
          <ul className="mt-2 space-y-0.5 text-sm text-tx-3">
            {w.exercises.slice(0, 4).map((we) => (
              <li key={we.id} className="truncate">{we.sets.length} × {lookup(we.exerciseId)?.name ?? 'Unknown'}</li>
            ))}
            {w.exercises.length > 4 && <li>+{w.exercises.length - 4} more</li>}
          </ul>
        )}
      </button>
      {open && (
        <div className="border-t border-line px-4 py-3">
          {w.exercises.map((we) => {
            const ex = lookup(we.exerciseId)
            return (
              <div key={we.id} className="py-1.5">
                <div className="text-sm font-semibold">{ex?.name ?? 'Unknown'}</div>
                <div className="tabular mt-0.5 flex flex-wrap gap-1.5">
                  {we.sets.map((s, i) => (
                    <span key={s.id} className="rounded-md bg-card-2 px-2 py-0.5 text-xs text-tx-2">
                      {i + 1}: {ex?.kind === 'time' ? `${s.reps}s` : ex?.kind === 'bodyweight' ? `${s.weight ? `+${s.weight} ` : ''}${s.reps} reps` : `${s.weight} ${unit} × ${s.reps}`}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
          {deletable && (
            <button
              onClick={async () => { if (await ask({ message: 'Delete this workout from history?', confirmLabel: 'Delete', danger: true })) del(w.id) }}
              className="mt-2 flex items-center gap-1.5 text-sm text-danger"
            >
              <IconTrash size={15} /> Delete workout
            </button>
          )}
        </div>
      )}
    </Card>
  )
}
