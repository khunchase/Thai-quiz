import { useEffect, useMemo, useRef, useState } from 'react'
import { IconPause, IconPlay, IconReset, IconSkip } from '../components/icons'
import { Card, PageHeader, Stepper } from '../components/ui'
import { fmtClock } from '../lib/format'
import { beep, unlockAudio, vibrate } from '../lib/sound'
import { useNow } from '../lib/useNow'

interface Config { prep: number; work: number; rest: number; rounds: number }
type PhaseType = 'prep' | 'work' | 'rest'
interface Phase { type: PhaseType; dur: number; round: number }
type Status = 'idle' | 'running' | 'paused' | 'done'

const PRESETS: { name: string; desc: string; cfg: Config }[] = [
  { name: 'Tabata', desc: '20s on / 10s off × 8', cfg: { prep: 10, work: 20, rest: 10, rounds: 8 } },
  { name: 'HIIT', desc: '40s on / 20s off × 10', cfg: { prep: 10, work: 40, rest: 20, rounds: 10 } },
  { name: 'EMOM', desc: 'Every minute × 10', cfg: { prep: 10, work: 60, rest: 0, rounds: 10 } },
  { name: 'Long intervals', desc: '3 min on / 1 min off × 5', cfg: { prep: 10, work: 180, rest: 60, rounds: 5 } },
]

const STORAGE_KEY = 'rep-timer-config'
function loadConfig(): Config {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...PRESETS[0].cfg, ...JSON.parse(raw) }
  } catch { /* storage unavailable */ }
  return PRESETS[0].cfg
}

const PHASE_STYLE: Record<PhaseType, { label: string; color: string; bg: string }> = {
  prep: { label: 'Get ready', color: '#facc15', bg: 'rgba(250,204,21,0.08)' },
  work: { label: 'Work', color: '#c6f432', bg: 'rgba(198,244,50,0.08)' },
  rest: { label: 'Rest', color: '#60a5fa', bg: 'rgba(96,165,250,0.08)' },
}

function buildPhases(c: Config): Phase[] {
  const out: Phase[] = []
  if (c.prep > 0) out.push({ type: 'prep', dur: c.prep, round: 1 })
  for (let i = 1; i <= c.rounds; i++) {
    out.push({ type: 'work', dur: c.work, round: i })
    if (i < c.rounds && c.rest > 0) out.push({ type: 'rest', dur: c.rest, round: i })
  }
  return out
}

function useWakeLock(on: boolean) {
  useEffect(() => {
    if (!on || !('wakeLock' in navigator)) return
    let lock: WakeLockSentinel | null = null
    let cancelled = false
    navigator.wakeLock.request('screen').then((l) => { if (cancelled) void l.release(); else lock = l }).catch(() => {})
    return () => { cancelled = true; void lock?.release() }
  }, [on])
}

export function TimerPage() {
  const [cfg, setCfg] = useState<Config>(loadConfig)
  const phases = useMemo(() => buildPhases(cfg), [cfg])
  const [status, setStatus] = useState<Status>('idle')
  const [idx, setIdx] = useState(0)
  const [endsAt, setEndsAt] = useState(0)
  const [pausedLeft, setPausedLeft] = useState(0)
  const lastBeep = useRef<string>('')
  const now = useNow(100, status === 'running')
  useWakeLock(status === 'running')

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg)) } catch { /* ignore */ }
  }, [cfg])

  const phase = phases[Math.min(idx, phases.length - 1)]
  const leftMs = status === 'running' ? endsAt - now : status === 'paused' ? pausedLeft : status === 'done' ? 0 : (phase?.dur ?? 0) * 1000

  const announce = (p: Phase | undefined) => {
    if (!p) return
    if (p.type === 'work') { beep(1046, 350, 0.35); vibrate(250) }
    else { beep(523, 350, 0.3); vibrate([100, 80, 100]) }
  }

  // Advance through phases, anchored to the previous end time so there's no drift.
  useEffect(() => {
    if (status !== 'running') return
    if (now >= endsAt) {
      const next = idx + 1
      if (next >= phases.length) {
        setStatus('done')
        beep(1318, 700, 0.4)
        vibrate([300, 120, 300, 120, 300])
        return
      }
      setIdx(next)
      setEndsAt(endsAt + phases[next].dur * 1000)
      announce(phases[next])
      return
    }
    const sec = Math.ceil((endsAt - now) / 1000)
    const key = `${idx}:${sec}`
    if (sec <= 3 && sec >= 1 && lastBeep.current !== key) {
      lastBeep.current = key
      beep(784, 110, 0.25)
    }
  }, [now, status, endsAt, idx, phases])

  const start = () => {
    unlockAudio()
    if (status === 'paused') {
      setEndsAt(Date.now() + pausedLeft)
    } else {
      setIdx(0)
      setEndsAt(Date.now() + phases[0].dur * 1000)
      announce(phases[0])
    }
    setStatus('running')
  }
  const pause = () => { setPausedLeft(Math.max(0, endsAt - Date.now())); setStatus('paused') }
  const reset = () => { setStatus('idle'); setIdx(0) }
  const skip = () => {
    if (status === 'running') setEndsAt(Date.now())
    else if (status === 'paused') {
      const next = idx + 1
      if (next >= phases.length) setStatus('done')
      else { setIdx(next); setPausedLeft(phases[next].dur * 1000) }
    }
  }

  const totalSec = phases.reduce((n, p) => n + p.dur, 0)
  const remainingTotal = status === 'idle' ? totalSec : status === 'done' ? 0 : leftMs / 1000 + phases.slice(idx + 1).reduce((n, p) => n + p.dur, 0)
  const style = status === 'done' ? { label: 'Done!', color: '#c6f432', bg: 'rgba(198,244,50,0.12)' } : PHASE_STYLE[phase?.type ?? 'work']
  const R = 120, C = 2 * Math.PI * R
  const frac = status === 'idle' ? 1 : status === 'done' ? 0 : Math.max(0, Math.min(1, leftMs / 1000 / (phase?.dur || 1)))
  const editing = status === 'idle' || status === 'done'

  return (
    <>
      <PageHeader title="Interval Timer" subtitle={`Total ${fmtClock(totalSec)} · ${cfg.rounds} rounds`} />

      <div className="mt-2 rounded-3xl p-4 transition-colors" style={{ background: style.bg }}>
        <div className="relative mx-auto aspect-square w-full max-w-[300px]">
          <svg viewBox="0 0 280 280" className="h-full w-full -rotate-90">
            <circle cx="140" cy="140" r={R} fill="none" stroke="#2a2e37" strokeWidth="14" />
            <circle
              cx="140" cy="140" r={R} fill="none" stroke={style.color} strokeWidth="14" strokeLinecap="round"
              strokeDasharray={C} strokeDashoffset={C * (1 - frac)}
              style={{ transition: status === 'running' ? 'stroke-dashoffset 0.1s linear' : 'none' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-sm font-bold uppercase tracking-[0.2em]" style={{ color: style.color }}>{style.label}</div>
            <div className="tabular text-7xl font-bold tracking-tight">{fmtClock(leftMs / 1000)}</div>
            <div className="mt-1 text-sm text-tx-2">
              {status === 'done' ? `${cfg.rounds} rounds complete` : `Round ${phase?.round ?? 1} / ${cfg.rounds}`}
            </div>
            {!editing && <div className="tabular mt-0.5 text-xs text-tx-3">{fmtClock(remainingTotal)} left</div>}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center gap-4">
          <button onClick={reset} disabled={status === 'idle'} className="flex h-14 w-14 items-center justify-center rounded-full bg-card-2 text-tx-2 disabled:opacity-30" aria-label="Reset">
            <IconReset />
          </button>
          {status === 'running' ? (
            <button onClick={pause} className="flex h-20 w-20 items-center justify-center rounded-full bg-tx text-bg active:scale-95" aria-label="Pause"><IconPause size={30} /></button>
          ) : (
            <button onClick={start} className="flex h-20 w-20 items-center justify-center rounded-full bg-accent text-on-accent active:scale-95" aria-label="Start"><IconPlay size={30} /></button>
          )}
          <button onClick={skip} disabled={editing} className="flex h-14 w-14 items-center justify-center rounded-full bg-card-2 text-tx-2 disabled:opacity-30" aria-label="Skip phase">
            <IconSkip />
          </button>
        </div>
      </div>

      {editing && (
        <>
          <div className="-mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-1">
            {PRESETS.map((p) => {
              const on = JSON.stringify(p.cfg) === JSON.stringify(cfg)
              return (
                <button key={p.name} onClick={() => { setCfg(p.cfg); setStatus('idle') }} className={`shrink-0 rounded-xl border px-3 py-2 text-left ${on ? 'border-accent bg-accent/10' : 'border-line bg-card'}`}>
                  <div className={`text-sm font-semibold ${on ? 'text-accent' : ''}`}>{p.name}</div>
                  <div className="text-xs text-tx-3">{p.desc}</div>
                </button>
              )
            })}
          </div>
          <Card className="mt-3 space-y-2 p-3">
            <Stepper label="Work" value={cfg.work} step={5} min={5} max={3600} format={fmtClock} onChange={(work) => setCfg({ ...cfg, work })} />
            <Stepper label="Rest" value={cfg.rest} step={5} min={0} max={3600} format={fmtClock} onChange={(rest) => setCfg({ ...cfg, rest })} />
            <Stepper label="Rounds" value={cfg.rounds} min={1} max={99} onChange={(rounds) => setCfg({ ...cfg, rounds })} />
            <Stepper label="Get ready" value={cfg.prep} step={5} min={0} max={60} format={fmtClock} onChange={(prep) => setCfg({ ...cfg, prep })} />
          </Card>
          <p className="mt-3 px-1 text-xs text-tx-3">Beeps on the last 3 seconds of every phase. The screen stays awake while the timer runs.</p>
        </>
      )}
    </>
  )
}
