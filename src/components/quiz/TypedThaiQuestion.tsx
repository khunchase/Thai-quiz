import { useState } from 'react';
import type { QuizQuestion, Grade } from '../../types/quiz';
import { gradeForTyped, GRADE_GIVE_UP } from '../../lib/srs';
import { isThaiAnswerCorrect } from '../../lib/answer';
import { AccentButton } from '../ui/Button';
import { ThaiWord } from './ThaiWord';
import { useSettingsStore, singleThaiFontClass } from '../../stores/settings-store';
import { ExerciseLayout, ExercisePrompt, type ExerciseFrame } from './ExerciseLayout';

interface Props extends ExerciseFrame {
  question: QuizQuestion;
  onAnswered: (grade: Grade, correct: boolean, userAnswer?: string) => void;
}

type Result = 'correct' | 'incorrect' | 'gave-up';

interface Pending {
  grade: Grade;
  correct: boolean;
  answer?: string;
}

export function TypedThaiQuestion({ question, onAnswered, ...frame }: Props) {
  const [value, setValue] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const [pending, setPending] = useState<Pending | null>(null);
  const scriptPractice = useSettingsStore((s) => s.settings.scriptPracticeMode);
  const fontStyle = useSettingsStore((s) => s.settings.thaiFontStyle);
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
    <ExerciseLayout
      {...frame}
      word={word}
      revealed={!!result}
      pendingGrade={pending?.grade}
      onNext={next}
      playText={word.thai}
      // Hearing the Thai would give away the spelling.
      playDisabled={!result}
      onHelp={giveUp}
      helpDisabled={!!result}
    >
      <ExercisePrompt label="Type it in Thai">
        <div className="text-3xl font-bold">{word.english}</div>
        {showHint && <div className="text-txt-secondary text-sm mt-1">{word.pronunciation ?? word.romanization}</div>}
      </ExercisePrompt>
      <div>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          disabled={!!result}
          autoFocus
          lang="th"
          placeholder="พิมพ์คำภาษาไทย — type the Thai word"
          className={`w-full h-20 rounded-lg bg-app-card border px-4 text-4xl ${singleThaiFontClass(fontStyle)} outline-none ${
            result === 'correct'
              ? 'border-success text-success'
              : result === 'incorrect' || result === 'gave-up'
                ? 'border-danger text-danger'
                : 'border-border text-txt-primary focus:border-accent'
          }`}
        />
        {(result === 'incorrect' || result === 'gave-up') && (
          <div className="mt-3">
            <ThaiWord text={word.thai} size="sm" align="left" />
          </div>
        )}
      </div>
      {!result && (
        <AccentButton onClick={submit} disabled={!value.trim()}>
          Check
        </AccentButton>
      )}
    </ExerciseLayout>
  );
}
