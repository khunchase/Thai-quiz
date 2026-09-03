import { useState } from 'react';
import type { QuizQuestion, Grade } from '../../types/quiz';
import { gradeForTyped, GRADE_GIVE_UP } from '../../lib/srs';
import { isThaiAnswerCorrect } from '../../lib/answer';
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

export function TypedThaiQuestion({ question, onAnswered }: Props) {
  const [value, setValue] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const [pending, setPending] = useState<Pending | null>(null);
  const scriptPractice = useSettingsStore((s) => s.settings.scriptPracticeMode);
  const { word } = question;

  const showHint = !scriptPractice;

  function submit() {
    if (result || !value.trim()) return;
    const correct = isThaiAnswerCorrect(value, word.thai);
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
    <div className="flex flex-col gap-4">
      <div className="text-center py-3">
        <div className="text-4xl font-semibold">{word.english}</div>
        {showHint && <div className="text-txt-secondary text-sm mt-1">{word.pronunciation ?? word.romanization}</div>}
      </div>
      <div>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          disabled={!!result}
          autoFocus
          lang="th"
          placeholder="พิมพ์คำภาษาไทย — type the Thai word"
          className={`w-full h-20 rounded-lg bg-app-card border px-4 text-4xl font-thai-looped outline-none ${
            result === 'correct'
              ? 'border-success text-success'
              : result === 'incorrect' || result === 'gave-up'
                ? 'border-danger text-danger'
                : 'border-border text-txt-primary focus:border-accent'
          }`}
        />
        {(result === 'incorrect' || result === 'gave-up') && (
          <div className="mt-3 flex items-center gap-3">
            <ThaiWord text={word.thai} size="sm" align="left" />
            <AudioButton text={word.thai} />
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
