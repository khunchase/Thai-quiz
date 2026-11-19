# Rep — Workout Tracker (web)

A mobile-first workout web app. Installable as a PWA and works offline. All data is stored on the device in `localStorage`; use **Export/Import backup** on the Today tab to move it.

## Features
- **Workout logger**: log sets with weight × reps (or reps-only / timed moves). Shows what you did last time and prefills it. Tap ✓ to complete a set, which starts a rest countdown with beeps and vibration.
- **Routines**: starter Push / Pull / Legs / Full Body templates. Create and edit your own with sets, reps, weight and rest per exercise, then start one in a tap.
- **Interval timer**: Tabata, HIIT, EMOM and custom work/rest/rounds. Counts down audibly and keeps the screen awake.
- **Progress**: weekly volume, workouts per week, week streak, estimated 1RM per exercise and personal records. The post-workout summary flags new PRs.
- About 50 built-in exercises, plus custom exercises.

## Develop
```bash
cd workout
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs dist/
```

Stack: React 19, Vite, Tailwind CSS 4, Zustand (persisted), Recharts, vite-plugin-pwa.

Note: the kg/lb setting only changes labels. Values are stored exactly as you enter them.
