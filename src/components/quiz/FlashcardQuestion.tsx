import { useState } from 'react';
import { motion } from 'framer-motion';
import type { QuizQuestion, Grade } from '../../types/quiz';
import { gradeForFlashcard, type FlashcardRating } from '../../lib/srs';
import { AudioButton } from './AudioButton';

interface Props {
  question: QuizQuestion;
  onAnswered: (grade: Grade, correct: boolean) => void;
}

const ratingButtons: { rating: FlashcardRating; label: string; color: string }[] = [
  { rating: 'again', label: "Don't know", color: 'bg-danger/15 text-danger' },
  { rating: 'hard', label: 'Struggled', color: 'bg-warning/15 text-warning' },
  { rating: 'good', label: 'Know it', color: 'bg-success/15 text-success' },
  { rating: 'easy', label: 'Easy', color: 'bg-accent/15 text-accent' },
];

export function FlashcardQuestion({ question, onAnswered }: Props) {
  const [flipped, setFlipped] = useState(false);
  const { word, direction } = question;

  const front = direction === 'th-en' ? word.thai : word.english;
  const back = direction === 'th-en' ? word.english : word.thai;

  function rate(rating: FlashcardRating) {
    const grade = gradeForFlashcard(rating);
    onAnswered(grade, grade >= 3);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="[perspective:1000px]" onClick={() => setFlipped((f) => !f)}>
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.4 }}
          className="relative h-56 [transform-style:preserve-3d] cursor-pointer"
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-lg bg-app-card border border-border [backface-visibility:hidden]">
            <div className={`text-4xl font-semibold ${direction === 'th-en' ? 'font-thai' : ''}`}>{front}</div>
            {direction === 'th-en' && <AudioButton text={word.thai} />}
            <div className="text-txt-tertiary text-xs">Tap to flip</div>
          </div>
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-lg bg-app-card-light border border-border-accent [backface-visibility:hidden]"
            style={{ transform: 'rotateY(180deg)' }}
          >
            <div className={`text-3xl font-semibold text-accent ${direction === 'en-th' ? 'font-thai' : ''}`}>
              {back}
            </div>
            {direction === 'en-th' && <AudioButton text={word.thai} />}
            <div className="text-txt-secondary text-sm">{word.romanization}</div>
          </div>
        </motion.div>
      </div>
      {flipped && (
        <div className="grid grid-cols-2 gap-2">
          {ratingButtons.map((b) => (
            <button
              key={b.rating}
              onClick={() => rate(b.rating)}
              className={`py-3 rounded-lg font-semibold text-sm ${b.color} active:scale-[0.97] transition-transform`}
            >
              {b.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
