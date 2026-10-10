import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/** Thai letterform style used everywhere: looped (traditional) or loopless (modern). */
export type ThaiFontStyle = 'looped' | 'loopless';

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
  thaiFontStyle: 'looped',
};

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
      version: 1,
      // v0 had a 'both' style that stacked looped above loopless; it's now looped-only.
      migrate: (persisted, version) => {
        const state = persisted as { settings: Omit<QuizSettings, 'thaiFontStyle'> & { thaiFontStyle: string } };
        if (version < 1 && state.settings.thaiFontStyle === 'both') state.settings.thaiFontStyle = 'looped';
        return state as unknown as SettingsStore;
      },
    }
  )
);
