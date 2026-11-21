import { useMemo, useState } from 'react';
import type { QuizQuestion, Grade } from '../../types/quiz';
import type { Tone } from '../../lib/tone';
import { toneQuizSyllables } from '../../lib/tone';
import { gradeForMultipleChoice, GRADE_GIVE_UP, type ScheduleOptions } from '../../lib/srs';
import { useSettingsStore, singleThaiFontClass } from '../../stores/settings-store';
import { GhostButton } from '../ui/Button';
import { ExerciseLayout, type ExerciseFrame } from './ExerciseLayout';
import { SyllableRow } from './ToneExplanation';
import { CONTOUR, TONE_LABEL as LABEL, TONE_ORDER } from './tone-style';

interface Props extends ExerciseFrame {
  question: QuizQuestion;
  onAnswered: (grade: Grade, correct: boolean, userAnswer?: string, options?: ScheduleOptions) => void;
}

function Contour({ tone, className = 'w-7 h-4' }: { tone: Tone; className?: string }) {
  return (
    <svg viewBox="0 0 20 12" className={className} aria-hidden>
      <path d={CONTOUR[tone]} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Name the tone of each syllable of a word, one syllable at a time: the
 * current syllable is highlighted, each pick is marked straight away, and
 * once the word is done every syllable's reasoning is shown.
 */
export function ToneQuestion({ question, onAnswered, ...frame }: Props) {
  const fontStyle = useSettingsStore((s) => s.settings.thaiFontStyle);
  const { word } = question;
  const syllables = useMemo(() => toneQuizSyllables(word.thai, word.pronunciation) ?? [], [word]);
  const [picks, setPicks] = useState<Tone[]>([]);
  const [gaveUp, setGaveUp] = useState(false);
  const thaiFont = singleThaiFontClass(fontStyle);

  const done = gaveUp || picks.length === syllables.length;
  const current = done ? -1 : picks.length;
  const allRight = !gaveUp && picks.every((p, i) => p === syllables[i].tone);
  const grade: Grade | null = !done ? null : gaveUp ? GRADE_GIVE_UP : gradeForMultipleChoice(allRight);
  const rightCount = picks.filter((p, i) => p === syllables[i].tone).length;

  function pick(tone: Tone) {
    if (done) return;
    setPicks((p) => [...p, tone]);
  }

  function next() {
    if (grade === null) return;
    onAnswered(grade, allRight, picks.map((t) => LABEL[t]).join(' '));
  }

  return (
    <ExerciseLayout
      {...frame}
      word={word}
      answered={done}
      pendingGrade={grade}
      onNext={next}
      playText={word.thai}
      // Hearing it would give the tones away.
      playDisabled={!done}
    >
      <div className="flex flex-col gap-1 py-2">
        <div className="text-txt-secondary font-semibold">
          {syllables.length > 1 ? 'Pick the tone of each syllable' : 'Pick the tone'}
        </div>
        <div className="text-txt-tertiary text-sm">{word.english}</div>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {syllables.map((s, i) => {
          const answered = i < picks.length || gaveUp;
          const right = i < picks.length && picks[i] === s.tone;
          const border =
            i === current
              ? 'border-accent bg-accent/10'
              : !answered
                ? 'border-border bg-app-surface/40'
                : right
                  ? 'border-success bg-success/10'
                  : 'border-danger bg-danger/10';
          return (
            <div key={i} className={`min-w-16 rounded-xl border-2 px-3 pt-2 pb-1.5 flex flex-col items-center ${border}`}>
              <span
                className={`${thaiFont} text-4xl font-semibold leading-snug ${
                  !answered && i !== current ? 'text-txt-tertiary' : 'text-txt-primary'
                }`}
              >
                {s.thai}
              </span>
              <span className="h-10 flex flex-col items-center justify-center text-xs">
                {answered ? (
                  <>
                    <span className="text-txt-secondary">{s.pronunciation}</span>
                    {right ? (
                      <span className="text-success font-semibold">✓ {LABEL[s.tone]}</span>
                    ) : (
                      <span className="font-semibold">
                        {i < picks.length && <span className="text-danger line-through mr-1">{LABEL[picks[i]]}</span>}
                        <span className="text-success">{LABEL[s.tone]}</span>
                      </span>
                    )}
                  </>
                ) : i === current ? (
                  <span className="text-accent font-semibold">?</span>
                ) : null}
              </span>
            </div>
          );
        })}
      </div>

      {!done && (
        <>
          <div className="grid grid-cols-5 gap-2">
            {TONE_ORDER.map(({ tone, label }) => (
              <button
                key={tone}
                type="button"
                onClick={() => pick(tone)}
                className="rounded-xl border border-border bg-app-card py-3 flex flex-col items-center gap-1 text-txt-primary active:scale-95 active:bg-app-surface transition"
              >
                <Contour tone={tone} />
                <span className="text-sm font-bold">{label}</span>
              </button>
            ))}
          </div>
          <div className="flex justify-center">
            <GhostButton onClick={() => setGaveUp(true)}>I don't know</GhostButton>
          </div>
        </>
      )}

      {done && (
        <div className="flex flex-col gap-2">
          <div className={`text-center font-bold ${allRight ? 'text-success' : 'text-danger'}`}>
            {allRight
              ? 'Correct!'
              : gaveUp
                ? 'Here’s why'
                : `${rightCount} of ${syllables.length} right`}
          </div>
          <div className="rounded-xl border border-border bg-app-surface/60 px-4 py-2 flex flex-col">
            {syllables.map((s, i) => (
              <SyllableRow key={i} s={s} thaiFont={thaiFont} />
            ))}
          </div>
        </div>
      )}
    </ExerciseLayout>
  );
}
