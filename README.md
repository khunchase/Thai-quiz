# Thai Word Quiz

A mobile-first Thai vocabulary quiz webapp. Mixes multiple-choice, typed-answer,
and flashcard questions in both directions (Thai → English and English → Thai),
schedules review with a spaced-repetition (SM-2) algorithm, and tracks XP,
levels, and streaks. All progress is stored locally in the browser — no
account or backend required.

## Features

- **Mixed question types** — multiple choice, typed answer, and flip
  flashcards, randomly rotated each session.
- **Both directions** — Thai script → English and English → Thai, mixed or
  fixed via Settings.
- **Spaced repetition** — an SM-2 scheduler tracks per-word ease/interval so
  words you struggle with resurface sooner.
- **926-word starter deck** across 23 categories (greetings, numbers, family,
  food, colors, time, verbs, places, animals, adjectives, pronouns, body
  parts, health, clothing, weather & nature, transportation, technology,
  shopping, work, school, emotions, household items, and directions/question
  words), plus a Words tab to add, edit, and delete your own words and
  categories.
- **Audio pronunciation** via the browser's built-in speech synthesis
  (`th-TH` voice when available).
- **Thai script practice mode** — hides romanization hints so you read the
  Thai script directly.
- **Progress dashboard** — level/XP bar, day streak, 7-day activity chart,
  and mastery-by-category breakdown.

## Stack

Vite + React 19 + TypeScript, Tailwind CSS v4, Zustand (persisted to
`localStorage`), Recharts, Framer Motion.

## Development

```bash
npm install
npm run dev      # start dev server
npm run lint      # oxlint
npm run build     # typecheck + production build
```
