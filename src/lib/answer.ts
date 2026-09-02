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
