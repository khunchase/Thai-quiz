import type { ReviewState } from '../types/progress';
import type { Grade } from '../types/quiz';

const DAY_MS = 24 * 60 * 60 * 1000;

export function createInitialReviewState(wordId: string, now = Date.now()): ReviewState {
  return {
    wordId,
    easeFactor: 2.5,
    intervalDays: 0,
    repetitions: 0,
    dueAt: now,
    lastReviewedAt: null,
    lapses: 0,
  };
}

/** Share of its gap a word keeps after a wrong answer... */
const LAPSE_KEEP = 1 / 3;
/** ...up to this many days, so a miss always shows on the % (3 days reads 66%). */
const LAPSE_MAX_DAYS = 3;

/**
 * SM-2 style scheduling. Grade is 0-5 recall quality; >=3 counts as a
 * successful recall. A correct answer only earns the full step up once the
 * word's gap has actually passed: answering it again sooner grows the gap by
 * the share of it that did pass, so cramming can't inflate a word. A wrong
 * answer cuts the gap to a third (at most 3 days) instead of starting over.
 */
export function scheduleNextReview(state: ReviewState, grade: Grade, now = Date.now()): ReviewState {
  const correct = grade >= 3;
  const easeChange = 0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02);
  let { easeFactor, intervalDays, repetitions, lapses } = state;

  if (!correct) {
    easeFactor = Math.max(1.3, easeFactor + easeChange);
    repetitions = 0;
    intervalDays = Math.min(LAPSE_MAX_DAYS, Math.round(intervalDays * LAPSE_KEEP));
    lapses += 1;
  } else if (intervalDays === 0) {
    repetitions += 1;
    intervalDays = 1;
    easeFactor = Math.max(1.3, easeFactor + easeChange);
  } else {
    const elapsedDays = state.lastReviewedAt === null ? intervalDays : (now - state.lastReviewedAt) / DAY_MS;
    const credit = Math.min(1, elapsedDays / intervalDays);
    const fullStep = Math.max(6, intervalDays * easeFactor);
    repetitions += 1;
    intervalDays = Math.max(intervalDays, Math.round(intervalDays + (fullStep - intervalDays) * credit));
    easeFactor = Math.max(1.3, easeFactor + easeChange * credit);
  }

  return {
    ...state,
    easeFactor,
    intervalDays,
    repetitions,
    lapses,
    lastReviewedAt: now,
    dueAt: now + intervalDays * DAY_MS,
  };
}

/** Review gap at which a word reads 100% learned. */
const LEARNED_INTERVAL_DAYS = 7;

/** Once a word is overdue, its % halves every this many of its own gaps. */
const DECAY_HALF_LIFE_GAPS = 2;

/**
 * How well a word is learned, 0-100. Climbs steeply at first and slows
 * toward a 7-day gap; once the word is past its review date it fades again.
 */
export function learnedPercent(state: ReviewState | undefined, now = Date.now()): number {
  if (!state || state.intervalDays === 0) return 0;
  const reached = Math.min(1, Math.log1p(state.intervalDays) / Math.log1p(LEARNED_INTERVAL_DAYS));
  const overdueDays = Math.max(0, (now - state.dueAt) / DAY_MS);
  const fade = 0.5 ** (overdueDays / (state.intervalDays * DECAY_HALF_LIFE_GAPS));
  // Rounded down, so a word reads 100% only while it's fully learned and not yet overdue.
  return Math.floor(reached * fade * 100);
}

/** % at which a word counts as known everywhere in the app. */
export const KNOWN_PERCENT = 50;

export function isKnown(state: ReviewState | undefined, now = Date.now()): boolean {
  return learnedPercent(state, now) >= KNOWN_PERCENT;
}

/** At 100%: left out of the quiz until it fades. */
export function isFullyLearned(state: ReviewState | undefined, now = Date.now()): boolean {
  return learnedPercent(state, now) >= 100;
}

export function isDue(state: ReviewState, now = Date.now()): boolean {
  return state.dueAt <= now;
}

export function gradeForMultipleChoice(correct: boolean): Grade {
  return correct ? 4 : 1;
}

export function gradeForTyped(correct: boolean): Grade {
  return correct ? 5 : 0;
}

/** Explicit "I don't know" give-up — worse than a wrong guess, no recall at all. */
export const GRADE_GIVE_UP: Grade = 0;

/** Explicit "I already know this" tag (e.g. a swipe) — a confident recall. */
export const GRADE_KNOWN: Grade = 4;

export type FlashcardRating = 'again' | 'hard' | 'good' | 'easy';

export function gradeForFlashcard(rating: FlashcardRating): Grade {
  switch (rating) {
    case 'again':
      return 0;
    case 'hard':
      return 3;
    case 'good':
      return 4;
    case 'easy':
      return 5;
  }
}
