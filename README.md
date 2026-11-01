# Thai Word Quiz

A mobile-first Thai vocabulary quiz webapp. Mixes multiple-choice, typed-answer,
and flashcard questions in both directions (Thai → English and English → Thai),
schedules review with a spaced-repetition (SM-2) algorithm, and tracks XP,
levels, and streaks. All progress is stored locally in the browser — no
account or backend required.

## Features

- **Mixed question types** — multiple choice, typed answer, and flip
  flashcards, randomly rotated each session.
- **Multiple-choice quiz modes** — *Words* (pick a word's
  meaning) and *Sentences*: fill-in-the-blank sentences (clause ___ clause) for
  37 Thai conjunctions and connectors (เมื่อ, ก่อนที่, หลังจากที่, ตราบใดที่,
  เท่าที่, แม้ว่า, ก็เลย…). The English translation highlights the
  relationship ("[When] I was young…") and you pick the Thai word that fits;
  wrong options always express a different relationship.
- **Order quiz** — rebuild a Thai sentence from its shuffled word blocks to
  match the English ("What do you like to eat?" → คุณ ชอบ กิน อะไร). Tap a
  block to place it, tap again to send it back; equally natural orders (time
  words first or last) count as right. 64 sentences covering classifiers,
  question words, particles and everyday verbs.
- **Both directions** — Thai script → English and English → Thai, mixed or
  fixed via Settings.
- **Spaced repetition** — an SM-2 scheduler tracks per-word ease/interval so
  words you struggle with resurface sooner.
- **1,600+ word starter deck**, levels 1–5 on every word except the connectors, across 28 categories (greetings, numbers, family,
  food, colors, time, verbs, places, animals, adjectives, pronouns, body
  parts, health, clothing, weather & nature, transportation, technology,
  shopping, work, school, emotions, household items, directions/question
  words, and conjunctions & connectors), plus a Words tab to add, edit, and delete your own words and
  categories.
- **Textbook romanization** — pronunciations follow the Thai Language
  Station convention (khɔ̀ɔp khun, chɯ̂ɯ, rooŋ riian); typed answers also
  accept plain-keyboard spellings (khop khun, chue, rong rian).
- **Word breakdowns** — compound words list the smaller words they're made
  of under the word's details (น้ำตก → น้ำ water + ตก fall), for about 750
  words.
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
