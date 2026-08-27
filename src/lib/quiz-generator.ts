import type { Word } from '../types/word';
import type { ReviewState } from '../types/progress';
import type { Direction, QuizQuestion } from '../types/quiz';
import { isDue } from './srs';

export interface GenerateQuizOptions {
  words: Word[];
  reviewStates: Record<string, ReviewState>;
  sessionLength: number;
  direction: Direction | 'both';
  categoryFilter?: string[];
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Prioritizes due reviews, then never-seen words, then not-yet-due reviews. */
export function selectSessionWords(options: GenerateQuizOptions): Word[] {
  const { words, reviewStates, sessionLength, categoryFilter } = options;
  const pool = categoryFilter?.length ? words.filter((w) => categoryFilter.includes(w.categoryId)) : words;

  const due: Word[] = [];
  const unseen: Word[] = [];
  const notDue: Word[] = [];

  for (const word of pool) {
    const state = reviewStates[word.id];
    if (!state) unseen.push(word);
    else if (isDue(state)) due.push(word);
    else notDue.push(word);
  }

  const ranked = [...shuffle(due), ...shuffle(unseen), ...shuffle(notDue)];
  return ranked.slice(0, Math.min(sessionLength, ranked.length));
}

function targetText(word: Word, direction: Direction): string {
  return direction === 'th-en' ? word.english : word.thai;
}

export function buildMultipleChoiceOptions(word: Word, direction: Direction, allWords: Word[]): string[] {
  const sameCategory = shuffle(allWords.filter((w) => w.id !== word.id && w.categoryId === word.categoryId));
  const others = shuffle(allWords.filter((w) => w.id !== word.id && w.categoryId !== word.categoryId));
  const distractorPool = [...sameCategory, ...others];

  const options = new Set<string>([targetText(word, direction)]);
  for (const candidate of distractorPool) {
    if (options.size >= 4) break;
    options.add(targetText(candidate, direction));
  }
  return shuffle([...options]);
}

export function generateQuiz(options: GenerateQuizOptions): QuizQuestion[] {
  const sessionWords = selectSessionWords(options);
  const { direction, words: allWords } = options;

  // Every question is multiple choice: recognizing the answer among options
  // is far more approachable than typing or recalling it from memory,
  // in either direction.
  return sessionWords.map((word, index) => {
    const qDirection: Direction = direction === 'both' ? (Math.random() < 0.5 ? 'th-en' : 'en-th') : direction;
    const question: QuizQuestion = {
      id: `${word.id}-${index}-${Date.now()}`,
      word,
      type: 'multiple-choice',
      direction: qDirection,
      options: buildMultipleChoiceOptions(word, qDirection, allWords),
    };
    return question;
  });
}
