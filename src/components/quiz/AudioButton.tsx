import { speakThai, isSpeechSupported } from '../../lib/speech';
import { useSettingsStore } from '../../stores/settings-store';

interface AudioButtonProps {
  text: string;
  className?: string;
}

export function AudioButton({ text, className = '' }: AudioButtonProps) {
  const audioEnabled = useSettingsStore((s) => s.settings.audioEnabled);
  if (!audioEnabled || !isSpeechSupported()) return null;
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        speakThai(text);
      }}
      aria-label="Play pronunciation"
      className={`inline-flex items-center justify-center w-9 h-9 rounded-full bg-app-surface text-accent active:scale-90 transition-transform ${className}`}
    >
      🔊
    </button>
  );
}
