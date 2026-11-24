import { useEffect, useRef } from 'react'
import { fmtClock } from '../lib/format'
import { beep, vibrate } from '../lib/sound'
import { useNow } from '../lib/useNow'
import { useStore } from '../store/workout'

/** Floating rest countdown. Mounted globally so it fires even off the workout screen. */
export function RestBar({ raised }: { raised: boolean }) {
  const rest = useStore((s) => s.rest)
  const adjust = useStore((s) => s.adjustRest)
  const clear = useStore((s) => s.clearRest)
  const now = useNow(250, !!rest)
  const lastBeep = useRef<number | null>(null)

  const remaining = rest ? (rest.endsAt - now) / 1000 : 0

  useEffect(() => {
    if (!rest) return
    const sec = Math.ceil(remaining)
    if (remaining <= 0) {
      beep(1046, 450, 0.35)
      vibrate([200, 100, 200])
      clear()
      lastBeep.current = null
    } else if (sec <= 3 && lastBeep.current !== sec) {
      lastBeep.current = sec
      beep(660, 120)
    }
  }, [remaining, rest, clear])

  if (!rest || remaining <= 0) return null
  const pct = Math.min(100, Math.max(0, (remaining / rest.total) * 100))

  return (
    <div className={`fixed inset-x-0 z-40 mx-auto max-w-md px-3 ${raised ? 'bottom-[calc(76px+env(safe-area-inset-bottom))]' : 'bottom-[calc(12px+env(safe-area-inset-bottom))]'}`}>
      <div className="overflow-hidden rounded-2xl border border-rest/30 bg-[#111a2a] shadow-2xl shadow-black/50">
        <div className="h-1 bg-rest/20">
          <div className="h-full bg-rest transition-[width] duration-200 ease-linear" style={{ width: `${pct}%` }} />
        </div>
        <div className="flex items-center gap-2 px-3 py-2.5">
          <div className="flex-1">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-rest">Rest</div>
            <div className="tabular text-2xl font-bold leading-none">{fmtClock(remaining)}</div>
          </div>
          <button onClick={() => adjust(-15)} className="h-10 rounded-xl bg-white/5 px-3 text-sm font-semibold">−15</button>
          <button onClick={() => adjust(15)} className="h-10 rounded-xl bg-white/5 px-3 text-sm font-semibold">+15</button>
          <button onClick={clear} className="h-10 rounded-xl bg-rest px-4 text-sm font-semibold text-[#0b1220]">Skip</button>
        </div>
      </div>
    </div>
  )
}
