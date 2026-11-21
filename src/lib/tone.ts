/**
 * Works out *why* each syllable of a word has the tone it has, using the
 * standard Thai tone rules: consonant class × live/dead syllable × tone mark.
 *
 * The word's `pronunciation` (tone-marked romanization) is the source of truth
 * for the tone; this module lines each romanized syllable up with its Thai
 * letters, applies the rules, and reports whether the spelling predicts the
 * tone that's actually spoken. Syllables it can't line up return null, so the
 * UI never shows an explanation it isn't sure of.
 */

export type Tone = 'mid' | 'low' | 'falling' | 'high' | 'rising';
export type ConsonantClass = 'mid' | 'high' | 'low';
export type ToneMark = '่' | '้' | '๊' | '๋';

export interface SyllableTone {
  /** The Thai letters of this syllable, e.g. ขอบ. */
  thai: string;
  /** Its tone-marked romanization, e.g. khɔ̀ɔp. */
  pronunciation: string;
  /** The tone that's actually spoken. */
  tone: Tone;
  /** The tone the spelling rules give. */
  ruleTone: Tone;
  /** True when ruleTone === tone. */
  regular: boolean;
  /** The letter whose class counts (the first letter of a cluster). */
  initial: string;
  cls: ConsonantClass;
  /** A silent ห or อ in front that sets the class instead, e.g. the ห in หมา. */
  leader?: 'ห' | 'อ';
  /**
   * The previous syllable's letter when it "leads" this one: a mid or high
   * consonant read with a hidden short a in front of a low sonorant, like the
   * ส of สนุก, lends this syllable its class.
   */
  ledBy?: string;
  /** True when the syllable ends in a short a that isn't written (ส in สบาย). */
  hiddenA: boolean;
  /** The second letter of a true cluster, e.g. ร in ครอบ. */
  clusterWith?: string;
  mark?: ToneMark;
  live: boolean;
  /** Romanized final sound, e.g. 'p' or 'n'; '' when the syllable ends in a vowel. */
  final: string;
  longVowel: boolean;
}

const MID = 'กจดตฎฏบปอ';
const HIGH = 'ขฃฉฐถผฝศษสห';
const SONORANTS = 'งญณนมยรลวฬ';

export function consonantClass(letter: string): ConsonantClass {
  if (MID.includes(letter)) return 'mid';
  if (HIGH.includes(letter)) return 'high';
  return 'low';
}

/** Thai letters that can start a syllable with each romanized sound. */
const ONSET_LETTERS: Record<string, string> = {
  k: 'ก',
  kh: 'ขฃคฅฆ',
  ŋ: 'ง',
  c: 'จ',
  ch: 'ฉชฌ',
  s: 'ซศษส',
  y: 'ญย',
  d: 'ฎด',
  t: 'ฏต',
  th: 'ฐฑฒถทธ',
  n: 'ณน',
  b: 'บ',
  p: 'ป',
  ph: 'ผพภ',
  f: 'ฝฟ',
  m: 'ม',
  r: 'ร',
  l: 'ลฬ',
  w: 'ว',
  h: 'หฮ',
  '': 'อ',
};

const ONSETS = ['kh', 'ph', 'th', 'ch', 'k', 'p', 't', 'c', 'b', 'd', 's', 'h', 'm', 'n', 'ŋ', 'y', 'r', 'l', 'w', 'f'];
const FINALS = ['p', 't', 'k', 'm', 'n', 'ŋ', 'y', 'w'];
const LEADING_VOWELS = 'เแโใไ';
const TONE_MARKS = '่้๊๋';
/** Vowel signs and marks written above/below/after a consonant they belong to. */
const ATTACHED = 'ะัาำิีึืุู็่้๊๋';

const isConsonant = (ch: string) => ch >= 'ก' && ch <= 'ฮ' && ch !== 'ฤ' && ch !== 'ฦ';

function toneOf(syllable: string): Tone {
  const d = syllable.normalize('NFD');
  if (d.includes('̀')) return 'low';
  if (d.includes('́')) return 'high';
  if (d.includes('̂')) return 'falling';
  if (d.includes('̌')) return 'rising';
  return 'mid';
}

interface Romanized {
  onset: string;
  clusterSound: string;
  final: string;
  live: boolean;
  longVowel: boolean;
}

function parseRomanized(syllable: string): Romanized | null {
  const base = syllable.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  if (!/^[a-zɔɛɯəŋ]+$/.test(base)) return null;
  const onset = ONSETS.find((o) => base.startsWith(o)) ?? '';
  let rest = base.slice(onset.length);
  let clusterSound = '';
  if (onset && /^[rlw][aeiouɔɛɯə]/.test(rest)) {
    clusterSound = rest[0];
    rest = rest.slice(1);
  }
  const final = FINALS.find((f) => rest.length > 1 && rest.endsWith(f) && !/[aeiouɔɛɯə]$/.test(f)) ?? '';
  const nucleus = final ? rest.slice(0, -final.length) : rest;
  if (!nucleus) return null;
  const longVowel = /(.)\1/.test(nucleus);
  const glide = nucleus.length >= 2 && /[iuo]$/.test(nucleus) && !longVowel;
  const live = final ? !'ptk'.includes(final) : longVowel || glide;
  return { onset, clusterSound, final, live, longVowel };
}

export function ruleTone(cls: ConsonantClass, mark: ToneMark | undefined, live: boolean, longVowel: boolean): Tone {
  if (mark === '่') return cls === 'low' ? 'falling' : 'low';
  if (mark === '้') return cls === 'low' ? 'high' : 'falling';
  if (mark === '๊') return 'high';
  if (mark === '๋') return 'rising';
  if (live) return cls === 'high' ? 'rising' : 'mid';
  if (cls === 'low') return longVowel ? 'falling' : 'high';
  return 'low';
}

interface Candidate {
  index: number;
  /** Where the syllable's letters start (any leading vowel or silent ห/อ). */
  start: number;
  leader?: 'ห' | 'อ';
  structural: number;
}

function candidatesFor(thai: string, from: number, r: Romanized): Candidate[] {
  const letters = ONSET_LETTERS[r.onset];
  const out: Candidate[] = [];
  for (let i = from; i < thai.length; i++) {
    const ch = thai[i];
    if (!isConsonant(ch) || !letters.includes(ch)) continue;
    let start = i;
    let leader: Candidate['leader'];
    if (r.onset !== 'h' && SONORANTS.includes(ch) && thai[i - 1] === 'ห' && i - 1 >= from) {
      leader = 'ห';
      start = i - 1;
    } else if (r.onset === 'y' && i - 1 >= from && /^อย(่า|ู่|าก)/.test(thai.slice(i - 1))) {
      // Only four words do this: อย่า อยู่ อย่าง อยาก.
      leader = 'อ';
      start = i - 1;
    }
    if (start - 1 >= from && LEADING_VOWELS.includes(thai[start - 1])) start -= 1;
    const next = thai[i + 1] ?? '';
    const after = r.clusterSound ? thai[i + 2] ?? '' : next;
    let structural = 0;
    if (start < i || (after !== '' && ATTACHED.includes(after)) || (r.clusterSound && isConsonant(next))) structural += 1;
    out.push({ index: i, start, leader, structural });
  }
  return out;
}

/**
 * Explains each syllable's tone, or returns null when the word can't be lined
 * up syllable by syllable (no tone-marked pronunciation, repeated ๆ, etc.).
 */
export function explainTones(thaiRaw: string, pronunciation: string | undefined): SyllableTone[] | null {
  if (!pronunciation) return null;
  const thai = thaiRaw.replace(/\s+/g, '').normalize('NFC');
  if (!thai || /[^ก-๎]/.test(thai) || thai.includes('ๆ') || thai.includes('ฯ')) return null;
  const sylls = pronunciation.trim().split(/\s+/);
  const parsed = sylls.map(parseRomanized);
  if (parsed.some((p) => !p)) return null;
  const roms = parsed as Romanized[];

  // Search the alignments for the one that best fits: a syllable whose rule
  // matches its spoken tone scores highest, then letters that look like an
  // onset (a vowel sign or tone mark on them).
  let best: { score: number; picks: Candidate[] } | null = null;
  const picks: Candidate[] = [];
  let steps = 0;
  const search = (s: number, from: number, score: number) => {
    if (++steps > 5000) return;
    if (s === roms.length) {
      if (!best || score > best.score) best = { score, picks: [...picks] };
      return;
    }
    const r = roms[s];
    const cands = candidatesFor(thai, from, r);
    // The first syllable has to start at the start of the word.
    for (const c of s === 0 ? cands.filter((c) => c.start === 0) : cands) {
      picks.push(c);
      search(s + 1, c.index + 1 + (r.clusterSound ? 1 : 0), score + c.structural);
      picks.pop();
    }
  };
  search(0, 0, 0);
  if (!best) return null;
  const chosen = (best as { picks: Candidate[] }).picks;

  const spans = chosen.map((c, s) => thai.slice(c.start, s + 1 < chosen.length ? chosen[s + 1].start : thai.length));
  const hiddenA = (s: number) => {
    const base = sylls[s].normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return /a$/.test(base) && !/aa$/.test(base) && /^[ก-ฮ]+$/.test(spans[s]);
  };
  const result = chosen.map((c, s): SyllableTone => {
    const r = roms[s];
    const end = s + 1 < chosen.length ? chosen[s + 1].start : thai.length;
    const span = spans[s];
    const onsetEnd = c.index + 1 + (r.clusterSound ? 1 : 0);
    const mark = [...thai.slice(c.index, Math.min(end, onsetEnd + 2))].find((ch) => TONE_MARKS.includes(ch)) as
      | ToneMark
      | undefined;
    let cls: ConsonantClass = c.leader === 'ห' ? 'high' : c.leader === 'อ' ? 'mid' : consonantClass(thai[c.index]);
    let ledBy: string | undefined;
    if (!c.leader && !r.clusterSound && s > 0 && SONORANTS.includes(thai[c.index]) && c.start === c.index) {
      const prev = chosen[s - 1];
      const prevCls = consonantClass(thai[prev.index]);
      const prevRom = roms[s - 1];
      const prevBase = sylls[s - 1].normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      // The led syllable needs a long vowel or a final (นุ of อนุ isn't led),
      // and the leader is a lone consonant (ส of สนุก) or a cluster (ปร of ประวัติ).
      const leaderShape = prevRom.clusterSound ? /^[ก-ฮ]{2}ะ?$/ : /^[ก-ฮ]$/;
      if (
        prevCls !== 'low' &&
        !prev.leader &&
        (r.final !== '' || r.live || spans[s].endsWith('ะ')) &&
        leaderShape.test(spans[s - 1]) &&
        /a$/.test(prevBase) &&
        !prevRom.final
      ) {
        ledBy = thai[prev.index];
        cls = prevCls;
      }
    }
    const tone = toneOf(sylls[s]);
    const rt = ruleTone(cls, mark, r.live, r.longVowel);
    return {
      thai: span,
      pronunciation: sylls[s],
      tone,
      ruleTone: rt,
      regular: rt === tone,
      initial: thai[c.index],
      cls,
      leader: c.leader,
      ledBy,
      hiddenA: hiddenA(s),
      clusterWith: r.clusterSound && isConsonant(thai[c.index + 1] ?? '') ? thai[c.index + 1] : undefined,
      mark,
      live: r.live,
      final: r.final,
      longVowel: r.longVowel,
    };
  });
  return result;
}

export const TONE_MARK_NAMES: Record<ToneMark, string> = {
  '่': 'mai ek',
  '้': 'mai tho',
  '๊': 'mai tri',
  '๋': 'mai chattawa',
};
