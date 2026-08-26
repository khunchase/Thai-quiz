const XP_PER_LEVEL_BASE = 100;
const LEVEL_GROWTH = 1.15;

export interface LevelProgress {
  level: number;
  into: number;
  span: number;
}

export function xpProgress(xp: number): LevelProgress {
  let level = 1;
  let threshold = XP_PER_LEVEL_BASE;
  let remaining = Math.max(0, xp);
  while (remaining >= threshold) {
    remaining -= threshold;
    level += 1;
    threshold = Math.round(threshold * LEVEL_GROWTH);
  }
  return { level, into: remaining, span: threshold };
}
