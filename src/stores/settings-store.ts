import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * 'both' shows looped (traditional) and loopless (modern) side by side —
 * see ThaiWord. 'looped' / 'loopless' pick one style everywhere, including
 * single-line spots (typing input, word list, breakdown parts) that can't
 * show both at once.
 */
export type ThaiFontStyle = 'both' | 'looped' | 'loopless';

export interface QuizSettings {
  sessionLength: number;
  scriptPracticeMode: boolean;
  audioEnabled: boolean;
  thaiFontStyle: ThaiFontStyle;
}

const DEFAULT_SETTINGS: QuizSettings = {
  sessionLength: 15,
  scriptPracticeMode: false,
  audioEnabled: true,
  thaiFontStyle: 'both',
};

/** Font class for contexts that can only show one Thai font style at a time. */
export function singleThaiFontClass(style: ThaiFontStyle): string {
  return style === 'loopless' ? 'font-thai' : 'font-thai-looped';
}

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
