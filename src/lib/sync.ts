import { supabase, isSupabaseConfigured } from '../services/supabase';
import { useAuthStore } from '../stores/auth-store';
import { useProgressStore } from '../stores/progress-store';
import { useDeckStore } from '../stores/deck-store';

const PUSH_DEBOUNCE_MS = 1200;

let unsubscribeProgress: (() => void) | null = null;
let unsubscribeDeck: (() => void) | null = null;
let pushTimer: ReturnType<typeof window.setTimeout> | null = null;
let currentUserId: string | null = null;

function schedulePush(userId: string) {
  if (pushTimer) window.clearTimeout(pushTimer);
  pushTimer = window.setTimeout(() => void pushAll(userId), PUSH_DEBOUNCE_MS);
}

async function pushAll(userId: string) {
  if (!supabase) return;
  const progress = useProgressStore.getState();
  const deck = useDeckStore.getState();

  await Promise.all([
    supabase.from('thai_quiz_progress').upsert({
      user_id: userId,
      review_states: progress.reviewStates,
      daily_log: progress.dailyLog,
      xp: progress.xp,
      current_streak: progress.currentStreak,
      longest_streak: progress.longestStreak,
      last_active_date: progress.lastActiveDate,
      updated_at: new Date().toISOString(),
    }),
    supabase.from('thai_quiz_deck').upsert({
      user_id: userId,
      custom_words: deck.customWords,
      custom_categories: deck.customCategories,
      updated_at: new Date().toISOString(),
    }),
  ]);
}

/** On sign-in: pull the account's saved state and overwrite local state with it.
 * A brand-new account has no remote row yet — seed it from whatever is on this device. */
async function pullAndHydrate(userId: string) {
  if (!supabase) return;

  const [{ data: progressRow }, { data: deckRow }] = await Promise.all([
    supabase.from('thai_quiz_progress').select('*').eq('user_id', userId).maybeSingle(),
    supabase.from('thai_quiz_deck').select('*').eq('user_id', userId).maybeSingle(),
  ]);

  if (progressRow) {
    useProgressStore.getState().hydrate({
      reviewStates: progressRow.review_states ?? {},
      dailyLog: progressRow.daily_log ?? {},
      xp: progressRow.xp ?? 0,
      currentStreak: progressRow.current_streak ?? 0,
      longestStreak: progressRow.longest_streak ?? 0,
      lastActiveDate: progressRow.last_active_date ?? null,
    });
  }

  if (deckRow) {
    useDeckStore.getState().hydrate({
      customWords: deckRow.custom_words ?? [],
      customCategories: deckRow.custom_categories ?? [],
    });
  }

  if (!progressRow || !deckRow) {
    await pushAll(userId);
  }
}

function attachLocalWatchers(userId: string) {
  detachLocalWatchers();
  unsubscribeProgress = useProgressStore.subscribe(() => schedulePush(userId));
  unsubscribeDeck = useDeckStore.subscribe(() => schedulePush(userId));
}

function detachLocalWatchers() {
  unsubscribeProgress?.();
  unsubscribeDeck?.();
  unsubscribeProgress = null;
  unsubscribeDeck = null;
}

/** Call once at app startup. No-op if Supabase env vars aren't configured. */
export function initSync() {
  if (!isSupabaseConfigured) return;

  useAuthStore.subscribe((state) => {
    const userId = state.user?.id ?? null;
    if (userId === currentUserId) return;
    currentUserId = userId;
    detachLocalWatchers();

    if (userId) {
      void pullAndHydrate(userId).then(() => attachLocalWatchers(userId));
    }
  });
}
