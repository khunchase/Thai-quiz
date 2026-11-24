import { useMemo, useState } from 'react'
import { MUSCLES } from '../data/exercises'
import { useExercises, useStore } from '../store/workout'
import type { ExerciseKind, Muscle } from '../types'
import { IconPlus, IconSearch } from './icons'
import { Sheet } from './ui'

const KIND_LABEL: Record<ExerciseKind, string> = { weight: 'Weight × reps', bodyweight: 'Reps only', time: 'Timed' }

export function ExercisePicker({ open, onClose, onPick }: { open: boolean; onClose: () => void; onPick: (id: string) => void }) {
  const exercises = useExercises()
  const addCustom = useStore((s) => s.addCustomExercise)
  const [q, setQ] = useState('')
  const [muscle, setMuscle] = useState<Muscle | null>(null)
  const [creating, setCreating] = useState(false)
  const [newMuscle, setNewMuscle] = useState<Muscle>('Chest')
  const [newKind, setNewKind] = useState<ExerciseKind>('weight')

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return exercises
      .filter((x) => (!muscle || x.muscle === muscle) && (!needle || x.name.toLowerCase().includes(needle)))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [exercises, q, muscle])

  const pick = (id: string) => {
    onPick(id)
    setQ('')
    setCreating(false)
    onClose()
  }

  return (
    <Sheet open={open} onClose={onClose} title="Add exercise" full>
      <div className="sticky top-0 z-10 space-y-3 border-b border-line bg-card px-4 py-3">
        <label className="flex items-center gap-2 rounded-xl bg-card-2 px-3">
          <IconSearch size={18} className="text-tx-3" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search exercises"
            className="h-11 w-full bg-transparent text-base outline-none placeholder:text-tx-3"
          />
        </label>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
          {[null, ...MUSCLES].map((m) => (
            <button
              key={m ?? 'all'}
              onClick={() => setMuscle(m)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-medium ${muscle === m ? 'bg-accent text-on-accent' : 'bg-card-2 text-tx-2'}`}
            >
              {m ?? 'All'}
            </button>
          ))}
        </div>
      </div>

      <ul className="divide-y divide-line">
        {filtered.map((x) => (
          <li key={x.id}>
            <button onClick={() => pick(x.id)} className="flex w-full items-center justify-between px-5 py-3 text-left hover:bg-card-2 active:bg-card-2">
              <span>
                <span className="block font-medium">{x.name}</span>
                <span className="text-sm text-tx-3">{x.muscle}{x.custom ? ' · Custom' : ''}</span>
              </span>
              <IconPlus size={18} className="text-tx-3" />
            </button>
          </li>
        ))}
      </ul>

      <div className="p-4">
        {!creating ? (
          <button onClick={() => setCreating(true)} className="w-full rounded-xl border border-dashed border-line py-3 text-sm font-medium text-tx-2">
            {q.trim() ? `Create “${q.trim()}”` : 'Create custom exercise'}
          </button>
        ) : (
          <div className="space-y-3 rounded-2xl bg-card-2 p-4">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Exercise name"
              className="h-11 w-full rounded-lg bg-line px-3 outline-none"
            />
            <select value={newMuscle} onChange={(e) => setNewMuscle(e.target.value as Muscle)} className="h-11 w-full rounded-lg bg-line px-3">
              {MUSCLES.map((m) => <option key={m}>{m}</option>)}
            </select>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(KIND_LABEL) as ExerciseKind[]).map((k) => (
                <button key={k} onClick={() => setNewKind(k)} className={`rounded-lg py-2 text-xs font-medium ${newKind === k ? 'bg-accent text-on-accent' : 'bg-line text-tx-2'}`}>
                  {KIND_LABEL[k]}
                </button>
              ))}
            </div>
            <button
              disabled={!q.trim()}
              onClick={() => pick(addCustom(q, newMuscle, newKind).id)}
              className="h-11 w-full rounded-lg bg-accent font-semibold text-on-accent disabled:opacity-40"
            >
              Create & add
            </button>
          </div>
        )}
      </div>
    </Sheet>
  )
}
