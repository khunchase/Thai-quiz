import { useAuthStore } from '../stores/auth-store';
import { isSupabaseConfigured } from '../services/supabase';
import { AccentButton, GhostButton } from './ui/Button';
import { Card } from './ui/Card';

export function AccountCard() {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const signInWithGoogle = useAuthStore((s) => s.signInWithGoogle);
  const signOut = useAuthStore((s) => s.signOut);

  if (!isSupabaseConfigured) return null;

  return (
    <Card>
      <div className="text-txt-secondary text-xs font-semibold uppercase tracking-wide mb-3">Account</div>
      {loading ? (
        <div className="text-txt-tertiary text-sm">Checking sign-in status…</div>
      ) : user ? (
        <div className="flex items-center gap-3">
          {user.user_metadata?.avatar_url && (
            <img src={user.user_metadata.avatar_url} alt="" className="w-10 h-10 rounded-full" />
          )}
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold truncate">{user.user_metadata?.full_name ?? user.email}</div>
            <div className="text-txt-tertiary text-xs truncate">{user.email}</div>
          </div>
          <GhostButton onClick={() => signOut()}>Sign out</GhostButton>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="text-txt-tertiary text-xs">
            Sign in to sync your progress across devices. Each Google account keeps its own separate progress.
          </div>
          <AccentButton size="medium" onClick={() => signInWithGoogle()}>
            Sign in with Google
          </AccentButton>
        </div>
      )}
    </Card>
  );
}
