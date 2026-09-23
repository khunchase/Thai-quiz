import { useEffect, useState } from 'react';
import type { Word } from '../types/word';
import { useAllWords, useAllCategories, useDeckStore } from '../stores/deck-store';
import { useProgressStore } from '../stores/progress-store';
import { useSettingsStore, singleThaiFontClass } from '../stores/settings-store';
import { useNavigationStore } from '../stores/navigation-store';
import { buildWordBooks, bookMasteryCount, type WordBook } from '../lib/word-books';
import { LEVELS } from '../data/levels';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { AccentButton, GhostButton, SecondaryButton } from '../components/ui/Button';
import { AudioButton } from '../components/quiz/AudioButton';
import { FlashcardDeck } from '../components/flashcards/FlashcardDeck';

type ViewMode = 'list' | 'flashcards';

export function WordsPage() {
  const words = useAllWords();
  const categories = useAllCategories();
  const addWord = useDeckStore((s) => s.addWord);
  const updateWord = useDeckStore((s) => s.updateWord);
  const deleteWord = useDeckStore((s) => s.deleteWord);
  const addCategory = useDeckStore((s) => s.addCategory);
  const deleteCategory = useDeckStore((s) => s.deleteCategory);
  const fontStyle = useSettingsStore((s) => s.settings.thaiFontStyle);
  const reviewStates = useProgressStore((s) => s.reviewStates);
  const setFlashcardActive = useNavigationStore((s) => s.setFlashcardActive);

  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [activeBook, setActiveBook] = useState<WordBook | null>(null);
  const [filter, setFilter] = useState<string | null>(null);
  const [showAddWord, setShowAddWord] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    thai: '',
    romanization: '',
    english: '',
    categoryId: categories[0]?.id ?? '',
    level: 1,
  });
  const [categoryForm, setCategoryForm] = useState({ name: '', icon: '📁' });

  useEffect(() => {
    setFlashcardActive(activeBook !== null);
    return () => setFlashcardActive(false);
  }, [activeBook, setFlashcardActive]);

  const visibleWords = filter ? words.filter((w) => w.categoryId === filter) : words;
  const filterCategory = filter ? categories.find((c) => c.id === filter) : null;
  const wordBooks = buildWordBooks(words, categories);

  function resetForm() {
    setForm({ thai: '', romanization: '', english: '', categoryId: filter ?? categories[0]?.id ?? '', level: 1 });
  }

  function submitWord() {
    if (!form.thai.trim() || !form.romanization.trim() || !form.english.trim() || !form.categoryId) return;
    if (editingId) updateWord(editingId, form);
    else addWord(form);
    setEditingId(null);
    setShowAddWord(false);
    resetForm();
  }

  function startEdit(word: Word) {
    setForm({
      thai: word.thai,
      romanization: word.romanization,
      english: word.english,
      categoryId: word.categoryId,
      level: word.level,
    });
    setEditingId(word.id);
    setShowAddWord(true);
  }

  function submitCategory() {
    if (!categoryForm.name.trim()) return;
    addCategory(categoryForm.name.trim(), categoryForm.icon || '📁');
    setCategoryForm({ name: '', icon: '📁' });
    setShowAddCategory(false);
  }

  if (activeBook) {
    return <FlashcardDeck words={activeBook.words} bookName={activeBook.name} onExit={() => setActiveBook(null)} />;
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-y-auto">
      <div className="p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Words</h1>
          {viewMode === 'list' && (
            <SecondaryButton onClick={() => setShowAddCategory(true)}>+ Category</SecondaryButton>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('list')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
              viewMode === 'list' ? 'bg-accent text-app-bg' : 'bg-app-surface text-txt-secondary'
            }`}
          >
            📃 List
          </button>
          <button
            onClick={() => setViewMode('flashcards')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
              viewMode === 'flashcards' ? 'bg-accent text-app-bg' : 'bg-app-surface text-txt-secondary'
            }`}
          >
            🗂️ Flashcards
          </button>
        </div>

        {viewMode === 'flashcards' ? (
          <div className="flex flex-col gap-2">
            {wordBooks.map((book) => {
              const { known, total } = bookMasteryCount(book, reviewStates);
              return (
                <Card key={book.id} onClick={() => setActiveBook(book)} className="flex items-center gap-3">
                  <div className="text-2xl shrink-0">{book.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{book.name}</div>
                    <div className="text-txt-tertiary text-xs mt-0.5">
                      {total} words · ✓ {known} known
                    </div>
                  </div>
                  <div className="text-txt-tertiary text-lg shrink-0">›</div>
                </Card>
              );
            })}
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-2">
              <Badge active={filter === null} onClick={() => setFilter(null)}>
                All ({words.length})
              </Badge>
              {categories.map((c) => {
                const count = words.filter((w) => w.categoryId === c.id).length;
                return (
                  <Badge key={c.id} active={filter === c.id} onClick={() => setFilter(c.id)}>
                    {c.icon} {c.name} ({count})
                  </Badge>
                );
              })}
            </div>

            {filterCategory?.custom && (
              <GhostButton
                onClick={() => {
                  deleteCategory(filterCategory.id);
                  setFilter(null);
                }}
                className="text-danger self-start"
              >
                Delete this category
              </GhostButton>
            )}
          </>
        )}

        {viewMode === 'list' && showAddCategory && (
          <Card className="flex flex-col gap-3">
            <div className="flex gap-2">
              <input
                value={categoryForm.icon}
                onChange={(e) => setCategoryForm((f) => ({ ...f, icon: e.target.value }))}
                className="w-14 h-11 rounded-lg bg-app-surface border border-border text-center text-xl"
                maxLength={2}
              />
              <input
                value={categoryForm.name}
                onChange={(e) => setCategoryForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Category name"
                className="flex-1 h-11 rounded-lg bg-app-surface border border-border px-3"
              />
            </div>
            <div className="flex gap-2">
              <AccentButton size="medium" onClick={submitCategory}>
                Add
              </AccentButton>
              <GhostButton onClick={() => setShowAddCategory(false)}>Cancel</GhostButton>
            </div>
          </Card>
        )}

        {viewMode === 'list' && (
          <div className="flex flex-col gap-2">
            {visibleWords.map((word) => {
              const category = categories.find((c) => c.id === word.categoryId);
              return (
                <Card key={word.id} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`${singleThaiFontClass(fontStyle)} text-2xl`}>{word.thai}</span>
                      <span className="text-txt-tertiary text-xs">{word.pronunciation ?? word.romanization}</span>
                    </div>
                    <div className="text-txt-secondary text-sm truncate">{word.english}</div>
                    <div className="text-txt-tertiary text-[10px] mt-1">
                      {category?.icon} {category?.name} · Lv.{word.level} {LEVELS[word.level - 1]?.name}
                    </div>
                  </div>
                  <AudioButton text={word.thai} />
                  {word.custom && (
                    <div className="flex flex-col gap-1">
                      <GhostButton onClick={() => startEdit(word)}>Edit</GhostButton>
                      <GhostButton onClick={() => deleteWord(word.id)} className="text-danger">
                        Delete
                      </GhostButton>
                    </div>
                  )}
                </Card>
              );
            })}
            {visibleWords.length === 0 && (
              <div className="text-center text-txt-tertiary text-sm py-8">No words in this category yet.</div>
            )}
          </div>
        )}
      </div>

      {viewMode === 'list' && (
      <div className="sticky bottom-0 p-4 bg-app-bg border-t border-divider">
        {showAddWord ? (
          <Card className="flex flex-col gap-3">
            <input
              value={form.thai}
              onChange={(e) => setForm((f) => ({ ...f, thai: e.target.value }))}
              placeholder="Thai script (e.g. สวัสดี)"
              className={`h-11 rounded-lg bg-app-surface border border-border px-3 ${singleThaiFontClass(fontStyle)}`}
            />
            <input
              value={form.romanization}
              onChange={(e) => setForm((f) => ({ ...f, romanization: e.target.value }))}
              placeholder="Romanization (e.g. sawatdee)"
              className="h-11 rounded-lg bg-app-surface border border-border px-3"
            />
            <input
              value={form.english}
              onChange={(e) => setForm((f) => ({ ...f, english: e.target.value }))}
              placeholder="English meaning"
              className="h-11 rounded-lg bg-app-surface border border-border px-3"
            />
            <select
              value={form.categoryId}
              onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
              className="h-11 rounded-lg bg-app-surface border border-border px-3"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.name}
                </option>
              ))}
            </select>
            <select
              value={form.level}
              onChange={(e) => setForm((f) => ({ ...f, level: Number(e.target.value) }))}
              className="h-11 rounded-lg bg-app-surface border border-border px-3"
            >
              {LEVELS.map((l) => (
                <option key={l.level} value={l.level}>
                  Lv.{l.level} — {l.name}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <AccentButton size="medium" onClick={submitWord}>
                {editingId ? 'Save' : 'Add word'}
              </AccentButton>
              <GhostButton
                onClick={() => {
                  setShowAddWord(false);
                  setEditingId(null);
                  resetForm();
                }}
              >
                Cancel
              </GhostButton>
            </div>
          </Card>
        ) : (
          <AccentButton
            onClick={() => {
              resetForm();
              setShowAddWord(true);
            }}
          >
            + Add word
          </AccentButton>
        )}
      </div>
      )}
    </div>
  );
}
