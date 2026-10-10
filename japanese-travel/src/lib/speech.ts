import { toWritten } from './furigana';

let cachedVoice: SpeechSynthesisVoice | null | undefined;

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

function getJapaneseVoice(): SpeechSynthesisVoice | null {
  if (!isSpeechSupported()) return null;
  if (cachedVoice !== undefined) return cachedVoice;
  const voices = window.speechSynthesis.getVoices().filter((v) => v.lang?.toLowerCase().startsWith('ja'));
  // Prefer higher-quality network/enhanced voices when the platform offers them.
  cachedVoice =
    voices.find((v) => /google|enhanced|premium|kyoko|o-ren|nanami/i.test(v.name)) ?? voices[0] ?? null;
  return cachedVoice;
}

/** Speaks furigana markup (or plain text) with a Japanese voice. */
export function speakJapanese(markup: string, rate = 0.9): void {
  if (!isSpeechSupported()) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(toWritten(markup));
  utterance.lang = 'ja-JP';
  utterance.rate = rate;
  const voice = getJapaneseVoice();
  if (voice) utterance.voice = voice;
  window.speechSynthesis.speak(utterance);
}

if (isSpeechSupported()) {
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoice = undefined;
  };
}
