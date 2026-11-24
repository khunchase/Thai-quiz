import { WorkoutCard } from '../components/WorkoutCard'
import { Card, PageHeader, SectionTitle } from '../components/ui'
import { useStore } from '../store/workout'
import type { Workout } from '../types'

export function HistoryPage() {
  const history = useStore((s) => s.history)
  const groups = new Map<string, Workout[]>()
  for (const w of history) {
    const key = new Date(w.startedAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
    groups.set(key, [...(groups.get(key) ?? []), w])
  }

  return (
    <>
      <PageHeader title="History" subtitle={`${history.length} workout${history.length === 1 ? '' : 's'} logged`} />
      {history.length === 0 && <Card className="mt-4 p-6 text-center text-sm text-tx-2">Nothing here yet — finish a workout to see it.</Card>}
      {[...groups].map(([month, list]) => (
        <div key={month}>
          <SectionTitle>{month} · {list.length}</SectionTitle>
          <div className="space-y-2">{list.map((w) => <WorkoutCard key={w.id} w={w} deletable />)}</div>
        </div>
      ))}
    </>
  )
}
