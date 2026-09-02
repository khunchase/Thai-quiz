import type { Word } from '../types/word';
import type { ReviewState } from '../types/progress';

/**
 * A tier is unlocked once every word in the tier below it has been
 * successfully recalled at least once (repetitions >= 1 — SM-2 resets
 * repetitions to 0 on a miss, so this means "got it right, at least once").
 * Tier 1 is always unlocked.
 */
export function isLevelUnlocked(level: number, allWords: Word[], reviewStates: Record<string, ReviewState>): boolean {
  if (level <= 1) return true;
  const previousTierWords = allWords.filter((w) => w.level === level - 1);
  if (previousTierWords.length === 0) return true;
  return previousTierWords.every((w) => (reviewStates[w.id]?.repetitions ?? 0) >= 1);
}

export function levelMasteryCount(level: number, allWords: Word[], reviewStates: Record<string, ReviewState>) {
  const words = allWords.filter((w) => w.level === level);
  const mastered = words.filter((w) => (reviewStates[w.id]?.repetitions ?? 0) >= 1).length;
  return { mastered, total: words.length };
}
