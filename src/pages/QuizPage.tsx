import { useMemo, useState } from 'react';
import { useAllWords, useAllCategories } from '../stores/deck-store';
import { useProgressStore } from '../stores/progress-store';
import { useSettingsStore } from '../stores/settings-store';
import { generateQuiz } from '../lib/quiz-generator';
import { isDue } from '../lib/srs';
import type { QuizQuestion, Grade } from '../types/quiz';
import { QuestionRenderer } from '../components/quiz/QuestionRenderer';
import { AccentButton, GhostButton } from '../components/ui/Button';
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
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);

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

  function startQuiz() {
    const quiz = generateQuiz({
      words,
      reviewStates,
      sessionLength: settings.sessionLength,
      direction: settings.direction,
      categoryFilter: selectedCategories.length ? selectedCategories : undefined,
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
        <div className="flex items-center justify-between">
          <GhostButton onClick={() => setPhase('start')}>✕</GhostButton>
          <div className="text-txt-secondary text-sm font-semibold">
            {index + 1} / {questions.length}
          </div>
          <div className="w-9" />
        </div>
        <ProgressBar value={progressPct} />
        <QuestionRenderer key={questions[index].id} question={questions[index]} onAnswered={handleAnswered} />
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
        <div className="text-txt-secondary text-xs font-semibold uppercase tracking-wide mb-3">Categories</div>
        <div className="flex flex-wrap gap-2">
          <Badge active={selectedCategories.length === 0} onClick={() => setSelectedCategories([])}>
            All
          </Badge>
          {categories.map((c) => (
            <Badge key={c.id} active={selectedCategories.includes(c.id)} onClick={() => toggleCategory(c.id)}>
              {c.icon} {c.name}
            </Badge>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex justify-between text-sm">
          <span className="text-txt-secondary">Session length</span>
          <span className="font-semibold">{settings.sessionLength} words</span>
        </div>
        <div className="flex justify-between text-sm mt-2">
          <span className="text-txt-secondary">Direction</span>
          <span className="font-semibold">
            {settings.direction === 'both'
              ? 'Thai ↔ English'
              : settings.direction === 'th-en'
                ? 'Thai → English'
                : 'English → Thai'}
          </span>
        </div>
      </Card>

      <div className="mt-auto">
        <AccentButton onClick={startQuiz}>Start Quiz</AccentButton>
      </div>
    </div>
  );
}
