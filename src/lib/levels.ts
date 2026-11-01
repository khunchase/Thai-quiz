import type { WordLevel } from '../types/word';

/** Levels 1–5, roughly following beginner → advanced Thai course levels (≈ CEFR A1 → C1). */
export const WORD_LEVELS: { level: WordLevel; name: string; description: string }[] = [
  { level: 1, name: 'Beginner', description: 'First-weeks survival words: greetings, numbers, basic verbs' },
  { level: 2, name: 'Elementary', description: 'Everyday life: shopping, travel, home, feelings' },
  { level: 3, name: 'Intermediate', description: 'Wider everyday vocabulary and more specific words' },
  { level: 4, name: 'Upper-intermediate', description: 'Formal, abstract and specialised words' },
  { level: 5, name: 'Advanced', description: 'Academic, literary and formal-register words' },
];

export const ALL_LEVELS: WordLevel[] = WORD_LEVELS.map((l) => l.level);
