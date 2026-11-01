import type { ClozeSentence, Word } from './word';
import type { OrderSentence } from '../data/word-order';

export type QuestionType = 'multiple-choice' | 'typed' | 'flashcard' | 'connector' | 'order';
/** Which side is shown: Thai → English or English → Thai. */
export type Direction = 'th-en' | 'en-th';

/** One displayed choice, carrying its source word so it can be graded
 * independently of whether it's the correct answer to the current prompt. */
export interface MultipleChoiceOption {
  text: string;
  word: Word;
}

export interface QuizQuestion {
  id: string;
  word: Word;
  type: QuestionType;
  direction: Direction;
  options?: MultipleChoiceOption[];
  /** For 'connector' questions: the sentence whose blank `word` fills. */
  sentence?: ClozeSentence;
  /** For 'order' questions: the sentence to rebuild from its word blocks. */
  orderSentence?: OrderSentence;
  /** For 'order' questions: indexes into `orderSentence.chunks`, in the shuffled order they're offered. */
  blockOrder?: number[];
}

/** SM-2 style recall grade: 0-2 fail/hard, 3-5 pass, higher is better recall. */
export type Grade = 0 | 1 | 2 | 3 | 4 | 5;

export interface QuizAnswer {
  question: QuizQuestion;
  grade: Grade;
  correct: boolean;
  userAnswer?: string;
}
