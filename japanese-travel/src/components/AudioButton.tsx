import { isSpeechSupported, speakJapanese } from '../lib/speech';
import { useSettingsStore } from '../stores/settings-store';

interface AudioButtonProps {
  markup: string;
  size?: 'small' | 'large';
}

export function AudioButton({ markup, size = 'small' }: AudioButtonProps) {
  const rate = useSettingsStore((s) => s.settings.speechRate);
  if (!isSpeechSupported()) return null;
  const sizeClass = size === 'large' ? 'w-12 h-12 text-xl' : 'w-9 h-9 text-base';
  return (
    <button
      type="button"
      aria-label="Play audio"
      onClick={(e) => {
        e.stopPropagation();
        speakJapanese(markup, rate);
      }}
      className={`${sizeClass} shrink-0 rounded-full bg-accent/15 text-accent flex items-center justify-center active:scale-95 transition-transform`}
    >
      🔊
    </button>
  );
}
