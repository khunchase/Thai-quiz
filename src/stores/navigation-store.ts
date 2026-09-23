import { create } from 'zustand';

export type Tab = 'quiz' | 'words' | 'progress' | 'settings';

interface NavigationStore {
  currentTab: Tab;
  setTab: (tab: Tab) => void;
  /** Hides the bottom tab bar while a quiz session is in progress. */
  isQuizActive: boolean;
  setQuizActive: (active: boolean) => void;
  /** Hides the bottom tab bar while a flashcard deck session is in progress. */
  isFlashcardActive: boolean;
  setFlashcardActive: (active: boolean) => void;
}

export const useNavigationStore = create<NavigationStore>((set) => ({
  currentTab: 'quiz',
  setTab: (tab) => set({ currentTab: tab }),
  isQuizActive: false,
  setQuizActive: (active) => set({ isQuizActive: active }),
  isFlashcardActive: false,
  setFlashcardActive: (active) => set({ isFlashcardActive: active }),
}));
