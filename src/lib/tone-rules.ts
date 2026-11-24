/**
 * The tone rules on their own, as quiz items: "low class + dead syllable,
 * short vowel + no tone mark = ?". Each rule is one item with its own
 * progress, and real syllables from the deck show it in action.
 */
import type { Word } from '../types/word';
import { ruleTone, toneQuizSyllables, type ConsonantClass, type SyllableTone, type Tone, type ToneMark } from './tone';

export interface ToneRule {
  id: string;
  cls: ConsonantClass;
  /** Set for the rules about a written tone mark; then live/dead doesn't matter. */
  mark?: ToneMark;
  /** For unmarked rules: live or dead syllable. */
  live?: boolean;
  /** Only matters for low class + dead: the vowel length decides the tone. */
  longVowel?: boolean;
  tone: Tone;
  /** A syllable that follows the rule, shown as the item's card. */
  example: { thai: string; pronunciation: string; english: string };
}

/** Prefix for rule progress, apart from words and the per-word tone quiz. */
export const RULE_ITEM_PREFIX = 'rule:';

type RuleSpec = Omit<ToneRule, 'tone'>;

const SPECS: RuleSpec[] = [
  { id: 'mid-live', cls: 'mid', live: true, example: { thai: 'กา', pronunciation: 'kaa', english: 'crow' } },
  { id: 'mid-dead', cls: 'mid', live: false, example: { thai: 'กับ', pronunciation: 'kàp', english: 'with' } },
  { id: 'high-live', cls: 'high', live: true, example: { thai: 'ขา', pronunciation: 'khǎa', english: 'leg' } },
  { id: 'high-dead', cls: 'high', live: false, example: { thai: 'ผัก', pronunciation: 'phàk', english: 'vegetable' } },
  { id: 'low-live', cls: 'low', live: true, example: { thai: 'มา', pronunciation: 'maa', english: 'come' } },
  {
    id: 'low-dead-short',
    cls: 'low',
    live: false,
    longVowel: false,
    example: { thai: 'รัก', pronunciation: 'rák', english: 'love' },
  },
  {
    id: 'low-dead-long',
    cls: 'low',
    live: false,
    longVowel: true,
    example: { thai: 'มาก', pronunciation: 'mâak', english: 'very' },
  },
  { id: 'mid-ek', cls: 'mid', mark: '่', example: { thai: 'ไก่', pronunciation: 'kài', english: 'chicken' } },
  { id: 'mid-tho', cls: 'mid', mark: '้', example: { thai: 'บ้าน', pronunciation: 'bâan', english: 'house' } },
  { id: 'mid-tri', cls: 'mid', mark: '๊', example: { thai: 'โต๊ะ', pronunciation: 'tó', english: 'table' } },
  { id: 'mid-chattawa', cls: 'mid', mark: '๋', example: { thai: 'จ๋า', pronunciation: 'cǎa', english: 'yes, dear (particle)' } },
  { id: 'high-ek', cls: 'high', mark: '่', example: { thai: 'ข่าว', pronunciation: 'khàaw', english: 'news' } },
  { id: 'high-tho', cls: 'high', mark: '้', example: { thai: 'ข้าว', pronunciation: 'khâaw', english: 'rice' } },
  { id: 'low-ek', cls: 'low', mark: '่', example: { thai: 'พ่อ', pronunciation: 'phɔ̂ɔ', english: 'father' } },
  { id: 'low-tho', cls: 'low', mark: '้', example: { thai: 'น้ำ', pronunciation: 'náam', english: 'water' } },
];

export const TONE_RULES: ToneRule[] = SPECS.map((s) => ({
  ...s,
  tone: ruleTone(s.cls, s.mark, s.live ?? true, s.longVowel ?? true),
}));

const RULES_BY_ID = Object.fromEntries(TONE_RULES.map((r) => [r.id, r]));

export function ruleById(id: string): ToneRule | undefined {
  return RULES_BY_ID[id.startsWith(RULE_ITEM_PREFIX) ? id.slice(RULE_ITEM_PREFIX.length) : id];
}

/** The rule a syllable follows, or undefined for combinations Thai doesn't write (high class + ๊). */
export function ruleFor(s: Pick<SyllableTone, 'cls' | 'mark' | 'live' | 'longVowel'>): ToneRule | undefined {
  if (s.mark) return TONE_RULES.find((r) => r.cls === s.cls && r.mark === s.mark);
  return TONE_RULES.find(
    (r) => !r.mark && r.cls === s.cls && r.live === s.live && (r.longVowel === undefined || r.longVowel === s.longVowel)
  );
}

const CLASS_LABEL: Record<ConsonantClass, string> = { mid: 'Mid class', high: 'High class', low: 'Low class' };

/** "Low class + dead, short vowel + no tone mark" — the parts of the rule, in order. */
export function ruleParts(rule: ToneRule): { cls: string; syllable: string; mark: string } {
  const syllable = rule.mark
    ? 'live or dead'
    : rule.live
      ? 'live syllable'
      : rule.longVowel === undefined
        ? 'dead syllable'
        : `dead, ${rule.longVowel ? 'long' : 'short'} vowel`;
  const mark = rule.mark ? `◌${rule.mark} ${MARK_NAMES[rule.mark]}` : 'no tone mark';
  return { cls: CLASS_LABEL[rule.cls], syllable, mark };
}

const MARK_NAMES: Record<ToneMark, string> = { '่': 'mai ek', '้': 'mai tho', '๊': 'mai tri', '๋': 'mai chattawa' };

/** One line on why the rule gives its tone, shown after answering. */
export function ruleWhy(rule: ToneRule): string {
  if (rule.mark === '่')
    return rule.cls === 'low'
      ? 'Mai ek on a low-class letter gives falling — one step up from what it gives mid and high class (low).'
      : 'Mai ek on a mid- or high-class letter gives a low tone.';
  if (rule.mark === '้')
    return rule.cls === 'low'
      ? 'Mai tho on a low-class letter gives high — one step up from what it gives mid and high class (falling).'
      : 'Mai tho on a mid- or high-class letter gives a falling tone.';
  if (rule.mark === '๊') return 'Mai tri always gives a high tone. It is only written on mid-class letters.';
  if (rule.mark === '๋') return 'Mai chattawa always gives a rising tone. It is only written on mid-class letters.';
  if (rule.live)
    return rule.cls === 'high'
      ? 'A live syllable on a high-class letter rises. Live = long vowel, or ends in -m -n -ŋ -y -w.'
      : `A live syllable on a ${rule.cls}-class letter stays mid. Live = long vowel, or ends in -m -n -ŋ -y -w.`;
  if (rule.cls === 'low')
    return rule.longVowel
      ? 'A dead low-class syllable with a long vowel falls. With a long vowel, dead means it ends in -p -t -k.'
      : 'A dead low-class syllable with a short vowel goes high. Dead = ends in -p -t -k, or a short open vowel.';
  return `A dead syllable on a ${rule.cls}-class letter is low. Dead = ends in -p -t -k, or a short open vowel.`;
}

export interface RuleExample {
  thai: string;
  pronunciation: string;
  /** The word it's from, when it's one syllable of a longer word. */
  fromWord?: string;
  english: string;
}

const examplesCache = new WeakMap<Word[], Record<string, RuleExample[]>>();

/** Up to three syllables from the deck that follow each rule, easiest words first. Cached per word list. */
export function ruleExamples(words: Word[]): Record<string, RuleExample[]> {
  let cached = examplesCache.get(words);
  if (!cached) {
    cached = findRuleExamples(words, 3);
    examplesCache.set(words, cached);
  }
  return cached;
}

function findRuleExamples(words: Word[], limit: number): Record<string, RuleExample[]> {
  const out: Record<string, RuleExample[]> = Object.fromEntries(TONE_RULES.map((r) => [r.id, []]));
  const seen = new Set<string>();
  const sorted = [...words].sort((a, b) => (a.level ?? 9) - (b.level ?? 9));
  for (const w of sorted) {
    const syllables = toneQuizSyllables(w.thai, w.pronunciation);
    if (!syllables) continue;
    for (const s of syllables) {
      // Skip syllables whose class comes from somewhere else (หนึ่ง, the วัส of สวัสดี) or an unwritten vowel.
      if (s.leader || s.ledBy || s.hiddenA) continue;
      const rule = ruleFor(s);
      if (!rule || out[rule.id].length >= limit || seen.has(s.thai) || s.thai === rule.example.thai) continue;
      seen.add(s.thai);
      out[rule.id].push({
        thai: s.thai,
        pronunciation: s.pronunciation,
        fromWord: syllables.length > 1 ? w.thai : undefined,
        english: w.english,
      });
    }
  }
  return out;
}

/** The rules as quiz items: each a pseudo-word keyed `rule:<id>`, its card showing the example syllable. */
export function ruleQuizWords(): Word[] {
  return TONE_RULES.map((r) => {
    const parts = ruleParts(r);
    return {
      id: `${RULE_ITEM_PREFIX}${r.id}`,
      thai: r.example.thai,
      romanization: r.example.pronunciation,
      pronunciation: r.example.pronunciation,
      english: `${parts.cls} + ${parts.syllable} + ${parts.mark} → ${r.tone} (e.g. ${r.example.english})`,
      categoryId: 'tone-rules',
    };
  });
}
