import { create } from 'zustand';

export type Tab = 'practice' | 'phrases' | 'progress' | 'settings';

interface NavigationStore {
  currentTab: Tab;
  setTab: (tab: Tab) => void;
  /** Hides the bottom tab bar while a practice session is running. */
  isSessionActive: boolean;
  setSessionActive: (active: boolean) => void;
}

export const useNavigationStore = create<NavigationStore>((set) => ({
  currentTab: 'practice',
  setTab: (tab) => set({ currentTab: tab }),
  isSessionActive: false,
  setSessionActive: (active) => set({ isSessionActive: active }),
}));
