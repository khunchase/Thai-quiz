import { useState } from 'react';
import type { QuizQuestion, Grade } from '../../types/quiz';
import type { Tone } from '../../lib/tone';
import { ruleById, ruleExamples, ruleParts, ruleWhy } from '../../lib/tone-rules';
import { gradeForMultipleChoice, GRADE_GIVE_UP, type ScheduleOptions } from '../../lib/srs';
import { useAllWords } from '../../stores/deck-store';
import { useSettingsStore, singleThaiFontClass } from '../../stores/settings-store';
import { GhostButton } from '../ui/Button';
import { ExerciseLayout, type ExerciseFrame } from './ExerciseLayout';
import { ToneChip } from './ToneExplanation';
import { CONTOUR, TONE_LABEL, TONE_ORDER, TONE_STYLE } from './tone-style';

interface Props extends ExerciseFrame {
  question: QuizQuestion;
  onAnswered: (grade: Grade, correct: boolean, userAnswer?: string, options?: ScheduleOptions) => void;
}

function Token({ children, tone }: { children: string; tone?: 'accent' }) {
  return (
    <span
      className={`rounded-lg border px-3 py-2 text-sm font-semibold text-center ${
        tone === 'accent' ? 'border-accent text-accent bg-accent/10' : 'border-border bg-app-card text-txt-primary'
      }`}
    >
      {children}
    </span>
  );
}

/** A tone rule written as a sum — "Low class + dead, short vowel + no tone mark = ?" — answered with a tone. */
export function RuleQuestion({ question, onAnswered, ...frame }: Props) {
  const fontStyle = useSettingsStore((s) => s.settings.thaiFontStyle);
  const words = useAllWords();
  const thaiFont = singleThaiFontClass(fontStyle);
  const rule = ruleById(question.word.id)!;
  const parts = ruleParts(rule);
  const [pick, setPick] = useState<Tone | null>(null);
  const [gaveUp, setGaveUp] = useState(false);
  const examples = ruleExamples(words)[rule.id] ?? [];

  const done = gaveUp || pick !== null;
  const correct = pick === rule.tone;
  const grade: Grade | null = !done ? null : gaveUp ? GRADE_GIVE_UP : gradeForMultipleChoice(correct);

  function next() {
    if (grade === null) return;
    onAnswered(grade, correct, pick ? TONE_LABEL[pick] : undefined);
  }

  const allExamples = [{ ...rule.example, fromWord: undefined as string | undefined }, ...examples];

  return (
    <ExerciseLayout
      {...frame}
      word={question.word}
      answered={done}
      pendingGrade={grade}
      onNext={next}
      playText={done ? rule.example.thai : undefined}
    >
      <div className="text-txt-secondary font-semibold py-2">Which tone does this rule give?</div>

      <div className="flex flex-col items-stretch gap-1.5">
        <Token tone="accent">{parts.cls}</Token>
        <span className="text-center text-txt-tertiary font-bold">+</span>
        <Token>{parts.syllable}</Token>
        <span className="text-center text-txt-tertiary font-bold">+</span>
        {rule.mark ? (
          <span className="rounded-lg border border-border bg-app-card px-3 py-1 text-sm font-semibold text-center text-txt-primary">
            <span className={`${thaiFont} text-2xl mr-2`}>◌{rule.mark}</span>
            {parts.mark.slice(3)}
          </span>
        ) : (
          <Token>{parts.mark}</Token>
        )}
        <span className="text-center text-txt-tertiary font-bold">=</span>
        {done ? (
          <span
            className={`rounded-lg border-2 px-3 py-2 text-center font-bold ${
              correct ? 'border-success text-success bg-success/10' : 'border-danger bg-danger/10'
            }`}
          >
            {!correct && pick && <span className="text-danger line-through mr-2">{TONE_LABEL[pick]}</span>}
            <span className={correct ? '' : 'text-success'}>{TONE_LABEL[rule.tone]} tone</span>
          </span>
        ) : (
          <span className="rounded-lg border-2 border-dashed border-accent px-3 py-2 text-center text-accent font-bold">
            ?
          </span>
        )}
      </div>

      {!done && (
        <>
          <div className="grid grid-cols-5 gap-2">
            {TONE_ORDER.map(({ tone, label }) => (
              <button
                key={tone}
                type="button"
                onClick={() => setPick(tone)}
                className="rounded-xl border border-border bg-app-card py-3 flex flex-col items-center gap-1 text-txt-primary active:scale-95 active:bg-app-surface transition"
              >
                <svg viewBox="0 0 20 12" className="w-7 h-4" aria-hidden>
                  <path d={CONTOUR[tone]} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
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
        <div className="flex flex-col gap-3">
          <div className="text-txt-secondary text-sm leading-relaxed">{ruleWhy(rule)}</div>
          <div className="rounded-xl border border-border bg-app-surface/60 px-4 py-2 flex flex-col">
            <div className="text-txt-tertiary text-[11px] font-semibold uppercase tracking-wide pt-1">Examples</div>
            {allExamples.map((ex) => (
              <div key={ex.thai} className="flex items-center gap-3 py-2 border-t border-border first:border-t-0">
                <span className={`${thaiFont} min-w-12 text-2xl font-semibold ${TONE_STYLE[rule.tone].text}`}>
                  {ex.thai}
                </span>
                <span className="flex-1 min-w-0 text-xs text-txt-secondary">
                  <span className="text-txt-primary text-sm font-semibold mr-2">{ex.pronunciation}</span>
                  {ex.fromWord ? (
                    <>
                      in <span className={thaiFont}>{ex.fromWord}</span> ({ex.english})
                    </>
                  ) : (
                    ex.english
                  )}
                </span>
                <ToneChip tone={rule.tone} />
              </div>
            ))}
          </div>
        </div>
      )}
    </ExerciseLayout>
  );
}
