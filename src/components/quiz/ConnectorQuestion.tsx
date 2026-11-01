import { Fragment, useState } from 'react';
import type { QuizQuestion, Grade } from '../../types/quiz';
import { gradeForMultipleChoice, GRADE_GIVE_UP, type ScheduleOptions } from '../../lib/srs';
import { CONNECTOR_GROUP_LABELS, CONNECTOR_INFO, fillBlank } from '../../data/conjunctions';
import { useSettingsStore, singleThaiFontClass } from '../../stores/settings-store';
import { GhostButton } from '../ui/Button';
import { AudioButton } from './AudioButton';
import { ExerciseLayout, ExercisePrompt, type ExerciseFrame } from './ExerciseLayout';

interface Props extends ExerciseFrame {
  question: QuizQuestion;
  onAnswered: (grade: Grade, correct: boolean, userAnswer?: string, options?: ScheduleOptions) => void;
}

const GAVE_UP = Symbol('gave-up');

/** Clause ___ clause: pick the connector that gives the sentence its meaning. */
export function ConnectorQuestion({ question, onAnswered, ...frame }: Props) {
  const [selected, setSelected] = useState<string | typeof GAVE_UP | null>(null);
  const scriptPractice = useSettingsStore((s) => s.settings.scriptPracticeMode);
  const fontStyle = useSettingsStore((s) => s.settings.thaiFontStyle);
  const { word, sentence, options = [] } = question;
  if (!sentence) return null;

  const answered = selected !== null;
  const correct = selected === word.id;
  const [before, after] = sentence.thai.split('___');
  const group = CONNECTOR_INFO[word.id]?.group;

  function next() {
    if (!answered) return;
    const grade = selected === GAVE_UP ? GRADE_GIVE_UP : gradeForMultipleChoice(correct);
    onAnswered(grade, correct, typeof selected === 'string' ? selected : undefined);
  }

  let blankStyle = 'border-accent/70 text-accent';
  if (answered) blankStyle = correct ? 'border-success bg-success/15 text-success' : 'border-danger bg-danger/15 text-danger';

  return (
    <ExerciseLayout
      {...frame}
      word={word}
      answered={answered}
      pendingGrade={answered ? (selected === GAVE_UP ? GRADE_GIVE_UP : gradeForMultipleChoice(correct)) : null}
      onNext={next}
      playText={fillBlank(sentence, word)}
      // Hearing the sentence would give the answer away.
      playDisabled={!answered}
    >
      <ExercisePrompt label="Fill in the connector">
        <div className={`${singleThaiFontClass(fontStyle)} text-2xl font-semibold leading-relaxed`}>
          {before}
          <span className={`inline-block min-w-16 mx-1 px-2 rounded-md border-2 border-dashed text-center ${blankStyle}`}>
            {answered ? word.thai : '?'}
          </span>
          {after}
        </div>
      </ExercisePrompt>

      <div className="text-txt-secondary text-base">
        <Highlighted text={sentence.english} />
      </div>

      <div className="grid grid-cols-1 gap-2">
        {options.map((option) => {
          const isAnswer = option.word.id === word.id;
          const isPicked = option.word.id === selected;
          let style = 'bg-app-card border-border text-txt-primary';
          if (answered) {
            if (isAnswer) style = 'bg-success/15 border-success text-success';
            else if (isPicked) style = 'bg-danger/15 border-danger text-danger';
            else style = 'bg-app-card border-border text-txt-tertiary';
          }
          return (
            <div key={option.word.id} className={`w-full rounded-lg border transition-colors overflow-hidden flex items-stretch ${style}`}>
              <button
                type="button"
                disabled={answered}
                onClick={() => setSelected(option.word.id)}
                className="flex-1 min-w-0 px-4 py-3 text-left"
              >
                <div className={`${singleThaiFontClass(fontStyle)} text-2xl font-semibold`}>{option.text}</div>
                {(!scriptPractice || answered) && (
                  <div className="text-xs opacity-80 mt-0.5">{option.word.pronunciation ?? option.word.romanization}</div>
                )}
                {answered && <div className="text-xs mt-0.5">{option.word.english}</div>}
              </button>
              <AudioButton text={option.text} variant="zone" />
            </div>
          );
        })}
      </div>

      {!answered && (
        <GhostButton onClick={() => setSelected(GAVE_UP)} className="self-center">
          I don't know
        </GhostButton>
      )}
      {answered && group && (
        <div className="text-center text-sm">
          <span className="text-txt-tertiary">Relationship: </span>
          <span className="text-txt-primary font-semibold">{CONNECTOR_GROUP_LABELS[group]}</span>
        </div>
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
