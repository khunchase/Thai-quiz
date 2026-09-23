import type { Category, Word } from '../types/word';
import type { ReviewState } from '../types/progress';

export const BOOK_SIZE = 50;

export interface WordBook {
  id: string;
  name: string;
  icon: string;
  words: Word[];
}

/**
 * Groups words into ~50-word "books" for flashcard study. Chunks within
 * category (rather than a flat slice across the whole deck) so each book
 * stays topically coherent; a category over BOOK_SIZE splits into
 * "Book 1", "Book 2", etc. in its existing (curated) word order.
 */
export function buildWordBooks(words: Word[], categories: Category[]): WordBook[] {
  const books: WordBook[] = [];
  for (const category of categories) {
    const categoryWords = words.filter((w) => w.categoryId === category.id);
    if (categoryWords.length === 0) continue;

    const chunkCount = Math.ceil(categoryWords.length / BOOK_SIZE);
    for (let i = 0; i < chunkCount; i++) {
      const chunk = categoryWords.slice(i * BOOK_SIZE, (i + 1) * BOOK_SIZE);
      books.push({
        id: `${category.id}-book${i + 1}`,
        name: chunkCount > 1 ? `${category.name} — Book ${i + 1}` : category.name,
        icon: category.icon,
        words: chunk,
      });
    }
  }
  return books;
}

/** A word counts as "known" once it's been recalled correctly at least once. */
export function bookMasteryCount(book: WordBook, reviewStates: Record<string, ReviewState>) {
  const known = book.words.filter((w) => (reviewStates[w.id]?.repetitions ?? 0) >= 1).length;
  return { known, total: book.words.length };
}
