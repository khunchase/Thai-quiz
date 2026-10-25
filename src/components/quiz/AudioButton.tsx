import { speakThai, isSpeechSupported } from '../../lib/speech';
import { useSettingsStore } from '../../stores/settings-store';

interface AudioButtonProps {
  text: string;
  /** Multiplier on the normal speaking rate (e.g. 0.5 for half speed). */
  speed?: number;
  className?: string;
  /** 'zone' fills its container's height as a wide tap strip instead of a small circle. */
  variant?: 'icon' | 'zone';
}

const VARIANT_CLASSES = {
  icon: 'inline-flex w-9 h-9 rounded-full bg-app-surface active:scale-90 transition-transform',
  zone: 'flex self-stretch w-1/5 min-w-16 shrink-0 border-l border-border bg-app-surface/60 text-xl active:bg-app-surface transition-colors',
};

export function AudioButton({ text, speed = 1, className = '', variant = 'icon' }: AudioButtonProps) {
  const audioEnabled = useSettingsStore((s) => s.settings.audioEnabled);
  if (!audioEnabled || !isSpeechSupported()) return null;
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        speakThai(text, speed);
      }}
      aria-label="Play pronunciation"
      className={`items-center justify-center text-accent ${VARIANT_CLASSES[variant]} ${className}`}
    >
      🔊
    </button>
  );
}
