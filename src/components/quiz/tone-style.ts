import type { Tone } from '../../lib/tone';

export const TONE_STYLE: Record<Tone, { text: string; chip: string }> = {
  mid: { text: 'text-txt-secondary', chip: 'bg-app-surface text-txt-secondary' },
  low: { text: 'text-connector', chip: 'bg-connector/15 text-connector' },
  falling: { text: 'text-warning', chip: 'bg-warning/15 text-warning' },
  high: { text: 'text-success', chip: 'bg-success/15 text-success' },
  rising: { text: 'text-purple-400', chip: 'bg-purple-400/15 text-purple-400' },
};

/** Pitch shapes on a 20×12 box, top = high. */
export const CONTOUR: Record<Tone, string> = {
  mid: 'M2 6 L18 6',
  low: 'M2 8 L18 10.5',
  falling: 'M2 4 Q7 1.5 10 4 T18 11',
  high: 'M2 4 Q12 4 18 1.5',
  rising: 'M2 8 Q8 11 12 8 T18 1.5',
};

/** The five tones in the usual teaching order: mid, low, falling, high, rising. */
export const TONE_ORDER: { tone: Tone; label: string }[] = [
  { tone: 'mid', label: 'Mid' },
  { tone: 'low', label: 'Low' },
  { tone: 'falling', label: 'Falling' },
  { tone: 'high', label: 'High' },
  { tone: 'rising', label: 'Rising' },
];

export const TONE_LABEL = Object.fromEntries(TONE_ORDER.map((t) => [t.tone, t.label])) as Record<Tone, string>;
