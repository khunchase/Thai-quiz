import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Direction } from '../types/quiz';

export interface QuizSettings {
  direction: Direction | 'both';
  sessionLength: number;
  scriptPracticeMode: boolean;
  audioEnabled: boolean;
}

const DEFAULT_SETTINGS: QuizSettings = {
  direction: 'both',
  sessionLength: 15,
  scriptPracticeMode: false,
  audioEnabled: true,
};

interface SettingsStore {
  settings: QuizSettings;
  updateSettings: (partial: Partial<QuizSettings>) => void;
  resetSettings: () => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: DEFAULT_SETTINGS,

      updateSettings: (partial) => set((state) => ({ settings: { ...state.settings, ...partial } })),

      resetSettings: () => set({ settings: DEFAULT_SETTINGS }),
    }),
    {
      name: 'thai-quiz-settings',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
