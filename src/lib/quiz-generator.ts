import type { ClozeSentence, Word } from '../types/word';
import type { ReviewState } from '../types/progress';
import type { Direction, MultipleChoiceOption, QuestionType, QuizQuestion } from '../types/quiz';
import { isDue, isFullyLearned, isKnown } from './srs';
import { CONNECTOR_INFO } from '../data/conjunctions';
import { ORDER_SENTENCES, isCorrectOrder, type OrderSentence } from '../data/word-order';

export interface GenerateQuizOptions {
  words: Word[];
  reviewStates: Record<string, ReviewState>;
  sessionLength: number;
  direction: Direction | 'both';
  categoryFilter?: string[];
  /** Words to leave out, e.g. ones just asked so they don't come straight back. */
  excludeWordIds?: string[];
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

/** Share of a session that learned words due for review may take, so reviews never crowd out new words. */
const MAX_REVIEW_SHARE = 1 / 3;

/**
 * Splits words into the quiz's buckets. Words at 100% are left out entirely,
 * and so are known words that aren't due yet.
 */
export function classifyWords(words: Word[], reviewStates: Record<string, ReviewState>, now = Date.now()) {
  const reviews: Word[] = [];
  const unseen: Word[] = [];
  const learning: Word[] = [];
  for (const word of words) {
    const state = reviewStates[word.id];
    if (!state) unseen.push(word);
    else if (isFullyLearned(state, now)) continue;
    else if (!isKnown(state, now)) learning.push(word);
    else if (isDue(state, now)) reviews.push(word);
  }
  return { reviews, unseen, learning };
}

/**
 * Learned words due on their review date first (capped at a third of the
 * session), then never-seen words, then words still being learned. Learned
 * words that aren't due don't appear at all.
 */
export function selectSessionWords(options: GenerateQuizOptions): Word[] {
  const { words, reviewStates, sessionLength, categoryFilter, excludeWordIds = [] } = options;
  const pool = (categoryFilter?.length ? words.filter((w) => categoryFilter.includes(w.categoryId)) : words).filter(
    (w) => !excludeWordIds.includes(w.id)
  );
  const { reviews, unseen, learning } = classifyWords(pool, reviewStates);

  const reviewSlots = Math.ceil(sessionLength * MAX_REVIEW_SHARE);
  const ranked = [...shuffle(reviews).slice(0, reviewSlots), ...shuffle(unseen), ...shuffle(learning)];
  return ranked.slice(0, Math.min(sessionLength, ranked.length));
}

function targetText(word: Word, direction: Direction): string {
  return direction === 'th-en' ? word.english : word.thai;
}

export function buildMultipleChoiceOptions(
  word: Word,
  direction: Direction,
  allWords: Word[],
  reviewStates: Record<string, ReviewState>
): MultipleChoiceOption[] {
  // Learned words aren't used as wrong options; they're only a last resort
  // when too few other words exist to fill four choices.
  const candidates = allWords.filter((w) => w.id !== word.id);
  const byPreference = (pool: Word[]) => [
    ...shuffle(pool.filter((w) => w.categoryId === word.categoryId)),
    ...shuffle(pool.filter((w) => w.categoryId !== word.categoryId)),
  ];
  const distractorPool = [
    ...byPreference(candidates.filter((w) => !isKnown(reviewStates[w.id]))),
    ...byPreference(candidates.filter((w) => isKnown(reviewStates[w.id]))),
  ];

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

/**
 * Four connectors for a sentence's blank: the answer plus three that express
 * a different relationship, so only one can be right. Unlearned connectors are
 * preferred as wrong answers, like the regular multiple choice.
 */
export function buildConnectorOptions(
  word: Word,
  sentence: ClozeSentence,
  allWords: Word[],
  reviewStates: Record<string, ReviewState>
): MultipleChoiceOption[] {
  const group = CONNECTOR_INFO[word.id]?.group;
  const excluded = new Set(sentence.alsoOk ?? []);
  const candidates = allWords.filter(
    (w) => w.id !== word.id && CONNECTOR_INFO[w.id] && CONNECTOR_INFO[w.id].group !== group && !excluded.has(w.id)
  );
  const distractorPool = [
    ...shuffle(candidates.filter((w) => !isKnown(reviewStates[w.id]))),
    ...shuffle(candidates.filter((w) => isKnown(reviewStates[w.id]))),
  ];
  const seenThai = new Set([word.thai]);
  const seenGroups = new Set([group]);
  const options: MultipleChoiceOption[] = [{ text: word.thai, word }];
  for (const candidate of distractorPool) {
    if (options.length >= 4) break;
    const candidateGroup = CONNECTOR_INFO[candidate.id].group;
    // One per relationship, so two wrong answers never mean the same thing.
    if (seenThai.has(candidate.thai) || seenGroups.has(candidateGroup)) continue;
    seenThai.add(candidate.thai);
    seenGroups.add(candidateGroup);
    options.push({ text: candidate.thai, word: candidate });
  }
  return shuffle(options);
}

export function generateQuiz(options: GenerateQuizOptions): QuizQuestion[] {
  const { direction, words: allWords, forceType } = options;

  // Connector questions only ask words that have fill-in-the-blank sentences.
  if (forceType === 'connector') {
    const sessionWords = selectSessionWords({
      ...options,
      words: allWords.filter((w) => CONNECTOR_INFO[w.id]),
      categoryFilter: undefined,
    });
    return sessionWords.map((word, index) => {
      const sentences = CONNECTOR_INFO[word.id].sentences;
      const sentence = sentences[Math.floor(Math.random() * sentences.length)];
      return {
        id: `${word.id}-${index}-${Date.now()}`,
        word,
        type: 'connector',
        direction: 'en-th',
        sentence,
        options: buildConnectorOptions(word, sentence, allWords, options.reviewStates),
      };
    });
  }

  // Word-order questions only ask words that have word-order sentences.
  if (forceType === 'order') {
    const sessionWords = selectSessionWords({
      ...options,
      words: allWords.filter((w) => ORDER_SENTENCES[w.id]),
      categoryFilter: undefined,
    });
    return sessionWords.map((word, index) => {
      const sentences = ORDER_SENTENCES[word.id];
      const orderSentence = sentences[Math.floor(Math.random() * sentences.length)];
      return {
        id: `${word.id}-${index}-${Date.now()}`,
        word,
        type: 'order',
        direction: 'en-th',
        orderSentence,
        blockOrder: shuffleBlocks(orderSentence),
      };
    });
  }

  const sessionWords = selectSessionWords(options);

  // Every other question is multiple choice: recognizing the answer
  // among options is far more approachable than typing or recalling it
  // from memory, in either direction.
  return sessionWords.map((word, index) => {
    const qDirection: Direction = direction === 'both' ? (Math.random() < 0.5 ? 'th-en' : 'en-th') : direction;
    const question: QuizQuestion = {
      id: `${word.id}-${index}-${Date.now()}`,
      word,
      type: 'multiple-choice',
      direction: qDirection,
      options: buildMultipleChoiceOptions(word, qDirection, allWords, options.reviewStates),
    };
    return question;
  });
}

/** Block indexes in a random order that isn't already a right answer, so there's always something to do. */
export function shuffleBlocks(sentence: OrderSentence): number[] {
  const indexes = sentence.chunks.map((_, i) => i);
  for (let attempt = 0; attempt < 20; attempt++) {
    const order = shuffle(indexes);
    if (!isCorrectOrder(sentence, order.map((i) => sentence.chunks[i]))) return order;
  }
  return indexes.reverse();
}
