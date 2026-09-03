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
  const [detailWord, setDetailWord] = useState<Word | null>(null);
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

  function reviewWord(wordId: string, status: ReviewStatus) {
    if (reviewed[wordId]) return;
    setReviewed((r) => ({ ...r, [wordId]: status }));
    if (status === 'known') onMarkWord?.(wordId, GRADE_KNOWN, true);
    else onMarkWord?.(wordId, GRADE_GIVE_UP, false);
    setDetailWord(null);
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
              reviewStatus={reviewed[option.word.id]}
              onSelect={() => choose(option.text)}
              onOpenDetail={() => setDetailWord(option.word)}
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
          Tap a word to see details, then swipe to mark it known or to learn
        </div>
      )}
      {pending && <AccentButton onClick={next}>Next question</AccentButton>}

      {detailWord && (
        <WordDetailPopup
          word={detailWord}
          reviewStatus={reviewed[detailWord.id]}
          onClose={() => setDetailWord(null)}
          onReview={(status) => reviewWord(detailWord.id, status)}
        />
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
  reviewStatus?: ReviewStatus;
  onSelect: () => void;
  onOpenDetail: () => void;
}

function OptionCard({
  option,
  direction,
  isCorrectOption,
  isSelected,
  answered,
  reviewStatus,
  onSelect,
  onOpenDetail,
}: OptionCardProps) {
  let style = 'bg-app-card border-border text-txt-primary';
  if (answered) {
    if (isCorrectOption) style = 'bg-success/15 border-success text-success';
    else if (isSelected) style = 'bg-danger/15 border-danger text-danger';
    else style = 'bg-app-card border-border text-txt-tertiary';
  }

  const handleActivate = answered ? onOpenDetail : onSelect;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleActivate}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleActivate();
        }
      }}
      className={`w-full rounded-lg border font-medium transition-colors overflow-hidden cursor-pointer px-4 py-4 flex items-center gap-3 ${style} ${
        reviewStatus ? 'opacity-50' : ''
      }`}
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
    </div>
  );
}

interface WordDetailPopupProps {
  word: Word;
  reviewStatus?: ReviewStatus;
  onClose: () => void;
  onReview: (status: ReviewStatus) => void;
}

const SWIPE_THRESHOLD = 100;

function WordDetailPopup({ word, reviewStatus, onClose, onReview }: WordDetailPopupProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 220], [-12, 12]);
  const tint = useTransform(
    x,
    [-160, 0, 160],
    ['rgba(255, 92, 92, 0.3)', 'rgba(0, 0, 0, 0)', 'rgba(74, 222, 128, 0.3)']
  );
  const learnOpacity = useTransform(x, [-120, -20], [1, 0]);
  const knownOpacity = useTransform(x, [20, 120], [0, 1]);

  const draggable = !reviewStatus;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6" onClick={onClose}>
      <motion.div
        drag={draggable ? 'x' : false}
        style={draggable ? { x, rotate, background: tint, touchAction: 'pan-y' } : undefined}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.85}
        onDragEnd={(_, info) => {
          if (info.offset.x > SWIPE_THRESHOLD) onReview('known');
          else if (info.offset.x < -SWIPE_THRESHOLD) onReview('learn');
        }}
        onClick={(e) => e.stopPropagation()}
        className={`relative bg-app-card-light border border-border-accent rounded-2xl p-6 max-w-xs w-full flex flex-col items-center gap-3 ${
          draggable ? 'cursor-grab active:cursor-grabbing' : ''
        }`}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full bg-app-surface text-txt-secondary text-sm"
        >
          ✕
        </button>
        <ThaiWord text={word.thai} size="md" />
        <div className="text-txt-secondary text-sm">{word.pronunciation ?? word.romanization}</div>
        <div className="text-txt-primary text-lg font-semibold text-center">{word.english}</div>
        <AudioButton text={word.thai} />

        {draggable ? (
          <>
            <div className="flex items-center justify-between w-full text-xs mt-2">
              <motion.span style={{ opacity: learnOpacity }} className="text-warning font-semibold">
                ← learn it
              </motion.span>
              <motion.span style={{ opacity: knownOpacity }} className="text-success font-semibold">
                know it →
              </motion.span>
            </div>
            <div className="text-txt-tertiary text-[11px] -mt-1">Swipe the card to mark this word</div>
          </>
        ) : (
          <div
            className={`text-xs font-semibold mt-2 ${reviewStatus === 'known' ? 'text-success' : 'text-warning'}`}
          >
            {reviewStatus === 'known' ? '✓ Marked as known' : '📖 Marked to learn'}
          </div>
        )}
      </motion.div>
    </div>
  );
}
