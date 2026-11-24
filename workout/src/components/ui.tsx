import { useEffect, type ReactNode } from 'react'
import { IconX } from './icons'

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-line bg-card ${className}`}>{children}</div>
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-2 mt-6 flex items-center justify-between px-1">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-tx-3">{children}</h2>
      {action}
    </div>
  )
}

export function PageHeader({ title, subtitle, right }: { title: string; subtitle?: string; right?: ReactNode }) {
  return (
    <header className="pt-safe flex items-end justify-between gap-3 pb-2 pt-6">
      <div>
        <h1 className="text-[28px] font-bold leading-tight tracking-tight">{title}</h1>
        {subtitle && <p className="mt-0.5 text-sm text-tx-2">{subtitle}</p>}
      </div>
      {right}
    </header>
  )
}

/** Bottom sheet on phones, centered dialog on wider screens. */
export function Sheet({ open, onClose, title, children, full = false }: { open: boolean; onClose: () => void; title: string; children: ReactNode; full?: boolean }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center" onClick={onClose}>
      <div
        role="dialog"
        aria-label={title}
        className={`sheet-in pb-safe flex w-full max-w-md flex-col overflow-hidden rounded-t-3xl border border-line bg-card sm:rounded-3xl ${full ? 'h-[92dvh]' : 'max-h-[88dvh]'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="-mr-2 rounded-full p-2 text-tx-2 hover:bg-card-2" aria-label="Close">
            <IconX />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}

export function Stepper({ label, value, onChange, step = 1, min = 0, max = 9999, format }: {
  label: string; value: number; onChange: (v: number) => void; step?: number; min?: number; max?: number; format?: (v: number) => string
}) {
  const clamp = (v: number) => Math.min(max, Math.max(min, v))
  return (
    <div className="flex items-center justify-between rounded-xl bg-card-2 px-3 py-2">
      <span className="text-sm text-tx-2">{label}</span>
      <div className="flex items-center gap-1">
        <button className="h-9 w-9 rounded-lg bg-line text-lg font-semibold active:scale-95" onClick={() => onChange(clamp(value - step))} aria-label={`Decrease ${label}`}>−</button>
        <span className="tabular w-16 text-center text-base font-semibold">{format ? format(value) : value}</span>
        <button className="h-9 w-9 rounded-lg bg-line text-lg font-semibold active:scale-95" onClick={() => onChange(clamp(value + step))} aria-label={`Increase ${label}`}>+</button>
      </div>
    </div>
  )
}
