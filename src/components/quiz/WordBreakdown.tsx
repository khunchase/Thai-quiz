import { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Word, WordPart } from '../../types/word';
import { useAllWords, useAllCategories } from '../../stores/deck-store';
import { AudioButton } from './AudioButton';
import { useSettingsStore, singleThaiFontClass } from '../../stores/settings-store';

const PART_COLORS = [
  { text: 'text-accent', tile: 'border-accent/50 bg-accent/10' },
  { text: 'text-teal-400', tile: 'border-teal-400/50 bg-teal-400/10' },
  { text: 'text-purple-400', tile: 'border-purple-400/50 bg-purple-400/10' },
];

const partColor = (i: number) => PART_COLORS[i % PART_COLORS.length];

function partsSpellWord(word: Word): boolean {
  const strip = (s: string) => s.replace(/\s+/g, '').normalize('NFC');
  return !!word.breakdown && strip(word.breakdown.map((p) => p.thai).join('')) === strip(word.thai);
}

/** The headword in a single font, each breakdown part tinted to match its tile below. */
export function BreakdownHeadword({ word, className = '' }: { word: Word; className?: string }) {
  const fontStyle = useSettingsStore((s) => s.settings.thaiFontStyle);
  const colored = word.breakdown && word.breakdown.length > 1 && partsSpellWord(word);
  return (
    <div className={`${singleThaiFontClass(fontStyle)} font-bold text-center leading-tight ${className}`}>
      {colored
        ? word.breakdown!.map((part, i) => (
            <span key={i} className={partColor(i).text}>
              {part.thai}
            </span>
          ))
        : word.thai}
    </div>
  );
}

/** The deck word a part refers to, or a stand-in built from the part when it isn't in the deck. */
function usePartWord(): (part: WordPart) => Word {
  const words = useAllWords();
  const byThai = useMemo(() => {
    const map = new Map<string, Word>();
    for (const w of words) if (!map.has(w.thai)) map.set(w.thai, w);
    return map;
  }, [words]);
  return (part) =>
    byThai.get(part.thai) ?? {
      id: `part:${part.thai}`,
      thai: part.thai,
      romanization: part.romanization,
      english: part.english,
      categoryId: '',
    };
}

/**
 * The smaller words a compound is made of, one row each. Tapping a row opens
 * that word's card, and its own parts can be tapped in turn.
 */
export function WordBreakdown({ word }: { word: Word }) {
  const [trail, setTrail] = useState<Word[]>([]);
  const toWord = usePartWord();
  if (!word.breakdown || word.breakdown.length < 2) return null;

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="text-txt-primary text-lg font-bold">Made of</div>
      <PartList parts={word.breakdown} onOpen={(part) => setTrail([toWord(part)])} />
      {trail.length > 0 &&
        createPortal(
          <WordPeek
            word={trail[trail.length - 1]}
            canGoBack={trail.length > 1}
            onBack={() => setTrail((t) => t.slice(0, -1))}
            onClose={() => setTrail([])}
            onOpen={(part) => setTrail((t) => [...t, toWord(part)])}
          />,
          document.body
        )}
    </div>
  );
}

function PartList({ parts, onOpen }: { parts: WordPart[]; onOpen: (part: WordPart) => void }) {
  const fontStyle = useSettingsStore((s) => s.settings.thaiFontStyle);
  return (
    <ul className="w-full flex flex-col gap-2">
      {parts.map((part, i) => (
        <li key={i}>
          <button
            type="button"
            onClick={(e) => {
              // Keep the tap from also flipping or closing whatever card this list sits in.
              e.stopPropagation();
              onOpen(part);
            }}
            className="w-full flex items-center gap-4 rounded-xl border border-border bg-app-surface/60 px-4 py-3 text-left active:scale-[0.98] active:bg-app-surface transition"
          >
            <span
              className={`${singleThaiFontClass(fontStyle)} shrink-0 min-w-16 text-3xl font-semibold leading-snug ${partColor(i).text}`}
            >
              {part.thai}
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-txt-primary text-base font-semibold leading-snug">{part.english}</span>
              <span className="block text-txt-secondary text-sm">{part.romanization}</span>
            </span>
            <span aria-hidden className="shrink-0 text-txt-tertiary text-2xl leading-none">
              ›
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}

interface PeekProps {
  word: Word;
  canGoBack: boolean;
  onBack: () => void;
  onClose: () => void;
  onOpen: (part: WordPart) => void;
}

/** A word's card on top of everything: the word, how to say it, what it means, and what it's made of. */
function WordPeek({ word, canGoBack, onBack, onClose, onOpen }: PeekProps) {
  const fontStyle = useSettingsStore((s) => s.settings.thaiFontStyle);
  const category = useAllCategories().find((c) => c.id === word.categoryId);
  const parts = word.breakdown && word.breakdown.length >= 2 ? word.breakdown : null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div
        role="dialog"
        aria-label={word.english}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm max-h-[85vh] overflow-y-auto rounded-2xl border border-border bg-app-card-light px-5 pt-12 pb-6 flex flex-col items-center gap-2"
      >
        {canGoBack && (
          <button
            type="button"
            onClick={onBack}
            className="absolute top-3 left-3 h-8 px-3 rounded-full bg-app-surface text-txt-secondary text-sm font-semibold"
          >
            ‹ Back
          </button>
        )}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-app-surface text-txt-secondary"
        >
          ✕
        </button>

        <div className={`${singleThaiFontClass(fontStyle)} text-5xl font-bold text-accent text-center leading-tight`}>
          {word.thai}
        </div>
        <div className="text-txt-secondary text-lg">{word.pronunciation ?? word.romanization}</div>
        <div className="text-txt-primary text-2xl font-bold text-center">{word.english}</div>
        <AudioButton text={word.thai} />
        {category && (
          <span className="mt-1 px-3 py-1 rounded-lg bg-accent/15 text-accent text-sm font-semibold">
            {category.icon} {category.name}
          </span>
        )}

        {parts && (
          <div className="w-full flex flex-col gap-2 mt-4 pt-4 border-t border-border">
            <div className="text-txt-primary text-lg font-bold">Made of</div>
            <PartList parts={parts} onOpen={onOpen} />
          </div>
        )}
      </div>
    </div>
  );
}
