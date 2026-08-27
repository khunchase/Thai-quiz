import { create } from 'zustand';
import type { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../services/supabase';

interface AuthStore {
  session: Session | null;
  user: User | null;
  loading: boolean;
  initialized: boolean;
  init: () => void;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  session: null,
  user: null,
  loading: isSupabaseConfigured,
  initialized: false,

  init: () => {
    if (!supabase || get().initialized) return;
    set({ initialized: true });

    supabase.auth.getSession().then(({ data }) => {
      set({ session: data.session, user: data.session?.user ?? null, loading: false });
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, user: session?.user ?? null, loading: false });
    });
  },

  signInWithGoogle: async () => {
    if (!supabase) return;
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
  },

  signOut: async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  },
}));
