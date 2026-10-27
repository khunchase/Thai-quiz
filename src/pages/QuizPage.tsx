import { useEffect, useMemo, useState } from 'react';
import { useAllWords, useAllCategories } from '../stores/deck-store';
import { useProgressStore, displayedStreak } from '../stores/progress-store';
import { useNavigationStore } from '../stores/navigation-store';
import { classifyWords, generateQuiz } from '../lib/quiz-generator';
import type { QuizQuestion, Grade, Direction } from '../types/quiz';
import { QuestionRenderer } from '../components/quiz/QuestionRenderer';
import { AccentButton } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

interface Answer {
  question: QuizQuestion;
  correct: boolean;
}

type Phase = 'start' | 'active' | 'caught-up';

type QuizMode = 'multiple-choice' | 'typed-thai' | 'phonetic';

const QUIZ_MODES: { id: QuizMode; label: string }[] = [
  { id: 'multiple-choice', label: 'Multiple Choice' },
  { id: 'typed-thai', label: '⌨️ Type Thai' },
  { id: 'phonetic', label: '🔤 Phonetics' },
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

  const available = useMemo(
    () => classifyWords(words.filter((w) => selectedCategories.includes(w.categoryId)), reviewStates),
    [words, reviewStates, selectedCategories]
  );
  const nothingToQuiz = available.unseen.length + available.learning.length + available.reviews.length === 0;

  function toggleCategory(id: string) {
    setSelectedCategories((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  }

  const allCategoriesSelected = selectedCategories.length === categories.length;

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
      forceType: quizMode === 'multiple-choice' ? undefined : quizMode,
    };
    for (const excludeWordIds of [recentWordIds, recentWordIds.slice(-1), []]) {
      const batch = generateQuiz({ ...options, excludeWordIds });
      if (batch.length) return batch;
    }
    return [];
  }

  function startQuiz() {
    if (selectedCategories.length === 0) return;
    const batch = nextBatch([]);
    setQuestions(batch);
    setIndex(0);
    setAnswers([]);
    if (batch.length) setPhase('active');
  }

  // The quiz never runs out on its own: a new batch follows each one until Back, or until nothing is left to ask.
  function handleAnswered(grade: Grade, correct: boolean) {
    const question = questions[index];
    recordAnswer(question.word.id, grade, correct);
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
        onMarkWord={(wordId, grade, correct) => recordAnswer(wordId, grade, correct, { countActivity: false })}
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
            Every word here is learned — come back when reviews are due, or pick more categories.
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
        {quizMode === 'typed-thai' && (
          <div className="text-txt-tertiary text-[11px] mt-2">
            You'll see the English word (and pronunciation) and type the actual Thai script.
          </div>
        )}
        {quizMode === 'phonetic' && (
          <div className="text-txt-tertiary text-[11px] mt-2">
            Read Thai and type how it sounds, or see the pronunciation and type the Thai. Tone marks are forgiven.
          </div>
        )}
      </Card>

      {quizMode !== 'typed-thai' && (
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
                  : quizMode === 'phonetic'
                    ? dir === 'th-en'
                      ? 'TH → ABC'
                      : 'ABC → TH'
                    : dir === 'th-en'
                      ? 'TH → EN'
                      : 'EN → TH'}
              </button>
            ))}
          </div>
        </Card>
      )}

      <div className="mt-auto">
        {selectedCategories.length > 0 && nothingToQuiz && (
          <div className="text-txt-tertiary text-xs text-center mb-2">
            Every word here is learned — come back when reviews are due, or pick more categories.
          </div>
        )}
        <AccentButton onClick={startQuiz} disabled={selectedCategories.length === 0 || nothingToQuiz}>
          Start Quiz
        </AccentButton>
      </div>
    </div>
  );
}
