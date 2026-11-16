import type { Word } from '../../types/word';
import { classifierFor } from '../../data/classifiers';
import { useSettingsStore, singleThaiFontClass } from '../../stores/settings-store';

/**
 * The classifier used to count a noun, with the word counted as an example
 * (แมว สอง ตัว "two cats"). Renders nothing for words without one.
 * `compact` is a single line for small cards.
 */
export function ClassifierNote({
  word,
  compact = false,
  align = 'center',
  className = '',
}: {
  word: Word;
  compact?: boolean;
  align?: 'center' | 'left';
  className?: string;
}) {
  const fontStyle = useSettingsStore((s) => s.settings.thaiFontStyle);
  const classifier = classifierFor(word);
  if (!classifier) return null;
  const thaiFont = singleThaiFontClass(fontStyle);

  if (compact) {
    return (
      <div className={`text-sm text-txt-secondary ${className}`}>
        <span className="text-txt-tertiary">classifier </span>
        <span className={`${thaiFont} font-semibold text-accent`}>{classifier.thai}</span>{' '}
        <span className="text-txt-tertiary">{classifier.pronunciation}</span>
      </div>
    );
  }

  return (
    <div className={`w-full ${align === 'center' ? 'text-center' : 'text-left'} ${className}`}>
      {align === 'center' && (
        <div className="text-txt-tertiary text-[10px] uppercase tracking-wide mb-1">Classifier</div>
      )}
      <div className={`flex items-baseline gap-2 ${align === 'center' ? 'justify-center' : ''}`}>
        <span className={`${thaiFont} text-2xl font-semibold text-accent`}>{classifier.thai}</span>
        <span className="text-txt-secondary">{classifier.pronunciation}</span>
      </div>
      <div className="text-txt-tertiary text-xs mt-0.5">for {classifier.usedFor}</div>
      <div className="mt-1.5 text-sm">
        <span className={thaiFont}>
          {word.thai} สอง <span className="text-accent">{classifier.thai}</span>
        </span>
        <span className="text-txt-tertiary text-xs"> (two)</span>
      </div>
      <div className="text-txt-tertiary text-xs">
        {word.pronunciation ?? word.romanization} sɔ̌ɔŋ {classifier.pronunciation}
      </div>
    </div>
  );
}
