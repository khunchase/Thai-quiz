import { useRef, useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import type { Word } from '../../types/word';
import { useProgressStore } from '../../stores/progress-store';
import { useSettingsStore, singleThaiFontClass } from '../../stores/settings-store';
import { GRADE_KNOWN, GRADE_GIVE_UP } from '../../lib/srs';
import { AudioButton } from '../quiz/AudioButton';
import { ThaiWord } from '../quiz/ThaiWord';
import { AccentButton } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';

interface Props {
  words: Word[];
  bookName: string;
  onExit: () => void;
}

type MarkStatus = 'known' | 'learning';

const SWIPE_THRESHOLD = 100;

export function FlashcardDeck({ words, bookName, onExit }: Props) {
  const recordAnswer = useProgressStore((s) => s.recordAnswer);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(0);
  const [learning, setLearning] = useState(0);
  const [finished, setFinished] = useState(false);

  const word = words[index];

  function mark(status: MarkStatus) {
    if (!word) return;
    recordAnswer(word.id, status === 'known' ? GRADE_KNOWN : GRADE_GIVE_UP, status === 'known');
    if (status === 'known') setKnown((k) => k + 1);
    else setLearning((l) => l + 1);
    setFlipped(false);
    if (index + 1 >= words.length) setFinished(true);
    else setIndex((i) => i + 1);
  }

  if (finished || !word) {
    return (
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-6 gap-6 text-center overflow-y-auto">
        <div className="text-5xl">🎉</div>
        <div>
          <div className="text-2xl font-bold">{bookName} complete</div>
          <div className="text-txt-secondary text-sm mt-2">
            ✓ {known} known · 📖 {learning} to learn
          </div>
        </div>
        <AccentButton onClick={onExit}>Done</AccentButton>
      </div>
    );
  }

  const progressPct = (index / words.length) * 100;

  return (
    <div className="flex-1 min-h-0 flex flex-col p-3 gap-3 overflow-y-auto">
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={onExit}
          className="px-4 py-2 rounded-lg bg-app-surface text-danger font-semibold text-sm shrink-0"
        >
          ✕ Exit
        </button>
        <div className="text-txt-secondary text-sm font-semibold truncate px-2">{bookName}</div>
        <div className="text-txt-secondary text-sm font-semibold shrink-0">
          {index + 1} / {words.length}
        </div>
      </div>
      <ProgressBar value={progressPct} />

      <div className="flex-1 min-h-0 flex flex-col items-center justify-center gap-4 py-2">
        <FlashcardFace
          key={word.id}
          word={word}
          flipped={flipped}
          onFlip={() => setFlipped((f) => !f)}
          onSwipe={mark}
        />
        <div className="flex items-center justify-between w-full max-w-sm text-xs px-2">
          <span className="text-warning font-semibold">← swipe to learn</span>
          <span className="text-success font-semibold">know it, swipe →</span>
        </div>
      </div>
    </div>
  );
}

interface FaceProps {
  word: Word;
  flipped: boolean;
  onFlip: () => void;
  onSwipe: (status: MarkStatus) => void;
}

function FlashcardFace({ word, flipped, onFlip, onSwipe }: FaceProps) {
  const fontStyle = useSettingsStore((s) => s.settings.thaiFontStyle);
  const wasDragging = useRef(false);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 220], [-12, 12]);
  const tint = useTransform(
    x,
    [-160, 0, 160],
    ['rgba(255, 92, 92, 0.3)', 'rgba(0, 0, 0, 0)', 'rgba(74, 222, 128, 0.3)']
  );
  const learnOpacity = useTransform(x, [-120, -20], [1, 0]);
  const knownOpacity = useTransform(x, [20, 120], [0, 1]);

  return (
    <motion.div
      drag="x"
      style={{ x, rotate, touchAction: 'pan-y' }}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.85}
      onDragStart={() => {
        wasDragging.current = true;
      }}
      onDragEnd={(_, info) => {
        // Let the pending onTap (which fires right after onDragEnd for the
        // same pointer sequence in Framer Motion) see this and no-op.
        setTimeout(() => {
          wasDragging.current = false;
        }, 0);
        if (info.offset.x > SWIPE_THRESHOLD) onSwipe('known');
        else if (info.offset.x < -SWIPE_THRESHOLD) onSwipe('learning');
      }}
      onTap={() => {
        if (wasDragging.current) return;
        onFlip();
      }}
      className="relative w-full max-w-sm min-h-[22rem] rounded-2xl border border-border-accent bg-app-card-light p-6 flex flex-col items-center justify-center gap-3 cursor-grab active:cursor-grabbing overflow-hidden"
    >
      <motion.div className="absolute inset-0 pointer-events-none" style={{ background: tint }} />
      <motion.div
        style={{ opacity: learnOpacity }}
        className="absolute top-4 left-4 text-warning text-xs font-semibold"
      >
        📖 learning
      </motion.div>
      <motion.div
        style={{ opacity: knownOpacity }}
        className="absolute top-4 right-4 text-success text-xs font-semibold"
      >
        known ✓
      </motion.div>

      <div className="relative z-10 flex flex-col items-center gap-3 w-full">
        {!flipped ? (
          <>
            <ThaiWord text={word.thai} size="lg" />
            <div className="text-txt-tertiary text-sm mt-6">👆 Tap to reveal</div>
          </>
        ) : (
          <>
            <div className="text-txt-primary text-2xl font-bold text-center">{word.english}</div>
            <div className="text-txt-secondary text-sm">{word.pronunciation ?? word.romanization}</div>
            <AudioButton text={word.thai} />

            {word.breakdown && word.breakdown.length > 1 && (
              <div className="w-full border-t border-border pt-3 mt-1">
                <div className="text-txt-tertiary text-[10px] uppercase tracking-wide mb-2 text-center">
                  Breakdown
                </div>
                <div className="flex items-center justify-center flex-wrap gap-x-2 gap-y-1">
                  {word.breakdown.map((part, i) => (
                    <div key={i} className="flex items-center gap-1">
                      {i > 0 && <span className="text-txt-tertiary text-sm">+</span>}
                      <div className="text-center">
                        <div className={`${singleThaiFontClass(fontStyle)} text-lg`}>{part.thai}</div>
                        <div className="text-txt-tertiary text-[10px]">{part.english}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {word.exampleSentence && (
              <div className="w-full border-t border-border pt-3 mt-1 text-center">
                <div className="text-txt-tertiary text-[10px] uppercase tracking-wide mb-1">Example</div>
                <div className={`${singleThaiFontClass(fontStyle)} text-base`}>{word.exampleSentence.thai}</div>
                <div className="text-txt-tertiary text-xs mt-1">{word.exampleSentence.romanization}</div>
                <div className="text-txt-secondary text-xs mt-1">{word.exampleSentence.english}</div>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
