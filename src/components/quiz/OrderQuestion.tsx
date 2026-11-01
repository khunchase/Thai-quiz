import { useState } from 'react';
import { LayoutGroup, motion } from 'framer-motion';
import type { QuizQuestion, Grade } from '../../types/quiz';
import { gradeForMultipleChoice, GRADE_GIVE_UP, type ScheduleOptions } from '../../lib/srs';
import { closestOrder, isCorrectOrder } from '../../data/word-order';
import { useSettingsStore, singleThaiFontClass } from '../../stores/settings-store';
import { AccentButton, GhostButton } from '../ui/Button';
import { ExerciseLayout, type ExerciseFrame } from './ExerciseLayout';

interface Props extends ExerciseFrame {
  question: QuizQuestion;
  onAnswered: (grade: Grade, correct: boolean, userAnswer?: string, options?: ScheduleOptions) => void;
}

type Result = 'right' | 'wrong' | 'gave-up';

/** Put the shuffled word blocks in order to make the Thai for an English sentence. */
export function OrderQuestion({ question, onAnswered, ...frame }: Props) {
  const fontStyle = useSettingsStore((s) => s.settings.thaiFontStyle);
  const { word, orderSentence: sentence, blockOrder = [] } = question;
  /** Block indexes in the answer row, in the order they were placed. */
  const [placed, setPlaced] = useState<number[]>([]);
  const [result, setResult] = useState<Result | null>(null);
  if (!sentence) return null;

  const answered = result !== null;
  const built = placed.map((i) => sentence.chunks[i]);
  const bank = blockOrder.filter((i) => !placed.includes(i));
  const allPlaced = bank.length === 0;
  const target = closestOrder(sentence, built);
  const fullThai = sentence.chunks.join('');
  const grade: Grade | null = result === null ? null : result === 'gave-up' ? GRADE_GIVE_UP : gradeForMultipleChoice(result === 'right');

  function place(i: number) {
    if (answered) return;
    setPlaced((p) => [...p, i]);
  }

  function unplace(i: number) {
    if (answered) return;
    setPlaced((p) => p.filter((x) => x !== i));
  }

  function check() {
    if (answered || !allPlaced || !sentence) return;
    setResult(isCorrectOrder(sentence, built) ? 'right' : 'wrong');
  }

  function next() {
    if (grade === null) return;
    onAnswered(grade, result === 'right', built.join(' '));
  }

  const blockBase = `${singleThaiFontClass(fontStyle)} text-3xl font-semibold px-3 py-2 rounded-lg border-2 leading-snug`;

  return (
    <ExerciseLayout
      {...frame}
      word={word}
      answered={answered}
      pendingGrade={grade}
      onNext={next}
      playText={fullThai}
      // Hearing the sentence would give the order away.
      playDisabled={!answered}
    >
      <div className="flex flex-col gap-2 py-2">
        <div className="text-txt-secondary font-semibold">Put the words in order</div>
        <div className="text-txt-primary text-xl font-semibold">{sentence.english}</div>
      </div>

      <LayoutGroup>
        {/* Answer row: tap a block to send it back. */}
        <div
          className={`min-h-20 rounded-xl border-2 border-dashed p-2 flex flex-wrap content-start gap-2 transition-colors ${
            result === 'right' ? 'border-success' : answered ? 'border-danger' : 'border-border'
          }`}
        >
          {placed.length === 0 && (
            <div className="self-center w-full text-center text-txt-tertiary text-sm">Tap the words below</div>
          )}
          {placed.map((i, pos) => {
            let style = 'bg-app-card border-accent/60 text-txt-primary';
            if (answered) {
              style =
                built[pos] === target[pos]
                  ? 'bg-success/15 border-success text-success'
                  : 'bg-danger/15 border-danger text-danger';
            }
            return (
              <motion.button
                key={i}
                layoutId={`block-${question.id}-${i}`}
                type="button"
                onClick={() => unplace(i)}
                disabled={answered}
                className={`${blockBase} ${style}`}
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              >
                {sentence.chunks[i]}
              </motion.button>
            );
          })}
        </div>

        {/* Word bank: tap a block to add it to the end of the answer. */}
        {!answered && (
          <div className="min-h-16 flex flex-wrap justify-center gap-2">
            {bank.map((i) => (
              <motion.button
                key={i}
                layoutId={`block-${question.id}-${i}`}
                type="button"
                onClick={() => place(i)}
                className={`${blockBase} bg-app-surface border-border text-txt-primary active:scale-95`}
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              >
                {sentence.chunks[i]}
              </motion.button>
            ))}
          </div>
        )}
      </LayoutGroup>

      {!answered && (
        <>
          <AccentButton onClick={check} disabled={!allPlaced}>
            Check
          </AccentButton>
          <div className="flex justify-center gap-2">
            {placed.length > 0 && <GhostButton onClick={() => setPlaced([])}>Clear</GhostButton>}
            <GhostButton onClick={() => setResult('gave-up')}>I don't know</GhostButton>
          </div>
        </>
      )}

      {answered && (
        <div className="text-center flex flex-col gap-1">
          <div className={`font-bold ${result === 'right' ? 'text-success' : 'text-danger'}`}>
            {result === 'right' ? 'Correct!' : result === 'wrong' ? 'Not quite' : 'The answer is'}
          </div>
          {result !== 'right' && (
            <div className={`${singleThaiFontClass(fontStyle)} text-3xl font-semibold text-txt-primary`}>
              {sentence.chunks.join(' ')}
            </div>
          )}
          {result === 'right' && built.join('') !== fullThai && (
            <div className="text-txt-tertiary text-xs">
              Also right: <span className={singleThaiFontClass(fontStyle)}>{sentence.chunks.join(' ')}</span>
            </div>
          )}
        </div>
      )}
    </ExerciseLayout>
  );
}
