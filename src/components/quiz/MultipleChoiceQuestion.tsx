import { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import type { QuizQuestion, Grade, MultipleChoiceOption, Direction } from '../../types/quiz';
import type { Word } from '../../types/word';
import { gradeForMultipleChoice, GRADE_GIVE_UP, GRADE_KNOWN } from '../../lib/srs';
import { AudioButton } from './AudioButton';
import { ThaiWord } from './ThaiWord';
import { AccentButton, GhostButton } from '../ui/Button';
import { useSettingsStore } from '../../stores/settings-store';

interface Props {
  question: QuizQuestion;
  onAnswered: (grade: Grade, correct: boolean, userAnswer?: string) => void;
  onMarkWord?: (wordId: string, grade: Grade, correct: boolean) => void;
}

const GAVE_UP = Symbol('gave-up');

interface Pending {
  grade: Grade;
  correct: boolean;
  answer?: string;
}

type ReviewStatus = 'known' | 'learn';

export function MultipleChoiceQuestion({ question, onAnswered, onMarkWord }: Props) {
  const [selected, setSelected] = useState<string | typeof GAVE_UP | null>(null);
  const [pending, setPending] = useState<Pending | null>(null);
  const [reviewed, setReviewed] = useState<Record<string, ReviewStatus>>({});
  const [popupWord, setPopupWord] = useState<Word | null>(null);
  const scriptPractice = useSettingsStore((s) => s.settings.scriptPracticeMode);
  const { word, direction, options = [] } = question;

  const promptText = direction === 'th-en' ? word.thai : word.english;
  const correctText = direction === 'th-en' ? word.english : word.thai;
  const showRomanization = direction === 'th-en' && !scriptPractice;
  const answered = !!selected;

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

  function handleSwipe(option: MultipleChoiceOption, direction: ReviewStatus) {
    if (reviewed[option.word.id]) return;
    setReviewed((r) => ({ ...r, [option.word.id]: direction }));
    if (direction === 'known') {
      onMarkWord?.(option.word.id, GRADE_KNOWN, true);
    } else {
      onMarkWord?.(option.word.id, GRADE_GIVE_UP, false);
      setPopupWord(option.word);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="text-center py-3">
        {direction === 'th-en' ? (
          <ThaiWord text={promptText} size="lg" />
        ) : (
          <div className="text-4xl font-semibold">{promptText}</div>
        )}
        {showRomanization && (
          <div className="text-txt-secondary text-sm mt-1">{word.pronunciation ?? word.romanization}</div>
        )}
        {direction === 'th-en' && (
          <div className="flex justify-center mt-2">
            <AudioButton text={word.thai} />
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 gap-2">
        {options.map((option) => {
          const isCorrectOption = option.text === correctText;
          const isSelected = option.text === selected;
          return (
            <OptionCard
              key={option.word.id}
              option={option}
              direction={direction}
              isCorrectOption={isCorrectOption}
              isSelected={isSelected}
              answered={answered}
              swipeEnabled={answered}
              reviewStatus={reviewed[option.word.id]}
              onSelect={() => choose(option.text)}
              onSwipe={(dir) => handleSwipe(option, dir)}
            />
          );
        })}
      </div>
      {!selected && (
        <GhostButton onClick={giveUp} className="self-center">
          I don't know
        </GhostButton>
      )}
      {answered && (
        <div className="text-txt-tertiary text-xs text-center -mt-2">
          Swipe a word right if you know it, left to learn it
        </div>
      )}
      {pending && <AccentButton onClick={next}>Next question</AccentButton>}

      {popupWord && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6"
          onClick={() => setPopupWord(null)}
        >
          <div
            className="bg-app-card-light border border-border-accent rounded-lg p-6 max-w-xs w-full flex flex-col items-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <ThaiWord text={popupWord.thai} size="md" />
            <div className="text-txt-secondary text-sm">{popupWord.pronunciation ?? popupWord.romanization}</div>
            <div className="text-txt-primary text-lg font-semibold text-center">{popupWord.english}</div>
            <AudioButton text={popupWord.thai} />
            <AccentButton size="medium" onClick={() => setPopupWord(null)}>
              Got it
            </AccentButton>
          </div>
        </div>
      )}
    </div>
  );
}

interface OptionCardProps {
  option: MultipleChoiceOption;
  direction: Direction;
  isCorrectOption: boolean;
  isSelected: boolean;
  answered: boolean;
  swipeEnabled: boolean;
  reviewStatus?: ReviewStatus;
  onSelect: () => void;
  onSwipe: (direction: ReviewStatus) => void;
}

const SWIPE_THRESHOLD = 70;

function OptionCard({
  option,
  direction,
  isCorrectOption,
  isSelected,
  answered,
  swipeEnabled,
  reviewStatus,
  onSelect,
  onSwipe,
}: OptionCardProps) {
  const x = useMotionValue(0);
  const tint = useTransform(
    x,
    [-100, 0, 100],
    ['rgba(255, 92, 92, 0.25)', 'rgba(0, 0, 0, 0)', 'rgba(74, 222, 128, 0.25)']
  );

  let style = 'bg-app-card border-border text-txt-primary';
  if (answered) {
    if (isCorrectOption) style = 'bg-success/15 border-success text-success';
    else if (isSelected) style = 'bg-danger/15 border-danger text-danger';
    else style = 'bg-app-card border-border text-txt-tertiary';
  }

  const draggable = swipeEnabled && !reviewStatus;

  return (
    <div
      role={swipeEnabled ? undefined : 'button'}
      tabIndex={swipeEnabled ? undefined : 0}
      onClick={swipeEnabled ? undefined : onSelect}
      onKeyDown={
        swipeEnabled
          ? undefined
          : (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelect();
              }
            }
      }
      className={`relative w-full rounded-lg border font-medium transition-colors overflow-hidden ${
        swipeEnabled ? 'cursor-default' : 'cursor-pointer'
      } ${style} ${reviewStatus ? 'opacity-50' : ''}`}
    >
      <motion.div
        drag={draggable ? 'x' : false}
        style={draggable ? { x, background: tint, touchAction: 'pan-y' } : undefined}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.85}
        onDragEnd={(_, info) => {
          if (info.offset.x > SWIPE_THRESHOLD) onSwipe('known');
          else if (info.offset.x < -SWIPE_THRESHOLD) onSwipe('learn');
        }}
        className="px-4 py-4 flex items-center gap-3"
      >
        <div className="flex-1 min-w-0">
          {direction === 'en-th' ? (
            <ThaiWord text={option.text} size="sm" align="left" mutedSecondary={false} />
          ) : (
            option.text
          )}
        </div>
        {direction === 'en-th' && <AudioButton text={option.text} className="shrink-0" />}
        {reviewStatus === 'known' && (
          <span className="text-success text-lg shrink-0" aria-label="Marked as known">
            ✓
          </span>
        )}
        {reviewStatus === 'learn' && (
          <span className="text-warning text-lg shrink-0" aria-label="Marked to learn">
            📖
          </span>
        )}
      </motion.div>
    </div>
  );
}
