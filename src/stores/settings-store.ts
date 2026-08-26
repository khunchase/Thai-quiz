import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Direction, QuestionType } from '../types/quiz';

export interface QuizSettings {
  enabledTypes: QuestionType[];
  direction: Direction | 'both';
  sessionLength: number;
  scriptPracticeMode: boolean;
  audioEnabled: boolean;
}

const DEFAULT_SETTINGS: QuizSettings = {
  enabledTypes: ['multiple-choice', 'typed', 'flashcard'],
  direction: 'both',
  sessionLength: 15,
  scriptPracticeMode: false,
  audioEnabled: true,
};

interface SettingsStore {
  settings: QuizSettings;
  updateSettings: (partial: Partial<QuizSettings>) => void;
  toggleQuestionType: (type: QuestionType) => void;
  resetSettings: () => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      settings: DEFAULT_SETTINGS,

      updateSettings: (partial) => set((state) => ({ settings: { ...state.settings, ...partial } })),

      toggleQuestionType: (type) => {
        const current = get().settings.enabledTypes;
        const has = current.includes(type);
        if (has && current.length === 1) return;
        const next = has ? current.filter((t) => t !== type) : [...current, type];
        set((state) => ({ settings: { ...state.settings, enabledTypes: next } }));
      },

      resetSettings: () => set({ settings: DEFAULT_SETTINGS }),
    }),
    {
      name: 'thai-quiz-settings',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
