import type { Word } from './word';

export type QuestionType = 'multiple-choice' | 'typed' | 'typed-thai' | 'phonetic' | 'flashcard';
/**
 * Which side is shown. For 'phonetic' questions, 'th-en' means Thai script is
 * shown and romanization is typed; 'en-th' means romanization is shown and
 * Thai script is typed.
 */
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
}

/** SM-2 style recall grade: 0-2 fail/hard, 3-5 pass, higher is better recall. */
export type Grade = 0 | 1 | 2 | 3 | 4 | 5;

export interface QuizAnswer {
  question: QuizQuestion;
  grade: Grade;
  correct: boolean;
  userAnswer?: string;
}
