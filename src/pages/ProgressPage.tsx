import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';
import { useAllWords, useAllCategories } from '../stores/deck-store';
import { useProgressStore } from '../stores/progress-store';
import { xpProgress } from '../lib/level';
import { dateKey } from '../lib/date-utils';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';

export function ProgressPage() {
  const words = useAllWords();
  const categories = useAllCategories();
  const reviewStates = useProgressStore((s) => s.reviewStates);
  const xp = useProgressStore((s) => s.xp);
  const currentStreak = useProgressStore((s) => s.currentStreak);
  const longestStreak = useProgressStore((s) => s.longestStreak);
  const dailyLog = useProgressStore((s) => s.dailyLog);

  const { level, into, span } = xpProgress(xp);

  const masteryByCategory = useMemo(
    () =>
      categories
        .map((c) => {
          const catWords = words.filter((w) => w.categoryId === c.id);
          const mastered = catWords.filter((w) => (reviewStates[w.id]?.repetitions ?? 0) >= 2).length;
          return { name: c.name, icon: c.icon, total: catWords.length, mastered };
        })
        .filter((c) => c.total > 0),
    [words, categories, reviewStates]
  );

  const last7Days = useMemo(() => {
    const days: { label: string; reviewed: number }[] = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = dateKey(d);
      const entry = dailyLog[key];
      days.push({ label: d.toLocaleDateString(undefined, { weekday: 'short' }), reviewed: entry?.reviewed ?? 0 });
    }
    return days;
  }, [dailyLog]);

  const wordsSeen = Object.keys(reviewStates).length;
  const totalWords = words.length;

  return (
    <div className="flex-1 min-h-0 overflow-y-auto p-4 flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Progress</h1>

      <Card>
        <div className="flex items-center justify-between mb-2">
          <span className="text-txt-secondary text-sm">Level {level}</span>
          <span className="text-txt-tertiary text-xs">
            {into} / {span} XP
          </span>
        </div>
        <ProgressBar value={(into / span) * 100} />
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Card className="text-center">
          <div className="text-3xl font-bold text-accent">🔥 {currentStreak}</div>
          <div className="text-txt-secondary text-xs mt-1">Day streak</div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-accent">
            {wordsSeen}/{totalWords}
          </div>
          <div className="text-txt-secondary text-xs mt-1">Words studied</div>
        </Card>
      </div>

      <Card>
        <div className="text-txt-secondary text-xs font-semibold uppercase tracking-wide mb-3">Last 7 days</div>
        <div style={{ width: '100%', height: 140 }}>
          <ResponsiveContainer>
            <BarChart data={last7Days}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2E2A22" vertical={false} />
              <XAxis dataKey="label" stroke="#7A7364" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: '#17140F', border: '1px solid #2E2A22', borderRadius: 8 }}
                labelStyle={{ color: '#FAF7F0' }}
              />
              <Bar dataKey="reviewed" fill="#E8B23D" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <div className="text-txt-secondary text-xs font-semibold uppercase tracking-wide mb-3">
          Mastery by category
        </div>
        <div className="flex flex-col gap-3">
          {masteryByCategory.map((c) => (
            <div key={c.name}>
              <div className="flex justify-between text-sm mb-1">
                <span>
                  {c.icon} {c.name}
                </span>
                <span className="text-txt-tertiary">
                  {c.mastered}/{c.total}
                </span>
              </div>
              <ProgressBar value={(c.mastered / c.total) * 100} />
            </div>
          ))}
        </div>
      </Card>

      <div className="text-txt-tertiary text-xs text-center pb-2">Longest streak: {longestStreak} days</div>
    </div>
  );
}
