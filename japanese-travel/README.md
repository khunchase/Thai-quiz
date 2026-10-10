# Travel Japanese 旅の日本語

A mobile-first webapp for travel Japanese, aimed at intermediate (JLPT N3-ish)
learners. It focuses on what staff actually say to you, which is usually keigo,
and on the polite requests you'll want to make. Progress stays in the browser,
and the app installs as an offline PWA.

## Drills

- **👂 Understand**: staff say something; pick what it means.
- **💬 Say it**: given what you want to say, pick the natural Japanese.
- **🎎 Keigo decoder**: rewrite a keigo line in plain です/ます Japanese
  (e.g. お{待}ちいただけますか → {待}ってください).
- **↩️ Respond**: staff say something; pick a natural reply.

Each phrase × drill pair is scheduled on its own with SM-2 spaced repetition.
A session uses each phrase at most once, so one answer can't give away another.

## Content

174 phrases across 10 situations: airport, trains, taxi & bus, hotel & ryokan,
restaurant, konbini, shopping (tax-free), sightseeing, directions, and
trouble & health. Every phrase has furigana (can be turned off). Staff lines
come with a plain-Japanese version, a natural reply, and a note on the keigo
form or a cultural point. Phrases live in `src/data/scenarios/*.ts`. Furigana
markup is `{漢字|かんじ}`.

## Features

- Furigana toggle, listening mode (hides staff text until you answer), and
  Japanese text-to-speech with speed control
- A phrasebook with search in English, kanji, or kana, plus a "Practice"
  button for each situation
- XP, levels, a day streak, a 7-day activity chart, and mastery per situation

## Stack

Vite + React 19 + TypeScript, Tailwind CSS v4, Zustand (persisted to
`localStorage`), vite-plugin-pwa. Shares its design and SRS code with the Thai
quiz in the repo root.

## Development

```bash
cd japanese-travel
npm install
npm run dev
npm run lint
npm run build
```
