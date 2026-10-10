export interface FuriganaSegment {
  text: string;
  reading?: string;
}

const MARKUP = /\{([^|{}]+)\|([^|{}]+)\}/g;

/** Splits `{予約|よやく}をお{願|ねが}いします` into kanji+reading and plain-kana segments. */
export function parseFurigana(markup: string): FuriganaSegment[] {
  const segments: FuriganaSegment[] = [];
  let last = 0;
  for (const match of markup.matchAll(MARKUP)) {
    const index = match.index ?? 0;
    if (index > last) segments.push({ text: markup.slice(last, index) });
    segments.push({ text: match[1], reading: match[2] });
    last = index + match[0].length;
  }
  if (last < markup.length) segments.push({ text: markup.slice(last) });
  return segments;
}

/** The text as it's normally written, e.g. for speech synthesis. */
export function toWritten(markup: string): string {
  return markup.replace(MARKUP, '$1');
}

/** All-kana reading, used for search. */
export function toKana(markup: string): string {
  return markup.replace(MARKUP, '$2');
}
