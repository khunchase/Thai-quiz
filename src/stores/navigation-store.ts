import { create } from 'zustand';

export type Tab = 'quiz' | 'words' | 'progress' | 'settings';

interface NavigationStore {
  currentTab: Tab;
  setTab: (tab: Tab) => void;
}

export const useNavigationStore = create<NavigationStore>((set) => ({
  currentTab: 'quiz',
  setTab: (tab) => set({ currentTab: tab }),
}));
