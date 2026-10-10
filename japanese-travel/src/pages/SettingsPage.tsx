import type { ReactNode } from 'react';
import { useSettingsStore } from '../stores/settings-store';
import { useProgressStore } from '../stores/progress-store';
import { isSpeechSupported, speakJapanese } from '../lib/speech';
import { Card } from '../components/ui/Card';
import { Furigana } from '../components/Furigana';

function Toggle({ label, hint, value, onChange }: { label: string; hint?: ReactNode; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!value)} className="flex items-center gap-3 w-full text-left py-2">
      <span className="flex-1">
        <span className="block text-sm font-semibold">{label}</span>
        {hint && <span className="block text-xs text-txt-tertiary mt-0.5">{hint}</span>}
      </span>
      <span className={`w-11 h-6 rounded-full p-0.5 transition-colors ${value ? 'bg-accent' : 'bg-app-surface'}`}>
        <span className={`block w-5 h-5 rounded-full bg-txt-primary transition-transform ${value ? 'translate-x-5' : ''}`} />
      </span>
    </button>
  );
}

function Segmented<T extends number>({ options, value, onChange, format }: { options: T[]; value: T; onChange: (v: T) => void; format: (v: T) => string }) {
  return (
    <div className="flex gap-2">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold ${value === o ? 'bg-accent text-app-bg' : 'bg-app-surface text-txt-secondary'}`}
        >
          {format(o)}
        </button>
      ))}
    </div>
  );
}

export function SettingsPage() {
  const { settings, updateSettings } = useSettingsStore();
  const resetProgress = useProgressStore((s) => s.resetProgress);

  return (
    <div className="flex-1 min-h-0 flex flex-col p-4 gap-4 overflow-y-auto">
      <h1 className="text-2xl font-bold">Settings</h1>

      <Card>
        <Toggle
          label="Furigana"
          hint={<Furigana markup="{予約|よやく}をお{願|ねが}いします" show={settings.furigana} />}
          value={settings.furigana}
          onChange={(v) => updateSettings({ furigana: v })}
        />
        <Toggle
          label="Listening mode"
          hint="Hide what staff say until you answer — train your ear."
          value={settings.listeningMode}
          onChange={(v) => updateSettings({ listeningMode: v })}
        />
        <Toggle
          label="Auto-play audio"
          value={settings.autoplay}
          onChange={(v) => updateSettings({ autoplay: v })}
        />
      </Card>

      <Card>
        <div className="text-txt-secondary text-xs font-semibold uppercase tracking-wide mb-3">Questions per session</div>
        <Segmented options={[10, 15, 20, 30]} value={settings.sessionLength} onChange={(v) => updateSettings({ sessionLength: v })} format={String} />
      </Card>

      <Card>
        <div className="text-txt-secondary text-xs font-semibold uppercase tracking-wide mb-3">Speech speed</div>
        <Segmented
          options={[0.7, 0.9, 1.1]}
          value={settings.speechRate}
          onChange={(v) => {
            updateSettings({ speechRate: v });
            speakJapanese('お{待|ま}たせいたしました', v);
          }}
          format={(v) => (v < 0.8 ? 'Slow' : v < 1 ? 'Normal' : 'Native')}
        />
        {!isSpeechSupported() && <div className="text-danger text-xs mt-2">This browser has no speech synthesis.</div>}
      </Card>

      <Card>
        <button
          onClick={() => {
            if (confirm('Reset all progress? This cannot be undone.')) resetProgress();
          }}
          className="text-danger font-semibold text-sm"
        >
          Reset progress
        </button>
      </Card>

      <div className="text-txt-tertiary text-xs text-center pb-2">
        Progress is saved on this device. Install to your home screen to use offline.
      </div>
    </div>
  );
}
