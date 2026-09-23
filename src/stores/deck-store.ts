import { useMemo } from 'react';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Word, Category } from '../types/word';
import { STARTER_WORDS } from '../data/starter-words';
import { BUILTIN_CATEGORIES } from '../data/categories';
import { generateId } from '../lib/id';

interface DeckStore {
  customWords: Word[];
  customCategories: Category[];
  addWord: (input: { thai: string; romanization: string; english: string; categoryId: string }) => Word;
  updateWord: (id: string, updates: Partial<Pick<Word, 'thai' | 'romanization' | 'english' | 'categoryId'>>) => void;
  deleteWord: (id: string) => void;
  addCategory: (name: string, icon: string) => Category;
  deleteCategory: (id: string) => void;
  hydrate: (data: { customWords: Word[]; customCategories: Category[] }) => void;
}

export const useDeckStore = create<DeckStore>()(
  persist(
    (set) => ({
      customWords: [],
      customCategories: [],

      addWord: (input) => {
        const word: Word = { id: generateId('word'), custom: true, ...input };
        set((state) => ({ customWords: [...state.customWords, word] }));
        return word;
      },

      updateWord: (id, updates) =>
        set((state) => ({
          customWords: state.customWords.map((w) => (w.id === id ? { ...w, ...updates } : w)),
        })),

      deleteWord: (id) => set((state) => ({ customWords: state.customWords.filter((w) => w.id !== id) })),

      addCategory: (name, icon) => {
        const category: Category = { id: generateId('cat'), name, icon, custom: true };
        set((state) => ({ customCategories: [...state.customCategories, category] }));
        return category;
      },

      deleteCategory: (id) =>
        set((state) => ({
          customCategories: state.customCategories.filter((c) => c.id !== id),
          customWords: state.customWords.filter((w) => w.categoryId !== id),
        })),

      hydrate: (data) => set(data),
    }),
    {
      name: 'thai-quiz-deck',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ customWords: state.customWords, customCategories: state.customCategories }),
    }
  )
);

export function useAllWords(): Word[] {
  const customWords = useDeckStore((s) => s.customWords);
  return useMemo(() => [...STARTER_WORDS, ...customWords], [customWords]);
}

export function useAllCategories(): Category[] {
  const customCategories = useDeckStore((s) => s.customCategories);
  return useMemo(() => [...BUILTIN_CATEGORIES, ...customCategories], [customCategories]);
}
