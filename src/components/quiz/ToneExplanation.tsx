import { useMemo, useState, type ReactNode } from 'react';
import type { Word } from '../../types/word';
import { explainTones, TONE_MARK_NAMES, type SyllableTone, type Tone } from '../../lib/tone';
import { useSettingsStore, singleThaiFontClass } from '../../stores/settings-store';
import { CONTOUR, TONE_STYLE } from './tone-style';

export function ToneChip({ tone }: { tone: Tone }) {
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

function Step({ n, children }: { n: number; children: ReactNode }) {
  return (
    <span className="flex gap-1.5">
      <span className="shrink-0 w-3.5 text-txt-tertiary">{'①②③'[n - 1]}</span>
      <span>{children}</span>
    </span>
  );
}

/** Step ③ of the chart: what the syllable ends with, and so whether it's live or dead. */
function EndingReason({ s, thaiFont }: { s: SyllableTone; thaiFont: string }) {
  const t = (text: string) => <span className={`${thaiFont} text-txt-primary`}>{text}</span>;
  const live = <span className="text-txt-primary">live</span>;
  const dead = <span className="text-txt-primary">dead</span>;
  if (s.final) {
    if (s.live)
      return s.thai.includes('ำ') ? (
        <>{t('ำ')} is short but counts as {live}</>
      ) : (
        <>ends in -{s.final}: a {live} ending</>
      );
    return (
      <>
        ends in -{s.final}: a {dead} ending
        {s.cls === 'low' && <>, {s.longVowel ? 'long' : 'short'} vowel</>}
      </>
    );
  }
  if (s.live && !s.longVowel) return <>no ending; {t('ไ ใ เา')} are short but count as {live}</>;
  return s.live ? <>no ending, long vowel: {live}</> : <>no ending, short vowel: {dead}</>;
}

export function SyllableRow({ s, thaiFont }: { s: SyllableTone; thaiFont: string }) {
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
        {s.regular ? (
          <span className="mt-1 flex flex-col gap-0.5 text-txt-secondary text-xs leading-relaxed">
            <Step n={1}>
              <ClassReason s={s} thaiFont={thaiFont} />
            </Step>
            {s.mark ? (
              <Step n={2}>
                tone mark {TONE_MARK_NAMES[s.mark]}{' '}
                <span className={`${thaiFont} text-txt-primary text-sm`}>◌{s.mark}</span>
              </Step>
            ) : (
              <>
                <Step n={2}>no tone mark</Step>
                <Step n={3}>
                  <EndingReason s={s} thaiFont={thaiFont} />
                </Step>
              </>
            )}
            <span className="pl-5">
              → <span className={`font-semibold ${TONE_STYLE[s.tone].text}`}>{s.tone} tone</span>
            </span>
          </span>
        ) : (
          <span className="block mt-0.5 text-txt-secondary text-xs leading-relaxed">
            <span className="text-warning font-semibold">Exception.</span> The spelling rules give {s.ruleTone}, but
            it's said {s.tone}. Loanwords and a few everyday words (like ก็) do this.
          </span>
        )}
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
            Live: long vowel, or ends in -m -n -ŋ -y -w. Dead: short vowel, or ends in -p -t -k. With a tone mark,
            live/dead doesn't matter: ◌่ gives low (falling on low class), ◌้ gives falling (high on low class).
          </span>
        </span>
      )}
    </button>
  );
}
