// Thai consonants and vowels for the Letters quiz. This is standalone practice:
// none of it is in the word deck, flashcards, or spaced-repetition progress.
//
// Romanization follows the same Thai Language Station convention as the
// starter words (ɔ, ɛ, ɯ, ə, ŋ, c = จ, doubled long vowels, tone marks).

export type ConsonantClass = 'mid' | 'high' | 'low';

export interface Consonant {
  kind: 'consonant';
  id: string;
  letter: string;
  /** Full Thai name, e.g. กอ ไก่. */
  name: string;
  /** Romanized name, e.g. kɔɔ kài. */
  nameRoman: string;
  /** English meaning of the name's key word. */
  meaning: string;
  /** Sound at the start of a syllable. */
  initial: string;
  /** Sound at the end of a syllable, or null when it's never a final. */
  final: string | null;
  class: ConsonantClass;
  obsolete?: boolean;
}

export interface Vowel {
  kind: 'vowel';
  id: string;
  /** Written on อ, the usual carrier, e.g. อะ, เอีย. */
  form: string;
  /** Thai name, e.g. สระอะ. */
  name: string;
  /** The sound, e.g. aa. */
  sound: string;
  length: 'short' | 'long';
  /** Sets apart vowels that share a sound (ใอ / ไอ). */
  note?: string;
}

export type Letter = Consonant | Vowel;

function c(
  letter: string,
  name: string,
  nameRoman: string,
  meaning: string,
  initial: string,
  final: string | null,
  cls: ConsonantClass,
  obsolete = false
): Consonant {
  return { kind: 'consonant', id: `c-${letter}`, letter, name, nameRoman, meaning, initial, final, class: cls, obsolete };
}

export const CONSONANTS: Consonant[] = [
  c('ก', 'กอ ไก่', 'kɔɔ kài', 'chicken', 'k', 'k', 'mid'),
  c('ข', 'ขอ ไข่', 'khɔ̌ɔ khài', 'egg', 'kh', 'k', 'high'),
  c('ฃ', 'ฃอ ขวด', 'khɔ̌ɔ khùuat', 'bottle', 'kh', 'k', 'high', true),
  c('ค', 'คอ ควาย', 'khɔɔ khwaai', 'buffalo', 'kh', 'k', 'low'),
  c('ฅ', 'ฅอ คน', 'khɔɔ khon', 'person', 'kh', 'k', 'low', true),
  c('ฆ', 'ฆอ ระฆัง', 'khɔɔ rá khaŋ', 'bell', 'kh', 'k', 'low'),
  c('ง', 'งอ งู', 'ŋɔɔ ŋuu', 'snake', 'ŋ', 'ŋ', 'low'),
  c('จ', 'จอ จาน', 'cɔɔ caan', 'plate', 'c', 't', 'mid'),
  c('ฉ', 'ฉอ ฉิ่ง', 'chɔ̌ɔ chìŋ', 'cymbals', 'ch', null, 'high'),
  c('ช', 'ชอ ช้าง', 'chɔɔ cháaŋ', 'elephant', 'ch', 't', 'low'),
  c('ซ', 'ซอ โซ่', 'sɔɔ sôo', 'chain', 's', 't', 'low'),
  c('ฌ', 'ฌอ เฌอ', 'chɔɔ chəə', 'tree', 'ch', null, 'low'),
  c('ญ', 'ญอ หญิง', 'yɔɔ yǐŋ', 'woman', 'y', 'n', 'low'),
  c('ฎ', 'ฎอ ชฎา', 'dɔɔ chá daa', 'headdress', 'd', 't', 'mid'),
  c('ฏ', 'ฏอ ปฏัก', 'tɔɔ pà tàk', 'goad', 't', 't', 'mid'),
  c('ฐ', 'ฐอ ฐาน', 'thɔ̌ɔ thǎan', 'pedestal', 'th', 't', 'high'),
  c('ฑ', 'ฑอ มณโฑ', 'thɔɔ mon thoo', 'Montho (Ramakien queen)', 'th', 't', 'low'),
  c('ฒ', 'ฒอ ผู้เฒ่า', 'thɔɔ phûu thâu', 'elder', 'th', 't', 'low'),
  c('ณ', 'ณอ เณร', 'nɔɔ neen', 'novice monk', 'n', 'n', 'low'),
  c('ด', 'ดอ เด็ก', 'dɔɔ dèk', 'child', 'd', 't', 'mid'),
  c('ต', 'ตอ เต่า', 'tɔɔ tàu', 'turtle', 't', 't', 'mid'),
  c('ถ', 'ถอ ถุง', 'thɔ̌ɔ thǔŋ', 'bag', 'th', 't', 'high'),
  c('ท', 'ทอ ทหาร', 'thɔɔ thá hǎan', 'soldier', 'th', 't', 'low'),
  c('ธ', 'ธอ ธง', 'thɔɔ thoŋ', 'flag', 'th', 't', 'low'),
  c('น', 'นอ หนู', 'nɔɔ nǔu', 'mouse', 'n', 'n', 'low'),
  c('บ', 'บอ ใบไม้', 'bɔɔ bai máai', 'leaf', 'b', 'p', 'mid'),
  c('ป', 'ปอ ปลา', 'pɔɔ plaa', 'fish', 'p', 'p', 'mid'),
  c('ผ', 'ผอ ผึ้ง', 'phɔ̌ɔ phɯ̂ŋ', 'bee', 'ph', null, 'high'),
  c('ฝ', 'ฝอ ฝา', 'fɔ̌ɔ fǎa', 'lid', 'f', null, 'high'),
  c('พ', 'พอ พาน', 'phɔɔ phaan', 'offering tray', 'ph', 'p', 'low'),
  c('ฟ', 'ฟอ ฟัน', 'fɔɔ fan', 'teeth', 'f', 'p', 'low'),
  c('ภ', 'ภอ สำเภา', 'phɔɔ sǎm phau', 'junk (ship)', 'ph', 'p', 'low'),
  c('ม', 'มอ ม้า', 'mɔɔ máa', 'horse', 'm', 'm', 'low'),
  c('ย', 'ยอ ยักษ์', 'yɔɔ yák', 'giant', 'y', 'y', 'low'),
  c('ร', 'รอ เรือ', 'rɔɔ rɯɯa', 'boat', 'r', 'n', 'low'),
  c('ล', 'ลอ ลิง', 'lɔɔ liŋ', 'monkey', 'l', 'n', 'low'),
  c('ว', 'วอ แหวน', 'wɔɔ wɛ̌ɛn', 'ring', 'w', 'w', 'low'),
  c('ศ', 'ศอ ศาลา', 'sɔ̌ɔ sǎa laa', 'pavilion', 's', 't', 'high'),
  c('ษ', 'ษอ ฤๅษี', 'sɔ̌ɔ rɯɯ sǐi', 'hermit', 's', 't', 'high'),
  c('ส', 'สอ เสือ', 'sɔ̌ɔ sɯ̌ɯa', 'tiger', 's', 't', 'high'),
  c('ห', 'หอ หีบ', 'hɔ̌ɔ hìip', 'chest', 'h', null, 'high'),
  c('ฬ', 'ฬอ จุฬา', 'lɔɔ cù laa', 'star kite', 'l', 'n', 'low'),
  c('อ', 'ออ อ่าง', 'ɔɔ àaŋ', 'basin', 'ʔ (silent)', null, 'mid'),
  c('ฮ', 'ฮอ นกฮูก', 'hɔɔ nók hûuk', 'owl', 'h', null, 'low'),
];

function v(form: string, name: string, sound: string, length: 'short' | 'long', note?: string): Vowel {
  return { kind: 'vowel', id: `v-${form}`, form, name, sound, length, note };
}

export const VOWELS: Vowel[] = [
  v('อะ', 'สระอะ', 'a', 'short'),
  v('อา', 'สระอา', 'aa', 'long'),
  v('อิ', 'สระอิ', 'i', 'short'),
  v('อี', 'สระอี', 'ii', 'long'),
  v('อึ', 'สระอึ', 'ɯ', 'short'),
  v('อือ', 'สระอือ', 'ɯɯ', 'long'),
  v('อุ', 'สระอุ', 'u', 'short'),
  v('อู', 'สระอู', 'uu', 'long'),
  v('เอะ', 'สระเอะ', 'e', 'short'),
  v('เอ', 'สระเอ', 'ee', 'long'),
  v('แอะ', 'สระแอะ', 'ɛ', 'short'),
  v('แอ', 'สระแอ', 'ɛɛ', 'long'),
  v('โอะ', 'สระโอะ', 'o', 'short'),
  v('โอ', 'สระโอ', 'oo', 'long'),
  v('เอาะ', 'สระเอาะ', 'ɔ', 'short'),
  v('ออ', 'สระออ', 'ɔɔ', 'long'),
  v('เออะ', 'สระเออะ', 'ə', 'short'),
  v('เออ', 'สระเออ', 'əə', 'long'),
  v('เอียะ', 'สระเอียะ', 'ia', 'short'),
  v('เอีย', 'สระเอีย', 'iia', 'long'),
  v('เอือะ', 'สระเอือะ', 'ɯa', 'short'),
  v('เอือ', 'สระเอือ', 'ɯɯa', 'long'),
  v('อัวะ', 'สระอัวะ', 'ua', 'short'),
  v('อัว', 'สระอัว', 'uua', 'long'),
  v('อำ', 'สระอำ', 'am', 'short'),
  v('ใอ', 'สระใอ ไม้ม้วน', 'ai', 'short', 'mái múan, the rolled one'),
  v('ไอ', 'สระไอ ไม้มลาย', 'ai', 'short', 'mái má laai, the straight one'),
  v('เอา', 'สระเอา', 'au', 'short'),
];

export const CLASS_LABELS: Record<ConsonantClass, string> = {
  mid: 'Mid class',
  high: 'High class',
  low: 'Low class',
};

/** What the letter looks like on screen. */
export function letterGlyph(item: Letter): string {
  return item.kind === 'consonant' ? item.letter : item.form;
}

/** What text-to-speech reads for the letter: its Thai name. */
export function letterSpeech(item: Letter): string {
  return item.name;
}

/** The sound side of a letter, as shown on a choice or a prompt. */
export function letterSound(item: Letter): string {
  if (item.kind === 'consonant') return `${item.nameRoman} · ${item.meaning}`;
  return `${item.sound} · ${item.length}${item.note ? ` · ${item.note}` : ''}`;
}
