import type { Phrase } from '../types/phrase';
import type { ReviewState } from '../types/progress';
import type { QuizMode, QuizOption, QuizQuestion } from '../types/quiz';
import { isDue } from './srs';

export const MODE_INFO: Record<QuizMode, { label: string; icon: string; description: string; prompt: string }> = {
  understand: {
    label: 'Understand',
    icon: '👂',
    description: 'Staff say something — what does it mean?',
    prompt: 'What does this mean?',
  },
  say: {
    label: 'Say it',
    icon: '💬',
    description: 'Pick the natural Japanese for what you want to say.',
    prompt: 'How would you say this?',
  },
  keigo: {
    label: 'Keigo decoder',
    icon: '🎎',
    description: 'Translate service keigo into plain です/ます Japanese.',
    prompt: 'Same meaning in plain Japanese?',
  },
  respond: {
    label: 'Respond',
    icon: '↩️',
    description: 'Staff say something — pick a natural reply.',
    prompt: 'What would you say back?',
  },
};

export const ALL_MODES: QuizMode[] = ['understand', 'say', 'keigo', 'respond'];

export function itemKey(mode: QuizMode, phraseId: string): string {
  return `${mode}:${phraseId}`;
}

export function isEligible(phrase: Phrase, mode: QuizMode): boolean {
  switch (mode) {
    case 'understand':
      return phrase.speaker === 'staff';
    case 'say':
      return phrase.speaker === 'you';
    case 'keigo':
      return !!phrase.plain;
    case 'respond':
      return phrase.speaker === 'staff' && !!phrase.reply;
  }
}

/** The text the learner has to pick for this phrase in this mode. */
function answerText(phrase: Phrase, mode: QuizMode): string {
  switch (mode) {
    case 'understand':
      return phrase.en;
    case 'say':
      return phrase.jp;
    case 'keigo':
      return phrase.plain!;
    case 'respond':
      return phrase.reply!.jp;
  }
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Four options, with distractors drawn from the same scenario first so they're plausible. */
export function buildOptions(phrase: Phrase, mode: QuizMode, allPhrases: Phrase[]): QuizOption[] {
  const pool = allPhrases.filter((p) => p.id !== phrase.id && isEligible(p, mode));
  const sameScenario = shuffle(pool.filter((p) => p.scenarioId === phrase.scenarioId));
  const others = shuffle(pool.filter((p) => p.scenarioId !== phrase.scenarioId));

  const correct = answerText(phrase, mode);
  const seen = new Set([correct]);
  const options: QuizOption[] = [{ text: correct, correct: true }];
  for (const candidate of [...sameScenario, ...others]) {
    if (options.length >= 4) break;
    const text = answerText(candidate, mode);
    if (seen.has(text)) continue;
    seen.add(text);
    options.push({ text, correct: false });
  }
  return shuffle(options);
}

export interface GenerateQuizOptions {
  phrases: Phrase[];
  allPhrases: Phrase[];
  modes: QuizMode[];
  reviewStates: Record<string, ReviewState>;
  sessionLength: number;
}

/**
 * Picks phrase/mode items — due reviews first, then unseen, then the rest —
 * using each phrase at most once per session so the answer to one question
 * never gives away another.
 */
export function generateQuiz({ phrases, allPhrases, modes, reviewStates, sessionLength }: GenerateQuizOptions): QuizQuestion[] {
  const due: [Phrase, QuizMode][] = [];
  const unseen: [Phrase, QuizMode][] = [];
  const notDue: [Phrase, QuizMode][] = [];

  for (const phrase of phrases) {
    for (const mode of modes) {
      if (!isEligible(phrase, mode)) continue;
      const state = reviewStates[itemKey(mode, phrase.id)];
      if (!state) unseen.push([phrase, mode]);
      else if (isDue(state)) due.push([phrase, mode]);
      else notDue.push([phrase, mode]);
    }
  }

  const ranked = [...shuffle(due), ...shuffle(unseen), ...shuffle(notDue)];
  const usedPhrases = new Set<string>();
  const picked: [Phrase, QuizMode][] = [];
  for (const item of ranked) {
    if (picked.length >= sessionLength) break;
    if (usedPhrases.has(item[0].id)) continue;
    usedPhrases.add(item[0].id);
    picked.push(item);
  }

  const stamp = Date.now();
  return shuffle(picked).map(([phrase, mode], index) => ({
    id: `${mode}-${phrase.id}-${index}-${stamp}`,
    itemId: itemKey(mode, phrase.id),
    mode,
    phrase,
    options: buildOptions(phrase, mode, allPhrases),
  }));
}

export function countDue(phrases: Phrase[], modes: QuizMode[], reviewStates: Record<string, ReviewState>): number {
  let count = 0;
  for (const phrase of phrases) {
    for (const mode of modes) {
      if (!isEligible(phrase, mode)) continue;
      const state = reviewStates[itemKey(mode, phrase.id)];
      if (state && isDue(state)) count += 1;
    }
  }
  return count;
}
