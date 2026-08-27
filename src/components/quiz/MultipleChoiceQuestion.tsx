import { useState } from 'react';
import type { QuizQuestion, Grade } from '../../types/quiz';
import { gradeForMultipleChoice, GRADE_GIVE_UP } from '../../lib/srs';
import { AudioButton } from './AudioButton';
import { ThaiWord } from './ThaiWord';
import { AccentButton, GhostButton } from '../ui/Button';
import { useSettingsStore } from '../../stores/settings-store';

interface Props {
  question: QuizQuestion;
  onAnswered: (grade: Grade, correct: boolean, userAnswer?: string) => void;
}

const GAVE_UP = Symbol('gave-up');

interface Pending {
  grade: Grade;
  correct: boolean;
  answer?: string;
}

export function MultipleChoiceQuestion({ question, onAnswered }: Props) {
  const [selected, setSelected] = useState<string | typeof GAVE_UP | null>(null);
  const [pending, setPending] = useState<Pending | null>(null);
  const scriptPractice = useSettingsStore((s) => s.settings.scriptPracticeMode);
  const { word, direction, options = [] } = question;

  const promptText = direction === 'th-en' ? word.thai : word.english;
  const correctText = direction === 'th-en' ? word.english : word.thai;
  const showRomanization = direction === 'th-en' && !scriptPractice;

  function choose(option: string) {
    if (selected) return;
    setSelected(option);
    const correct = option === correctText;
    setPending({ grade: gradeForMultipleChoice(correct), correct, answer: option });
  }

  function giveUp() {
    if (selected) return;
    setSelected(GAVE_UP);
    setPending({ grade: GRADE_GIVE_UP, correct: false });
  }

  function next() {
    if (!pending) return;
    onAnswered(pending.grade, pending.correct, pending.answer);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center py-6">
        {direction === 'th-en' ? (
          <ThaiWord text={promptText} size="lg" />
        ) : (
          <div className="text-4xl font-semibold">{promptText}</div>
        )}
        {showRomanization && (
          <div className="text-txt-secondary text-sm mt-2">{word.pronunciation ?? word.romanization}</div>
        )}
        {direction === 'th-en' && (
          <div className="flex justify-center mt-3">
            <AudioButton text={word.thai} />
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 gap-3">
        {options.map((option) => {
          const isCorrectOption = option === correctText;
          const isSelected = option === selected;
          let style = 'bg-app-card border-border text-txt-primary';
          if (selected) {
            if (isCorrectOption) style = 'bg-success/15 border-success text-success';
            else if (isSelected) style = 'bg-danger/15 border-danger text-danger';
            else style = 'bg-app-card border-border text-txt-tertiary';
          }
          return (
            <div
              key={option}
              role="button"
              tabIndex={0}
              onClick={() => choose(option)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  choose(option);
                }
              }}
              className={`w-full text-left px-4 py-4 rounded-lg border font-medium transition-colors flex items-center gap-3 ${
                selected ? 'cursor-default' : 'cursor-pointer'
              } ${style}`}
            >
              <div className="flex-1 min-w-0">
                {direction === 'en-th' ? (
                  <ThaiWord text={option} size="sm" align="left" mutedSecondary={false} />
                ) : (
                  option
                )}
              </div>
              {direction === 'en-th' && <AudioButton text={option} className="shrink-0" />}
            </div>
          );
        })}
      </div>
      {!selected && (
        <GhostButton onClick={giveUp} className="self-center">
          I don't know
        </GhostButton>
      )}
      {pending && (
        <AccentButton onClick={next}>Next question</AccentButton>
      )}
    </div>
  );
}
