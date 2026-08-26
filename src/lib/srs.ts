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

/**
 * SM-2 spaced repetition scheduling. Grade is 0-5 recall quality;
 * >=3 counts as a successful recall, below that resets the streak.
 */
export function scheduleNextReview(state: ReviewState, grade: Grade, now = Date.now()): ReviewState {
  const correct = grade >= 3;
  let easeFactor = Math.max(1.3, state.easeFactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02)));
  let repetitions = state.repetitions;
  let intervalDays = state.intervalDays;
  let lapses = state.lapses;

  if (!correct) {
    repetitions = 0;
    intervalDays = 1;
    lapses += 1;
  } else {
    repetitions += 1;
    if (repetitions === 1) intervalDays = 1;
    else if (repetitions === 2) intervalDays = 6;
    else intervalDays = Math.round(intervalDays * easeFactor);
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

export function isDue(state: ReviewState, now = Date.now()): boolean {
  return state.dueAt <= now;
}

export function gradeForMultipleChoice(correct: boolean): Grade {
  return correct ? 4 : 1;
}

export function gradeForTyped(correct: boolean): Grade {
  return correct ? 5 : 0;
}

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
