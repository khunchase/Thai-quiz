import { useState } from 'react';
import type { QuizQuestion, Grade } from '../../types/quiz';
import { gradeForTyped, GRADE_GIVE_UP } from '../../lib/srs';
import { isTypedAnswerCorrect } from '../../lib/answer';
import { AccentButton, GhostButton } from '../ui/Button';
import { AudioButton } from './AudioButton';
import { ThaiWord } from './ThaiWord';
import { useSettingsStore } from '../../stores/settings-store';

interface Props {
  question: QuizQuestion;
  onAnswered: (grade: Grade, correct: boolean, userAnswer?: string) => void;
}

type Result = 'correct' | 'incorrect' | 'gave-up';

interface Pending {
  grade: Grade;
  correct: boolean;
  answer?: string;
}

export function TypedAnswerQuestion({ question, onAnswered }: Props) {
  const [value, setValue] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const [pending, setPending] = useState<Pending | null>(null);
  const scriptPractice = useSettingsStore((s) => s.settings.scriptPracticeMode);
  const { word, direction } = question;

  const promptText = direction === 'th-en' ? word.thai : word.english;
  const correctAnswer = direction === 'th-en' ? word.english : word.romanization;
  const showRomanization = direction === 'th-en' && !scriptPractice;

  function submit() {
    if (result || !value.trim()) return;
    const correct = isTypedAnswerCorrect(value, correctAnswer);
    setResult(correct ? 'correct' : 'incorrect');
    setPending({ grade: gradeForTyped(correct), correct, answer: value });
  }

  function giveUp() {
    if (result) return;
    setResult('gave-up');
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
              : result === 'incorrect' || result === 'gave-up'
                ? 'border-danger text-danger'
                : 'border-border text-txt-primary focus:border-accent'
          }`}
        />
        {(result === 'incorrect' || result === 'gave-up') && (
          <div className="text-danger text-sm mt-2">
            Correct answer: <span className={direction === 'en-th' ? 'font-thai' : ''}>{correctAnswer}</span>
          </div>
        )}
      </div>
      {!result && (
        <div className="flex flex-col gap-3">
          <AccentButton onClick={submit} disabled={!value.trim()}>
            Check
          </AccentButton>
          <GhostButton onClick={giveUp} className="self-center">
            I don't know
          </GhostButton>
        </div>
      )}
      {pending && <AccentButton onClick={next}>Next question</AccentButton>}
    </div>
  );
}
