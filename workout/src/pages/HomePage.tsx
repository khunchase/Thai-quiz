import { useRef } from 'react'
import { IconDumbbell, IconFlame, IconPlay, IconPlus } from '../components/icons'
import { WorkoutCard } from '../components/WorkoutCard'
import { Card, PageHeader, SectionTitle } from '../components/ui'
import { fmtClock, fmtCompact } from '../lib/format'
import { startOfWeek, weekStreak, workoutVolume } from '../lib/stats'
import { useNow } from '../lib/useNow'
import { useLookup, useNav, useStore } from '../store/workout'

function greeting() {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
}

export function HomePage() {
  const s = useStore()
  const lookup = useLookup()
  const { setWorkoutOpen, setTab } = useNav()
  const now = useNow(1000, !!s.active)
  const fileRef = useRef<HTMLInputElement>(null)

  const weekStart = startOfWeek(Date.now())
  const thisWeek = s.history.filter((w) => w.startedAt >= weekStart)
  const weekVol = thisWeek.reduce((v, w) => v + workoutVolume(w, lookup), 0)
  const streak = weekStreak(s.history)

  const start = (routineId?: string) => {
    s.startWorkout(routineId)
    setWorkoutOpen(true)
  }

  const exportData = () => {
    const { routines, history, customExercises, unit, defaultRest } = useStore.getState()
    const blob = new Blob([JSON.stringify({ app: 'rep', version: 1, routines, history, customExercises, unit, defaultRest }, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `rep-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const importData = async (file: File) => {
    try {
      const data = JSON.parse(await file.text())
      if (!confirm('Replace your routines and history with this backup?')) return
      s.importData(data)
    } catch {
      alert('That file is not a valid backup.')
    }
  }

  return (
    <>
      <PageHeader title={greeting()} subtitle={new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })} />

      {s.active ? (
        <button onClick={() => setWorkoutOpen(true)} className="mt-3 w-full rounded-2xl bg-accent p-4 text-left text-on-accent active:scale-[0.99]">
          <div className="text-xs font-bold uppercase tracking-wider opacity-70">In progress</div>
          <div className="mt-1 flex items-center justify-between">
            <span className="text-xl font-bold">{s.active.name}</span>
            <span className="tabular text-xl font-bold">{fmtClock((now - s.active.startedAt) / 1000)}</span>
          </div>
          <div className="mt-1 text-sm font-medium opacity-80">Tap to resume</div>
        </button>
      ) : (
        <button onClick={() => start()} className="mt-3 flex w-full items-center gap-3 rounded-2xl bg-accent p-4 text-left text-on-accent active:scale-[0.99]">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-on-accent/10"><IconPlay size={20} /></span>
          <span>
            <span className="block text-lg font-bold">Start empty workout</span>
            <span className="text-sm font-medium opacity-75">Add exercises as you go</span>
          </span>
        </button>
      )}

      <div className="mt-3 grid grid-cols-3 gap-2">
        <Card className="p-3">
          <div className="text-2xl font-bold">{thisWeek.length}</div>
          <div className="text-xs text-tx-3">this week</div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center gap-1 text-2xl font-bold">{streak}<IconFlame size={18} className={streak ? 'text-orange-400' : 'text-tx-3'} /></div>
          <div className="text-xs text-tx-3">week streak</div>
        </Card>
        <Card className="p-3">
          <div className="text-2xl font-bold">{fmtCompact(weekVol)}</div>
          <div className="text-xs text-tx-3">{s.unit} lifted</div>
        </Card>
      </div>

      <SectionTitle action={<button onClick={() => setTab('routines')} className="text-sm font-medium text-accent">See all</button>}>Start a routine</SectionTitle>
      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1">
        {s.routines.map((r) => (
          <Card key={r.id} className="w-44 shrink-0 p-4">
            <div className="flex items-center gap-2 text-tx-3"><IconDumbbell size={16} /><span className="text-xs">{r.exercises.length} exercises</span></div>
            <div className="mt-2 truncate text-lg font-semibold">{r.name}</div>
            <div className="mt-1 line-clamp-2 h-10 text-xs text-tx-3">{r.exercises.map((x) => lookup(x.exerciseId)?.name).filter(Boolean).join(', ')}</div>
            <button
              disabled={!!s.active}
              onClick={() => start(r.id)}
              className="mt-3 w-full rounded-lg bg-card-2 py-2 text-sm font-semibold text-accent disabled:opacity-40"
            >
              Start
            </button>
          </Card>
        ))}
        <button onClick={() => setTab('routines')} className="flex w-32 shrink-0 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-line text-sm text-tx-2">
          <IconPlus /> New routine
        </button>
      </div>

      <SectionTitle action={s.history.length > 0 && <button onClick={() => setTab('history')} className="text-sm font-medium text-accent">History</button>}>Recent</SectionTitle>
      {s.history.length === 0 ? (
        <Card className="p-6 text-center text-sm text-tx-2">No workouts yet. Your finished sessions will show up here.</Card>
      ) : (
        <div className="space-y-2">{s.history.slice(0, 3).map((w) => <WorkoutCard key={w.id} w={w} />)}</div>
      )}

      <SectionTitle>Settings</SectionTitle>
      <Card className="divide-y divide-line">
        <div className="flex items-center justify-between px-4 py-3">
          <span>Weight unit</span>
          <div className="flex rounded-lg bg-card-2 p-0.5">
            {(['kg', 'lb'] as const).map((u) => (
              <button key={u} onClick={() => s.setUnit(u)} className={`rounded-md px-3 py-1 text-sm font-semibold ${s.unit === u ? 'bg-accent text-on-accent' : 'text-tx-2'}`}>{u}</button>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between px-4 py-3">
          <span>Default rest</span>
          <select value={s.defaultRest} onChange={(e) => s.setDefaultRest(Number(e.target.value))} className="rounded-lg bg-card-2 px-2 py-1 text-sm">
            {[30, 45, 60, 90, 120, 150, 180, 240].map((r) => <option key={r} value={r}>{fmtClock(r)}</option>)}
          </select>
        </div>
        <div className="flex gap-2 px-4 py-3">
          <button onClick={exportData} className="flex-1 rounded-lg bg-card-2 py-2 text-sm font-medium">Export backup</button>
          <button onClick={() => fileRef.current?.click()} className="flex-1 rounded-lg bg-card-2 py-2 text-sm font-medium">Import backup</button>
          <input ref={fileRef} type="file" accept="application/json" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) void importData(f); e.target.value = '' }} />
        </div>
      </Card>
      <p className="mt-3 px-1 text-xs text-tx-3">Your data is stored on this device. Export a backup to move it to another browser.</p>
    </>
  )
}
