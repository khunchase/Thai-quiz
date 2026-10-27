import { useState } from 'react';
import type { QuizQuestion, Grade } from '../../types/quiz';
import { gradeForTyped, GRADE_GIVE_UP } from '../../lib/srs';
import { checkThaiIgnoringTones, isRomanizationCorrect } from '../../lib/answer';
import { AccentButton } from '../ui/Button';
import { ThaiWord } from './ThaiWord';
import { useSettingsStore, singleThaiFontClass } from '../../stores/settings-store';
import { ExerciseLayout, ExercisePrompt, type ExerciseFrame } from './ExerciseLayout';

interface Props extends ExerciseFrame {
  question: QuizQuestion;
  onAnswered: (grade: Grade, correct: boolean, userAnswer?: string) => void;
}

/** 'tone' = right apart from tone marks, which this mode forgives. */
type Result = 'correct' | 'tone' | 'incorrect' | 'gave-up';

interface Pending {
  grade: Grade;
  correct: boolean;
  answer?: string;
}

/** A tone slip still passes, just with slightly weaker recall than a perfect answer. */
const GRADE_TONE_SLIP: Grade = 4;

/**
 * Phonetics quiz: 'th-en' shows Thai script and asks for the romanization;
 * 'en-th' shows the tone-marked romanization and asks for Thai script.
 * Tone marks are forgiven in both directions.
 */
export function PhoneticQuestion({ question, onAnswered, ...frame }: Props) {
  const [value, setValue] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const [pending, setPending] = useState<Pending | null>(null);
  const scriptPractice = useSettingsStore((s) => s.settings.scriptPracticeMode);
  const fontStyle = useSettingsStore((s) => s.settings.thaiFontStyle);
  const { word, direction } = question;
  const typingThai = direction === 'en-th';
  const pronunciation = word.pronunciation ?? word.romanization;

  function submit() {
    if (result || !value.trim()) return;
    let outcome: Result;
    if (typingThai) {
      const check = checkThaiIgnoringTones(value, word.thai);
      outcome = check === 'exact' ? 'correct' : check === 'tone' ? 'tone' : 'incorrect';
    } else {
      outcome = isRomanizationCorrect(value, [word.romanization, pronunciation]) ? 'correct' : 'incorrect';
    }
    const correct = outcome !== 'incorrect';
    setResult(outcome);
    setPending({ grade: outcome === 'tone' ? GRADE_TONE_SLIP : gradeForTyped(correct), correct, answer: value });
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

  const passed = result === 'correct' || result === 'tone';

  return (
    <ExerciseLayout
      {...frame}
      word={word}
      revealed={!!result}
      pendingGrade={pending?.grade}
      onNext={next}
      playText={word.thai}
      // Hearing the Thai would give away the spelling.
      playDisabled={typingThai && !result}
      onHelp={giveUp}
      helpDisabled={!!result}
    >
      <ExercisePrompt label={typingThai ? 'Write it in Thai' : 'How does it sound?'}>
        {typingThai ? (
          <>
            <div className="text-3xl font-bold">{pronunciation}</div>
            {!scriptPractice && <div className="text-txt-secondary text-sm mt-1">{word.english}</div>}
          </>
        ) : (
          <ThaiWord text={word.thai} size="lg" align="left" />
        )}
      </ExercisePrompt>
      <div>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          disabled={!!result}
          autoFocus
          lang={typingThai ? 'th' : 'en'}
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          placeholder={typingThai ? 'พิมพ์ภาษาไทย — type the Thai word' : 'Type the pronunciation'}
          className={`w-full rounded-lg bg-app-card border px-4 outline-none ${
            typingThai ? `h-20 text-4xl ${singleThaiFontClass(fontStyle)}` : 'h-12 text-lg'
          } ${
            passed
              ? 'border-success text-success'
              : result
                ? 'border-danger text-danger'
                : 'border-border text-txt-primary focus:border-accent'
          }`}
        />
        {result && (result !== 'correct' || !typingThai) && (
          <div className="mt-3 flex flex-col gap-1">
            {result === 'tone' && (
              <div className="text-success text-sm">Correct — just check the tone mark:</div>
            )}
            {typingThai && <ThaiWord text={word.thai} size="sm" align="left" />}
            <div className="text-txt-secondary text-sm">
              {pronunciation} · {word.english}
            </div>
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
