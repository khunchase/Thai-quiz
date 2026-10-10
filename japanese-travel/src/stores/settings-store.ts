import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { QuizMode } from '../types/quiz';
import { ALL_MODES } from '../lib/quiz';

export interface Settings {
  sessionLength: number;
  /** Show readings over kanji. */
  furigana: boolean;
  /** Speak Japanese prompts automatically when a question appears. */
  autoplay: boolean;
  /** Hide the Japanese text of staff lines until you answer — pure listening. */
  listeningMode: boolean;
  speechRate: number;
  /** Last-used practice selection, remembered between visits. */
  modes: QuizMode[];
  scenarioIds: string[] | null;
}

const DEFAULT_SETTINGS: Settings = {
  sessionLength: 15,
  furigana: true,
  autoplay: true,
  listeningMode: false,
  speechRate: 0.9,
  modes: ALL_MODES,
  scenarioIds: null,
};

interface SettingsStore {
  settings: Settings;
  updateSettings: (partial: Partial<Settings>) => void;
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
      name: 'travel-jp-settings',
      storage: createJSONStorage(() => localStorage),
      merge: (persisted, current) => ({
        ...current,
        settings: { ...current.settings, ...(persisted as Partial<SettingsStore>)?.settings },
      }),
    }
  )
);
