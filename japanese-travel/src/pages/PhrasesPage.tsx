import { useMemo, useState } from 'react';
import { allPhrases, scenarioById, scenarios } from '../data';
import { toKana, toWritten } from '../lib/furigana';
import { useSettingsStore } from '../stores/settings-store';
import { useNavigationStore } from '../stores/navigation-store';
import type { Phrase } from '../types/phrase';
import { Furigana } from '../components/Furigana';
import { AudioButton } from '../components/AudioButton';
import { PhraseDetails } from '../components/PhraseDetails';
import { SpeakerTag } from '../components/SpeakerTag';
import { Card } from '../components/ui/Card';
import { SecondaryButton } from '../components/ui/Button';

function matches(phrase: Phrase, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [phrase.en, toWritten(phrase.jp), toKana(phrase.jp), phrase.note ?? ''].some((t) =>
    t.toLowerCase().includes(q)
  );
}

function PhraseRow({ phrase }: { phrase: Phrase }) {
  const [open, setOpen] = useState(false);
  return (
    <Card onClick={() => setOpen(!open)} className="!active:scale-100">
      <div className="flex flex-col gap-2">
        <SpeakerTag phrase={phrase} />
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <Furigana markup={phrase.jp} className="text-lg leading-[2.1]" />
            <div className="text-txt-secondary text-sm">{phrase.en}</div>
          </div>
          <AudioButton markup={phrase.jp} />
        </div>
        {open && (
          <div className="pt-2 border-t border-divider">
            <PhraseDetails phrase={phrase} />
          </div>
        )}
      </div>
    </Card>
  );
}

export function PhrasesPage() {
  const [scenarioId, setScenarioId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const updateSettings = useSettingsStore((s) => s.updateSettings);
  const setTab = useNavigationStore((s) => s.setTab);

  const results = useMemo(
    () => allPhrases.filter((p) => (scenarioId ? p.scenarioId === scenarioId : true) && matches(p, query)),
    [scenarioId, query]
  );

  function practiceScenario(id: string) {
    updateSettings({ scenarioIds: [id] });
    setTab('practice');
  }

  const search = (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search English, 日本語, or かな"
      className="w-full rounded-lg bg-app-card border border-border px-3 py-2.5 text-sm outline-none focus:border-accent placeholder:text-txt-tertiary"
    />
  );

  if (!scenarioId && !query.trim()) {
    return (
      <div className="flex-1 min-h-0 flex flex-col p-4 gap-4 overflow-y-auto">
        <h1 className="text-2xl font-bold">Phrasebook</h1>
        {search}
        <div className="grid grid-cols-2 gap-2">
          {scenarios.map((s) => (
            <Card key={s.id} onClick={() => setScenarioId(s.id)}>
              <div className="text-2xl">{s.icon}</div>
              <div className="font-semibold text-sm mt-1">{s.name}</div>
              <div className="text-txt-tertiary text-xs font-jp" lang="ja">
                {s.jp} · {allPhrases.filter((p) => p.scenarioId === s.id).length}
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const scenario = scenarioId ? scenarioById[scenarioId] : null;
  return (
    <div className="flex-1 min-h-0 flex flex-col p-4 gap-3 overflow-y-auto">
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            setScenarioId(null);
            setQuery('');
          }}
          className="text-accent font-semibold text-sm"
        >
          ‹ Back
        </button>
        {scenario && (
          <h1 className="text-xl font-bold flex-1">
            {scenario.icon} {scenario.name}
          </h1>
        )}
        {scenario && <SecondaryButton onClick={() => practiceScenario(scenario.id)}>Practice</SecondaryButton>}
      </div>
      {search}
      <div className="text-txt-tertiary text-xs">Tap a phrase for keigo notes and replies.</div>
      {results.map((p) => (
        <PhraseRow key={p.id} phrase={p} />
      ))}
      {results.length === 0 && <div className="text-txt-tertiary text-sm text-center py-8">No phrases found.</div>}
    </div>
  );
}
