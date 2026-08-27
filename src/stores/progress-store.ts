import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { ReviewState, DailyLogEntry } from '../types/progress';
import type { Grade } from '../types/quiz';
import { createInitialReviewState, scheduleNextReview } from '../lib/srs';
import { todayKey, daysBetweenKeys } from '../lib/date-utils';

const XP_BY_GRADE: Record<Grade, number> = { 0: 0, 1: 2, 2: 4, 3: 6, 4: 10, 5: 12 };

interface ProgressStore {
  reviewStates: Record<string, ReviewState>;
  dailyLog: Record<string, DailyLogEntry>;
  xp: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  recordAnswer: (wordId: string, grade: Grade, correct: boolean) => void;
  resetProgress: () => void;
  hydrate: (data: {
    reviewStates: Record<string, ReviewState>;
    dailyLog: Record<string, DailyLogEntry>;
    xp: number;
    currentStreak: number;
    longestStreak: number;
    lastActiveDate: string | null;
  }) => void;
}

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      reviewStates: {},
      dailyLog: {},
      xp: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: null,

      recordAnswer: (wordId, grade, correct) => {
        const now = Date.now();
        const state = get();
        const prevReview = state.reviewStates[wordId] ?? createInitialReviewState(wordId, now);
        const nextReview = scheduleNextReview(prevReview, grade, now);

        const today = todayKey(new Date(now));
        const prevEntry = state.dailyLog[today] ?? { date: today, reviewed: 0, correct: 0 };
        const nextEntry: DailyLogEntry = {
          date: today,
          reviewed: prevEntry.reviewed + 1,
          correct: prevEntry.correct + (correct ? 1 : 0),
        };

        let currentStreak = state.currentStreak;
        let longestStreak = state.longestStreak;
        let lastActiveDate = state.lastActiveDate;
        if (lastActiveDate !== today) {
          const gap = lastActiveDate ? daysBetweenKeys(lastActiveDate, today) : null;
          currentStreak = gap === 1 ? currentStreak + 1 : 1;
          longestStreak = Math.max(longestStreak, currentStreak);
          lastActiveDate = today;
        }

        set({
          reviewStates: { ...state.reviewStates, [wordId]: nextReview },
          dailyLog: { ...state.dailyLog, [today]: nextEntry },
          xp: state.xp + XP_BY_GRADE[grade],
          currentStreak,
          longestStreak,
          lastActiveDate,
        });
      },

      resetProgress: () =>
        set({ reviewStates: {}, dailyLog: {}, xp: 0, currentStreak: 0, longestStreak: 0, lastActiveDate: null }),

      hydrate: (data) => set(data),
    }),
    {
      name: 'thai-quiz-progress',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
