let cachedThaiVoice: SpeechSynthesisVoice | null | undefined;

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

function getThaiVoice(): SpeechSynthesisVoice | null {
  if (!isSpeechSupported()) return null;
  if (cachedThaiVoice !== undefined) return cachedThaiVoice;
  const voices = window.speechSynthesis.getVoices();
  cachedThaiVoice = voices.find((v) => v.lang?.toLowerCase().startsWith('th')) ?? null;
  return cachedThaiVoice;
}

/** `speed` scales the default rate, so 0.5 is half the normal reading speed. */
export function speakThai(text: string, speed = 1): void {
  if (!isSpeechSupported()) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'th-TH';
  utterance.rate = 0.9 * speed;
  const voice = getThaiVoice();
  if (voice) utterance.voice = voice;
  window.speechSynthesis.speak(utterance);
}

if (isSpeechSupported()) {
  window.speechSynthesis.onvoiceschanged = () => {
    cachedThaiVoice = undefined;
  };
}
