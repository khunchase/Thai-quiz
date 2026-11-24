import { create } from 'zustand'

interface Ask {
  message: string
  confirmLabel?: string
  danger?: boolean
  /** Info-only: show a single OK button. */
  alert?: boolean
}

interface DialogState {
  current: (Ask & { resolve: (ok: boolean) => void }) | null
}

const useDialog = create<DialogState>(() => ({ current: null }))

/** In-app replacement for window.confirm / alert (which some embedded browsers block). */
export function ask(opts: Ask | string): Promise<boolean> {
  const o = typeof opts === 'string' ? { message: opts } : opts
  return new Promise((resolve) => {
    useDialog.getState().current?.resolve(false)
    useDialog.setState({ current: { ...o, resolve } })
  })
}

export function DialogHost() {
  const current = useDialog((s) => s.current)
  if (!current) return null
  const close = (ok: boolean) => {
    current.resolve(ok)
    useDialog.setState({ current: null })
  }
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-6 backdrop-blur-sm" onClick={() => close(false)}>
      <div role="alertdialog" aria-modal="true" className="sheet-in w-full max-w-xs rounded-2xl border border-line bg-card p-5" onClick={(e) => e.stopPropagation()}>
        <p className="text-base leading-snug">{current.message}</p>
        <div className="mt-5 flex gap-2">
          {!current.alert && (
            <button autoFocus onClick={() => close(false)} className="h-11 flex-1 rounded-xl bg-card-2 font-semibold text-tx-2">Cancel</button>
          )}
          <button
            autoFocus={current.alert}
            onClick={() => close(true)}
            className={`h-11 flex-1 rounded-xl font-semibold ${current.danger ? 'bg-danger text-white' : 'bg-accent text-on-accent'}`}
          >
            {current.confirmLabel ?? 'OK'}
          </button>
        </div>
      </div>
    </div>
  )
}
