import { useMemo, useState } from 'react';
import type { Word } from '../../types/word';
import { explainTones, liveReason, TONE_MARK_NAMES, type SyllableTone, type Tone } from '../../lib/tone';
import { useSettingsStore, singleThaiFontClass } from '../../stores/settings-store';

const TONE_STYLE: Record<Tone, { text: string; chip: string }> = {
  mid: { text: 'text-txt-secondary', chip: 'bg-app-surface text-txt-secondary' },
  low: { text: 'text-connector', chip: 'bg-connector/15 text-connector' },
  falling: { text: 'text-warning', chip: 'bg-warning/15 text-warning' },
  high: { text: 'text-success', chip: 'bg-success/15 text-success' },
  rising: { text: 'text-purple-400', chip: 'bg-purple-400/15 text-purple-400' },
};

/** Pitch shapes on a 20×12 box, top = high. */
const CONTOUR: Record<Tone, string> = {
  mid: 'M2 6 L18 6',
  low: 'M2 8 L18 10.5',
  falling: 'M2 4 Q7 1.5 10 4 T18 11',
  high: 'M2 4 Q12 4 18 1.5',
  rising: 'M2 8 Q8 11 12 8 T18 1.5',
};

function ToneChip({ tone }: { tone: Tone }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-semibold ${TONE_STYLE[tone].chip}`}>
      <svg viewBox="0 0 20 12" className="w-4 h-3" aria-hidden>
        <path d={CONTOUR[tone]} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      {tone}
    </span>
  );
}

/** "ข is high class" — or what overrides the letter's own class. */
function ClassReason({ s, thaiFont }: { s: SyllableTone; thaiFont: string }) {
  const t = (text: string) => <span className={`${thaiFont} text-txt-primary font-semibold`}>{text}</span>;
  if (s.leader === 'ห')
    return <>silent {t('ห')} makes {t(s.initial)} high class</>;
  if (s.leader === 'อ')
    return <>silent {t('อ')} makes {t(s.initial)} mid class</>;
  if (s.ledBy)
    return (
      <>
        {t(s.ledBy)} in front leads {t(s.initial)}: {s.cls} class
      </>
    );
  if (s.clusterWith)
    return (
      <>
        {t(s.initial + s.clusterWith)}: first letter {t(s.initial)} is {s.cls} class
      </>
    );
  return (
    <>
      {t(s.initial)} is {s.cls} class
    </>
  );
}

function SyllableRow({ s, thaiFont }: { s: SyllableTone; thaiFont: string }) {
  return (
    <span className="flex items-start gap-3 py-2 border-t border-border first:border-t-0">
      <span className={`${thaiFont} shrink-0 min-w-12 text-2xl font-semibold leading-tight ${TONE_STYLE[s.tone].text}`}>
        {s.thai}
      </span>
      <span className="flex-1 min-w-0 text-left">
        <span className="flex items-center gap-2 flex-wrap">
          <span className="text-txt-primary text-sm font-semibold">{s.pronunciation}</span>
          <ToneChip tone={s.tone} />
        </span>
        <span className="block text-txt-secondary text-xs leading-relaxed mt-0.5">
          {s.regular ? (
            <>
              <ClassReason s={s} thaiFont={thaiFont} />
              {' · '}
              {s.mark ? (
                <>
                  {TONE_MARK_NAMES[s.mark]} <span className={`${thaiFont} text-txt-primary text-sm`}>◌{s.mark}</span>
                </>
              ) : (
                <>
                  {s.live ? 'live' : 'dead'} ({liveReason(s)}
                  {!s.live && s.final && s.cls === 'low' ? `, ${s.longVowel ? 'long' : 'short'} vowel` : ''}), no tone
                  mark
                </>
              )}
              {' → '}
              <span className={`font-semibold ${TONE_STYLE[s.tone].text}`}>{s.tone}</span>
            </>
          ) : (
            <>
              <span className="text-warning font-semibold">Exception.</span> The spelling rules give {s.ruleTone}, but
              it's said {s.tone}. Loanwords and a few everyday words (like ก็) do this.
            </>
          )}
        </span>
      </span>
    </span>
  );
}

/**
 * Why each syllable of a word has its tone (consonant class + live/dead +
 * tone mark). Collapsed to a one-line tone summary until tapped, so it fits
 * on small cards. Renders nothing when the word can't be explained.
 */
export function ToneExplanation({ word, className = '' }: { word: Word; className?: string }) {
  const fontStyle = useSettingsStore((s) => s.settings.thaiFontStyle);
  const [open, setOpen] = useState(false);
  const syllables = useMemo(() => explainTones(word.thai, word.pronunciation), [word.thai, word.pronunciation]);
  if (!syllables) return null;
  const thaiFont = singleThaiFontClass(fontStyle);

  return (
    <button
      type="button"
      aria-expanded={open}
      onClick={(e) => {
        // Keep the tap from also flipping or closing the card this sits in.
        e.stopPropagation();
        setOpen((o) => !o);
      }}
      className={`w-full rounded-xl border border-border bg-app-surface/60 px-4 py-3 text-left ${className}`}
    >
      <span className="flex items-center gap-2">
        <span className="text-txt-primary text-sm font-bold">Why {syllables.length > 1 ? 'these tones' : 'this tone'}?</span>
        <span aria-hidden className={`ml-auto text-txt-tertiary text-lg leading-none transition-transform ${open ? 'rotate-90' : ''}`}>
          ›
        </span>
      </span>
      {!open && (
        <span className="mt-2 flex flex-wrap gap-x-3 gap-y-1.5">
          {syllables.map((s, i) => (
            <span key={i} className="inline-flex items-center gap-1.5">
              <span className={`${thaiFont} text-base font-semibold ${TONE_STYLE[s.tone].text}`}>{s.thai}</span>
              <ToneChip tone={s.tone} />
            </span>
          ))}
        </span>
      )}
      {open && (
        <span className="block mt-2">
          <span className="block">
            {syllables.map((s, i) => (
              <SyllableRow key={i} s={s} thaiFont={thaiFont} />
            ))}
          </span>
          <span className="block mt-2 pt-2 border-t border-border text-txt-tertiary text-[11px] leading-snug">
            Tone = consonant class (mid / high / low) + live or dead syllable + tone mark. Dead syllables end in -p,
            -t, -k or a short vowel.
          </span>
        </span>
      )}
    </button>
  );
}
