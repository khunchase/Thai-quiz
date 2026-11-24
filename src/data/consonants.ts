/**
 * The 42 Thai consonants in use (obsolete ฃ and ฅ left out), each with its
 * traditional name word: ก ไก่ "kɔɔ kài", the ก of chicken.
 */
export interface Consonant {
  letter: string;
  /** The name word written in Thai, e.g. ไก่. */
  nameWord: string;
  /** The full spoken name, e.g. kɔɔ kài. */
  pronunciation: string;
  english: string;
}

export const CONSONANTS: Consonant[] = [
  { letter: 'ก', nameWord: 'ไก่', pronunciation: 'kɔɔ kài', english: 'chicken' },
  { letter: 'ข', nameWord: 'ไข่', pronunciation: 'khɔ̌ɔ khài', english: 'egg' },
  { letter: 'ค', nameWord: 'ควาย', pronunciation: 'khɔɔ khwaai', english: 'buffalo' },
  { letter: 'ฆ', nameWord: 'ระฆัง', pronunciation: 'khɔɔ rá khaŋ', english: 'bell' },
  { letter: 'ง', nameWord: 'งู', pronunciation: 'ŋɔɔ ŋuu', english: 'snake' },
  { letter: 'จ', nameWord: 'จาน', pronunciation: 'cɔɔ caan', english: 'plate' },
  { letter: 'ฉ', nameWord: 'ฉิ่ง', pronunciation: 'chɔ̌ɔ chìŋ', english: 'small cymbals' },
  { letter: 'ช', nameWord: 'ช้าง', pronunciation: 'chɔɔ cháaŋ', english: 'elephant' },
  { letter: 'ซ', nameWord: 'โซ่', pronunciation: 'sɔɔ sôo', english: 'chain' },
  { letter: 'ฌ', nameWord: 'เฌอ', pronunciation: 'chɔɔ chəə', english: 'tree' },
  { letter: 'ญ', nameWord: 'หญิง', pronunciation: 'yɔɔ yǐŋ', english: 'woman' },
  { letter: 'ฎ', nameWord: 'ชฎา', pronunciation: 'dɔɔ chá daa', english: 'headdress' },
  { letter: 'ฏ', nameWord: 'ปฏัก', pronunciation: 'tɔɔ pà tàk', english: 'goad' },
  { letter: 'ฐ', nameWord: 'ฐาน', pronunciation: 'thɔ̌ɔ thǎan', english: 'pedestal' },
  { letter: 'ฑ', nameWord: 'มณโฑ', pronunciation: 'thɔɔ mon thoo', english: 'Montho (a queen in the Ramakien)' },
  { letter: 'ฒ', nameWord: 'ผู้เฒ่า', pronunciation: 'thɔɔ phûu thâu', english: 'old man' },
  { letter: 'ณ', nameWord: 'เณร', pronunciation: 'nɔɔ neen', english: 'novice monk' },
  { letter: 'ด', nameWord: 'เด็ก', pronunciation: 'dɔɔ dèk', english: 'child' },
  { letter: 'ต', nameWord: 'เต่า', pronunciation: 'tɔɔ tàu', english: 'turtle' },
  { letter: 'ถ', nameWord: 'ถุง', pronunciation: 'thɔ̌ɔ thǔŋ', english: 'bag' },
  { letter: 'ท', nameWord: 'ทหาร', pronunciation: 'thɔɔ thá hǎan', english: 'soldier' },
  { letter: 'ธ', nameWord: 'ธง', pronunciation: 'thɔɔ thoŋ', english: 'flag' },
  { letter: 'น', nameWord: 'หนู', pronunciation: 'nɔɔ nǔu', english: 'mouse' },
  { letter: 'บ', nameWord: 'ใบไม้', pronunciation: 'bɔɔ bai máai', english: 'leaf' },
  { letter: 'ป', nameWord: 'ปลา', pronunciation: 'pɔɔ plaa', english: 'fish' },
  { letter: 'ผ', nameWord: 'ผึ้ง', pronunciation: 'phɔ̌ɔ phɯ̂ŋ', english: 'bee' },
  { letter: 'ฝ', nameWord: 'ฝา', pronunciation: 'fɔ̌ɔ fǎa', english: 'lid' },
  { letter: 'พ', nameWord: 'พาน', pronunciation: 'phɔɔ phaan', english: 'pedestal tray' },
  { letter: 'ฟ', nameWord: 'ฟัน', pronunciation: 'fɔɔ fan', english: 'tooth' },
  { letter: 'ภ', nameWord: 'สำเภา', pronunciation: 'phɔɔ sǎm phau', english: 'junk (sailing ship)' },
  { letter: 'ม', nameWord: 'ม้า', pronunciation: 'mɔɔ máa', english: 'horse' },
  { letter: 'ย', nameWord: 'ยักษ์', pronunciation: 'yɔɔ yák', english: 'giant' },
  { letter: 'ร', nameWord: 'เรือ', pronunciation: 'rɔɔ rɯa', english: 'boat' },
  { letter: 'ล', nameWord: 'ลิง', pronunciation: 'lɔɔ liŋ', english: 'monkey' },
  { letter: 'ว', nameWord: 'แหวน', pronunciation: 'wɔɔ wɛ̌ɛn', english: 'ring' },
  { letter: 'ศ', nameWord: 'ศาลา', pronunciation: 'sɔ̌ɔ sǎa laa', english: 'pavilion' },
  { letter: 'ษ', nameWord: 'ฤๅษี', pronunciation: 'sɔ̌ɔ rɯɯ sǐi', english: 'hermit' },
  { letter: 'ส', nameWord: 'เสือ', pronunciation: 'sɔ̌ɔ sɯ̌a', english: 'tiger' },
  { letter: 'ห', nameWord: 'หีบ', pronunciation: 'hɔ̌ɔ hìip', english: 'chest (box)' },
  { letter: 'ฬ', nameWord: 'จุฬา', pronunciation: 'lɔɔ cù laa', english: 'star-shaped kite' },
  { letter: 'อ', nameWord: 'อ่าง', pronunciation: 'ɔɔ àaŋ', english: 'basin' },
  { letter: 'ฮ', nameWord: 'นกฮูก', pronunciation: 'hɔɔ nók hûuk', english: 'owl' },
];
