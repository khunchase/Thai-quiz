// Word-order sentences: a Thai sentence cut into word blocks that the Order
// quiz shuffles for you to put back together. Thai is written without spaces,
// so the blocks are split by hand here rather than by code.
//
// Each sentence practises one starter word (`wordId`) and is graded through
// that word's spaced-repetition progress. `alsoOk` lists other orders that are
// just as natural (time words can usually go first or last), so they're marked
// right too.

export interface OrderSentence {
  wordId: string;
  /** The blocks in the right order. */
  chunks: string[];
  english: string;
  /** Other orders of the same blocks that are also correct. */
  alsoOk?: string[][];
}

const SENTENCES: OrderSentence[] = [
  // Greetings
  { wordId: 'greet-thanks', chunks: ['ขอบคุณ', 'มาก', 'นะ', 'ครับ'], english: 'Thank you very much.' },
  { wordId: 'greet-sorry', chunks: ['ขอโทษ', 'ที่', 'มา', 'สาย'], english: 'Sorry for being late.' },
  { wordId: 'greet-howareyou', chunks: ['ช่วงนี้', 'คุณ', 'สบายดี', 'ไหม'], english: 'Have you been well lately?' },
  { wordId: 'greet-nicemeet', chunks: ['ยินดี', 'ที่', 'ได้', 'รู้จัก', 'ครับ'], english: 'Nice to meet you.' },

  // Numbers and classifiers
  { wordId: 'num-2', chunks: ['ฉัน', 'มี', 'หมา', 'สอง', 'ตัว'], english: 'I have two dogs.' },
  { wordId: 'num-3', chunks: ['ขอ', 'กาแฟ', 'สาม', 'แก้ว', 'ค่ะ'], english: 'Three cups of coffee, please.' },
  { wordId: 'num-5', chunks: ['เขา', 'มี', 'ลูก', 'ห้า', 'คน'], english: 'She has five children.' },
  { wordId: 'num-10', chunks: ['ฉัน', 'รอ', 'คุณ', 'สิบ', 'นาที'], english: 'I waited for you for ten minutes.' },

  // Family
  { wordId: 'fam-mother', chunks: ['แม่', 'ของ', 'ฉัน', 'ทำ', 'อาหาร', 'อร่อย'], english: 'My mother cooks delicious food.' },
  {
    wordId: 'fam-father',
    chunks: ['พ่อ', 'ไป', 'ทำงาน', 'ทุก', 'วัน'],
    english: 'Dad goes to work every day.',
    alsoOk: [['ทุก', 'วัน', 'พ่อ', 'ไป', 'ทำงาน']],
  },
  { wordId: 'fam-youngersis', chunks: ['น้องสาว', 'ของ', 'ฉัน', 'ชอบ', 'แมว'], english: 'My younger sister likes cats.' },
  { wordId: 'fam-family', chunks: ['ครอบครัว', 'ของ', 'ฉัน', 'อยู่', 'ที่', 'เชียงใหม่'], english: 'My family lives in Chiang Mai.' },

  // Food
  { wordId: 'food-rice', chunks: ['คุณ', 'กิน', 'ข้าว', 'หรือ', 'ยัง'], english: 'Have you eaten yet?' },
  {
    wordId: 'food-water',
    chunks: ['ขอ', 'น้ำ', 'เย็น', 'หนึ่ง', 'แก้ว'],
    english: 'A glass of cold water, please.',
    alsoOk: [['ขอ', 'น้ำ', 'เย็น', 'แก้ว', 'หนึ่ง']],
  },
  {
    wordId: 'food-coffee',
    chunks: ['ฉัน', 'ดื่ม', 'กาแฟ', 'ทุก', 'เช้า'],
    english: 'I drink coffee every morning.',
    alsoOk: [['ทุก', 'เช้า', 'ฉัน', 'ดื่ม', 'กาแฟ']],
  },
  { wordId: 'food-spicy', chunks: ['อาหาร', 'ไทย', 'เผ็ด', 'มาก'], english: 'Thai food is very spicy.' },
  { wordId: 'food-chicken', chunks: ['ฉัน', 'อยาก', 'กิน', 'ไก่', 'ทอด'], english: 'I want to eat fried chicken.' },
  { wordId: 'food-fruit', chunks: ['ตลาด', 'นี้', 'มี', 'ผลไม้', 'เยอะ'], english: 'This market has lots of fruit.' },

  // Colors
  { wordId: 'color-red', chunks: ['ฉัน', 'ชอบ', 'เสื้อ', 'สีแดง', 'ตัว', 'นี้'], english: 'I like this red shirt.' },
  { wordId: 'color-white', chunks: ['รถ', 'ของ', 'เขา', 'สีขาว'], english: 'His car is white.' },

  // Time
  {
    wordId: 'time-today',
    chunks: ['วันนี้', 'อากาศ', 'ร้อน', 'มาก'],
    english: 'The weather is very hot today.',
    alsoOk: [['อากาศ', 'วันนี้', 'ร้อน', 'มาก']],
  },
  {
    wordId: 'time-tomorrow',
    chunks: ['พรุ่งนี้', 'ฉัน', 'จะ', 'ไป', 'ทะเล'],
    english: "Tomorrow I'm going to the beach.",
    alsoOk: [['ฉัน', 'จะ', 'ไป', 'ทะเล', 'พรุ่งนี้']],
  },
  {
    wordId: 'time-yesterday',
    chunks: ['เมื่อวาน', 'ฝน', 'ตก', 'หนัก'],
    english: 'It rained heavily yesterday.',
    alsoOk: [['ฝน', 'ตก', 'หนัก', 'เมื่อวาน']],
  },
  { wordId: 'time-now', chunks: ['ตอนนี้', 'กี่', 'โมง', 'แล้ว'], english: 'What time is it now?' },
  { wordId: 'time-morning', chunks: ['ฉัน', 'ตื่น', 'ตอน', 'หก', 'โมง', 'เช้า'], english: 'I wake up at six in the morning.' },

  // Verbs
  { wordId: 'verb-eat', chunks: ['คุณ', 'ชอบ', 'กิน', 'อะไร'], english: 'What do you like to eat?' },
  { wordId: 'verb-go', chunks: ['คุณ', 'จะ', 'ไป', 'ไหน'], english: 'Where are you going?' },
  {
    wordId: 'verb-sleep',
    chunks: ['เมื่อคืน', 'ฉัน', 'นอน', 'ไม่', 'หลับ'],
    english: "I couldn't sleep last night.",
    alsoOk: [['ฉัน', 'นอน', 'ไม่', 'หลับ', 'เมื่อคืน']],
  },
  { wordId: 'verb-speak', chunks: ['เขา', 'พูด', 'ภาษาอังกฤษ', 'เก่ง'], english: 'He speaks English well.' },
  { wordId: 'verb-understand', chunks: ['ขอโทษ', 'ฉัน', 'ไม่', 'เข้าใจ'], english: "Sorry, I don't understand." },
  { wordId: 'verb-work', chunks: ['เขา', 'ทำงาน', 'ที่', 'โรงพยาบาล'], english: 'She works at a hospital.' },
  { wordId: 'verb-watch', chunks: ['เรา', 'ไป', 'ดู', 'หนัง', 'กัน', 'ไหม'], english: 'Shall we go see a movie?' },
  { wordId: 'verb-love', chunks: ['ฉัน', 'รัก', 'ครอบครัว', 'ของ', 'ฉัน'], english: 'I love my family.' },
  { wordId: 'verbs-buy', chunks: ['ฉัน', 'อยาก', 'ซื้อ', 'เสื้อ', 'ตัว', 'นี้'], english: 'I want to buy this shirt.' },

  // Places
  { wordId: 'place-market', chunks: ['ตลาด', 'อยู่', 'ใกล้', 'บ้าน', 'ฉัน'], english: 'The market is near my house.' },
  { wordId: 'place-bathroom', chunks: ['ห้องน้ำ', 'อยู่', 'ที่ไหน', 'ครับ'], english: 'Where is the bathroom?' },
  {
    wordId: 'place-airport',
    chunks: ['ฉัน', 'จะ', 'ไป', 'สนามบิน', 'พรุ่งนี้', 'เช้า'],
    english: "I'm going to the airport tomorrow morning.",
    alsoOk: [['พรุ่งนี้', 'เช้า', 'ฉัน', 'จะ', 'ไป', 'สนามบิน']],
  },
  { wordId: 'place-school', chunks: ['โรงเรียน', 'ของ', 'เรา', 'ใหญ่', 'มาก'], english: 'Our school is very big.' },
  { wordId: 'place-restaurant', chunks: ['ร้านอาหาร', 'นี้', 'อร่อย', 'มาก'], english: 'This restaurant is really good.' },

  // Animals
  { wordId: 'animal-dog', chunks: ['หมา', 'ตัว', 'นั้น', 'ใหญ่', 'มาก'], english: 'That dog is very big.' },
  { wordId: 'animal-cat', chunks: ['แมว', 'ของ', 'ฉัน', 'ชอบ', 'นอน'], english: 'My cat likes to sleep.' },
  { wordId: 'animal-elephant', chunks: ['ช้าง', 'ใหญ่', 'กว่า', 'ม้า'], english: 'An elephant is bigger than a horse.' },

  // Adjectives
  { wordId: 'adj-big', chunks: ['บ้าน', 'หลัง', 'นี้', 'ใหญ่', 'มาก'], english: 'This house is very big.' },
  { wordId: 'adj-small', chunks: ['ห้อง', 'ของ', 'ฉัน', 'เล็ก', 'มาก'], english: 'My room is very small.' },
  { wordId: 'adj-beautiful', chunks: ['ทะเล', 'ที่', 'ภูเก็ต', 'สวย', 'มาก'], english: 'The sea in Phuket is very beautiful.' },
  { wordId: 'adj-fast', chunks: ['เขา', 'พูด', 'เร็ว', 'มาก'], english: 'He talks very fast.' },
  { wordId: 'adj-slow', chunks: ['ช่วย', 'พูด', 'ช้าๆ', 'หน่อย', 'ได้ไหม'], english: 'Could you speak a little slower?' },
  { wordId: 'adjectives-expensive', chunks: ['อัน', 'นี้', 'แพง', 'เกินไป'], english: 'This one is too expensive.' },

  // People
  { wordId: 'pron-we', chunks: ['เรา', 'ไป', 'กิน', 'ข้าว', 'กัน'], english: "Let's go eat." },
  { wordId: 'pron-friend', chunks: ['เพื่อน', 'ของ', 'ฉัน', 'เป็น', 'คน', 'ญี่ปุ่น'], english: 'My friend is Japanese.' },

  // Question words and little words
  { wordId: 'dir-where', chunks: ['บ้าน', 'คุณ', 'อยู่', 'ที่ไหน'], english: 'Where do you live?' },
  { wordId: 'dir-how-much', chunks: ['อัน', 'นี้', 'ราคา', 'เท่าไหร่'], english: 'How much is this one?' },
  { wordId: 'dir-why', chunks: ['ทำไม', 'คุณ', 'มา', 'สาย'], english: 'Why are you late?' },
  { wordId: 'dir-who', chunks: ['คน', 'นั้น', 'เป็น', 'ใคร'], english: 'Who is that person?' },
  { wordId: 'dir-already', chunks: ['ฉัน', 'กิน', 'ข้าว', 'แล้ว'], english: "I've already eaten." },
  { wordId: 'dir-still', chunks: ['เขา', 'ยัง', 'ไม่', 'มา'], english: "He still hasn't come." },
  {
    wordId: 'dir-must',
    chunks: ['พรุ่งนี้', 'ฉัน', 'ต้อง', 'ตื่น', 'เช้า'],
    english: 'I have to get up early tomorrow.',
    alsoOk: [['ฉัน', 'ต้อง', 'ตื่น', 'เช้า', 'พรุ่งนี้']],
  },
  { wordId: 'dir-can', chunks: ['ฉัน', 'พูด', 'ภาษาไทย', 'ได้', 'นิดหน่อย'], english: 'I can speak a little Thai.' },
  { wordId: 'dir-left', chunks: ['เลี้ยว', 'ซ้าย', 'ที่', 'ไฟแดง'], english: 'Turn left at the traffic light.' },
  { wordId: 'dir-near', chunks: ['โรงแรม', 'อยู่', 'ใกล้', 'ทะเล'], english: 'The hotel is near the sea.' },
  {
    wordId: 'dir-with',
    chunks: ['ฉัน', 'ไป', 'ตลาด', 'กับ', 'แม่'],
    english: 'I go to the market with my mom.',
    alsoOk: [['ฉัน', 'กับ', 'แม่', 'ไป', 'ตลาด']],
  },

  // Feelings and body
  {
    wordId: 'emotions-happy',
    chunks: ['วันนี้', 'ฉัน', 'มีความสุข', 'มาก'],
    english: "I'm very happy today.",
    alsoOk: [['ฉัน', 'มีความสุข', 'มาก', 'วันนี้']],
  },
  { wordId: 'emotions-miss', chunks: ['ฉัน', 'คิดถึง', 'คุณ', 'มาก'], english: 'I miss you a lot.' },
  { wordId: 'body-headache', chunks: ['ฉัน', 'ปวดหัว', 'มาก'], english: 'I have a bad headache.' },
];

/** Word-order sentences for each word id that has any. */
export const ORDER_SENTENCES: Record<string, OrderSentence[]> = SENTENCES.reduce<Record<string, OrderSentence[]>>(
  (acc, s) => {
    (acc[s.wordId] ??= []).push(s);
    return acc;
  },
  {}
);

/** Every order of the blocks that counts as right, the main one first. */
export function acceptedOrders(sentence: OrderSentence): string[][] {
  return [sentence.chunks, ...(sentence.alsoOk ?? [])];
}

/** Whether these blocks, in this order, make a correct sentence. Compares the text, so two identical blocks can swap. */
export function isCorrectOrder(sentence: OrderSentence, blocks: string[]): boolean {
  const built = blocks.join('');
  return acceptedOrders(sentence).some((order) => order.join('') === built);
}

/** The accepted order that best matches what was built, for marking each block right or wrong. */
export function closestOrder(sentence: OrderSentence, blocks: string[]): string[] {
  let best = sentence.chunks;
  let bestScore = -1;
  for (const order of acceptedOrders(sentence)) {
    const score = order.filter((chunk, i) => blocks[i] === chunk).length;
    if (score > bestScore) {
      best = order;
      bestScore = score;
    }
  }
  return best;
}
