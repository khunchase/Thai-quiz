import { useEffect, useMemo, useState } from 'react';
import { allPhrases, scenarios } from '../data';
import { ALL_MODES, MODE_INFO, countDue, generateQuiz, isEligible } from '../lib/quiz';
import { useProgressStore } from '../stores/progress-store';
import { useSettingsStore } from '../stores/settings-store';
import { useNavigationStore } from '../stores/navigation-store';
import type { Grade, QuizMode, QuizQuestion } from '../types/quiz';
import { QuestionCard } from '../components/QuestionCard';
import { Furigana } from '../components/Furigana';
import { AccentButton } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';

interface Answer {
  question: QuizQuestion;
  correct: boolean;
}

type Phase = 'start' | 'active' | 'summary';

export function PracticePage() {
  const reviewStates = useProgressStore((s) => s.reviewStates);
  const recordAnswer = useProgressStore((s) => s.recordAnswer);
  const currentStreak = useProgressStore((s) => s.currentStreak);
  const settings = useSettingsStore((s) => s.settings);
  const updateSettings = useSettingsStore((s) => s.updateSettings);
  const setSessionActive = useNavigationStore((s) => s.setSessionActive);

  const [phase, setPhase] = useState<Phase>('start');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);

  useEffect(() => {
    setSessionActive(phase === 'active');
    return () => setSessionActive(false);
  }, [phase, setSessionActive]);

  const modes = settings.modes;
  const selectedScenarios = settings.scenarioIds ?? scenarios.map((s) => s.id);
  const allScenariosSelected = selectedScenarios.length === scenarios.length;

  const pool = useMemo(
    () => allPhrases.filter((p) => selectedScenarios.includes(p.scenarioId)),
    [selectedScenarios]
  );
  const dueCount = useMemo(() => countDue(allPhrases, ALL_MODES, reviewStates), [reviewStates]);
  // Each phrase appears at most once per session, so count phrases, not phrase/drill pairs.
  const availableItems = useMemo(() => pool.filter((p) => modes.some((m) => isEligible(p, m))).length, [pool, modes]);

  function toggleMode(mode: QuizMode) {
    updateSettings({ modes: modes.includes(mode) ? modes.filter((m) => m !== mode) : [...modes, mode] });
  }

  function toggleScenario(id: string) {
    const next = selectedScenarios.includes(id)
      ? selectedScenarios.filter((s) => s !== id)
      : [...selectedScenarios, id];
    updateSettings({ scenarioIds: next.length === scenarios.length ? null : next });
  }

  function start() {
    const quiz = generateQuiz({
      phrases: pool,
      allPhrases,
      modes,
      reviewStates,
      sessionLength: settings.sessionLength,
    });
    if (!quiz.length) return;
    setQuestions(quiz);
    setIndex(0);
    setAnswers([]);
    setPhase('active');
  }

  function handleAnswered(grade: Grade, correct: boolean) {
    const question = questions[index];
    recordAnswer(question.itemId, grade, correct);
    setAnswers((prev) => [...prev, { question, correct }]);
    if (index + 1 >= questions.length) setPhase('summary');
    else setIndex(index + 1);
  }

  if (phase === 'active' && questions[index]) {
    return (
      <div className="flex-1 min-h-0 flex flex-col p-3 gap-3 overflow-y-auto">
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => (answers.length ? setPhase('summary') : setPhase('start'))}
            className="px-4 py-2 rounded-lg bg-app-surface text-danger font-semibold text-sm shrink-0"
          >
            ✕ End
          </button>
          <div className="text-txt-secondary text-sm font-semibold">
            {index + 1} / {questions.length}
          </div>
        </div>
        <ProgressBar value={(index / questions.length) * 100} />
        <QuestionCard key={questions[index].id} question={questions[index]} onAnswered={handleAnswered} />
      </div>
    );
  }

  if (phase === 'summary') {
    const correctCount = answers.filter((a) => a.correct).length;
    const missed = answers.filter((a) => !a.correct);
    return (
      <div className="flex-1 min-h-0 flex flex-col p-4 gap-5 overflow-y-auto">
        <div className="text-center pt-6 flex flex-col items-center gap-2">
          <div className="text-5xl">{correctCount === answers.length ? '🎉' : '🍵'}</div>
          <div className="text-2xl font-bold">
            {correctCount} / {answers.length} correct
          </div>
          <div className="text-txt-secondary text-sm">🔥 {currentStreak} day streak</div>
        </div>
        {missed.length > 0 && (
          <Card>
            <div className="text-txt-secondary text-xs font-semibold uppercase tracking-wide mb-3">Review these</div>
            <div className="flex flex-col gap-3">
              {missed.map(({ question }) => (
                <div key={question.id} className="border-b border-divider last:border-0 pb-3 last:pb-0">
                  <Furigana markup={question.phrase.jp} className="text-lg leading-[2.1]" show />
                  <div className="text-txt-secondary text-sm">{question.phrase.en}</div>
                </div>
              ))}
            </div>
          </Card>
        )}
        <div className="mt-auto">
          <AccentButton onClick={() => setPhase('start')}>Done</AccentButton>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col p-4 gap-5 overflow-y-auto">
      <div>
        <h1 className="text-2xl font-bold">
          Travel Japanese <span className="font-jp text-accent">旅の日本語</span>
        </h1>
        <p className="text-txt-secondary text-sm mt-1">
          {dueCount > 0 ? `${dueCount} reviews due` : 'No reviews due — learn something new'}
          {currentStreak > 0 && ` · 🔥 ${currentStreak}`}
        </p>
      </div>

      <Card>
        <div className="text-txt-secondary text-xs font-semibold uppercase tracking-wide mb-3">Drills</div>
        <div className="flex flex-col gap-2">
          {ALL_MODES.map((mode) => {
            const active = modes.includes(mode);
            return (
              <button
                key={mode}
                onClick={() => toggleMode(mode)}
                className={`flex items-center gap-3 text-left rounded-lg border px-3 py-2.5 transition-colors ${
                  active ? 'border-accent bg-accent/10' : 'border-border bg-app-card-light'
                }`}
              >
                <span className="text-xl">{MODE_INFO[mode].icon}</span>
                <span className="flex-1">
                  <span className={`block text-sm font-semibold ${active ? 'text-txt-primary' : 'text-txt-secondary'}`}>
                    {MODE_INFO[mode].label}
                  </span>
                  <span className="block text-xs text-txt-tertiary">{MODE_INFO[mode].description}</span>
                </span>
                <span className={`text-sm ${active ? 'text-accent' : 'text-txt-disabled'}`}>{active ? '●' : '○'}</span>
              </button>
            );
          })}
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-3">
          <div className="text-txt-secondary text-xs font-semibold uppercase tracking-wide">Situations</div>
          <button
            onClick={() => updateSettings({ scenarioIds: allScenariosSelected ? [] : null })}
            className="text-accent text-xs font-semibold"
          >
            {allScenariosSelected ? 'Deselect All' : 'Select All'}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {scenarios.map((s) => (
            <Badge key={s.id} active={selectedScenarios.includes(s.id)} onClick={() => toggleScenario(s.id)}>
              {s.icon} {s.name}
            </Badge>
          ))}
        </div>
      </Card>

      <div className="mt-auto flex flex-col gap-2">
        {availableItems === 0 && (
          <div className="text-danger text-xs text-center">Pick at least one drill and one situation.</div>
        )}
        <AccentButton onClick={start} disabled={availableItems === 0}>
          Start · {Math.min(settings.sessionLength, availableItems)} questions
        </AccentButton>
      </div>
    </div>
  );
}
