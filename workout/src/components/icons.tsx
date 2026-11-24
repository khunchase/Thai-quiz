import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement> & { size?: number }
const base = ({ size = 20, ...p }: P) => ({
  width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
  strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true, ...p,
})

export const IconHome = (p: P) => <svg {...base(p)}><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" /></svg>
export const IconList = (p: P) => <svg {...base(p)}><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>
export const IconTimer = (p: P) => <svg {...base(p)}><circle cx="12" cy="13" r="8" /><path d="M12 9v4l2 2M9 2h6" /></svg>
export const IconHistory = (p: P) => <svg {...base(p)}><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5M12 7v5l3 3" /></svg>
export const IconChart = (p: P) => <svg {...base(p)}><path d="M3 3v18h18" /><path d="m7 15 4-4 3 3 5-6" /></svg>
export const IconPlus = (p: P) => <svg {...base(p)}><path d="M12 5v14M5 12h14" /></svg>
export const IconCheck = (p: P) => <svg {...base(p)} strokeWidth={3}><path d="m5 12 5 5 9-10" /></svg>
export const IconX = (p: P) => <svg {...base(p)}><path d="M18 6 6 18M6 6l12 12" /></svg>
export const IconTrash = (p: P) => <svg {...base(p)}><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" /></svg>
export const IconUp = (p: P) => <svg {...base(p)}><path d="m6 15 6-6 6 6" /></svg>
export const IconDown = (p: P) => <svg {...base(p)}><path d="m6 9 6 6 6-6" /></svg>
export const IconPlay = (p: P) => <svg {...base(p)} fill="currentColor"><path d="M7 4v16l13-8z" /></svg>
export const IconPause = (p: P) => <svg {...base(p)} fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
export const IconReset = (p: P) => <svg {...base(p)}><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></svg>
export const IconSkip = (p: P) => <svg {...base(p)}><path d="m5 4 10 8-10 8zM19 5v14" /></svg>
export const IconSearch = (p: P) => <svg {...base(p)}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
export const IconTrophy = (p: P) => <svg {...base(p)}><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3" /></svg>
export const IconFlame = (p: P) => <svg {...base(p)}><path d="M12 22a7 7 0 0 0 7-7c0-4-3-6-4-10-2 2-3 4-3 6-1-1-2-2-2-4-2 2-5 5-5 8a7 7 0 0 0 7 7z" /></svg>
export const IconDumbbell = (p: P) => <svg {...base(p)}><path d="M6 7v10M3 9v6M18 7v10M21 9v6M6 12h12" /></svg>
export const IconEdit = (p: P) => <svg {...base(p)}><path d="M4 20h4L19 9l-4-4L4 16z" /></svg>
