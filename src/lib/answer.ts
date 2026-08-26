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
