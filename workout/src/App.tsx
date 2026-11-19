import type { ComponentType } from 'react'
import { IconChart, IconHistory, IconHome, IconList, IconTimer } from './components/icons'
import { RestBar } from './components/RestBar'
import { SummarySheet } from './components/SummarySheet'
import { fmtClock } from './lib/format'
import { useNow } from './lib/useNow'
import { HistoryPage } from './pages/HistoryPage'
import { HomePage } from './pages/HomePage'
import { ProgressPage } from './pages/ProgressPage'
import { RoutinesPage } from './pages/RoutinesPage'
import { TimerPage } from './pages/TimerPage'
import { WorkoutPage } from './pages/WorkoutPage'
import { useNav, useStore, type Tab } from './store/workout'

const TABS: { id: Tab; label: string; Icon: ComponentType<{ size?: number }>; Page: ComponentType }[] = [
  { id: 'home', label: 'Today', Icon: IconHome, Page: HomePage },
  { id: 'routines', label: 'Routines', Icon: IconList, Page: RoutinesPage },
  { id: 'timer', label: 'Timer', Icon: IconTimer, Page: TimerPage },
  { id: 'history', label: 'History', Icon: IconHistory, Page: HistoryPage },
  { id: 'progress', label: 'Progress', Icon: IconChart, Page: ProgressPage },
]

function ActiveBanner() {
  const active = useStore((s) => s.active)
  const open = useNav((s) => s.setWorkoutOpen)
  const now = useNow(1000, !!active)
  if (!active) return null
  return (
    <button onClick={() => open(true)} className="mb-2 flex w-full items-center justify-between rounded-xl bg-accent px-4 py-2.5 text-on-accent">
      <span className="truncate text-sm font-semibold">▲ {active.name}</span>
      <span className="tabular text-sm font-bold">{fmtClock((now - active.startedAt) / 1000)}</span>
    </button>
  )
}

export default function App() {
  const { tab, setTab, workoutOpen } = useNav()
  const active = useStore((s) => s.active)
  const rest = useStore((s) => s.rest)
  const Page = TABS.find((t) => t.id === tab)!.Page
  const showWorkout = workoutOpen && !!active

  return (
    <>
      <main className="mx-auto max-w-md px-4 pb-44">
        <Page />
      </main>

      {showWorkout && <WorkoutPage />}

      {!showWorkout && (
        <nav className="pb-safe fixed inset-x-0 bottom-0 z-20 border-t border-line bg-bg/90 backdrop-blur-lg">
          <div className="mx-auto max-w-md px-3 pt-2">
            {tab !== 'home' && !rest && <ActiveBanner />}
            <div className="grid grid-cols-5">
              {TABS.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  onClick={() => { setTab(id); window.scrollTo({ top: 0 }) }}
                  className={`flex flex-col items-center gap-0.5 pb-2 pt-1 text-[11px] font-medium ${tab === id ? 'text-accent' : 'text-tx-3'}`}
                  aria-current={tab === id ? 'page' : undefined}
                >
                  <Icon size={22} />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </nav>
      )}

      <RestBar raised={!showWorkout} />
      <SummarySheet />
    </>
  )
}
