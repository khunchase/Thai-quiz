import type { Word } from '../types/word';

// Static, stable ids — do not rename existing ids, spaced-repetition
// progress is keyed by word id in localStorage.
//
// `pronunciation` uses Paiboon-style tone marks: unmarked = mid tone,
// à = low, â = falling, á = high, ǎ = rising.
export const STARTER_WORDS: Word[] = [
  // Greetings & Basics
  { id: 'greet-hello', thai: 'สวัสดี', romanization: 'sawatdee', pronunciation: 'sàwàtdee', english: 'hello', categoryId: 'greetings' },
  { id: 'greet-thanks', thai: 'ขอบคุณ', romanization: 'khop khun', pronunciation: 'khòp khun', english: 'thank you', categoryId: 'greetings' },
  { id: 'greet-sorry', thai: 'ขอโทษ', romanization: 'khor thot', pronunciation: 'khǒr thôt', english: 'sorry / excuse me', categoryId: 'greetings' },
  { id: 'greet-yes', thai: 'ใช่', romanization: 'chai', pronunciation: 'châi', english: 'yes', categoryId: 'greetings' },
  { id: 'greet-no', thai: 'ไม่', romanization: 'mai', pronunciation: 'mâi', english: 'no', categoryId: 'greetings' },
  { id: 'greet-noworries', thai: 'ไม่เป็นไร', romanization: 'mai pen rai', pronunciation: 'mâi pen rai', english: "it's okay / no worries", categoryId: 'greetings' },
  { id: 'greet-howareyou', thai: 'สบายดีไหม', romanization: 'sabai dee mai', pronunciation: 'sàbaai dee mǎi', english: 'how are you?', categoryId: 'greetings' },
  { id: 'greet-bye', thai: 'ลาก่อน', romanization: 'la kon', pronunciation: 'laa kòn', english: 'goodbye', categoryId: 'greetings' },
  { id: 'greet-nicemeet', thai: 'ยินดีที่ได้รู้จัก', romanization: 'yindee thi dai ruchak', pronunciation: 'yin dee thîi dâi rúu jàk', english: 'nice to meet you', categoryId: 'greetings' },
  { id: 'greet-please', thai: 'กรุณา', romanization: 'karuna', pronunciation: 'kà rú naa', english: 'please', categoryId: 'greetings' },

  // Numbers
  { id: 'num-1', thai: 'หนึ่ง', romanization: 'neung', pronunciation: 'nèung', english: 'one', categoryId: 'numbers' },
  { id: 'num-2', thai: 'สอง', romanization: 'song', pronunciation: 'sǒng', english: 'two', categoryId: 'numbers' },
  { id: 'num-3', thai: 'สาม', romanization: 'sam', pronunciation: 'sǎam', english: 'three', categoryId: 'numbers' },
  { id: 'num-4', thai: 'สี่', romanization: 'si', pronunciation: 'sìi', english: 'four', categoryId: 'numbers' },
  { id: 'num-5', thai: 'ห้า', romanization: 'ha', pronunciation: 'hâa', english: 'five', categoryId: 'numbers' },
  { id: 'num-6', thai: 'หก', romanization: 'hok', pronunciation: 'hòk', english: 'six', categoryId: 'numbers' },
  { id: 'num-7', thai: 'เจ็ด', romanization: 'jet', pronunciation: 'jèt', english: 'seven', categoryId: 'numbers' },
  { id: 'num-8', thai: 'แปด', romanization: 'paet', pronunciation: 'pàet', english: 'eight', categoryId: 'numbers' },
  { id: 'num-9', thai: 'เก้า', romanization: 'kao', pronunciation: 'kâo', english: 'nine', categoryId: 'numbers' },
  { id: 'num-10', thai: 'สิบ', romanization: 'sip', pronunciation: 'sìp', english: 'ten', categoryId: 'numbers' },

  // Family
  { id: 'fam-mother', thai: 'แม่', romanization: 'mae', pronunciation: 'mâe', english: 'mother', categoryId: 'family' },
  { id: 'fam-father', thai: 'พ่อ', romanization: 'phor', pronunciation: 'phôr', english: 'father', categoryId: 'family' },
  { id: 'fam-olderbro', thai: 'พี่ชาย', romanization: 'phi chai', pronunciation: 'phîi chaai', english: 'older brother', categoryId: 'family' },
  { id: 'fam-youngersis', thai: 'น้องสาว', romanization: 'nong sao', pronunciation: 'nóng sǎao', english: 'younger sister', categoryId: 'family' },
  { id: 'fam-child', thai: 'ลูก', romanization: 'luk', pronunciation: 'lûuk', english: 'child (offspring)', categoryId: 'family' },
  { id: 'fam-husband', thai: 'สามี', romanization: 'sami', pronunciation: 'sǎa mii', english: 'husband', categoryId: 'family' },
  { id: 'fam-wife', thai: 'ภรรยา', romanization: 'phanraya', pronunciation: 'phan rá yaa', english: 'wife', categoryId: 'family' },
  { id: 'fam-grandpa', thai: 'ปู่', romanization: 'pu', pronunciation: 'pùu', english: 'grandfather (paternal)', categoryId: 'family' },
  { id: 'fam-grandma', thai: 'ย่า', romanization: 'ya', pronunciation: 'yâa', english: 'grandmother (paternal)', categoryId: 'family' },
  { id: 'fam-family', thai: 'ครอบครัว', romanization: 'khropkhrua', pronunciation: 'khróp khrua', english: 'family', categoryId: 'family' },

  // Food & Drink
  { id: 'food-rice', thai: 'ข้าว', romanization: 'khao', pronunciation: 'khâao', english: 'rice', categoryId: 'food' },
  { id: 'food-water', thai: 'น้ำ', romanization: 'nam', pronunciation: 'náam', english: 'water', categoryId: 'food' },
  { id: 'food-food', thai: 'อาหาร', romanization: 'ahan', pronunciation: 'aa hǎan', english: 'food', categoryId: 'food' },
  { id: 'food-fruit', thai: 'ผลไม้', romanization: 'phonlamai', pronunciation: 'phǒn lá mái', english: 'fruit', categoryId: 'food' },
  { id: 'food-chicken', thai: 'ไก่', romanization: 'kai', pronunciation: 'kài', english: 'chicken', categoryId: 'food' },
  { id: 'food-pork', thai: 'หมู', romanization: 'mu', pronunciation: 'mǔu', english: 'pork', categoryId: 'food' },
  { id: 'food-fish', thai: 'ปลา', romanization: 'pla', pronunciation: 'plaa', english: 'fish', categoryId: 'food' },
  { id: 'food-coffee', thai: 'กาแฟ', romanization: 'kafae', pronunciation: 'kaa fae', english: 'coffee', categoryId: 'food' },
  { id: 'food-tea', thai: 'ชา', romanization: 'cha', pronunciation: 'chaa', english: 'tea', categoryId: 'food' },
  { id: 'food-spicy', thai: 'เผ็ด', romanization: 'phet', pronunciation: 'phèt', english: 'spicy', categoryId: 'food' },

  // Colors
  { id: 'color-red', thai: 'สีแดง', romanization: 'si daeng', pronunciation: 'sǐi daeng', english: 'red', categoryId: 'colors' },
  { id: 'color-blue', thai: 'สีน้ำเงิน', romanization: 'si nam ngoen', pronunciation: 'sǐi náam ngoen', english: 'blue', categoryId: 'colors' },
  { id: 'color-green', thai: 'สีเขียว', romanization: 'si khiao', pronunciation: 'sǐi khǐao', english: 'green', categoryId: 'colors' },
  { id: 'color-yellow', thai: 'สีเหลือง', romanization: 'si lueang', pronunciation: 'sǐi lǔeang', english: 'yellow', categoryId: 'colors' },
  { id: 'color-black', thai: 'สีดำ', romanization: 'si dam', pronunciation: 'sǐi dam', english: 'black', categoryId: 'colors' },
  { id: 'color-white', thai: 'สีขาว', romanization: 'si khao', pronunciation: 'sǐi khǎao', english: 'white', categoryId: 'colors' },
  { id: 'color-orange', thai: 'สีส้ม', romanization: 'si som', pronunciation: 'sǐi sôm', english: 'orange', categoryId: 'colors' },
  { id: 'color-pink', thai: 'สีชมพู', romanization: 'si chomphu', pronunciation: 'sǐi chom phuu', english: 'pink', categoryId: 'colors' },

  // Time & Days
  { id: 'time-today', thai: 'วันนี้', romanization: 'wan ni', pronunciation: 'wan níi', english: 'today', categoryId: 'time' },
  { id: 'time-tomorrow', thai: 'พรุ่งนี้', romanization: 'phrung ni', pronunciation: 'phrûng níi', english: 'tomorrow', categoryId: 'time' },
  { id: 'time-yesterday', thai: 'เมื่อวาน', romanization: 'muea wan', pronunciation: 'mûea waan', english: 'yesterday', categoryId: 'time' },
  { id: 'time-monday', thai: 'วันจันทร์', romanization: 'wan jan', pronunciation: 'wan jan', english: 'Monday', categoryId: 'time' },
  { id: 'time-tuesday', thai: 'วันอังคาร', romanization: 'wan angkhan', pronunciation: 'wan ang khaan', english: 'Tuesday', categoryId: 'time' },
  { id: 'time-friday', thai: 'วันศุกร์', romanization: 'wan suk', pronunciation: 'wan sùk', english: 'Friday', categoryId: 'time' },
  { id: 'time-morning', thai: 'เช้า', romanization: 'chao', pronunciation: 'cháo', english: 'morning', categoryId: 'time' },
  { id: 'time-evening', thai: 'เย็น', romanization: 'yen', pronunciation: 'yen', english: 'evening', categoryId: 'time' },
  { id: 'time-now', thai: 'ตอนนี้', romanization: 'ton ni', pronunciation: 'ton níi', english: 'now', categoryId: 'time' },
  { id: 'time-week', thai: 'สัปดาห์', romanization: 'sapda', pronunciation: 'sàp daa', english: 'week', categoryId: 'time' },

  // Common Verbs
  { id: 'verb-eat', thai: 'กิน', romanization: 'kin', pronunciation: 'kin', english: 'eat', categoryId: 'verbs' },
  { id: 'verb-drink', thai: 'ดื่ม', romanization: 'duem', pronunciation: 'dùem', english: 'drink', categoryId: 'verbs' },
  { id: 'verb-go', thai: 'ไป', romanization: 'pai', pronunciation: 'pai', english: 'go', categoryId: 'verbs' },
  { id: 'verb-come', thai: 'มา', romanization: 'ma', pronunciation: 'maa', english: 'come', categoryId: 'verbs' },
  { id: 'verb-sleep', thai: 'นอน', romanization: 'non', pronunciation: 'non', english: 'sleep', categoryId: 'verbs' },
  { id: 'verb-work', thai: 'ทำงาน', romanization: 'tham ngan', pronunciation: 'tham ngaan', english: 'work', categoryId: 'verbs' },
  { id: 'verb-speak', thai: 'พูด', romanization: 'phut', pronunciation: 'phûut', english: 'speak', categoryId: 'verbs' },
  { id: 'verb-watch', thai: 'ดู', romanization: 'du', pronunciation: 'duu', english: 'watch / look', categoryId: 'verbs' },
  { id: 'verb-love', thai: 'รัก', romanization: 'rak', pronunciation: 'rák', english: 'love', categoryId: 'verbs' },
  { id: 'verb-understand', thai: 'เข้าใจ', romanization: 'khaojai', pronunciation: 'khâo jai', english: 'understand', categoryId: 'verbs' },

  // Places
  { id: 'place-house', thai: 'บ้าน', romanization: 'ban', pronunciation: 'bâan', english: 'house / home', categoryId: 'places' },
  { id: 'place-school', thai: 'โรงเรียน', romanization: 'rong rian', pronunciation: 'roong rian', english: 'school', categoryId: 'places' },
  { id: 'place-market', thai: 'ตลาด', romanization: 'talat', pronunciation: 'talàat', english: 'market', categoryId: 'places' },
  { id: 'place-hospital', thai: 'โรงพยาบาล', romanization: 'rong phayaban', pronunciation: 'roong phá yaa baan', english: 'hospital', categoryId: 'places' },
  { id: 'place-restaurant', thai: 'ร้านอาหาร', romanization: 'ran ahan', pronunciation: 'ráan aa hǎan', english: 'restaurant', categoryId: 'places' },
  { id: 'place-airport', thai: 'สนามบิน', romanization: 'sanam bin', pronunciation: 'sà nǎam bin', english: 'airport', categoryId: 'places' },
  { id: 'place-temple', thai: 'วัด', romanization: 'wat', pronunciation: 'wát', english: 'temple', categoryId: 'places' },
  { id: 'place-bathroom', thai: 'ห้องน้ำ', romanization: 'hong nam', pronunciation: 'hông náam', english: 'bathroom', categoryId: 'places' },

  // Animals
  { id: 'animal-dog', thai: 'หมา', romanization: 'ma', pronunciation: 'mǎa', english: 'dog', categoryId: 'animals' },
  { id: 'animal-cat', thai: 'แมว', romanization: 'maeo', pronunciation: 'maeo', english: 'cat', categoryId: 'animals' },
  { id: 'animal-elephant', thai: 'ช้าง', romanization: 'chang', pronunciation: 'cháang', english: 'elephant', categoryId: 'animals' },
  { id: 'animal-bird', thai: 'นก', romanization: 'nok', pronunciation: 'nók', english: 'bird', categoryId: 'animals' },
  { id: 'animal-snake', thai: 'งู', romanization: 'ngu', pronunciation: 'nguu', english: 'snake', categoryId: 'animals' },
  { id: 'animal-tiger', thai: 'เสือ', romanization: 'suea', pronunciation: 'sǔea', english: 'tiger', categoryId: 'animals' },
  { id: 'animal-cow', thai: 'วัว', romanization: 'wua', pronunciation: 'wua', english: 'cow', categoryId: 'animals' },
  { id: 'animal-monkey', thai: 'ลิง', romanization: 'ling', pronunciation: 'ling', english: 'monkey', categoryId: 'animals' },

  // Adjectives
  { id: 'adj-big', thai: 'ใหญ่', romanization: 'yai', pronunciation: 'yài', english: 'big', categoryId: 'adjectives' },
  { id: 'adj-small', thai: 'เล็ก', romanization: 'lek', pronunciation: 'lék', english: 'small', categoryId: 'adjectives' },
  { id: 'adj-beautiful', thai: 'สวย', romanization: 'suay', pronunciation: 'sǔay', english: 'beautiful', categoryId: 'adjectives' },
  { id: 'adj-hot', thai: 'ร้อน', romanization: 'ron', pronunciation: 'rón', english: 'hot', categoryId: 'adjectives' },
  { id: 'adj-cold', thai: 'หนาว', romanization: 'nao', pronunciation: 'nǎao', english: 'cold', categoryId: 'adjectives' },
  { id: 'adj-good', thai: 'ดี', romanization: 'dee', pronunciation: 'dee', english: 'good', categoryId: 'adjectives' },
  { id: 'adj-fast', thai: 'เร็ว', romanization: 'reo', pronunciation: 'reo', english: 'fast', categoryId: 'adjectives' },
  { id: 'adj-slow', thai: 'ช้า', romanization: 'cha', pronunciation: 'cháa', english: 'slow', categoryId: 'adjectives' },

  // Pronouns & People
  { id: 'pron-i-f', thai: 'ฉัน', romanization: 'chan', pronunciation: 'chǎn', english: 'I / me (informal)', categoryId: 'pronouns' },
  { id: 'pron-i-m', thai: 'ผม', romanization: 'phom', pronunciation: 'phǒm', english: 'I / me (male speaker)', categoryId: 'pronouns' },
  { id: 'pron-you', thai: 'คุณ', romanization: 'khun', pronunciation: 'khun', english: 'you (polite)', categoryId: 'pronouns' },
  { id: 'pron-he-she', thai: 'เขา', romanization: 'khao', pronunciation: 'khǎo', english: 'he / she', categoryId: 'pronouns' },
  { id: 'pron-we', thai: 'เรา', romanization: 'rao', pronunciation: 'rao', english: 'we', categoryId: 'pronouns' },
  { id: 'pron-they', thai: 'พวกเขา', romanization: 'phuak khao', pronunciation: 'phúak khǎo', english: 'they', categoryId: 'pronouns' },
  { id: 'pron-friend', thai: 'เพื่อน', romanization: 'phuean', pronunciation: 'phûean', english: 'friend', categoryId: 'pronouns' },
  { id: 'pron-person', thai: 'คน', romanization: 'khon', pronunciation: 'khon', english: 'person', categoryId: 'pronouns' },
];
