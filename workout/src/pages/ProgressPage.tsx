import { useMemo, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { IconTrophy } from '../components/icons'
import { Card, PageHeader, SectionTitle } from '../components/ui'
import { fmtCompact, fmtNum, fmtShortDate } from '../lib/format'
import { exerciseSeries, personalRecords, weekStreak, weeklySummary, workoutVolume } from '../lib/stats'
import { useLookup, useStore } from '../store/workout'

const axis = { stroke: '#6b7280', fontSize: 11, tickLine: false, axisLine: false } as const
const tooltip = {
  contentStyle: { background: '#1e2128', border: '1px solid #2a2e37', borderRadius: 12, fontSize: 12 },
  labelStyle: { color: '#a3a9b5' },
  itemStyle: { color: '#f4f5f7' },
  cursor: { fill: 'rgba(255,255,255,0.04)' },
}

function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <Card className="p-3">
      <div className="tabular text-2xl font-bold">{value}</div>
      <div className="text-xs text-tx-3">{label}</div>
    </Card>
  )
}

export function ProgressPage() {
  const history = useStore((s) => s.history)
  const unit = useStore((s) => s.unit)
  const lookup = useLookup()

  const weekly = useMemo(() => weeklySummary(history, lookup, 12), [history, lookup])
  const prs = useMemo(() => personalRecords(history, lookup), [history, lookup])
  const totalVol = useMemo(() => history.reduce((v, w) => v + workoutVolume(w, lookup), 0), [history, lookup])
  const totalMins = history.reduce((m, w) => m + (w.finishedAt ? (w.finishedAt - w.startedAt) / 60000 : 0), 0)

  // Exercises ordered by how often you do them.
  const performed = useMemo(() => {
    const count = new Map<string, number>()
    for (const w of history) for (const we of w.exercises) count.set(we.exerciseId, (count.get(we.exerciseId) ?? 0) + 1)
    return [...count].sort((a, b) => b[1] - a[1]).map(([id]) => id).filter((id) => lookup(id))
  }, [history, lookup])

  const [picked, setPicked] = useState<string | null>(null)
  const exId = picked && performed.includes(picked) ? picked : performed[0]
  const ex = exId ? lookup(exId) : undefined
  const series = useMemo(() => (exId ? exerciseSeries(history, exId) : []), [history, exId])
  const metric: 'e1rm' | 'reps' = ex?.kind === 'weight' ? 'e1rm' : 'reps'
  const metricLabel = ex?.kind === 'weight' ? `Est. 1RM (${unit})` : ex?.kind === 'time' ? 'Best time (s)' : 'Best reps'

  if (history.length === 0) {
    return (
      <>
        <PageHeader title="Progress" />
        <Card className="mt-4 p-8 text-center">
          <IconTrophy size={36} className="mx-auto text-tx-3" />
          <p className="mt-3 font-semibold">No data yet</p>
          <p className="mt-1 text-sm text-tx-2">Finish a couple of workouts and your charts, streaks and personal records will appear here.</p>
        </Card>
      </>
    )
  }

  return (
    <>
      <PageHeader title="Progress" subtitle="Last 12 weeks" />
      <div className="mt-2 grid grid-cols-2 gap-2">
        <Stat value={history.length} label="workouts" />
        <Stat value={`${weekStreak(history)} wk`} label="current streak" />
        <Stat value={fmtCompact(totalVol)} label={`total ${unit} lifted`} />
        <Stat value={`${fmtNum(totalMins / 60)} h`} label="time training" />
      </div>

      <SectionTitle>Weekly volume ({unit})</SectionTitle>
      <Card className="h-56 p-2 pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weekly} margin={{ left: -12, right: 4 }}>
            <CartesianGrid vertical={false} stroke="#2a2e37" />
            <XAxis dataKey="label" {...axis} interval="preserveStartEnd" minTickGap={16} />
            <YAxis {...axis} tickFormatter={(v: number) => (v >= 1000 ? `${fmtNum(v / 1000)}k` : String(v))} width={40} />
            <Tooltip {...tooltip} formatter={(v) => [`${fmtNum(Number(v))} ${unit}`, 'Volume']} />
            <Bar dataKey="volume" fill="#c6f432" radius={[6, 6, 0, 0]} maxBarSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <SectionTitle>Workouts per week</SectionTitle>
      <Card className="flex items-end gap-1.5 p-3">
        {weekly.map((w) => {
          const max = Math.max(1, ...weekly.map((x) => x.workouts))
          return (
            <div key={w.start} className="flex flex-1 flex-col items-center gap-1" title={`${w.label}: ${w.workouts}`}>
              <span className="tabular text-[10px] text-tx-3">{w.workouts || ''}</span>
              <div className="w-full rounded-sm bg-accent/80" style={{ height: `${Math.max(3, (w.workouts / max) * 56)}px`, opacity: w.workouts ? 1 : 0.15 }} />
            </div>
          )
        })}
      </Card>

      {exId && (
        <>
          <SectionTitle>Exercise progress</SectionTitle>
          <Card className="p-3">
            <select value={exId} onChange={(e) => setPicked(e.target.value)} className="h-10 w-full rounded-lg bg-card-2 px-3 font-semibold">
              {performed.map((id) => <option key={id} value={id}>{lookup(id)?.name}</option>)}
            </select>
            {series.length < 2 ? (
              <p className="py-10 text-center text-sm text-tx-2">Log {ex?.name} in at least two workouts to see a trend.</p>
            ) : (
              <div className="mt-3 h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={series} margin={{ left: -12, right: 8, top: 4 }}>
                    <CartesianGrid vertical={false} stroke="#2a2e37" />
                    <XAxis dataKey="date" {...axis} minTickGap={20} />
                    <YAxis {...axis} width={44} domain={['auto', 'auto']} />
                    <Tooltip {...tooltip} formatter={(v) => [fmtNum(Number(v)), metricLabel]} />
                    <Line type="monotone" dataKey={metric} stroke="#c6f432" strokeWidth={2.5} dot={{ r: 3, fill: '#c6f432' }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
            {series.length > 0 && (
              <div className="mt-2 grid grid-cols-3 gap-2 text-center text-xs text-tx-3">
                <div><div className="tabular text-base font-semibold text-tx">{series.length}</div>sessions</div>
                {ex?.kind === 'weight' ? (
                  <>
                    <div><div className="tabular text-base font-semibold text-tx">{fmtNum(Math.max(...series.map((p) => p.top)))}</div>heaviest ({unit})</div>
                    <div><div className="tabular text-base font-semibold text-tx">{fmtNum(Math.max(...series.map((p) => p.e1rm)))}</div>best est. 1RM</div>
                  </>
                ) : (
                  <>
                    <div><div className="tabular text-base font-semibold text-tx">{Math.max(...series.map((p) => p.reps))}</div>best {ex?.kind === 'time' ? 'sec' : 'reps'}</div>
                    <div><div className="tabular text-base font-semibold text-tx">{fmtShortDate(series[series.length - 1].ts)}</div>last done</div>
                  </>
                )}
              </div>
            )}
          </Card>
        </>
      )}

      <SectionTitle>Personal records</SectionTitle>
      <Card className="divide-y divide-line">
        {prs.slice(0, 15).map((p) => {
          const x = lookup(p.exerciseId)
          if (!x) return null
          return (
            <div key={p.exerciseId} className="flex items-center gap-3 px-4 py-3">
              <IconTrophy size={18} className="shrink-0 text-yellow-400" />
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium">{x.name}</div>
                <div className="text-xs text-tx-3">{fmtShortDate(p.ts)}</div>
              </div>
              <div className="tabular text-right text-sm font-semibold">
                {x.kind === 'weight' ? <>{fmtNum(p.weight)} {unit} × {p.reps}<div className="text-xs font-normal text-tx-3">~{fmtNum(p.e1rm)} 1RM</div></>
                  : x.kind === 'time' ? `${p.reps}s` : `${p.reps} reps`}
              </div>
            </div>
          )
        })}
      </Card>
    </>
  )
}
