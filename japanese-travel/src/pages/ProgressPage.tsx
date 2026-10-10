import { useMemo, useState } from 'react';
import { allPhrases, scenarios } from '../data';
import { ALL_MODES, isEligible, itemKey } from '../lib/quiz';
import { xpProgress } from '../lib/level';
import { dateKey } from '../lib/date-utils';
import { useProgressStore } from '../stores/progress-store';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';

/** An item counts as learned once it's been recalled correctly twice in a row. */
const LEARNED_REPS = 2;

export function ProgressPage() {
  const { reviewStates, dailyLog, xp, currentStreak, longestStreak } = useProgressStore();
  const level = xpProgress(xp);

  const [today] = useState(() => new Date());
  const week = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = dateKey(d);
      days.push({ key, label: d.toLocaleDateString('en', { weekday: 'narrow' }), reviewed: dailyLog[key]?.reviewed ?? 0 });
    }
    return days;
  }, [dailyLog, today]);
  const weekMax = Math.max(1, ...week.map((d) => d.reviewed));

  const mastery = useMemo(
    () =>
      scenarios.map((s) => {
        let total = 0;
        let learned = 0;
        for (const p of allPhrases) {
          if (p.scenarioId !== s.id) continue;
          for (const mode of ALL_MODES) {
            if (!isEligible(p, mode)) continue;
            total += 1;
            if ((reviewStates[itemKey(mode, p.id)]?.repetitions ?? 0) >= LEARNED_REPS) learned += 1;
          }
        }
        return { scenario: s, total, learned };
      }),
    [reviewStates]
  );

  return (
    <div className="flex-1 min-h-0 flex flex-col p-4 gap-4 overflow-y-auto">
      <h1 className="text-2xl font-bold">Progress</h1>

      <Card>
        <div className="flex items-baseline justify-between mb-2">
          <div className="text-lg font-bold">Level {level.level}</div>
          <div className="text-txt-tertiary text-xs">
            {level.into} / {level.span} XP
          </div>
        </div>
        <ProgressBar value={(level.into / level.span) * 100} />
        <div className="grid grid-cols-3 gap-2 mt-4 text-center">
          <div>
            <div className="text-xl font-bold">🔥 {currentStreak}</div>
            <div className="text-txt-tertiary text-[11px]">Day streak</div>
          </div>
          <div>
            <div className="text-xl font-bold">{longestStreak}</div>
            <div className="text-txt-tertiary text-[11px]">Best streak</div>
          </div>
          <div>
            <div className="text-xl font-bold">{Object.keys(reviewStates).length}</div>
            <div className="text-txt-tertiary text-[11px]">Items seen</div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="text-txt-secondary text-xs font-semibold uppercase tracking-wide mb-3">Last 7 days</div>
        <div className="flex items-end gap-2 h-28">
          {week.map((d) => (
            <div key={d.key} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
              <div className="text-[10px] text-txt-tertiary">{d.reviewed || ''}</div>
              <div
                className="w-full rounded-t bg-accent/80"
                style={{ height: `${(d.reviewed / weekMax) * 80}%`, minHeight: d.reviewed ? 4 : 2, opacity: d.reviewed ? 1 : 0.15 }}
              />
              <div className="text-[10px] text-txt-tertiary">{d.label}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="text-txt-secondary text-xs font-semibold uppercase tracking-wide mb-3">By situation</div>
        <div className="flex flex-col gap-3">
          {mastery.map(({ scenario, total, learned }) => (
            <div key={scenario.id}>
              <div className="flex justify-between text-sm mb-1">
                <span>
                  {scenario.icon} {scenario.name}
                </span>
                <span className="text-txt-tertiary text-xs">
                  {learned} / {total}
                </span>
              </div>
              <ProgressBar value={total ? (learned / total) * 100 : 0} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
