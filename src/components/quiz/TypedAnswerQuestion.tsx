import { useState } from 'react';
import type { QuizQuestion, Grade } from '../../types/quiz';
import { gradeForTyped } from '../../lib/srs';
import { isTypedAnswerCorrect } from '../../lib/answer';
import { AccentButton } from '../ui/Button';
import { AudioButton } from './AudioButton';
import { useSettingsStore } from '../../stores/settings-store';

interface Props {
  question: QuizQuestion;
  onAnswered: (grade: Grade, correct: boolean, userAnswer?: string) => void;
}

export function TypedAnswerQuestion({ question, onAnswered }: Props) {
  const [value, setValue] = useState('');
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null);
  const scriptPractice = useSettingsStore((s) => s.settings.scriptPracticeMode);
  const { word, direction } = question;

  const promptText = direction === 'th-en' ? word.thai : word.english;
  const correctAnswer = direction === 'th-en' ? word.english : word.romanization;
  const showRomanization = direction === 'th-en' && !scriptPractice;

  function submit() {
    if (result || !value.trim()) return;
    const correct = isTypedAnswerCorrect(value, correctAnswer);
    setResult(correct ? 'correct' : 'incorrect');
    window.setTimeout(() => onAnswered(gradeForTyped(correct), correct, value), 900);
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
      <div>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          disabled={!!result}
          autoFocus
          placeholder={direction === 'th-en' ? 'Type the English meaning' : 'Type the romanization'}
          className={`w-full h-12 rounded-lg bg-app-card border px-4 text-lg outline-none ${
            result === 'correct'
              ? 'border-success text-success'
              : result === 'incorrect'
                ? 'border-danger text-danger'
                : 'border-border text-txt-primary focus:border-accent'
          }`}
        />
        {result === 'incorrect' && (
          <div className="text-danger text-sm mt-2">
            Correct answer: <span className={direction === 'en-th' ? 'font-thai' : ''}>{correctAnswer}</span>
          </div>
        )}
      </div>
      {!result && (
        <AccentButton onClick={submit} disabled={!value.trim()}>
          Check
        </AccentButton>
      )}
    </div>
  );
}
