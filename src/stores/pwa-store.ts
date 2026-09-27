import { create } from 'zustand';

interface PwaStore {
  offlineReady: boolean;
  needRefresh: boolean;
  updateServiceWorker: ((reloadPage?: boolean) => Promise<void>) | null;
  setStatus: (
    offlineReady: boolean,
    needRefresh: boolean,
    updateServiceWorker: (reloadPage?: boolean) => Promise<void>
  ) => void;
}

/** Populated once from the App-level useRegisterSW() call so any screen (e.g. Settings) can read offline status. */
export const usePwaStore = create<PwaStore>((set) => ({
  offlineReady: false,
  needRefresh: false,
  updateServiceWorker: null,
  setStatus: (offlineReady, needRefresh, updateServiceWorker) =>
    set({ offlineReady, needRefresh, updateServiceWorker }),
}));
