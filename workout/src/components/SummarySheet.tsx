import { fmtDuration, fmtNum } from '../lib/format'
import { doneSetCount, prsInWorkout, workoutVolume } from '../lib/stats'
import { useLookup, useNav, useStore } from '../store/workout'
import { IconTrophy } from './icons'
import { Sheet } from './ui'

export function SummarySheet() {
  const { summary, setSummary } = useNav()
  const history = useStore((s) => s.history)
  const unit = useStore((s) => s.unit)
  const lookup = useLookup()
  if (!summary) return null
  const prs = prsInWorkout(summary, history, lookup)
  const stats = [
    { label: 'Duration', value: fmtDuration((summary.finishedAt ?? Date.now()) - summary.startedAt) },
    { label: 'Sets', value: doneSetCount(summary) },
    { label: `Volume (${unit})`, value: fmtNum(workoutVolume(summary, lookup)) },
  ]

  return (
    <Sheet open onClose={() => setSummary(null)} title="Workout complete">
      <div className="p-5 text-center">
        <div className="text-5xl">💪</div>
        <h3 className="mt-2 text-2xl font-bold">{summary.name}</h3>
        <p className="text-sm text-tx-2">Nice work — it's saved to your history.</p>
        <div className="mt-5 grid grid-cols-3 gap-2">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl bg-card-2 p-3">
              <div className="tabular text-xl font-bold">{s.value}</div>
              <div className="text-[11px] text-tx-3">{s.label}</div>
            </div>
          ))}
        </div>
        {prs.length > 0 && (
          <div className="mt-4 rounded-xl border border-yellow-400/30 bg-yellow-400/10 p-3 text-left">
            <div className="flex items-center gap-2 text-sm font-semibold text-yellow-300"><IconTrophy size={16} /> New personal record{prs.length > 1 ? 's' : ''}</div>
            <ul className="mt-1 text-sm text-tx-2">{prs.map((id) => <li key={id}>{lookup(id)?.name}</li>)}</ul>
          </div>
        )}
        <button onClick={() => setSummary(null)} className="mt-5 h-12 w-full rounded-xl bg-accent font-semibold text-on-accent">Done</button>
      </div>
    </Sheet>
  )
}
