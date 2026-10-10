import { useEffect, useEffectEvent, useState } from 'react';
import type { Grade, QuizQuestion } from '../types/quiz';
import { MODE_INFO } from '../lib/quiz';
import { speakJapanese } from '../lib/speech';
import { gradeForMultipleChoice, GRADE_GIVE_UP } from '../lib/srs';
import { scenarioById } from '../data';
import { useSettingsStore } from '../stores/settings-store';
import { Furigana } from './Furigana';
import { AudioButton } from './AudioButton';
import { PhraseDetails } from './PhraseDetails';
import { SpeakerTag } from './SpeakerTag';
import { AccentButton } from './ui/Button';

interface QuestionCardProps {
  question: QuizQuestion;
  onAnswered: (grade: Grade, correct: boolean) => void;
}

export function QuestionCard({ question, onAnswered }: QuestionCardProps) {
  const { mode, phrase, options } = question;
  const { autoplay, listeningMode, speechRate } = useSettingsStore((s) => s.settings);
  const [picked, setPicked] = useState<number | null>(null);
  const [gaveUp, setGaveUp] = useState(false);
  const answered = picked !== null || gaveUp;

  const promptIsJapanese = mode !== 'say';
  const hideText = listeningMode && (mode === 'understand' || mode === 'respond') && !answered;
  const optionsAreJapanese = mode !== 'understand';

  // Speak once per question, not again when settings change mid-question.
  const playPrompt = useEffectEvent(() => {
    if (autoplay && promptIsJapanese) speakJapanese(phrase.jp, speechRate);
  });
  useEffect(() => playPrompt(), [question.id]);

  function pick(index: number) {
    if (answered) return;
    setPicked(index);
    if (mode === 'say' && autoplay) speakJapanese(phrase.jp, speechRate);
    if (mode === 'respond' && autoplay) speakJapanese(phrase.reply!.jp, speechRate);
  }

  function next() {
    const correct = picked !== null && options[picked].correct;
    onAnswered(gaveUp ? GRADE_GIVE_UP : gradeForMultipleChoice(correct), correct);
  }

  const scenario = scenarioById[phrase.scenarioId];
  const correctPicked = picked !== null && options[picked].correct;

  return (
    <div className="flex flex-col gap-3">
      <div className="text-txt-tertiary text-xs font-semibold flex items-center gap-1.5">
        <span>{MODE_INFO[mode].icon}</span>
        <span className="uppercase tracking-wide">{MODE_INFO[mode].label}</span>
        <span>·</span>
        <span>
          {scenario.icon} {scenario.name}
        </span>
      </div>

      <div className="bg-app-card rounded-lg border border-border/60 p-4 flex flex-col gap-3">
        {promptIsJapanese ? (
          <>
            <SpeakerTag phrase={phrase} />
            <div className="flex items-start gap-3">
              {hideText ? (
                <div className="flex-1 text-txt-tertiary text-sm py-3">🎧 Listen — the text appears after you answer.</div>
              ) : (
                <Furigana markup={phrase.jp} className="flex-1 text-2xl leading-[2.2] font-medium" />
              )}
              <AudioButton markup={phrase.jp} size="large" />
            </div>
          </>
        ) : (
          <>
            <div className="text-[10px] font-semibold uppercase tracking-wide text-accent">You want to say</div>
            <div className="text-xl font-semibold leading-snug">{phrase.en}</div>
          </>
        )}
        <div className="text-txt-secondary text-sm">{MODE_INFO[mode].prompt}</div>
      </div>

      <div className="flex flex-col gap-2">
        {options.map((option, i) => {
          let style = 'bg-app-card border-border/60';
          if (answered) {
            if (option.correct) style = 'bg-success/10 border-success';
            else if (i === picked) style = 'bg-danger/10 border-danger';
            else style = 'bg-app-card border-border/40 opacity-50';
          }
          return (
            <button
              key={i}
              onClick={() => pick(i)}
              disabled={answered}
              className={`text-left rounded-lg border px-4 py-3 transition-colors active:scale-[0.99] ${style}`}
            >
              {optionsAreJapanese ? (
                <Furigana markup={option.text} className="text-lg leading-[2.1]" />
              ) : (
                <span className="text-[15px] leading-snug">{option.text}</span>
              )}
            </button>
          );
        })}
      </div>

      {!answered && (
        <button onClick={() => setGaveUp(true)} className="text-txt-tertiary text-sm font-semibold py-2">
          I don't know
        </button>
      )}

      {answered && (
        <div className="flex flex-col gap-3">
          <div className={`font-bold ${correctPicked ? 'text-success' : 'text-danger'}`}>
            {correctPicked ? '正解！ Correct' : gaveUp ? 'Here it is' : 'Not quite'}
          </div>
          <div className="bg-app-card rounded-lg border border-border/60 p-4 flex flex-col gap-3">
            <SpeakerTag phrase={phrase} />
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <Furigana markup={phrase.jp} className="text-xl leading-[2.1] font-medium" show />
                <div className="text-txt-secondary text-sm mt-1">{phrase.en}</div>
              </div>
              <AudioButton markup={phrase.jp} />
            </div>
            <PhraseDetails phrase={phrase} />
          </div>
          <AccentButton onClick={next}>Next</AccentButton>
        </div>
      )}
    </div>
  );
}
