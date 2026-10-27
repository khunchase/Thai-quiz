import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { animate, motion, useDragControls, useMotionValue, useTransform } from 'framer-motion';
import type { Word } from '../../types/word';
import type { Grade } from '../../types/quiz';
import { useProgressStore } from '../../stores/progress-store';
import { useAllCategories } from '../../stores/deck-store';
import { useSettingsStore, singleThaiFontClass } from '../../stores/settings-store';
import { createInitialReviewState, learnedPercent, scheduleNextReview } from '../../lib/srs';
import { ProgressBar } from '../ui/ProgressBar';
import { ArrowRightIcon } from '../ui/icons';
import { AudioButton } from './AudioButton';
import { BreakdownHeadword, WordBreakdown } from './WordBreakdown';

interface Props {
  word: Word;
  /** Pulled up to show the word's details; it can be opened before answering too, to peek. */
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The question has been answered, so Next is live. */
  answered: boolean;
  /** The answer's grade before it's recorded, so the bar already shows where the word will land. */
  pendingGrade?: Grade | null;
  /** Omitted where something else moves on (e.g. swiping a flashcard). */
  onNext?: () => void;
}

const SPRING = { type: 'spring', stiffness: 420, damping: 42 } as const;

/** Bottom sheet: "progress on this item" while collapsed, the word's details when pulled up. */
export function ItemSheet({ word, open, onOpenChange, answered, pendingGrade, onNext }: Props) {
  const reviewState = useProgressStore((s) => s.reviewStates[word.id]);
  const sheetRef = useRef<HTMLDivElement>(null);
  const peekRef = useRef<HTMLDivElement>(null);
  const safeAreaRef = useRef<HTMLDivElement>(null);
  const [travel, setTravel] = useState(0);
  const y = useMotionValue(0);
  const backdropOpacity = useTransform(y, [0, Math.max(travel, 1)], [1, 0]);
  const dragControls = useDragControls();

  const percent =
    pendingGrade == null
      ? learnedPercent(reviewState)
      : learnedPercent(scheduleNextReview(reviewState ?? createInitialReviewState(word.id), pendingGrade));

  // Collapsed, only the peek row (plus the home-indicator inset) stays on screen.
  useLayoutEffect(() => {
    const sheet = sheetRef.current;
    const peek = peekRef.current;
    const safeArea = safeAreaRef.current;
    if (!sheet || !peek || !safeArea) return;
    let first = true;
    const measure = () => {
      const next = Math.max(0, sheet.offsetHeight - peek.offsetHeight - safeArea.offsetHeight);
      setTravel(next);
      // Start collapsed without animating up from the open position.
      if (first) y.jump(next);
      first = false;
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(sheet);
    return () => observer.disconnect();
  }, [y]);

  useEffect(() => {
    const controls = animate(y, open ? 0 : travel, SPRING);
    return () => controls.stop();
  }, [open, travel, y]);

  function settle(toOpen: boolean) {
    onOpenChange(toOpen);
    // Re-run even when the state doesn't change, to spring back after a short drag.
    animate(y, toOpen ? 0 : travel, SPRING);
  }

  return (
    <>
      <motion.div
        style={{ opacity: backdropOpacity }}
        onClick={() => settle(false)}
        className={`absolute inset-0 z-20 bg-black/50 ${open ? '' : 'pointer-events-none'}`}
      />
      <motion.div
        ref={sheetRef}
        drag="y"
        dragListener={false}
        dragControls={dragControls}
        dragConstraints={{ top: 0, bottom: travel }}
        dragElastic={0.04}
        dragMomentum={false}
        onDragEnd={(_, info) => {
          if (info.velocity.y < -400) settle(true);
          else if (info.velocity.y > 400) settle(false);
          else settle(y.get() < travel / 2);
        }}
        style={{ y }}
        className="absolute inset-x-0 bottom-0 z-30 h-[85%] flex flex-col rounded-t-3xl border-t border-border bg-app-card shadow-[0_-8px_30px_rgba(0,0,0,0.45)]"
      >
        <div ref={safeAreaRef} className="absolute w-0 h-[env(safe-area-inset-bottom)] invisible" />
        <div
          ref={peekRef}
          onPointerDown={(e) => dragControls.start(e)}
          onClick={() => settle(!open)}
          className="shrink-0 px-5 pt-2.5 pb-4 touch-none cursor-grab"
        >
          <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-txt-tertiary" />
          <div className="flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="text-txt-primary text-[15px] font-medium">Progress on this item</div>
              <div className="flex items-center gap-3 mt-2">
                <ProgressBar value={percent} className="flex-1" />
                <span className="text-accent text-sm font-bold w-10 shrink-0">{percent}%</span>
              </div>
            </div>
            {onNext && (
              <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  onNext();
                }}
                disabled={!answered}
                className="shrink-0 h-12 px-5 rounded-xl flex items-center gap-2 font-bold text-base bg-gradient-to-b from-accent-light to-accent text-app-bg active:scale-[0.97] transition-transform disabled:bg-none disabled:bg-app-surface disabled:text-txt-tertiary"
              >
                Next
                <ArrowRightIcon />
              </button>
            )}
          </div>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto px-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
          <ItemDetails word={word} />
        </div>
      </motion.div>
    </>
  );
}

function ItemDetails({ word }: { word: Word }) {
  const categories = useAllCategories();
  const category = categories.find((c) => c.id === word.categoryId);
  const hasBreakdown = !!word.breakdown && word.breakdown.length >= 2;

  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-center pt-4 pb-6">
        <BreakdownHeadword word={word} className="text-5xl text-accent" />
        <div className="text-txt-secondary text-sm font-semibold mt-2">{word.pronunciation ?? word.romanization}</div>
        <div className="w-3/4 border-t border-border my-4" />
        <div className="text-txt-primary text-3xl font-bold text-center">{word.english}</div>
      </div>

      {category && (
        <DetailSection title="This is">
          <span className="inline-block px-3.5 py-1.5 rounded-lg bg-accent/15 text-accent font-semibold">
            {category.icon} {category.name}
          </span>
        </DetailSection>
      )}

      {hasBreakdown && (
        <div className="border-t border-border py-5">
          <WordBreakdown word={word} />
        </div>
      )}

      {word.exampleSentence && (
        <DetailSection title="Examples">
          <ExampleLine word={word} />
        </DetailSection>
      )}
    </div>
  );
}

function DetailSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border-t border-border py-5 first:border-t-0">
      <div className="text-txt-primary text-lg font-bold mb-3">{title}</div>
      {children}
    </div>
  );
}

/** The example sentence with the word itself picked out in the accent color. */
function ExampleLine({ word }: { word: Word }) {
  const fontStyle = useSettingsStore((s) => s.settings.thaiFontStyle);
  const example = word.exampleSentence!;
  const pieces = example.thai.split(word.thai);

  return (
    <div className="flex items-start gap-3">
      <div className="flex-1 min-w-0">
        <div className="leading-relaxed">
          <span className={`${singleThaiFontClass(fontStyle)} text-2xl font-semibold`}>
            {pieces.map((piece, i) => (
              <span key={i}>
                {i > 0 && <span className="text-accent">{word.thai}</span>}
                {piece}
              </span>
            ))}
          </span>
          <span className="text-txt-secondary text-lg"> – {example.english}</span>
        </div>
        <div className="text-txt-tertiary text-sm mt-1">{example.romanization}</div>
      </div>
      <AudioButton text={example.thai} className="shrink-0" />
    </div>
  );
}
