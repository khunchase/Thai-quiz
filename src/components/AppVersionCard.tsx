import { useState } from 'react';
import { Card } from './ui/Card';
import { GhostButton, SecondaryButton } from './ui/Button';
import {
  CURRENT_BUILD,
  fetchLatestBuild,
  formatBuiltAt,
  isSameBuild,
  reloadLatest,
  type BuildInfo,
} from '../lib/app-version';

type CheckState =
  | { kind: 'idle' }
  | { kind: 'checking' }
  | { kind: 'latest' }
  | { kind: 'available'; latest: BuildInfo }
  | { kind: 'error' }
  | { kind: 'updating' };

export function AppVersionCard() {
  const [state, setState] = useState<CheckState>({ kind: 'idle' });

  const check = async () => {
    setState({ kind: 'checking' });
    try {
      const latest = await fetchLatestBuild();
      setState(isSameBuild(latest, CURRENT_BUILD) ? { kind: 'latest' } : { kind: 'available', latest });
    } catch {
      setState({ kind: 'error' });
    }
  };

  const update = () => {
    setState({ kind: 'updating' });
    void reloadLatest();
  };

  return (
    <Card>
      <div className="text-txt-secondary text-xs font-semibold uppercase tracking-wide mb-3">App version</div>

      <div className="flex items-baseline justify-between gap-3">
        <div className="font-mono text-sm">{CURRENT_BUILD.version}</div>
        <div className="text-txt-tertiary text-xs">Built {formatBuiltAt(CURRENT_BUILD.builtAt)}</div>
      </div>

      <div className="mt-3">
        {state.kind === 'latest' && (
          <div className="flex items-center gap-2 text-success text-sm font-semibold">
            <span>✓</span>
            <span>You're on the latest version</span>
          </div>
        )}
        {state.kind === 'available' && (
          <div className="flex flex-col gap-2">
            <div className="text-sm">
              New version available:{' '}
              <span className="font-mono">{state.latest.version}</span>
              <span className="text-txt-tertiary text-xs"> · {formatBuiltAt(state.latest.builtAt)}</span>
            </div>
            <SecondaryButton onClick={update}>Update now</SecondaryButton>
          </div>
        )}
        {state.kind === 'error' && (
          <div className="text-txt-secondary text-sm">Couldn't reach the server. Check your connection and try again.</div>
        )}
        {state.kind === 'updating' && <div className="text-txt-secondary text-sm">Updating…</div>}
      </div>

      {state.kind !== 'available' && state.kind !== 'updating' && (
        <div className="mt-3 flex items-center justify-between gap-3">
          <SecondaryButton onClick={check} disabled={state.kind === 'checking'}>
            {state.kind === 'checking' ? 'Checking…' : 'Check for updates'}
          </SecondaryButton>
          <GhostButton onClick={update} className="text-xs">
            Force reload
          </GhostButton>
        </div>
      )}
      <div className="text-txt-tertiary text-[11px] mt-2">
        Updating only reloads the app's files — your progress and words are kept.
      </div>
    </Card>
  );
}
