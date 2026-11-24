import { useState } from 'react';
import type { QuizQuestion, Grade } from '../../types/quiz';
import { consonantClass, type ConsonantClass } from '../../lib/tone';
import { CLASS_MNEMONIC, classTip, consonantFor, lettersOfClass } from '../../lib/letter-classes';
import { gradeForMultipleChoice, GRADE_GIVE_UP, type ScheduleOptions } from '../../lib/srs';
import { useSettingsStore, singleThaiFontClass } from '../../stores/settings-store';
import { GhostButton } from '../ui/Button';
import { ExerciseLayout, type ExerciseFrame } from './ExerciseLayout';

interface Props extends ExerciseFrame {
  question: QuizQuestion;
  onAnswered: (grade: Grade, correct: boolean, userAnswer?: string, options?: ScheduleOptions) => void;
}

const CLASSES: { cls: ConsonantClass; label: string }[] = [
  { cls: 'mid', label: 'Mid' },
  { cls: 'high', label: 'High' },
  { cls: 'low', label: 'Low' },
];

const LABEL = Object.fromEntries(CLASSES.map((c) => [c.cls, c.label])) as Record<ConsonantClass, string>;

/** One consonant, answered with its class: mid, high or low. */
export function LetterClassQuestion({ question, onAnswered, ...frame }: Props) {
  const fontStyle = useSettingsStore((s) => s.settings.thaiFontStyle);
  const thaiFont = singleThaiFontClass(fontStyle);
  const consonant = consonantFor(question.word.id)!;
  const cls = consonantClass(consonant.letter);
  const [pick, setPick] = useState<ConsonantClass | null>(null);
  const [gaveUp, setGaveUp] = useState(false);

  const done = gaveUp || pick !== null;
  const correct = pick === cls;
  const grade: Grade | null = !done ? null : gaveUp ? GRADE_GIVE_UP : gradeForMultipleChoice(correct);
  const mnemonic = cls === 'low' ? null : CLASS_MNEMONIC[cls];
  const tip = classTip(consonant.letter);

  function next() {
    if (grade === null) return;
    onAnswered(grade, correct, pick ? LABEL[pick] : undefined);
  }

  return (
    <ExerciseLayout
      {...frame}
      word={question.word}
      answered={done}
      pendingGrade={grade}
      onNext={next}
      playText={`${consonant.letter} ${consonant.nameWord}`}
      // Every high-class name is said with a rising tone, so hearing it would give the class away.
      playDisabled={!done}
    >
      <div className="text-txt-secondary font-semibold py-2">Which class is this letter?</div>

      <div className="flex flex-col items-center gap-1 py-2">
        <span
          className={`${thaiFont} text-8xl font-semibold leading-tight ${
            !done ? 'text-txt-primary' : correct ? 'text-success' : 'text-danger'
          }`}
        >
          {consonant.letter}
        </span>
        <span className="text-txt-secondary text-sm">
          <span className={`${thaiFont} text-base`}>
            {consonant.letter} {consonant.nameWord}
          </span>{' '}
          {done && <> · {consonant.pronunciation}</>} · {consonant.english}
        </span>
      </div>

      {!done ? (
        <>
          <div className="grid grid-cols-3 gap-2">
            {CLASSES.map((c) => (
              <button
                key={c.cls}
                type="button"
                onClick={() => setPick(c.cls)}
                className="rounded-xl border border-border bg-app-card py-4 text-txt-primary font-bold active:scale-95 active:bg-app-surface transition"
              >
                {c.label}
              </button>
            ))}
          </div>
          <div className="flex justify-center">
            <GhostButton onClick={() => setGaveUp(true)}>I don't know</GhostButton>
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-3">
          <div
            className={`rounded-lg border-2 px-3 py-2 text-center font-bold ${
              correct ? 'border-success text-success bg-success/10' : 'border-danger bg-danger/10'
            }`}
          >
            {!correct && pick && <span className="text-danger line-through mr-2">{LABEL[pick]}</span>}
            <span className={correct ? '' : 'text-success'}>{LABEL[cls]} class</span>
          </div>

          {tip && <div className="text-txt-secondary text-sm leading-relaxed">{tip}</div>}

          <div className="rounded-xl border border-border bg-app-surface/60 px-4 py-3 flex flex-col gap-2">
            <div className="text-txt-tertiary text-[11px] font-semibold uppercase tracking-wide">
              {LABEL[cls]} class letters
            </div>
            <div className={`${thaiFont} text-2xl flex flex-wrap gap-x-2.5 gap-y-1`}>
              {lettersOfClass(cls).map((l) => (
                <span key={l} className={l === consonant.letter ? 'text-accent font-bold' : 'text-txt-primary'}>
                  {l}
                </span>
              ))}
            </div>
            {mnemonic ? (
              <div className="text-xs text-txt-secondary leading-relaxed border-t border-border pt-2">
                <div className="text-txt-tertiary">Remember it with:</div>
                <div className={`${thaiFont} text-base text-txt-primary`}>{mnemonic.thai}</div>
                <div>{mnemonic.romanization}</div>
                <div className="italic">“{mnemonic.english}”</div>
              </div>
            ) : (
              <div className="text-xs text-txt-secondary leading-relaxed border-t border-border pt-2">
                Low class is everything that isn't mid or high — learn the {lettersOfClass('mid').length} mid and{' '}
                {lettersOfClass('high').length} high letters and the other {lettersOfClass('low').length} are low.
              </div>
            )}
          </div>
        </div>
      )}
    </ExerciseLayout>
  );
}
