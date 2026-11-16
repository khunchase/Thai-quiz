import {
  CLASS_LABELS,
  CONSONANTS,
  VOWELS,
  letterGlyph,
  letterSound,
  type ConsonantClass,
  type Letter,
} from '../data/alphabet';

/** to-sound: see the letter, pick its name/sound. to-letter: the reverse. class: pick a consonant's class. */
export type LetterAsk = 'to-sound' | 'to-letter' | 'class';

export interface LetterQuizOptions {
  consonants: boolean;
  vowels: boolean;
  direction: 'both' | 'to-sound' | 'to-letter';
  /** Mix in "which class is this consonant?" questions. */
  classQuestions: boolean;
}

export interface LetterChoice {
  key: string;
  text: string;
}

export interface LetterQuestion {
  id: string;
  item: Letter;
  ask: LetterAsk;
  choices: LetterChoice[];
  answerKey: string;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function letterPool(options: LetterQuizOptions): Letter[] {
  return [...(options.consonants ? CONSONANTS : []), ...(options.vowels ? VOWELS : [])];
}

/** "aa" → "a", "iia" → "ia": the short partner of a long vowel, so the pair can be told apart. */
function baseSound(sound: string): string {
  return sound.replace(/(.)\1/, '$1');
}

/** Letters that are easy to mix up with `item`: same starting sound, or the long/short partner. */
function lookalikes(item: Letter, pool: Letter[]): Letter[] {
  return pool.filter((other) => {
    if (other.id === item.id || other.kind !== item.kind) return false;
    if (item.kind === 'consonant' && other.kind === 'consonant') return other.initial === item.initial;
    if (item.kind === 'vowel' && other.kind === 'vowel') return baseSound(other.sound) === baseSound(item.sound);
    return false;
  });
}

function choiceText(item: Letter, ask: LetterAsk): string {
  return ask === 'to-letter' ? letterGlyph(item) : letterSound(item);
}

/** The right answer plus three others: up to two lookalikes so it isn't too easy, then letters of the same kind. */
function buildChoices(item: Letter, ask: 'to-sound' | 'to-letter'): LetterChoice[] {
  const sameKind: Letter[] = item.kind === 'consonant' ? CONSONANTS : VOWELS;
  const close = shuffle(lookalikes(item, sameKind)).slice(0, 2);
  const rest = shuffle(sameKind.filter((l) => l.id !== item.id && !close.includes(l)));
  const choices: LetterChoice[] = [{ key: item.id, text: choiceText(item, ask) }];
  const seen = new Set([choices[0].text]);
  for (const other of [...close, ...rest]) {
    if (choices.length >= 4) break;
    const text = choiceText(other, ask);
    if (seen.has(text)) continue;
    seen.add(text);
    choices.push({ key: other.id, text });
  }
  return shuffle(choices);
}

const CLASS_ORDER: ConsonantClass[] = ['mid', 'high', 'low'];

export function buildLetterQuestion(item: Letter, options: LetterQuizOptions, index: number): LetterQuestion {
  const asks: LetterAsk[] =
    options.direction === 'both' ? ['to-sound', 'to-letter'] : [options.direction];
  // A third of consonant questions ask the class when that's switched on.
  const askClass = item.kind === 'consonant' && options.classQuestions && Math.random() < 1 / 3;
  const ask: LetterAsk = askClass ? 'class' : asks[Math.floor(Math.random() * asks.length)];
  const id = `${item.id}-${index}-${Date.now()}`;

  if (ask === 'class' && item.kind === 'consonant') {
    return {
      id,
      item,
      ask,
      choices: CLASS_ORDER.map((cls) => ({ key: cls, text: CLASS_LABELS[cls] })),
      answerKey: item.class,
    };
  }
  const choiceAsk = ask === 'class' ? 'to-sound' : ask;
  return { id, item, ask: choiceAsk, choices: buildChoices(item, choiceAsk), answerKey: item.id };
}

/** A shuffled run through the pool that doesn't start with the letter just asked. */
export function shuffledRound(pool: Letter[], lastId?: string): Letter[] {
  const round = shuffle(pool);
  if (round.length > 1 && round[0].id === lastId) [round[0], round[1]] = [round[1], round[0]];
  return round;
}

/** How many questions later a missed letter comes back. */
export const RETRY_GAP = 4;
