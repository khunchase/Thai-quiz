import type { Word } from '../types/word';

// Static, stable ids — do not rename existing ids, spaced-repetition
// progress is keyed by word id in localStorage.
export const STARTER_WORDS: Word[] = [
  // Greetings & Basics
  { id: 'greet-hello', thai: 'สวัสดี', romanization: 'sawatdee', english: 'hello', categoryId: 'greetings' },
  { id: 'greet-thanks', thai: 'ขอบคุณ', romanization: 'khop khun', english: 'thank you', categoryId: 'greetings' },
  { id: 'greet-sorry', thai: 'ขอโทษ', romanization: 'khor thot', english: 'sorry / excuse me', categoryId: 'greetings' },
  { id: 'greet-yes', thai: 'ใช่', romanization: 'chai', english: 'yes', categoryId: 'greetings' },
  { id: 'greet-no', thai: 'ไม่', romanization: 'mai', english: 'no', categoryId: 'greetings' },
  { id: 'greet-noworries', thai: 'ไม่เป็นไร', romanization: 'mai pen rai', english: "it's okay / no worries", categoryId: 'greetings' },
  { id: 'greet-howareyou', thai: 'สบายดีไหม', romanization: 'sabai dee mai', english: 'how are you?', categoryId: 'greetings' },
  { id: 'greet-bye', thai: 'ลาก่อน', romanization: 'la kon', english: 'goodbye', categoryId: 'greetings' },
  { id: 'greet-nicemeet', thai: 'ยินดีที่ได้รู้จัก', romanization: 'yindee thi dai ruchak', english: 'nice to meet you', categoryId: 'greetings' },
  { id: 'greet-please', thai: 'กรุณา', romanization: 'karuna', english: 'please', categoryId: 'greetings' },

  // Numbers
  { id: 'num-1', thai: 'หนึ่ง', romanization: 'neung', english: 'one', categoryId: 'numbers' },
  { id: 'num-2', thai: 'สอง', romanization: 'song', english: 'two', categoryId: 'numbers' },
  { id: 'num-3', thai: 'สาม', romanization: 'sam', english: 'three', categoryId: 'numbers' },
  { id: 'num-4', thai: 'สี่', romanization: 'si', english: 'four', categoryId: 'numbers' },
  { id: 'num-5', thai: 'ห้า', romanization: 'ha', english: 'five', categoryId: 'numbers' },
  { id: 'num-6', thai: 'หก', romanization: 'hok', english: 'six', categoryId: 'numbers' },
  { id: 'num-7', thai: 'เจ็ด', romanization: 'jet', english: 'seven', categoryId: 'numbers' },
  { id: 'num-8', thai: 'แปด', romanization: 'paet', english: 'eight', categoryId: 'numbers' },
  { id: 'num-9', thai: 'เก้า', romanization: 'kao', english: 'nine', categoryId: 'numbers' },
  { id: 'num-10', thai: 'สิบ', romanization: 'sip', english: 'ten', categoryId: 'numbers' },

  // Family
  { id: 'fam-mother', thai: 'แม่', romanization: 'mae', english: 'mother', categoryId: 'family' },
  { id: 'fam-father', thai: 'พ่อ', romanization: 'phor', english: 'father', categoryId: 'family' },
  { id: 'fam-olderbro', thai: 'พี่ชาย', romanization: 'phi chai', english: 'older brother', categoryId: 'family' },
  { id: 'fam-youngersis', thai: 'น้องสาว', romanization: 'nong sao', english: 'younger sister', categoryId: 'family' },
  { id: 'fam-child', thai: 'ลูก', romanization: 'luk', english: 'child (offspring)', categoryId: 'family' },
  { id: 'fam-husband', thai: 'สามี', romanization: 'sami', english: 'husband', categoryId: 'family' },
  { id: 'fam-wife', thai: 'ภรรยา', romanization: 'phanraya', english: 'wife', categoryId: 'family' },
  { id: 'fam-grandpa', thai: 'ปู่', romanization: 'pu', english: 'grandfather (paternal)', categoryId: 'family' },
  { id: 'fam-grandma', thai: 'ย่า', romanization: 'ya', english: 'grandmother (paternal)', categoryId: 'family' },
  { id: 'fam-family', thai: 'ครอบครัว', romanization: 'khropkhrua', english: 'family', categoryId: 'family' },

  // Food & Drink
  { id: 'food-rice', thai: 'ข้าว', romanization: 'khao', english: 'rice', categoryId: 'food' },
  { id: 'food-water', thai: 'น้ำ', romanization: 'nam', english: 'water', categoryId: 'food' },
  { id: 'food-food', thai: 'อาหาร', romanization: 'ahan', english: 'food', categoryId: 'food' },
  { id: 'food-fruit', thai: 'ผลไม้', romanization: 'phonlamai', english: 'fruit', categoryId: 'food' },
  { id: 'food-chicken', thai: 'ไก่', romanization: 'kai', english: 'chicken', categoryId: 'food' },
  { id: 'food-pork', thai: 'หมู', romanization: 'mu', english: 'pork', categoryId: 'food' },
  { id: 'food-fish', thai: 'ปลา', romanization: 'pla', english: 'fish', categoryId: 'food' },
  { id: 'food-coffee', thai: 'กาแฟ', romanization: 'kafae', english: 'coffee', categoryId: 'food' },
  { id: 'food-tea', thai: 'ชา', romanization: 'cha', english: 'tea', categoryId: 'food' },
  { id: 'food-spicy', thai: 'เผ็ด', romanization: 'phet', english: 'spicy', categoryId: 'food' },

  // Colors
  { id: 'color-red', thai: 'สีแดง', romanization: 'si daeng', english: 'red', categoryId: 'colors' },
  { id: 'color-blue', thai: 'สีน้ำเงิน', romanization: 'si nam ngoen', english: 'blue', categoryId: 'colors' },
  { id: 'color-green', thai: 'สีเขียว', romanization: 'si khiao', english: 'green', categoryId: 'colors' },
  { id: 'color-yellow', thai: 'สีเหลือง', romanization: 'si lueang', english: 'yellow', categoryId: 'colors' },
  { id: 'color-black', thai: 'สีดำ', romanization: 'si dam', english: 'black', categoryId: 'colors' },
  { id: 'color-white', thai: 'สีขาว', romanization: 'si khao', english: 'white', categoryId: 'colors' },
  { id: 'color-orange', thai: 'สีส้ม', romanization: 'si som', english: 'orange', categoryId: 'colors' },
  { id: 'color-pink', thai: 'สีชมพู', romanization: 'si chomphu', english: 'pink', categoryId: 'colors' },

  // Time & Days
  { id: 'time-today', thai: 'วันนี้', romanization: 'wan ni', english: 'today', categoryId: 'time' },
  { id: 'time-tomorrow', thai: 'พรุ่งนี้', romanization: 'phrung ni', english: 'tomorrow', categoryId: 'time' },
  { id: 'time-yesterday', thai: 'เมื่อวาน', romanization: 'muea wan', english: 'yesterday', categoryId: 'time' },
  { id: 'time-monday', thai: 'วันจันทร์', romanization: 'wan jan', english: 'Monday', categoryId: 'time' },
  { id: 'time-tuesday', thai: 'วันอังคาร', romanization: 'wan angkhan', english: 'Tuesday', categoryId: 'time' },
  { id: 'time-friday', thai: 'วันศุกร์', romanization: 'wan suk', english: 'Friday', categoryId: 'time' },
  { id: 'time-morning', thai: 'เช้า', romanization: 'chao', english: 'morning', categoryId: 'time' },
  { id: 'time-evening', thai: 'เย็น', romanization: 'yen', english: 'evening', categoryId: 'time' },
  { id: 'time-now', thai: 'ตอนนี้', romanization: 'ton ni', english: 'now', categoryId: 'time' },
  { id: 'time-week', thai: 'สัปดาห์', romanization: 'sapda', english: 'week', categoryId: 'time' },

  // Common Verbs
  { id: 'verb-eat', thai: 'กิน', romanization: 'kin', english: 'eat', categoryId: 'verbs' },
  { id: 'verb-drink', thai: 'ดื่ม', romanization: 'duem', english: 'drink', categoryId: 'verbs' },
  { id: 'verb-go', thai: 'ไป', romanization: 'pai', english: 'go', categoryId: 'verbs' },
  { id: 'verb-come', thai: 'มา', romanization: 'ma', english: 'come', categoryId: 'verbs' },
  { id: 'verb-sleep', thai: 'นอน', romanization: 'non', english: 'sleep', categoryId: 'verbs' },
  { id: 'verb-work', thai: 'ทำงาน', romanization: 'tham ngan', english: 'work', categoryId: 'verbs' },
  { id: 'verb-speak', thai: 'พูด', romanization: 'phut', english: 'speak', categoryId: 'verbs' },
  { id: 'verb-watch', thai: 'ดู', romanization: 'du', english: 'watch / look', categoryId: 'verbs' },
  { id: 'verb-love', thai: 'รัก', romanization: 'rak', english: 'love', categoryId: 'verbs' },
  { id: 'verb-understand', thai: 'เข้าใจ', romanization: 'khaojai', english: 'understand', categoryId: 'verbs' },

  // Places
  { id: 'place-house', thai: 'บ้าน', romanization: 'ban', english: 'house / home', categoryId: 'places' },
  { id: 'place-school', thai: 'โรงเรียน', romanization: 'rong rian', english: 'school', categoryId: 'places' },
  { id: 'place-market', thai: 'ตลาด', romanization: 'talat', english: 'market', categoryId: 'places' },
  { id: 'place-hospital', thai: 'โรงพยาบาล', romanization: 'rong phayaban', english: 'hospital', categoryId: 'places' },
  { id: 'place-restaurant', thai: 'ร้านอาหาร', romanization: 'ran ahan', english: 'restaurant', categoryId: 'places' },
  { id: 'place-airport', thai: 'สนามบิน', romanization: 'sanam bin', english: 'airport', categoryId: 'places' },
  { id: 'place-temple', thai: 'วัด', romanization: 'wat', english: 'temple', categoryId: 'places' },
  { id: 'place-bathroom', thai: 'ห้องน้ำ', romanization: 'hong nam', english: 'bathroom', categoryId: 'places' },

  // Animals
  { id: 'animal-dog', thai: 'หมา', romanization: 'ma', english: 'dog', categoryId: 'animals' },
  { id: 'animal-cat', thai: 'แมว', romanization: 'maeo', english: 'cat', categoryId: 'animals' },
  { id: 'animal-elephant', thai: 'ช้าง', romanization: 'chang', english: 'elephant', categoryId: 'animals' },
  { id: 'animal-bird', thai: 'นก', romanization: 'nok', english: 'bird', categoryId: 'animals' },
  { id: 'animal-snake', thai: 'งู', romanization: 'ngu', english: 'snake', categoryId: 'animals' },
  { id: 'animal-tiger', thai: 'เสือ', romanization: 'suea', english: 'tiger', categoryId: 'animals' },
  { id: 'animal-cow', thai: 'วัว', romanization: 'wua', english: 'cow', categoryId: 'animals' },
  { id: 'animal-monkey', thai: 'ลิง', romanization: 'ling', english: 'monkey', categoryId: 'animals' },

  // Adjectives
  { id: 'adj-big', thai: 'ใหญ่', romanization: 'yai', english: 'big', categoryId: 'adjectives' },
  { id: 'adj-small', thai: 'เล็ก', romanization: 'lek', english: 'small', categoryId: 'adjectives' },
  { id: 'adj-beautiful', thai: 'สวย', romanization: 'suay', english: 'beautiful', categoryId: 'adjectives' },
  { id: 'adj-hot', thai: 'ร้อน', romanization: 'ron', english: 'hot', categoryId: 'adjectives' },
  { id: 'adj-cold', thai: 'หนาว', romanization: 'nao', english: 'cold', categoryId: 'adjectives' },
  { id: 'adj-good', thai: 'ดี', romanization: 'dee', english: 'good', categoryId: 'adjectives' },
  { id: 'adj-fast', thai: 'เร็ว', romanization: 'reo', english: 'fast', categoryId: 'adjectives' },
  { id: 'adj-slow', thai: 'ช้า', romanization: 'cha', english: 'slow', categoryId: 'adjectives' },

  // Pronouns & People
  { id: 'pron-i-f', thai: 'ฉัน', romanization: 'chan', english: 'I / me (informal)', categoryId: 'pronouns' },
  { id: 'pron-i-m', thai: 'ผม', romanization: 'phom', english: 'I / me (male speaker)', categoryId: 'pronouns' },
  { id: 'pron-you', thai: 'คุณ', romanization: 'khun', english: 'you (polite)', categoryId: 'pronouns' },
  { id: 'pron-he-she', thai: 'เขา', romanization: 'khao', english: 'he / she', categoryId: 'pronouns' },
  { id: 'pron-we', thai: 'เรา', romanization: 'rao', english: 'we', categoryId: 'pronouns' },
  { id: 'pron-they', thai: 'พวกเขา', romanization: 'phuak khao', english: 'they', categoryId: 'pronouns' },
  { id: 'pron-friend', thai: 'เพื่อน', romanization: 'phuean', english: 'friend', categoryId: 'pronouns' },
  { id: 'pron-person', thai: 'คน', romanization: 'khon', english: 'person', categoryId: 'pronouns' },
];
