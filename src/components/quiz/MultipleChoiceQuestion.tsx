import { useState } from 'react';
import type { QuizQuestion, Grade } from '../../types/quiz';
import { gradeForMultipleChoice } from '../../lib/srs';
import { AudioButton } from './AudioButton';
import { useSettingsStore } from '../../stores/settings-store';

interface Props {
  question: QuizQuestion;
  onAnswered: (grade: Grade, correct: boolean, userAnswer?: string) => void;
}

export function MultipleChoiceQuestion({ question, onAnswered }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const scriptPractice = useSettingsStore((s) => s.settings.scriptPracticeMode);
  const { word, direction, options = [] } = question;

  const promptText = direction === 'th-en' ? word.thai : word.english;
  const correctText = direction === 'th-en' ? word.english : word.thai;
  const showRomanization = direction === 'th-en' && !scriptPractice;

  function choose(option: string) {
    if (selected) return;
    setSelected(option);
    const correct = option === correctText;
    window.setTimeout(() => onAnswered(gradeForMultipleChoice(correct), correct, option), 550);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center py-6">
        <div className={`text-4xl font-semibold ${direction === 'th-en' ? 'font-thai' : ''}`}>{promptText}</div>
        {showRomanization && <div className="text-txt-secondary text-sm mt-2">{word.romanization}</div>}
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
            <button
              key={option}
              onClick={() => choose(option)}
              disabled={!!selected}
              className={`w-full text-left px-4 py-3 rounded-lg border font-medium transition-colors ${style} ${
                direction === 'en-th' ? 'font-thai text-xl' : ''
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
