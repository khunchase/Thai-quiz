import { useState } from 'react';
import { useSettingsStore } from '../stores/settings-store';
import { useProgressStore } from '../stores/progress-store';
import type { QuestionType, Direction } from '../types/quiz';
import { Card } from '../components/ui/Card';
import { GhostButton, SecondaryButton } from '../components/ui/Button';
import { AccountCard } from '../components/AccountCard';

const TYPE_LABELS: Record<QuestionType, string> = {
  'multiple-choice': 'Multiple choice',
  typed: 'Typed answer',
  flashcard: 'Flashcard',
};

const SESSION_LENGTHS = [10, 15, 20, 30];

export function SettingsPage() {
  const settings = useSettingsStore((s) => s.settings);
  const toggleQuestionType = useSettingsStore((s) => s.toggleQuestionType);
  const updateSettings = useSettingsStore((s) => s.updateSettings);
  const resetProgress = useProgressStore((s) => s.resetProgress);
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Settings</h1>

      <AccountCard />

      <Card>
        <div className="text-txt-secondary text-xs font-semibold uppercase tracking-wide mb-3">Question types</div>
        <div className="flex flex-col gap-2">
          {(Object.keys(TYPE_LABELS) as QuestionType[]).map((type) => (
            <label key={type} className="flex items-center justify-between py-1">
              <span>{TYPE_LABELS[type]}</span>
              <input
                type="checkbox"
                checked={settings.enabledTypes.includes(type)}
                onChange={() => toggleQuestionType(type)}
                className="w-5 h-5 accent-accent"
              />
            </label>
          ))}
        </div>
      </Card>

      <Card>
        <div className="text-txt-secondary text-xs font-semibold uppercase tracking-wide mb-3">Direction</div>
        <div className="flex gap-2">
          {(['both', 'th-en', 'en-th'] as (Direction | 'both')[]).map((dir) => (
            <button
              key={dir}
              onClick={() => updateSettings({ direction: dir })}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold ${
                settings.direction === dir ? 'bg-accent text-app-bg' : 'bg-app-surface text-txt-secondary'
              }`}
            >
              {dir === 'both' ? 'Both' : dir === 'th-en' ? 'TH → EN' : 'EN → TH'}
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <div className="text-txt-secondary text-xs font-semibold uppercase tracking-wide mb-3">Session length</div>
        <div className="flex gap-2">
          {SESSION_LENGTHS.map((len) => (
            <button
              key={len}
              onClick={() => updateSettings({ sessionLength: len })}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold ${
                settings.sessionLength === len ? 'bg-accent text-app-bg' : 'bg-app-surface text-txt-secondary'
              }`}
            >
              {len}
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <label className="flex items-center justify-between py-1">
          <div>
            <div>Thai script practice</div>
            <div className="text-txt-tertiary text-xs mt-0.5">
              Hide romanization hints — read the script directly
            </div>
          </div>
          <input
            type="checkbox"
            checked={settings.scriptPracticeMode}
            onChange={(e) => updateSettings({ scriptPracticeMode: e.target.checked })}
            className="w-5 h-5 accent-accent shrink-0 ml-3"
          />
        </label>
        <label className="flex items-center justify-between py-1 mt-2">
          <div>Audio pronunciation</div>
          <input
            type="checkbox"
            checked={settings.audioEnabled}
            onChange={(e) => updateSettings({ audioEnabled: e.target.checked })}
            className="w-5 h-5 accent-accent shrink-0 ml-3"
          />
        </label>
      </Card>

      <Card>
        {confirmReset ? (
          <div className="flex flex-col gap-3">
            <div className="text-sm text-danger">
              This clears all quiz progress, streaks, and XP. This can't be undone.
            </div>
            <div className="flex gap-2">
              <SecondaryButton
                className="text-danger bg-danger/15"
                onClick={() => {
                  resetProgress();
                  setConfirmReset(false);
                }}
              >
                Confirm reset
              </SecondaryButton>
              <GhostButton onClick={() => setConfirmReset(false)}>Cancel</GhostButton>
            </div>
          </div>
        ) : (
          <GhostButton onClick={() => setConfirmReset(true)} className="text-danger">
            Reset progress
          </GhostButton>
        )}
      </Card>
    </div>
  );
}
