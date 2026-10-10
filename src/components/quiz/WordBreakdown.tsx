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

export function WordBreakdown({ word }: { word: Word }) {
  const fontStyle = useSettingsStore((s) => s.settings.thaiFontStyle);
  if (!word.breakdown || word.breakdown.length < 2) return null;
  const parts = word.breakdown;
  const compact = parts.length >= 3;

  return (
    <div className="w-full flex flex-col items-center gap-3">
      <div className="flex items-center gap-2.5 w-full text-txt-secondary text-xs font-bold uppercase tracking-widest">
        <span className="flex-1 border-t border-border" />
        Breakdown
        <span className="flex-1 border-t border-border" />
      </div>
      <div className={`flex items-stretch justify-center w-full ${compact ? 'gap-1' : 'gap-1.5'}`}>
        {parts.map((part, i) => (
          <div key={i} className="contents">
            {i > 0 && (
              <span
                className={`self-center shrink-0 rounded-full bg-accent text-app-bg font-extrabold leading-none flex items-center justify-center ${
                  compact ? 'w-5 h-5 text-base' : 'w-6 h-6 text-lg'
                }`}
              >
                +
              </span>
            )}
            <div
              className={`flex-1 min-w-min max-w-36 rounded-xl border-[1.5px] px-1.5 py-2.5 text-center ${partColor(i).tile}`}
            >
              <div
                className={`${singleThaiFontClass(fontStyle)} font-semibold ${compact ? 'text-2xl' : 'text-3xl'} ${partColor(i).text}`}
              >
                {part.thai}
              </div>
              <div className={`text-txt-secondary font-semibold mt-0.5 ${compact ? 'text-xs' : 'text-[13px]'}`}>
                {part.romanization}
              </div>
              {/* Zero-width space after "/" lets "comfortable/well" wrap at the slash instead of mid-word. */}
              <div className={`text-txt-primary mt-0.5 ${compact ? 'text-[13px] leading-snug' : 'text-sm'}`}>
                {part.english.replaceAll('/', '/\u200B')}
              </div>
            </div>
          </div>
        ))}
      </div>
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
