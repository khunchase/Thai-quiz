import type { Word } from '../../types/word';
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

/** The smaller words a compound is made of, one per row under the word. */
export function WordBreakdown({ word }: { word: Word }) {
  const fontStyle = useSettingsStore((s) => s.settings.thaiFontStyle);
  if (!word.breakdown || word.breakdown.length < 2) return null;
  const parts = word.breakdown;

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex items-center gap-2.5 w-full text-txt-secondary text-xs font-bold uppercase tracking-widest">
        <span className="flex-1 border-t border-border" />
        Made of
        <span className="flex-1 border-t border-border" />
      </div>
      <ul className="w-full flex flex-col gap-1.5">
        {parts.map((part, i) => (
          <li
            key={i}
            className={`flex items-center gap-3 rounded-xl border-[1.5px] px-3 py-2 ${partColor(i).tile}`}
          >
            <div
              className={`${singleThaiFontClass(fontStyle)} shrink-0 min-w-14 text-3xl font-semibold leading-snug ${partColor(i).text}`}
            >
              {part.thai}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="text-txt-secondary text-sm font-semibold">{part.romanization}</div>
              <div className="text-txt-primary text-base leading-snug">{part.english}</div>
            </div>
          </li>
        ))}
      </ul>
      <div className="text-txt-secondary text-sm text-center leading-relaxed">
        {parts.map((part, i) => (
          <span key={i}>
            {i > 0 && ' + '}
            <span className={partColor(i).text}>{part.english}</span>
          </span>
        ))}
        <span className="text-accent font-extrabold px-1.5">→</span>
        <span className="text-txt-primary font-bold">{word.english}</span>
      </div>
    </div>
  );
}
