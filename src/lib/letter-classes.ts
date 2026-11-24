/**
 * "Which class is this letter?" — the first step of every tone rule, as quiz
 * items. Each consonant is one item keyed `class:<letter>`.
 */
import type { Word } from '../types/word';
import { CONSONANTS, type Consonant } from '../data/consonants';
import { consonantClass, type ConsonantClass } from './tone';

export const CLASS_ITEM_PREFIX = 'class:';

const SONORANTS = 'งญณนมยรลวฬ';

export function consonantFor(itemId: string): Consonant | undefined {
  const letter = itemId.startsWith(CLASS_ITEM_PREFIX) ? itemId.slice(CLASS_ITEM_PREFIX.length) : itemId;
  return CONSONANTS.find((c) => c.letter === letter);
}

export function lettersOfClass(cls: ConsonantClass): string[] {
  return CONSONANTS.filter((c) => consonantClass(c.letter) === cls).map((c) => c.letter);
}

/** The sentence Thai schoolchildren use to remember each short class; low is "everything else". */
export const CLASS_MNEMONIC: Record<Exclude<ConsonantClass, 'low'>, { thai: string; romanization: string; english: string; letters: string }> = {
  mid: {
    thai: 'ไก่ จิก เด็ก ตาย บน ปาก โอ่ง',
    romanization: 'kài cìk dèk taai bon pàak òoŋ',
    english: 'the chicken pecks the dead child on the mouth of the jar',
    letters: 'กจดตบปอ',
  },
  high: {
    thai: 'ผี ฝาก ถุง ข้าว สาร ให้ ฉัน',
    romanization: 'phǐi fàak thǔŋ khâaw sǎan hâi chǎn',
    english: 'the ghost leaves a bag of rice with me',
    letters: 'ผฝถขสหฉ',
  },
};

/** A tip for the letter, shown after answering. */
export function classTip(letter: string): string {
  const cls = consonantClass(letter);
  if (cls === 'mid' && 'ฎฏ'.includes(letter))
    return `${letter} is the rare twin of ${letter === 'ฎ' ? 'ด' : 'ต'}, so it's mid class too.`;
  if (cls === 'high' && 'ฐศษ'.includes(letter))
    return `${letter} is a rarer twin of ${letter === 'ฐ' ? 'ถ' : 'ส'}, so it's high class too.`;
  if (cls === 'low' && SONORANTS.includes(letter))
    return `${letter} is a low-class letter with no high-class twin. A silent ห in front makes it high (หมา, หนู, หลาย).`;
  if (cls === 'low')
    return `${letter} is low class. It sounds the same as a high-class letter but takes different tones (ค khaa vs ข khǎa).`;
  return '';
}

/** The consonants as quiz items: a pseudo-word per letter, its card showing the letter and its name. */
export function classQuizWords(): Word[] {
  return CONSONANTS.map((c) => ({
    id: `${CLASS_ITEM_PREFIX}${c.letter}`,
    thai: `${c.letter} ${c.nameWord}`,
    romanization: c.pronunciation,
    pronunciation: c.pronunciation,
    english: `${c.english} — ${consonantClass(c.letter)} class`,
    categoryId: 'letter-classes',
  }));
}
