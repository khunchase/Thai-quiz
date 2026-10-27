import type { ReactNode } from 'react';
import type { Word } from '../../types/word';
import type { Grade } from '../../types/quiz';
import { isSpeechSupported } from '../../lib/speech';
import { useSettingsStore } from '../../stores/settings-store';
import { BackIcon, HelpIcon, SearchIcon } from '../ui/icons';
import { AudioButton } from './AudioButton';
import { ItemSheet } from './ItemSheet';

/** What the screen hosting an exercise decides: its title and where Back goes. */
export interface ExerciseFrame {
  title: string;
  subtitle?: string;
  onExit: () => void;
}

interface HeaderProps extends ExerciseFrame {
  /** Thai text the ▶ button reads out; no ▶ without it. */
  playText?: string;
  playSpeed?: number;
  /** Greyed out while hearing it would give the answer away. */
  playDisabled?: boolean;
  /** What ? does; no ? without it. */
  onHelp?: () => void;
  helpLabel?: string;
  helpDisabled?: boolean;
}

/** Round back button, centered title, and a pill holding ▶ and ?. */
export function ExerciseHeader({
  title,
  subtitle,
  onExit,
  playText,
  playSpeed,
  playDisabled,
  onHelp,
  helpLabel = "I don't know",
  helpDisabled,
}: HeaderProps) {
  const audioEnabled = useSettingsStore((s) => s.settings.audioEnabled);
  const showPlay = !!playText && audioEnabled && isSpeechSupported();

  return (
    <div className="shrink-0 flex items-center gap-3 px-3 pt-3 pb-2">
      <button
        type="button"
        onClick={onExit}
        aria-label="Back"
        className="w-14 h-14 shrink-0 rounded-full border border-border bg-app-card text-txt-primary flex items-center justify-center active:scale-95 transition-transform"
      >
        <BackIcon />
      </button>
      <div className="flex-1 min-w-0 text-center">
        <div className="text-txt-primary text-xl font-bold truncate">{title}</div>
        {subtitle && <div className="text-txt-secondary text-xs font-semibold mt-0.5">{subtitle}</div>}
      </div>
      {showPlay || onHelp ? (
        <div className="shrink-0 h-14 px-1.5 rounded-full border border-border bg-app-card flex items-center gap-1">
          {showPlay && <AudioButton text={playText} speed={playSpeed} variant="bare" disabled={playDisabled} />}
          {onHelp && (
            <button
              type="button"
              onClick={onHelp}
              disabled={helpDisabled}
              aria-label={helpLabel}
              title={helpLabel}
              className="w-11 h-11 rounded-full inline-flex items-center justify-center text-accent active:scale-90 transition-transform disabled:opacity-30 disabled:pointer-events-none"
            >
              <HelpIcon className="w-8 h-8" />
            </button>
          )}
        </div>
      ) : (
        // Keeps the title centered when there are no buttons on the right.
        <div className="w-14 shrink-0" />
      )}
    </div>
  );
}

/** The instruction ("Find the word") over the thing being asked about. */
export function ExercisePrompt({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 py-2">
      <div className="text-txt-secondary font-semibold">{label}</div>
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 shrink-0 rounded-xl border-[1.5px] border-accent/60 bg-accent/10 text-accent flex items-center justify-center">
          <SearchIcon />
        </div>
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}

interface LayoutProps extends HeaderProps {
  word: Word;
  /** The answer is showing: Next is live and the sheet can be pulled up. */
  revealed: boolean;
  pendingGrade?: Grade | null;
  onNext?: () => void;
  children: ReactNode;
}

/** A full exercise screen: header, the question, and the progress sheet along the bottom. */
export function ExerciseLayout({ word, revealed, pendingGrade, onNext, children, ...header }: LayoutProps) {
  return (
    <div className="relative flex-1 min-h-0 flex flex-col overflow-hidden">
      <ExerciseHeader {...header} />
      {/* Bottom padding clears the collapsed sheet. */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 pt-2 pb-[calc(9rem+env(safe-area-inset-bottom))] flex flex-col gap-4">
        {children}
      </div>
      <ItemSheet key={word.id} word={word} revealed={revealed} pendingGrade={pendingGrade} onNext={onNext} />
    </div>
  );
}
