import { useState } from 'react';
import type { Word } from '../types/word';
import { useAllWords, useAllCategories, useDeckStore } from '../stores/deck-store';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { AccentButton, GhostButton, SecondaryButton } from '../components/ui/Button';
import { AudioButton } from '../components/quiz/AudioButton';

export function WordsPage() {
  const words = useAllWords();
  const categories = useAllCategories();
  const addWord = useDeckStore((s) => s.addWord);
  const updateWord = useDeckStore((s) => s.updateWord);
  const deleteWord = useDeckStore((s) => s.deleteWord);
  const addCategory = useDeckStore((s) => s.addCategory);
  const deleteCategory = useDeckStore((s) => s.deleteCategory);

  const [filter, setFilter] = useState<string | null>(null);
  const [showAddWord, setShowAddWord] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ thai: '', romanization: '', english: '', categoryId: categories[0]?.id ?? '' });
  const [categoryForm, setCategoryForm] = useState({ name: '', icon: '📁' });

  const visibleWords = filter ? words.filter((w) => w.categoryId === filter) : words;
  const filterCategory = filter ? categories.find((c) => c.id === filter) : null;

  function resetForm() {
    setForm({ thai: '', romanization: '', english: '', categoryId: filter ?? categories[0]?.id ?? '' });
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
    setForm({ thai: word.thai, romanization: word.romanization, english: word.english, categoryId: word.categoryId });
    setEditingId(word.id);
    setShowAddWord(true);
  }

  function submitCategory() {
    if (!categoryForm.name.trim()) return;
    addCategory(categoryForm.name.trim(), categoryForm.icon || '📁');
    setCategoryForm({ name: '', icon: '📁' });
    setShowAddCategory(false);
  }

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      <div className="p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Words</h1>
          <SecondaryButton onClick={() => setShowAddCategory(true)}>+ Category</SecondaryButton>
        </div>

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

        {showAddCategory && (
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

        <div className="flex flex-col gap-2">
          {visibleWords.map((word) => {
            const category = categories.find((c) => c.id === word.categoryId);
            return (
              <Card key={word.id} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-thai text-lg">{word.thai}</span>
                    <span className="text-txt-tertiary text-xs">{word.pronunciation ?? word.romanization}</span>
                  </div>
                  <div className="text-txt-secondary text-sm truncate">{word.english}</div>
                  <div className="text-txt-tertiary text-[10px] mt-1">
                    {category?.icon} {category?.name}
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
      </div>

      <div className="sticky bottom-0 p-4 bg-app-bg border-t border-divider">
        {showAddWord ? (
          <Card className="flex flex-col gap-3">
            <input
              value={form.thai}
              onChange={(e) => setForm((f) => ({ ...f, thai: e.target.value }))}
              placeholder="Thai script (e.g. สวัสดี)"
              className="h-11 rounded-lg bg-app-surface border border-border px-3 font-thai"
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
    </div>
  );
}
