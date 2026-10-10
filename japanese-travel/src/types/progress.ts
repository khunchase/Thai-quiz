export interface ReviewState {
  itemId: string;
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
  dueAt: number;
  lastReviewedAt: number | null;
  lapses: number;
}

export interface DailyLogEntry {
  date: string;
  reviewed: number;
  correct: number;
}
