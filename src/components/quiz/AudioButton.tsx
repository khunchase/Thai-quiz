import { speakThai, isSpeechSupported } from '../../lib/speech';
import { useSettingsStore } from '../../stores/settings-store';
import { PlayIcon } from '../ui/icons';

interface AudioButtonProps {
  text: string;
  /** Multiplier on the normal speaking rate (e.g. 0.5 for half speed). */
  speed?: number;
  className?: string;
  /**
   * 'zone' fills its container's height as a wide tap strip instead of a small circle;
   * 'bare' is just the icon, for the exercise header's button pill.
   */
  variant?: 'icon' | 'zone' | 'bare';
  /** Greys the button out, e.g. while hearing the word would give away the answer. */
  disabled?: boolean;
}

const VARIANT_CLASSES = {
  icon: 'inline-flex w-9 h-9 rounded-full bg-app-surface active:scale-90 transition-transform',
  zone: 'flex self-stretch w-1/5 min-w-16 shrink-0 border-l border-border bg-app-surface/60 active:bg-app-surface transition-colors',
  bare: 'inline-flex w-11 h-11 rounded-full active:scale-90 transition-transform',
};

const ICON_CLASSES = {
  icon: 'w-6 h-6',
  zone: 'w-7 h-7',
  bare: 'w-8 h-8',
};

export function AudioButton({ text, speed = 1, className = '', variant = 'icon', disabled = false }: AudioButtonProps) {
  const audioEnabled = useSettingsStore((s) => s.settings.audioEnabled);
  if (!audioEnabled || !isSpeechSupported()) return null;
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        speakThai(text, speed);
      }}
      disabled={disabled}
      aria-label="Play pronunciation"
      className={`items-center justify-center text-accent disabled:opacity-30 disabled:pointer-events-none ${VARIANT_CLASSES[variant]} ${className}`}
    >
      <PlayIcon className={ICON_CLASSES[variant]} />
    </button>
  );
}
