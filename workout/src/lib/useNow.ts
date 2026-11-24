import { useEffect, useState } from 'react'

/** Re-renders every `ms` while `active`, returning the current timestamp. */
export function useNow(ms = 1000, active = true): number {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (!active) return
    setNow(Date.now())
    const id = setInterval(() => setNow(Date.now()), ms)
    return () => clearInterval(id)
  }, [ms, active])
  return now
}
