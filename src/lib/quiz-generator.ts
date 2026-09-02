import type { Word } from '../types/word';
import type { ReviewState } from '../types/progress';
import type { Direction, MultipleChoiceOption, QuestionType, QuizQuestion } from '../types/quiz';
import { isDue } from './srs';

export interface GenerateQuizOptions {
  words: Word[];
  reviewStates: Record<string, ReviewState>;
  sessionLength: number;
  direction: Direction | 'both';
  categoryFilter?: string[];
  levelFilter?: number;
  /** Force every question to this type instead of the default multiple-choice. */
  forceType?: QuestionType;
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
  const { words, reviewStates, sessionLength, categoryFilter, levelFilter } = options;
  let pool = categoryFilter?.length ? words.filter((w) => categoryFilter.includes(w.categoryId)) : words;
  if (levelFilter) pool = pool.filter((w) => w.level === levelFilter);

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

export function buildMultipleChoiceOptions(
  word: Word,
  direction: Direction,
  allWords: Word[]
): MultipleChoiceOption[] {
  const sameCategory = shuffle(allWords.filter((w) => w.id !== word.id && w.categoryId === word.categoryId));
  const others = shuffle(allWords.filter((w) => w.id !== word.id && w.categoryId !== word.categoryId));
  const distractorPool = [...sameCategory, ...others];

  const seenText = new Set<string>([targetText(word, direction)]);
  const options: MultipleChoiceOption[] = [{ text: targetText(word, direction), word }];
  for (const candidate of distractorPool) {
    if (options.length >= 4) break;
    const text = targetText(candidate, direction);
    if (seenText.has(text)) continue;
    seenText.add(text);
    options.push({ text, word: candidate });
  }
  return shuffle(options);
}

export function generateQuiz(options: GenerateQuizOptions): QuizQuestion[] {
  const sessionWords = selectSessionWords(options);
  const { direction, words: allWords, forceType } = options;

  // Typing Thai script only makes sense when Thai is the target of the question.
  if (forceType === 'typed-thai') {
    return sessionWords.map((word, index) => ({
      id: `${word.id}-${index}-${Date.now()}`,
      word,
      type: 'typed-thai',
      direction: 'en-th',
    }));
  }

  // Otherwise, every question is multiple choice: recognizing the answer
  // among options is far more approachable than typing or recalling it
  // from memory, in either direction.
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
