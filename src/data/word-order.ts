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

// More sentences in a shorter form: [wordId, blocks separated by spaces, English, ...other right orders].
const MORE: [string, string, string, ...string[]][] = [
  // Greetings & people
  ['greet-hello', 'สวัสดี ครับ ผม ชื่อ ต้น', 'Hello, my name is Ton.'],
  ['greet-yes', 'ใช่ ฉัน เป็น คน ไทย', "Yes, I'm Thai."],
  ['greet-no', 'ฉัน ไม่ ชอบ อาหาร เผ็ด', "I don't like spicy food."],
  ['greet-bye', 'ลาก่อน แล้ว เจอ กัน ใหม่', 'Goodbye, see you again.'],
  ['greet-please', 'กรุณา รอ สักครู่ ค่ะ', 'Please wait a moment.'],
  ['pron-you', 'คุณ ชื่อ อะไร ครับ', "What's your name?"],
  ['pron-they', 'พวกเขา มา จาก ญี่ปุ่น', 'They come from Japan.'],
  ['pron-he-she', 'เขา กำลัง นอน อยู่', 'He is sleeping.'],
  ['fam-olderbro', 'พี่ชาย ของ ฉัน ทำงาน ที่ ธนาคาร', 'My older brother works at a bank.'],
  ['fam-child', 'ลูก ของ เขา อายุ ห้า ขวบ', 'Her child is five years old.'],
  ['fam-husband', 'สามี ของ ฉัน ทำ อาหาร เก่ง', 'My husband is a good cook.'],
  ['fam-wife', 'ภรรยา ของ ผม เป็น ครู', 'My wife is a teacher.'],
  ['fam-grandma', 'ย่า ชอบ ปลูก ดอกไม้', 'Grandma loves growing flowers.'],
  ['fam-partner', 'แฟน ของ ฉัน เป็น คน ไทย', 'My partner is Thai.'],
  ['fam-kid', 'เด็ก คน นั้น ร้องไห้ ทำไม', 'Why is that kid crying?'],
  ['family-younger-brother', 'น้องชาย ของ ฉัน เรียน ที่ มหาวิทยาลัย', 'My younger brother studies at university.'],
  ['family-older-sister', 'พี่สาว ฉัน อยู่ ที่ กรุงเทพฯ', 'My older sister lives in Bangkok.'],

  // Numbers
  ['num-1', 'ขอ ข้าวผัด หนึ่ง จาน', 'One plate of fried rice, please.', 'ขอ ข้าวผัด จาน หนึ่ง'],
  ['num-4', 'บ้าน นี้ มี สี่ ห้อง', 'This house has four rooms.'],
  ['num-7', 'หนึ่ง สัปดาห์ มี เจ็ด วัน', 'A week has seven days.'],
  ['numbers-hundred', 'อัน นี้ ราคา หนึ่ง ร้อย บาท', 'This one costs 100 baht.'],
  ['time-year', 'ฉัน เรียน ภาษาไทย มา สอง ปี แล้ว', "I've been studying Thai for two years."],
  ['time-hour', 'ไป เชียงใหม่ ใช้ เวลา หนึ่ง ชั่วโมง', 'Getting to Chiang Mai takes one hour.'],

  // Food
  ['food-pork', 'ผม ไม่ กิน หมู', "I don't eat pork."],
  ['food-fish', 'ปลา ตัว นี้ ราคา เท่าไหร่', 'How much is this fish?'],
  ['food-tea', 'คุณ อยาก ดื่ม ชา หรือ กาแฟ', 'Do you want tea or coffee?', 'คุณ อยาก ดื่ม กาแฟ หรือ ชา'],
  ['food-egg', 'ขอ ไข่ดาว หนึ่ง ฟอง', 'One fried egg, please.', 'ขอ ไข่ดาว ฟอง หนึ่ง'],
  ['food-milk', 'ลูก ดื่ม นม ทุก เช้า', 'My kid drinks milk every morning.', 'ทุก เช้า ลูก ดื่ม นม'],
  ['food-shrimp', 'ฉัน แพ้ กุ้ง ค่ะ', "I'm allergic to shrimp."],
  ['food-hungry', 'ฉัน หิว มาก แล้ว', "I'm really hungry now."],
  ['food-full', 'ฉัน อิ่ม แล้ว ขอบคุณ', "I'm full, thank you.", 'ขอบคุณ ฉัน อิ่ม แล้ว'],
  ['food-sweet', 'ขอ ไม่ หวาน นะ คะ', 'Not sweet, please.'],
  ['food-to-order', 'คุณ จะ สั่ง อะไร', 'What will you order?'],
  ['food-vegetable', 'ฉัน ไม่ กิน ผัก', "I don't eat vegetables."],
  ['adj-good', 'อาหาร ร้าน นี้ ดี มาก', 'The food at this restaurant is very good.'],
  ['household-glass', 'ขอ น้ำ อีก หนึ่ง แก้ว', 'One more glass of water, please.', 'ขอ น้ำ อีก แก้ว หนึ่ง'],
  ['household-spoon', 'คน ไทย กิน ข้าว ด้วย ช้อน', 'Thai people eat rice with a spoon.'],
  ['maimuan-chai-use', 'คุณ ใช้ ตะเกียบ เป็น ไหม', 'Can you use chopsticks?'],

  // Colors & clothes
  ['color-green', 'ฉัน ชอบ สีเขียว ที่สุด', 'I like green the most.'],
  ['color-black', 'แมว สีดำ ตัว นั้น น่ารัก มาก', 'That black cat is very cute.'],
  ['color-yellow', 'เขา ใส่ เสื้อ สีเหลือง', "He's wearing a yellow shirt."],
  ['clothing-shoes', 'รองเท้า คู่ นี้ ใหญ่ เกินไป', 'These shoes are too big.'],
  ['clothing-hat', 'อย่า ลืม ใส่ หมวก นะ', "Don't forget to wear a hat."],
  ['clothing-glasses', 'ฉัน หา แว่นตา ไม่ เจอ', "I can't find my glasses."],
  ['clothing-umbrella', 'เอา ร่ม ไป ด้วย นะ', 'Take an umbrella with you.'],
  ['clothing-to-take-off', 'กรุณา ถอด รองเท้า ตรงนี้', 'Please take your shoes off here.'],
  ['clothing-clothes', 'เสื้อผ้า ร้าน นี้ ถูก มาก', 'The clothes at this shop are very cheap.'],
  ['shopping-on-sale', 'เสื้อ ตัว นี้ ลดราคา ไหม', 'Is this shirt on sale?'],

  // Time
  ['time-monday', 'วันจันทร์ ฉัน ต้อง ไป ทำงาน', 'On Monday I have to go to work.', 'ฉัน ต้อง ไป ทำงาน วันจันทร์'],
  ['time-friday', 'วันศุกร์ นี้ เรา จะ ไป ดู หนัง', "This Friday we're going to see a movie.", 'เรา จะ ไป ดู หนัง วันศุกร์ นี้'],
  ['time-evening', 'ตอน เย็น ฉัน ไป วิ่ง', 'In the evening I go running.', 'ฉัน ไป วิ่ง ตอน เย็น'],
  ['time-sunday', 'วันอาทิตย์ ร้าน นี้ ปิด', 'This shop is closed on Sundays.', 'ร้าน นี้ ปิด วันอาทิตย์'],
  ['time-month', 'เดือน หน้า ฉัน จะ ไป ญี่ปุ่น', "Next month I'm going to Japan.", 'ฉัน จะ ไป ญี่ปุ่น เดือน หน้า'],
  ['time-oclock', 'เจอ กัน ตอน เก้า โมง', 'See you at nine.'],
  ['time-often', 'ฉัน ไป ตลาด บ่อย มาก', 'I go to the market very often.'],
  ['time-ever', 'คุณ เคย ไป ภูเก็ต ไหม', 'Have you ever been to Phuket?'],
  ['work-busy', 'วันนี้ ฉัน ยุ่ง มาก', "I'm very busy today.", 'ฉัน ยุ่ง มาก วันนี้'],
  ['work-day-off', 'พรุ่งนี้ เป็น วันหยุด', 'Tomorrow is a day off.'],
  ['work-finish-work', 'คุณ เลิกงาน กี่ โมง', 'What time do you finish work?'],
  ['work-meeting', 'บ่าย นี้ ผม มี ประชุม', 'I have a meeting this afternoon.', 'ผม มี ประชุม บ่าย นี้'],

  // Verbs
  ['verb-drink', 'อย่า ดื่ม น้ำ จาก ก๊อก', "Don't drink the tap water."],
  ['verb-come', 'พรุ่งนี้ เพื่อน ฉัน จะ มา หา', 'Tomorrow my friend is coming to visit.', 'เพื่อน ฉัน จะ มา หา พรุ่งนี้'],
  ['verb-want', 'ฉัน อยาก ไป เที่ยว ญี่ปุ่น', 'I want to travel to Japan.'],
  ['verb-wait', 'รอ ฉัน ที่ หน้า ร้าน นะ', 'Wait for me in front of the shop.'],
  ['verb-forget', 'ฉัน ลืม ชื่อ เขา แล้ว', "I've forgotten his name."],
  ['verb-help', 'ช่วย ฉัน หน่อย ได้ไหม', 'Can you help me?'],
  ['verb-tell', 'อย่า บอก ใคร นะ', "Don't tell anyone."],
  ['verb-wake-up', 'พรุ่งนี้ ฉัน ต้อง ตื่น ตี ห้า', 'Tomorrow I have to get up at 5 a.m.', 'ฉัน ต้อง ตื่น ตี ห้า พรุ่งนี้'],
  ['verb-borrow', 'ขอ ยืม ปากกา หน่อย', 'Can I borrow a pen?'],
  ['verb-massage', 'เรา ไป นวด กัน ไหม', 'Shall we go get a massage?'],
  ['verbs-sell', 'ร้าน นี้ ขาย อะไร', 'What does this shop sell?'],
  ['verbs-play', 'เด็กๆ เล่น อยู่ ใน สวน', 'The kids are playing in the garden.'],
  ['maimuan-hai', 'แม่ ให้ เงิน ฉัน', 'Mom gave me money.'],
  ['shopping-gift', 'ฉัน ซื้อ ของขวัญ ให้ แม่', 'I bought a gift for my mom.'],

  // Places & directions
  ['place-house', 'บ้าน ของ ฉัน อยู่ ใกล้ ทะเล', 'My house is near the sea.'],
  ['place-hospital', 'ฉัน ต้อง ไป โรงพยาบาล ตอนนี้', 'I have to go to the hospital now.', 'ตอนนี้ ฉัน ต้อง ไป โรงพยาบาล'],
  ['place-temple', 'วัด นี้ สวย มาก', 'This temple is very beautiful.'],
  ['place-room', 'ห้อง ของ คุณ อยู่ ชั้น สาม', 'Your room is on the third floor.'],
  ['place-mall', 'เรา ไป เดิน ห้าง กัน', "Let's go to the mall."],
  ['places-bank', 'ธนาคาร เปิด กี่ โมง', 'What time does the bank open?'],
  ['places-road', 'ถนน เส้น นี้ รถ ติด มาก', 'Traffic is bad on this road.'],
  ['dir-right', 'เลี้ยว ขวา ที่ ซอย หน้า', 'Turn right at the next soi.'],
  ['dir-straight', 'ตรง ไป อีก สอง ร้อย เมตร', 'Go straight another 200 meters.'],
  ['dir-far', 'สนามบิน ไกล จาก ที่นี่ ไหม', 'Is the airport far from here?'],
  ['dir-on', 'กุญแจ อยู่ บน โต๊ะ', 'The keys are on the table.'],
  ['dir-under', 'แมว นอน อยู่ ใต้ เตียง', 'The cat is sleeping under the bed.'],
  ['dir-in', 'โทรศัพท์ อยู่ ใน กระเป๋า', 'The phone is in the bag.'],
  ['dir-here', 'ที่นี่ มี ไวไฟ ไหม', 'Is there wifi here?'],

  // Question words & connectors
  ['dir-what', 'คุณ กำลัง ทำ อะไร อยู่', 'What are you doing?'],
  ['dir-when', 'คุณ จะ กลับ บ้าน เมื่อไหร่', 'When are you going home?'],
  ['dir-which', 'คุณ ชอบ อัน ไหน', 'Which one do you like?'],
  ['dir-how-many', 'คุณ มี พี่น้อง กี่ คน', 'How many siblings do you have?'],
  ['dir-most', 'อัน ไหน อร่อย ที่สุด', 'Which one is the most delicious?'],
  ['dir-but', 'ฉัน อยาก ไป แต่ ไม่ มี เวลา', "I want to go, but I don't have time."],
  ['dir-because', 'ฉัน ไม่ ไป เพราะ ฝน ตก', "I'm not going because it's raining."],
  ['dir-from', 'ผม มา จาก อังกฤษ', "I'm from England."],
  ['dir-if', 'ถ้า ฝน ตก เรา จะ อยู่ บ้าน', "If it rains, we'll stay home."],
  ['dir-before', 'ล้าง มือ ก่อน กิน ข้าว', 'Wash your hands before eating.'],
  ['dir-again', 'พูด อีก ที ได้ไหม', 'Can you say that again?'],
  ['dir-like', 'ลูก หน้า เหมือน พ่อ', 'The child looks like the dad.'],
  ['dir-together', 'เรา ไป ด้วยกัน ไหม', 'Shall we go together?'],
  ['dir-alone', 'เขา ชอบ เที่ยว คนเดียว', 'He likes to travel alone.'],

  // Animals & nature
  ['animal-bird', 'นก บิน อยู่ บน ท้องฟ้า', 'A bird is flying in the sky.'],
  ['animal-snake', 'ระวัง มี งู อยู่ ใน สวน', "Careful, there's a snake in the garden."],
  ['animal-tiger', 'เสือ เป็น สัตว์ ที่ อันตราย', 'Tigers are dangerous animals.'],
  ['animal-monkey', 'ลิง ชอบ กิน กล้วย', 'Monkeys like to eat bananas.'],
  ['animals-mosquito', 'ที่นี่ ยุง เยอะ มาก', 'There are lots of mosquitoes here.'],
  ['weather-rain', 'ฝน ตก ทุก วัน เลย', 'It rains every single day.'],
  ['weather-wind', 'วันนี้ ลม แรง มาก', 'The wind is very strong today.', 'ลม แรง มาก วันนี้'],
  ['weather-mountain', 'เรา จะ ไป เดิน ขึ้น ภูเขา', "We're going to hike up a mountain."],
  ['weather-flower', 'ดอกไม้ ใน สวน สวย มาก', 'The flowers in the garden are beautiful.'],
  ['weather-moon', 'คืนนี้ ดวงจันทร์ สวย มาก', 'The moon is beautiful tonight.', 'ดวงจันทร์ สวย มาก คืนนี้'],
  ['adj-cold', 'เดือน นี้ อากาศ หนาว มาก', 'The weather is very cold this month.', 'อากาศ เดือน นี้ หนาว มาก'],
  ['adj-hot', 'ระวัง กาแฟ ยัง ร้อน อยู่', 'Careful, the coffee is still hot.'],

  // Feelings
  ['emotions-glad', 'ดีใจ ที่ ได้ เจอ คุณ', "I'm glad to see you."],
  ['emotions-sad', 'ทำไม คุณ ดู เศร้า', 'Why do you look sad?'],
  ['emotions-angry', 'อย่า โกรธ ฉัน นะ', "Don't be angry at me."],
  ['emotions-scared', 'ฉัน กลัว งู มาก', "I'm very scared of snakes."],
  ['emotions-bored', 'ฉัน เบื่อ งาน นี้ แล้ว', "I'm tired of this job."],
  ['emotions-sleepy', 'ฉัน ง่วง นอน มาก', "I'm very sleepy."],
  ['emotions-fun', 'เที่ยว ทะเล สนุก มาก', 'The beach trip was a lot of fun.'],

  // Describing
  ['adjectives-cheap', 'ที่ ตลาด ของ ถูก กว่า', 'Things are cheaper at the market.'],
  ['adjectives-new', 'ฉัน ซื้อ โทรศัพท์ เครื่อง ใหม่', 'I bought a new phone.'],
  ['adjectives-old', 'รถ คัน นี้ เก่า มาก', 'This car is very old.'],
  ['adj-difficult', 'ภาษาไทย ไม่ ยาก อย่าง ที่ คิด', "Thai isn't as hard as you think."],
  ['adj-easy', 'ข้อสอบ วันนี้ ง่าย มาก', "Today's exam was very easy."],
  ['adj-tall', 'พี่ชาย ฉัน สูง กว่า ฉัน', 'My older brother is taller than me.'],
  ['adj-enough', 'ฉัน นอน ไม่ พอ', "I didn't get enough sleep."],
  ['adj-broken', 'แอร์ ใน ห้อง เสีย', 'The air conditioner in the room is broken.'],

  // Health
  ['health-fever', 'ลูก มี ไข้ ตั้งแต่ เมื่อวาน', 'My child has had a fever since yesterday.'],
  ['health-medicine', 'กิน ยา หลัง อาหาร', 'Take the medicine after meals.'],
  ['health-doctor', 'คุณ ควร ไป หา หมอ', 'You should go see a doctor.'],
  ['health-pharmacy', 'ร้านขายยา อยู่ ที่ไหน ครับ', 'Where is the pharmacy?'],
  ['health-stomachache', 'ฉัน ปวดท้อง ตั้งแต่ เช้า', "I've had a stomachache since this morning."],
  ['health-rest', 'คุณ ต้อง พักผ่อน เยอะๆ', 'You need to get lots of rest.'],

  // Home
  ['household-table', 'วาง จาน ไว้ บน โต๊ะ', 'Put the plates on the table.'],
  ['household-bed', 'เตียง นี้ นุ่ม มาก', 'This bed is very soft.'],
  ['household-fridge', 'นม อยู่ ใน ตู้เย็น', 'The milk is in the fridge.'],
  ['household-fan', 'ช่วย เปิด พัดลม หน่อย', 'Please turn on the fan.'],
  ['household-kitchen', 'แม่ ทำ อาหาร อยู่ ใน ห้องครัว', 'Mom is cooking in the kitchen.'],
  ['household-door', 'ช่วย ปิด ประตู ด้วย', 'Please close the door.'],
  ['household-wash-dishes', 'ใคร จะ ล้างจาน คืนนี้', "Who's washing the dishes tonight?", 'คืนนี้ ใคร จะ ล้างจาน'],
  ['household-phone', 'ฉัน ลืม โทรศัพท์ ไว้ ที่ บ้าน', 'I left my phone at home.'],
  ['household-key', 'ฉัน หา กุญแจ ไม่ เจอ', "I can't find the key."],
  ['clothing-to-wash', 'ฉัน ซัก ผ้า ทุก วันอาทิตย์', 'I do the laundry every Sunday.', 'ทุก วันอาทิตย์ ฉัน ซัก ผ้า'],

  // School
  ['school-book', 'หนังสือ เล่ม นี้ น่าสนใจ มาก', 'This book is very interesting.'],
  ['school-teacher', 'ครู ของ ฉัน ใจดี มาก', 'My teacher is very kind.'],
  ['school-student', 'นักเรียน ทุก คน ต้อง ใส่ ชุด นักเรียน', 'All students have to wear a uniform.'],
  ['school-homework', 'ฉัน ยัง ทำ การบ้าน ไม่ เสร็จ', "I haven't finished my homework yet."],
  ['school-to-read', 'ฉัน อ่าน ภาษาไทย ได้ นิดหน่อย', 'I can read a little Thai.'],
  ['school-to-write', 'ช่วย เขียน ชื่อ ของ คุณ ตรงนี้', 'Please write your name here.'],
  ['school-to-ask', 'ขอ ถาม อะไร หน่อย ได้ไหม', 'Can I ask you something?'],
  ['school-to-teach', 'แม่ ของ ฉัน สอน ภาษาอังกฤษ', 'My mother teaches English.'],
  ['school-library', 'ห้องสมุด ปิด กี่ โมง', 'What time does the library close?'],

  // Shopping & tech
  ['shopping-money', 'ฉัน ลืม เอา เงิน มา', 'I forgot to bring money.'],
  ['shopping-cash', 'ที่นี่ รับ เงินสด เท่านั้น', 'They only take cash here.'],
  ['shopping-to-pay', 'จ่ายเงิน ด้วย บัตรเครดิต ได้ไหม', 'Can I pay by credit card?'],
  ['tech-to-call', 'เดี๋ยว ฉัน โทร กลับ นะ', "I'll call you back."],
  ['tech-take-photo', 'ช่วย ถ่ายรูป ให้ หน่อย ได้ไหม', 'Could you take a photo for me?'],
  ['tech-to-charge', 'ฉัน ต้อง ชาร์จ โทรศัพท์', 'I need to charge my phone.'],
  ['tech-send-message', 'ส่ง ข้อความ มา หา ฉัน นะ', 'Send me a message.'],
  ['tech-to-turn-off', 'ช่วย ปิด ไฟ ด้วย', 'Please turn off the light.'],

  // Getting around
  ['transport-bus', 'รถเมล์ สาย นี้ ไป สยาม ไหม', 'Does this bus go to Siam?'],
  ['transport-skytrain', 'ไป รถไฟฟ้า เร็ว กว่า', 'Taking the skytrain is faster.'],
  ['transport-taxi', 'เรียก แท็กซี่ ให้ หน่อย ได้ไหม', 'Could you call me a taxi?'],
  ['transport-to-drive', 'คุณ ขับรถ เป็น ไหม', 'Can you drive?'],
  ['transport-traffic-jam', 'ตอน เย็น รถ ติด มาก', 'Traffic is bad in the evening.', 'รถ ติด มาก ตอน เย็น'],
  ['transport-get-off', 'ผม จะ ลง ป้าย หน้า', "I'll get off at the next stop."],
  ['transport-ticket', 'ขอ ตั๋ว ไป เชียงใหม่ สอง ใบ', 'Two tickets to Chiang Mai, please.'],
  ['transport-airplane', 'เครื่องบิน ออก กี่ โมง', 'What time does the plane leave?'],
  ['transport-hotel', 'โรงแรม นี้ มี สระว่ายน้ำ', 'This hotel has a swimming pool.'],
  ['transport-boat', 'เรา นั่ง เรือ ไป เกาะ', 'We took a boat to the island.'],
];

const split = (blocks: string) => blocks.split(' ');
for (const [wordId, blocks, english, ...alsoOk] of MORE) {
  SENTENCES.push({ wordId, chunks: split(blocks), english, ...(alsoOk.length ? { alsoOk: alsoOk.map(split) } : {}) });
}

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
