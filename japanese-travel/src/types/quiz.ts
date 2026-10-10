import type { Phrase } from './phrase';

/**
 * understand: staff line → its meaning
 * say:        an English intent → the Japanese you'd say
 * keigo:      a keigo line → the same thing in plain です/ます
 * respond:    staff line → a natural reply
 */
export type QuizMode = 'understand' | 'say' | 'keigo' | 'respond';

export interface QuizOption {
  /** Furigana markup for Japanese options, plain English otherwise. */
  text: string;
  correct: boolean;
}

export interface QuizQuestion {
  id: string;
  /** SRS key: `${mode}:${phrase.id}` — each skill is scheduled separately. */
  itemId: string;
  mode: QuizMode;
  phrase: Phrase;
  options: QuizOption[];
}

/** SM-2 style recall grade: 0-2 fail/hard, 3-5 pass, higher is better recall. */
export type Grade = 0 | 1 | 2 | 3 | 4 | 5;
