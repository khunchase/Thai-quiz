import { useEffect, useMemo, useState } from 'react';
import { useAllWords, useAllCategories } from '../stores/deck-store';
import { useProgressStore } from '../stores/progress-store';
import { useSettingsStore } from '../stores/settings-store';
import { useNavigationStore } from '../stores/navigation-store';
import { generateQuiz } from '../lib/quiz-generator';
import { isDue } from '../lib/srs';
import { isLevelUnlocked, levelMasteryCount } from '../lib/word-level';
import { LEVELS } from '../data/levels';
import type { QuizQuestion, Grade, Direction } from '../types/quiz';
import { QuestionRenderer } from '../components/quiz/QuestionRenderer';
import { AccentButton } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Badge } from '../components/ui/Badge';

interface Answer {
  question: QuizQuestion;
  correct: boolean;
}

type Phase = 'start' | 'active' | 'summary';

export function QuizPage() {
  const words = useAllWords();
  const categories = useAllCategories();
  const reviewStates = useProgressStore((s) => s.reviewStates);
  const recordAnswer = useProgressStore((s) => s.recordAnswer);
  const currentStreak = useProgressStore((s) => s.currentStreak);
  const settings = useSettingsStore((s) => s.settings);

  const [phase, setPhase] = useState<Phase>('start');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => categories.map((c) => c.id));
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [typeThaiMode, setTypeThaiMode] = useState(false);
  const [direction, setDirection] = useState<Direction | 'both'>('both');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const setQuizActive = useNavigationStore((s) => s.setQuizActive);

  useEffect(() => {
    setQuizActive(phase === 'active');
    return () => setQuizActive(false);
  }, [phase, setQuizActive]);

  const dueCount = useMemo(
    () =>
      words.filter((w) => {
        const state = reviewStates[w.id];
        return !state || isDue(state);
      }).length,
    [words, reviewStates]
  );

  function toggleCategory(id: string) {
    setSelectedCategories((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  }

  const allCategoriesSelected = selectedCategories.length === categories.length;

  function toggleSelectAllCategories() {
    setSelectedCategories(allCategoriesSelected ? [] : categories.map((c) => c.id));
  }

  function selectLevel(level: number) {
    setSelectedLevel((prev) => (prev === level ? null : level));
  }

  function startQuiz() {
    if (selectedCategories.length === 0) return;
    const quiz = generateQuiz({
      words,
      reviewStates,
      sessionLength: settings.sessionLength,
      direction,
      categoryFilter: allCategoriesSelected ? undefined : selectedCategories,
      levelFilter: selectedLevel ?? undefined,
      forceType: typeThaiMode ? 'typed-thai' : undefined,
    });
    setQuestions(quiz);
    setIndex(0);
    setAnswers([]);
    if (quiz.length) setPhase('active');
  }

  function handleAnswered(grade: Grade, correct: boolean) {
    const question = questions[index];
    recordAnswer(question.word.id, grade, correct);
    setAnswers((prev) => [...prev, { question, correct }]);
    const nextIndex = index + 1;
    if (nextIndex >= questions.length) setPhase('summary');
    else setIndex(nextIndex);
  }

  if (phase === 'active' && questions[index]) {
    const progressPct = (index / questions.length) * 100;
    return (
      <div className="flex-1 min-h-0 flex flex-col p-3 gap-3 overflow-y-auto">
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => setPhase('start')}
            className="px-4 py-2 rounded-lg bg-app-surface text-danger font-semibold text-sm shrink-0"
          >
            ✕ End Quiz
          </button>
          <div className="text-txt-secondary text-sm font-semibold">
            {index + 1} / {questions.length}
          </div>
        </div>
        <ProgressBar value={progressPct} />
        <QuestionRenderer
          key={questions[index].id}
          question={questions[index]}
          onAnswered={handleAnswered}
          onMarkWord={recordAnswer}
        />
      </div>
    );
  }

  if (phase === 'summary') {
    const correctCount = answers.filter((a) => a.correct).length;
    return (
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-6 gap-6 text-center overflow-y-auto">
        <div className="text-5xl">{correctCount === answers.length ? '🎉' : '👍'}</div>
        <div>
          <div className="text-2xl font-bold">
            {correctCount} / {answers.length} correct
          </div>
          <div className="text-txt-secondary text-sm mt-1">🔥 {currentStreak} day streak</div>
        </div>
        <AccentButton onClick={() => setPhase('start')}>Done</AccentButton>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col p-4 gap-5 overflow-y-auto">
      <div>
        <h1 className="text-2xl font-bold">Thai Word Quiz</h1>
        <p className="text-txt-secondary text-sm mt-1">{dueCount} words ready for review</p>
      </div>

      <Card>
        <div className="text-txt-secondary text-xs font-semibold uppercase tracking-wide mb-3">Level</div>
        <div className="flex flex-wrap gap-2">
          {LEVELS.map((l) => {
            const unlocked = isLevelUnlocked(l.level, words, reviewStates);
            const { mastered, total } = levelMasteryCount(l.level, words, reviewStates);
            return (
              <button
                key={l.level}
                disabled={!unlocked}
                onClick={() => selectLevel(l.level)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  !unlocked
                    ? 'bg-app-surface text-txt-disabled cursor-not-allowed'
                    : selectedLevel === l.level
                      ? 'bg-accent text-app-bg'
                      : 'bg-app-surface text-txt-secondary'
                }`}
              >
                {unlocked ? `Lv.${l.level} ${l.name}` : `🔒 Lv.${l.level} ${l.name}`}
                {unlocked && total > 0 && ` (${mastered}/${total})`}
              </button>
            );
          })}
        </div>
        {selectedLevel && !isLevelUnlocked(selectedLevel + 1, words, reviewStates) && (
          <div className="text-txt-tertiary text-[11px] mt-2">
            Master every word in this level to unlock the next one.
          </div>
        )}
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

      <Card>
        <div className="text-txt-secondary text-xs font-semibold uppercase tracking-wide mb-3">Quiz Mode</div>
        <div className="flex gap-2">
          <button
            onClick={() => setTypeThaiMode(false)}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
              !typeThaiMode ? 'bg-accent text-app-bg' : 'bg-app-surface text-txt-secondary'
            }`}
          >
            Multiple Choice
          </button>
          <button
            onClick={() => setTypeThaiMode(true)}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
              typeThaiMode ? 'bg-accent text-app-bg' : 'bg-app-surface text-txt-secondary'
            }`}
          >
            ⌨️ Type Thai
          </button>
        </div>
        {typeThaiMode && (
          <div className="text-txt-tertiary text-[11px] mt-2">
            You'll see the English word (and pronunciation) and type the actual Thai script.
          </div>
        )}
      </Card>

      {!typeThaiMode && (
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
                {dir === 'both' ? 'Both' : dir === 'th-en' ? 'TH → EN' : 'EN → TH'}
              </button>
            ))}
          </div>
        </Card>
      )}

      <Card>
        <div className="flex justify-between text-sm">
          <span className="text-txt-secondary">Session length</span>
          <span className="font-semibold">{settings.sessionLength} words</span>
        </div>
      </Card>

      <div className="mt-auto">
        <AccentButton onClick={startQuiz} disabled={selectedCategories.length === 0}>
          Start Quiz
        </AccentButton>
      </div>
    </div>
  );
}
