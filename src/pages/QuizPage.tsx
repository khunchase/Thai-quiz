import { useEffect, useMemo, useState } from 'react';
import { useAllWords, useAllCategories } from '../stores/deck-store';
import { useProgressStore, displayedStreak } from '../stores/progress-store';
import { useNavigationStore } from '../stores/navigation-store';
import { classifyWords, filterWords, generateQuiz } from '../lib/quiz-generator';
import { ALL_LEVELS, WORD_LEVELS } from '../lib/levels';
import type { ScheduleOptions } from '../lib/srs';
import type { QuizQuestion, Grade, Direction } from '../types/quiz';
import type { WordLevel } from '../types/word';
import { QuestionRenderer } from '../components/quiz/QuestionRenderer';
import { AccentButton } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { CONNECTOR_INFO } from '../data/conjunctions';
import { ORDER_SENTENCES } from '../data/word-order';

interface Answer {
  question: QuizQuestion;
  correct: boolean;
}

type Phase = 'start' | 'active' | 'caught-up';

type QuizMode = 'multiple-choice' | 'connector' | 'order';

const QUIZ_MODES: { id: QuizMode; label: string }[] = [
  { id: 'multiple-choice', label: '🃏 Words' },
  { id: 'connector', label: '🔗 Sentences' },
  { id: 'order', label: '🧩 Order' },
];

/** Questions picked at a time — small, so each batch reflects the latest answers. */
const BATCH_SIZE = 5;
/** Words asked this recently sit out the next batch so nothing comes straight back. */
const RECENT_GAP = 3;

export function QuizPage() {
  const words = useAllWords();
  const categories = useAllCategories();
  const reviewStates = useProgressStore((s) => s.reviewStates);
  const recordAnswer = useProgressStore((s) => s.recordAnswer);
  const currentStreak = useProgressStore((s) => displayedStreak(s.currentStreak, s.lastActiveDate));

  const [phase, setPhase] = useState<Phase>('start');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => categories.map((c) => c.id));
  const [selectedLevels, setSelectedLevels] = useState<WordLevel[]>(ALL_LEVELS);
  const [quizMode, setQuizMode] = useState<QuizMode>('multiple-choice');
  const [direction, setDirection] = useState<Direction | 'both'>('both');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const setQuizActive = useNavigationStore((s) => s.setQuizActive);

  useEffect(() => {
    setQuizActive(phase === 'active');
    return () => setQuizActive(false);
  }, [phase, setQuizActive]);

  // The Sentences and Order quizzes have their own word sets, so they ignore the category picks.
  const isConnectorMode = quizMode === 'connector';
  const isOrderMode = quizMode === 'order';
  const usesCategories = quizMode === 'multiple-choice';
  const available = useMemo(
    () =>
      classifyWords(
        quizMode === 'connector'
          ? words.filter((w) => CONNECTOR_INFO[w.id])
          : quizMode === 'order'
            ? words.filter((w) => ORDER_SENTENCES[w.id])
            : filterWords(words, selectedCategories, selectedLevels),
        reviewStates
      ),
    [words, reviewStates, selectedCategories, selectedLevels, quizMode]
  );
  const nothingToQuiz = available.unseen.length + available.learning.length + available.reviews.length === 0;

  function toggleCategory(id: string) {
    setSelectedCategories((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  }

  const allCategoriesSelected = selectedCategories.length === categories.length;
  const allLevelsSelected = selectedLevels.length === ALL_LEVELS.length;

  function toggleLevel(level: WordLevel) {
    setSelectedLevels((prev) => (prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level].sort()));
  }

  /** Taps "up to" a level: picking 3 selects 1, 2 and 3. */
  function selectUpToLevel(level: WordLevel) {
    setSelectedLevels(ALL_LEVELS.filter((l) => l <= level));
  }

  const canStart = !usesCategories || (selectedCategories.length > 0 && selectedLevels.length > 0);

  function toggleSelectAllCategories() {
    setSelectedCategories(allCategoriesSelected ? [] : categories.map((c) => c.id));
  }

  // Picks the next few questions from the latest review states. If too few words are left to keep the
  // recent ones out, they're let back in rather than ending the quiz.
  function nextBatch(recentWordIds: string[]): QuizQuestion[] {
    const options = {
      words,
      reviewStates: useProgressStore.getState().reviewStates,
      sessionLength: BATCH_SIZE,
      direction,
      categoryFilter: allCategoriesSelected ? undefined : selectedCategories,
      levelFilter: allLevelsSelected ? undefined : selectedLevels,
      forceType: quizMode === 'multiple-choice' ? undefined : quizMode,
    };
    for (const excludeWordIds of [recentWordIds, recentWordIds.slice(-1), []]) {
      const batch = generateQuiz({ ...options, excludeWordIds });
      if (batch.length) return batch;
    }
    return [];
  }

  function startQuiz() {
    if (!canStart) return;
    const batch = nextBatch([]);
    setQuestions(batch);
    setIndex(0);
    setAnswers([]);
    if (batch.length) setPhase('active');
  }

  // The quiz never runs out on its own: a new batch follows each one until Back, or until nothing is left to ask.
  function handleAnswered(grade: Grade, correct: boolean, _userAnswer?: string, options?: ScheduleOptions) {
    const question = questions[index];
    recordAnswer(question.word.id, grade, correct, options);
    setAnswers((prev) => [...prev, { question, correct }]);
    if (index + 1 < questions.length) {
      setIndex(index + 1);
      return;
    }
    const batch = nextBatch(questions.slice(-RECENT_GAP).map((q) => q.word.id));
    if (!batch.length) {
      setPhase('caught-up');
      return;
    }
    setQuestions(batch);
    setIndex(0);
  }

  if (phase === 'active' && questions[index]) {
    return (
      <QuestionRenderer
        key={questions[index].id}
        question={questions[index]}
        title="Quiz"
        onExit={() => setPhase('start')}
        onAnswered={handleAnswered}
        // Only swipes mark other words, so a correct one is a "known" swipe.
        onMarkWord={(wordId, grade, correct) =>
          recordAnswer(wordId, grade, correct, { countActivity: false, markedKnown: correct })
        }
      />
    );
  }

  if (phase === 'caught-up') {
    const correctCount = answers.filter((a) => a.correct).length;
    return (
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-6 gap-6 text-center overflow-y-auto">
        <div className="text-5xl">🎉</div>
        <div>
          <div className="text-2xl font-bold">All caught up</div>
          <div className="text-txt-secondary text-sm mt-2">
            {answers.length} answered · {correctCount} correct · 🔥 {currentStreak} day streak
          </div>
          <div className="text-txt-tertiary text-xs mt-2">
            Every word here is learned — come back when reviews are due, or pick more categories or levels.
          </div>
        </div>
        <AccentButton onClick={() => setPhase('start')}>Done</AccentButton>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col p-4 gap-5 overflow-y-auto">
      <div>
        <h1 className="text-2xl font-bold">Thai Word Quiz</h1>
        <p className="text-txt-secondary text-sm mt-1">
          {available.unseen.length} new · {available.learning.length} learning · {available.reviews.length} due for review
        </p>
      </div>

      <Card>
        <div className="text-txt-secondary text-xs font-semibold uppercase tracking-wide mb-3">Quiz Mode</div>
        <div className="flex gap-2">
          {QUIZ_MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => setQuizMode(m.id)}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                quizMode === m.id ? 'bg-accent text-app-bg' : 'bg-app-surface text-txt-secondary'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
        {usesCategories && (
          <div className="text-txt-tertiary text-[11px] mt-2">
            See a word and pick its meaning from four choices.
          </div>
        )}
        {isConnectorMode && (
          <div className="text-txt-tertiary text-[11px] mt-2">
            Fill the blank in a Thai sentence with the right connector (when, before, as long as…) for the
            highlighted English. Uses the Conjunctions &amp; Connectors words.
          </div>
        )}
        {isOrderMode && (
          <div className="text-txt-tertiary text-[11px] mt-2">
            Rebuild a Thai sentence from its shuffled word blocks to match the English. Tap a block to place it,
            tap it again to send it back.
          </div>
        )}
      </Card>

      {usesCategories && (
        <>
        <Card>
          <div className="flex items-center justify-between mb-3">
            <div className="text-txt-secondary text-xs font-semibold uppercase tracking-wide">Levels</div>
            <button
              onClick={() => setSelectedLevels(allLevelsSelected ? [] : ALL_LEVELS)}
              className="text-accent text-xs font-semibold"
            >
              {allLevelsSelected ? 'Deselect All' : 'Select All'}
            </button>
          </div>
          <div className="flex gap-2">
            {WORD_LEVELS.map((l) => (
              <button
                key={l.level}
                onClick={() => toggleLevel(l.level)}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  selectedLevels.includes(l.level) ? 'bg-accent text-app-bg' : 'bg-app-surface text-txt-secondary'
                }`}
              >
                {l.level}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
            {WORD_LEVELS.slice(0, -1).map((l) => (
              <button key={l.level} onClick={() => selectUpToLevel(l.level)} className="text-accent text-[11px] font-semibold">
                {l.level === 1 ? 'Level 1 only' : `Levels 1–${l.level}`}
              </button>
            ))}
          </div>
          <div className="text-txt-tertiary text-[11px] mt-2">
            {selectedLevels.length === 0
              ? 'Select at least one level to start a quiz.'
              : WORD_LEVELS.filter((l) => selectedLevels.includes(l.level))
                  .map((l) => `${l.level} ${l.name}`)
                  .join(' · ')}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-3">
            <div className="text-txt-secondary text-xs font-semibold uppercase tracking-wide">Categories</div>
            <button onClick={toggleSelectAllCategories} className="text-accent text-xs font-semibold">
              {allCategoriesSelected ? 'Deselect All' : 'Select All'}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <Badge key={c.id} active={selectedCategories.includes(c.id)} onClick={() => toggleCategory(c.id)}>
                {c.icon} {c.name}
              </Badge>
            ))}
          </div>
          {selectedCategories.length === 0 && (
            <div className="text-danger text-[11px] mt-2">Select at least one category to start a quiz.</div>
          )}
        </Card>
        </>
      )}

      {usesCategories && (
        <Card>
          <div className="text-txt-secondary text-xs font-semibold uppercase tracking-wide mb-3">Direction</div>
          <div className="flex gap-2">
            {(['both', 'th-en', 'en-th'] as (Direction | 'both')[]).map((dir) => (
              <button
                key={dir}
                onClick={() => setDirection(dir)}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold ${
                  direction === dir ? 'bg-accent text-app-bg' : 'bg-app-surface text-txt-secondary'
                }`}
              >
                {dir === 'both'
                  ? 'Both'
                  : dir === 'th-en'
                    ? 'TH → EN'
                    : 'EN → TH'}
              </button>
            ))}
          </div>
        </Card>
      )}

      <div className="mt-auto">
        {canStart && nothingToQuiz && (
          <div className="text-txt-tertiary text-xs text-center mb-2">
            Every word here is learned — come back when reviews are due, or pick more categories or levels.
          </div>
        )}
        <AccentButton onClick={startQuiz} disabled={!canStart || nothingToQuiz}>
          Start Quiz
        </AccentButton>
      </div>
    </div>
  );
}
