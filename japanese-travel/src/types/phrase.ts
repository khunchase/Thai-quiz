/** Who says the line: a staff member / local talking to you, or you. */
export type Speaker = 'staff' | 'you';

/** keigo = 尊敬語/謙譲語 service language, polite = です/ます, casual = plain form. */
export type Register = 'keigo' | 'polite' | 'casual';

export interface Scenario {
  id: string;
  name: string;
  jp: string;
  icon: string;
}

/**
 * Japanese text fields use furigana markup: `{漢字|かんじ}` puts the reading
 * over the kanji. Kana-only text needs no markup. One brace group per word
 * (e.g. `{予約|よやく}`), never a bare kanji outside braces.
 */
export interface Phrase {
  id: string;
  scenarioId: string;
  speaker: Speaker;
  jp: string;
  en: string;
  register: Register;
  /** Keigo lines only: the same meaning in plain です/ます Japanese (same markup). */
  plain?: string;
  /** Staff lines only: a natural thing to say back. */
  reply?: { jp: string; en: string };
  /** Short English note on the keigo / grammar / cultural point. */
  note?: string;
}
