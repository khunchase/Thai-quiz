import { useState } from 'react';
import { CLASS_LABELS, letterGlyph, letterSound, letterSpeech, type Letter } from '../../data/alphabet';
import {
  buildLetterQuestion,
  letterPool,
  shuffledRound,
  RETRY_GAP,
  type LetterQuestion,
  type LetterQuizOptions,
} from '../../lib/letter-quiz';
import { useSettingsStore, singleThaiFontClass } from '../../stores/settings-store';
import { AccentButton, GhostButton } from '../ui/Button';
import { AudioButton } from './AudioButton';
import { ExerciseHeader } from './ExerciseLayout';

interface Props {
  options: LetterQuizOptions;
  onExit: () => void;
}

interface Session {
  queue: Letter[];
  question: LetterQuestion;
  count: number;
}

function startSession(options: LetterQuizOptions): Session {
  const [first, ...queue] = shuffledRound(letterPool(options));
  return { queue, question: buildLetterQuestion(first, options, 0), count: 1 };
}

const GAVE_UP = '__gave-up__';

/**
 * Consonants and vowels on their own: no words, flashcards or spaced repetition.
 * It runs until Back; a missed letter comes back a few questions later.
 */
export function LetterQuiz({ options, onExit }: Props) {
  const [session, setSession] = useState(() => startSession(options));
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState({ right: 0, total: 0 });
  const fontStyle = useSettingsStore((s) => s.settings.thaiFontStyle);
  const thaiFont = singleThaiFontClass(fontStyle);

  const { question } = session;
  const { item, ask, choices, answerKey } = question;
  const answered = selected !== null;
  const correct = selected === answerKey;

  function choose(key: string) {
    if (answered) return;
    setSelected(key);
    setScore((s) => ({ right: s.right + (key === answerKey ? 1 : 0), total: s.total + 1 }));
  }

  function next() {
    let queue = [...session.queue];
    if (!correct) queue.splice(Math.min(RETRY_GAP - 1, queue.length), 0, item);
    if (!queue.length) queue = shuffledRound(letterPool(options), item.id);
    const [nextItem, ...rest] = queue;
    setSession({ queue: rest, question: buildLetterQuestion(nextItem, options, session.count), count: session.count + 1 });
    setSelected(null);
  }

  const prompt =
    ask === 'to-letter' ? 'Which letter is this?' : ask === 'class' ? 'Which class is this consonant?' : item.kind === 'consonant' ? 'Name this consonant' : 'What sound is this vowel?';
  const showsGlyph = ask !== 'to-letter';

  return (
    <div className="relative flex-1 min-h-0 flex flex-col overflow-hidden">
      <ExerciseHeader
        title="Letters"
        subtitle={score.total ? `${score.right} / ${score.total} correct` : undefined}
        onExit={onExit}
        playText={letterSpeech(item)}
        // The letter's name gives the answer away until it's answered, except when the name is the question.
        playDisabled={!answered && ask !== 'to-letter'}
      />
      <div className="flex-1 min-h-0 overflow-y-auto px-4 pt-2 pb-[calc(2rem+env(safe-area-inset-bottom))] flex flex-col gap-4">
        <div className="text-txt-secondary font-semibold">{prompt}</div>

        <div className="rounded-xl border border-border bg-app-card py-6 px-4 flex flex-col items-center gap-1 text-center">
          {showsGlyph ? (
            <div className={`${thaiFont} text-8xl font-semibold leading-tight`}>{letterGlyph(item)}</div>
          ) : (
            <div className="text-2xl font-semibold">{letterSound(item)}</div>
          )}
          <div className="text-txt-tertiary text-xs uppercase tracking-wide">
            {item.kind === 'consonant' ? 'Consonant' : 'Vowel'}
          </div>
        </div>

        <div className={`grid gap-2 ${ask === 'to-letter' ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {choices.map((choice) => {
            const isAnswer = choice.key === answerKey;
            const isPicked = choice.key === selected;
            let style = 'bg-app-card border-border text-txt-primary';
            if (answered) {
              if (isAnswer) style = 'bg-success/15 border-success text-success';
              else if (isPicked) style = 'bg-danger/15 border-danger text-danger';
              else style = 'bg-app-card border-border text-txt-tertiary';
            }
            return (
              <button
                key={choice.key}
                type="button"
                onClick={() => choose(choice.key)}
                disabled={answered}
                className={`w-full rounded-lg border px-4 py-3 transition-colors ${style} ${
                  ask === 'to-letter' ? `${thaiFont} text-5xl font-semibold py-4` : 'text-left text-base font-semibold'
                }`}
              >
                {choice.text}
              </button>
            );
          })}
        </div>

        {!answered && (
          <GhostButton onClick={() => choose(GAVE_UP)} className="self-center">
            I don't know
          </GhostButton>
        )}

        {answered && (
          <>
            <div className={`text-center font-bold ${correct ? 'text-success' : 'text-danger'}`}>
              {correct ? 'Correct!' : 'Not quite — it comes back soon'}
            </div>
            <AccentButton onClick={next}>Next</AccentButton>
            <LetterDetails item={item} thaiFont={thaiFont} />
          </>
        )}
      </div>
    </div>
  );
}

function LetterDetails({ item, thaiFont }: { item: Letter; thaiFont: string }) {
  const rows: [string, string][] =
    item.kind === 'consonant'
      ? [
          ['Name', `${item.nameRoman} — ${item.meaning}`],
          ['Class', CLASS_LABELS[item.class]],
          ['Starts a syllable as', item.initial],
          ['Ends a syllable as', item.final ?? 'never used at the end'],
          ...(item.obsolete ? ([['Note', 'Obsolete — no longer used in writing']] as [string, string][]) : []),
        ]
      : [
          ['Sound', item.sound],
          ['Length', item.length === 'long' ? 'Long' : 'Short'],
          ...(item.note ? ([['Note', item.note]] as [string, string][]) : []),
        ];

  return (
    <div className="rounded-xl border border-border bg-app-card p-4 flex flex-col gap-3">
      <div className="flex items-center gap-4">
        <div className={`${thaiFont} text-5xl font-semibold`}>{letterGlyph(item)}</div>
        <div className={`${thaiFont} flex-1 min-w-0 text-xl text-txt-secondary`}>{item.name}</div>
        <AudioButton text={letterSpeech(item)} />
      </div>
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="contents">
            <dt className="text-txt-tertiary">{label}</dt>
            <dd className="text-txt-primary">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
