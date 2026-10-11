export function normalizeAnswer(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFKC')
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Splits an answer like "watch / look" or "you (polite)" into acceptable alternatives. */
export function answerAlternatives(correctAnswer: string): string[] {
  const withoutParens = correctAnswer.replace(/\([^)]*\)/g, '').trim();
  const parts = withoutParens
    .split(/[/,]/)
    .map((p) => p.trim())
    .filter(Boolean);
  return [correctAnswer, withoutParens, ...parts].filter(Boolean);
}

export function isTypedAnswerCorrect(userInput: string, correctAnswer: string): boolean {
  const normalizedInput = normalizeAnswer(userInput);
  if (!normalizedInput) return false;
  return answerAlternatives(correctAnswer).some((alt) => normalizeAnswer(alt) === normalizedInput);
}

/**
 * Exact-match check for typed Thai script. Deliberately skips the general
 * normalizeAnswer() pipeline — its \p{L} filter would strip Thai combining
 * tone marks and vowel signs (they're Unicode category Mn, not L), silently
 * accepting wrong-toned spellings. Only trims whitespace and applies NFC so
 * visually-identical but differently-composed Unicode sequences still match.
 */
export function isThaiAnswerCorrect(userInput: string, correctThai: string): boolean {
  const input = userInput.trim().normalize('NFC');
  if (!input) return false;
  return input === correctThai.trim().normalize('NFC');
}

/**
 * Reduces a romanization to bare letters for lenient comparison: strips tone
 * diacritics (à â á ǎ), spaces, hyphens and case, so "khòp khun", "khop khun"
 * and "Khopkhun" all compare equal.
 */
export function normalizeRomanization(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]/gu, '');
}

/** Accepts either the plain romanization or the tone-marked pronunciation, ignoring tones and spacing. */
export function isRomanizationCorrect(userInput: string, accepted: string[]): boolean {
  const input = normalizeRomanization(userInput);
  if (!input) return false;
  return accepted.some((answer) =>
    answerAlternatives(answer).some((alt) => normalizeRomanization(alt) === input)
  );
}

const THAI_TONE_MARKS = /[่-๋]/g;

/**
 * Thai script check that forgives tone marks (่ ้ ๊ ๋): 'exact' when the
 * spelling matches, 'tone' when only tone marks are missing or wrong,
 * otherwise 'wrong'. Everything else (consonants, vowels) must still match.
 */
export function checkThaiIgnoringTones(userInput: string, correctThai: string): 'exact' | 'tone' | 'wrong' {
  if (isThaiAnswerCorrect(userInput, correctThai)) return 'exact';
  const strip = (s: string) => s.trim().normalize('NFC').replace(THAI_TONE_MARKS, '');
  const input = strip(userInput);
  if (!input) return 'wrong';
  return input === strip(correctThai) ? 'tone' : 'wrong';
}
