import { Fragment, useState } from 'react';
import type { QuizQuestion, Grade } from '../../types/quiz';
import type { Word } from '../../types/word';
import { gradeForMultipleChoice, GRADE_GIVE_UP, GRADE_KNOWN, type ScheduleOptions } from '../../lib/srs';
import { CONNECTOR_GROUP_LABELS, CONNECTOR_INFO, fillBlank } from '../../data/conjunctions';
import { useSettingsStore, singleThaiFontClass } from '../../stores/settings-store';
import { GhostButton } from '../ui/Button';
import { AudioButton } from './AudioButton';
import { ExerciseLayout, type ExerciseFrame } from './ExerciseLayout';
import { WordDetailPopup, type ReviewStatus } from './MultipleChoiceQuestion';

interface Props extends ExerciseFrame {
  question: QuizQuestion;
  onAnswered: (grade: Grade, correct: boolean, userAnswer?: string, options?: ScheduleOptions) => void;
  onMarkWord?: (wordId: string, grade: Grade, correct: boolean) => void;
}

const GAVE_UP = Symbol('gave-up');

interface Pending {
  grade: Grade;
  correct: boolean;
  answer?: string;
  markedKnown?: boolean;
}

/** Clause ___ clause: pick the connector that gives the sentence its meaning. */
export function ConnectorQuestion({ question, onAnswered, onMarkWord, ...frame }: Props) {
  const [selected, setSelected] = useState<string | typeof GAVE_UP | null>(null);
  const [pending, setPending] = useState<Pending | null>(null);
  const [reviewed, setReviewed] = useState<Record<string, ReviewStatus>>({});
  const [detailWord, setDetailWord] = useState<Word | null>(null);
  const fontStyle = useSettingsStore((s) => s.settings.thaiFontStyle);
  const { word, sentence, options = [] } = question;
  if (!sentence) return null;

  const answered = selected !== null;
  const correct = selected === word.id;
  const [before, after] = sentence.thai.split('___');
  const group = CONNECTOR_INFO[word.id]?.group;

  function choose(wordId: string) {
    if (answered) return;
    setSelected(wordId);
    const isRight = wordId === word.id;
    setPending({ grade: gradeForMultipleChoice(isRight), correct: isRight, answer: wordId });
  }

  function giveUp() {
    if (answered) return;
    setSelected(GAVE_UP);
    setPending({ grade: GRADE_GIVE_UP, correct: false });
  }

  function next() {
    if (!pending) return;
    onAnswered(pending.grade, pending.correct, pending.answer, { markedKnown: pending.markedKnown });
  }

  // Same as the Words quiz: swiping the question word replaces its grade; other words are recorded straight away.
  function reviewWord(wordId: string, status: ReviewStatus) {
    if (reviewed[wordId]) return;
    setReviewed((r) => ({ ...r, [wordId]: status }));
    if (wordId === word.id) {
      setPending(
        (p) => p && { ...p, grade: status === 'known' ? GRADE_KNOWN : GRADE_GIVE_UP, markedKnown: status === 'known' }
      );
    } else if (status === 'known') onMarkWord?.(wordId, GRADE_KNOWN, true);
    else onMarkWord?.(wordId, GRADE_GIVE_UP, false);
    setDetailWord(null);
  }

  // The blank isn't filled in; it just turns green (right) or red (wrong).
  let blankStyle = 'border-accent/70 text-accent';
  if (answered) blankStyle = correct ? 'border-success bg-success/15 text-success' : 'border-danger bg-danger/15 text-danger';

  return (
    <ExerciseLayout
      {...frame}
      word={word}
      answered={answered}
      pendingGrade={pending?.grade}
      pendingOptions={{ markedKnown: pending?.markedKnown }}
      onNext={next}
      playText={fillBlank(sentence, word)}
      // Hearing the sentence would give the answer away.
      playDisabled={!answered}
    >
      {/* No search icon beside the sentence, so it gets the full width. */}
      <div className="flex flex-col gap-3 py-2">
        <div className="text-txt-secondary font-semibold">Fill in the connector</div>
        <div className={`${singleThaiFontClass(fontStyle)} text-5xl font-semibold leading-snug`}>
          {before}
          <span className={`inline-block min-w-16 mx-1 px-2 rounded-md border-2 border-dashed text-center ${blankStyle}`}>
            {answered ? (correct ? '✓' : '✗') : '?'}
          </span>
          {after}
        </div>
      </div>

      <div className="text-txt-secondary text-base">
        <Highlighted text={sentence.english} />
      </div>

      <div className="grid grid-cols-1 gap-2">
        {options.map((option) => {
          const isAnswer = option.word.id === word.id;
          const isPicked = option.word.id === selected;
          const reviewStatus = reviewed[option.word.id];
          let style = 'bg-app-card border-border text-txt-primary';
          if (answered) {
            if (isAnswer) style = 'bg-success/15 border-success text-success';
            else if (isPicked) style = 'bg-danger/15 border-danger text-danger';
            else style = 'bg-app-card border-border text-txt-tertiary';
          }
          return (
            <div
              key={option.word.id}
              className={`w-full rounded-lg border transition-colors overflow-hidden flex items-stretch ${style} ${
                reviewStatus ? 'opacity-50' : ''
              }`}
            >
              <button
                type="button"
                // Before answering a tap picks it; after, a tap opens its card.
                onClick={() => (answered ? setDetailWord(option.word) : choose(option.word.id))}
                className="flex-1 min-w-0 px-4 py-3 text-left flex items-center gap-3"
              >
                <div className={`flex-1 min-w-0 ${singleThaiFontClass(fontStyle)} text-3xl font-semibold`}>
                  {option.text}
                </div>
                {reviewStatus === 'known' && (
                  <span className="text-success text-lg shrink-0" aria-label="Marked as known">
                    ✓
                  </span>
                )}
                {reviewStatus === 'learn' && (
                  <span className="text-warning text-lg shrink-0" aria-label="Marked to learn">
                    📖
                  </span>
                )}
              </button>
              <AudioButton text={option.text} variant="zone" />
            </div>
          );
        })}
      </div>

      {!answered && (
        <GhostButton onClick={giveUp} className="self-center">
          I don't know
        </GhostButton>
      )}
      {answered && (
        <>
          {group && (
            <div className="text-center text-sm">
              <span className="text-txt-tertiary">Relationship: </span>
              <span className="text-txt-primary font-semibold">{CONNECTOR_GROUP_LABELS[group]}</span>
            </div>
          )}
          <div className="text-txt-tertiary text-xs text-center">
            Tap a word to see details, then swipe to mark it known or to learn
          </div>
        </>
      )}

      {detailWord && (
        <WordDetailPopup
          word={detailWord}
          reviewStatus={reviewed[detailWord.id]}
          onClose={() => setDetailWord(null)}
          onReview={(status) => reviewWord(detailWord.id, status)}
        />
      )}
    </ExerciseLayout>
  );
}

/** Renders "[When] I was young" with the bracketed words highlighted. */
function Highlighted({ text }: { text: string }) {
  const parts = text.split(/\[([^\]]+)\]/);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className="text-accent font-bold underline decoration-2 underline-offset-4">
            {part}
          </span>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        )
      )}
    </>
  );
}
