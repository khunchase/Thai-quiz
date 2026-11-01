import type { ClozeSentence, Word } from '../types/word';

// Conjunctions & connectors (คำเชื่อม): the words that tie two clauses
// together. Each one comes with fill-in-the-blank sentences for the
// connectors quiz. Same id rules as starter-words.ts: never rename an id,
// spaced-repetition progress is keyed by it.

/** The relationship a connector expresses. Two connectors in the same group are never offered against each other. */
export type ConnectorGroup =
  | 'when'
  | 'before'
  | 'after'
  | 'while'
  | 'until'
  | 'since'
  | 'as-soon-as'
  | 'every-time'
  | 'if'
  | 'as-long-as'
  | 'unless'
  | 'in-case'
  | 'otherwise'
  | 'because'
  | 'so'
  | 'purpose'
  | 'but'
  | 'although'
  | 'whereas'
  | 'instead'
  | 'as-much-as'
  | 'as-if'
  | 'and'
  | 'or'
  | 'moreover'
  | 'no-matter';

export const CONNECTOR_GROUP_LABELS: Record<ConnectorGroup, string> = {
  when: 'Time · when',
  before: 'Time · before',
  after: 'Time · after',
  while: 'Time · at the same time',
  until: 'Time · up to a point',
  since: 'Time · starting from',
  'as-soon-as': 'Time · right after',
  'every-time': 'Time · every time',
  if: 'Condition · if',
  'as-long-as': 'Condition · as long as',
  unless: 'Condition · unless / except',
  'in-case': 'Condition · in case',
  otherwise: 'Condition · or else',
  because: 'Cause · the reason',
  so: 'Result · what follows',
  purpose: 'Purpose · in order to',
  but: 'Contrast · but',
  although: 'Contrast · despite this',
  whereas: 'Contrast · as for the other',
  instead: 'Alternative · instead',
  'as-much-as': 'Extent · as much / as far as',
  'as-if': 'Comparison · as if',
  and: 'Addition · and',
  or: 'Choice · or',
  moreover: 'Addition · on top of that',
  'no-matter': 'Concession · no matter',
};

interface Entry {
  word: Omit<Word, 'categoryId'>;
  group: ConnectorGroup;
  sentences: ClozeSentence[];
}

const ENTRIES: Entry[] = [
  // Time
  {
    word: { id: 'conj-when', thai: 'เมื่อ', romanization: 'mɯɯa', pronunciation: 'mɯ̂ɯa', english: 'when (general / formal)' },
    group: 'when',
    sentences: [
      { thai: '___ฉันเหนื่อย ฉันไปนอน', english: '[When] I am tired, I go to sleep.' },
      { thai: '___ฝนตก ฉันอยู่บ้าน', english: '[When] it rains, I stay home.' },
      { thai: '___ฉันป่วย ฉันไปโรงพยาบาล', english: '[When] I am sick, I go to the hospital.' },
    ],
  },
  {
    word: { id: 'conj-when-time', thai: 'ตอนที่', romanization: 'tɔɔn thii', pronunciation: 'tɔɔn thîi', english: 'when (at the time that)' },
    group: 'when',
    sentences: [
      { thai: '___ฉันมาถึง เขากินข้าวอยู่', english: '[When] I arrived, he was eating.' },
      { thai: '___ฉันอยู่โรงเรียน แม่โทรมา', english: '[When] I was at school, Mom called.' },
      { thai: '___เราไปทะเล ฝนตก', english: '[When] we went to the sea, it rained.' },
    ],
  },
  {
    word: { id: 'conj-before', thai: 'ก่อนที่', romanization: 'kɔɔn thii', pronunciation: 'kɔ̀ɔn thîi', english: 'before (+ clause)' },
    group: 'before',
    sentences: [
      { thai: 'ฉันดื่มกาแฟ___จะไปทำงาน', english: 'I drink coffee [before] I go to work.' },
      { thai: 'ฉันอ่านหนังสือ___จะนอน', english: 'I read [before] I go to sleep.' },
      { thai: 'ซื้อตั๋ว___จะขึ้นรถไฟ', english: 'Buy a ticket [before] you get on the train.' },
    ],
  },
  {
    word: { id: 'conj-after', thai: 'หลังจากที่', romanization: 'laŋ caak thii', pronunciation: 'lǎŋ càak thîi', english: 'after (+ clause)' },
    group: 'after',
    sentences: [
      { thai: '___กินข้าว ฉันดื่มกาแฟ', english: '[After] I eat, I drink coffee.' },
      { thai: '___เลิกงาน ฉันไปตลาด', english: '[After] I finish work, I go to the market.' },
      { thai: '___สอบ เราไปเที่ยวทะเล', english: '[After] the exam, we went on a trip to the sea.' },
    ],
  },
  {
    word: { id: 'conj-while', thai: 'ขณะที่', romanization: 'kha na thii', pronunciation: 'khà nà thîi', english: 'while (at the same moment)' },
    group: 'while',
    sentences: [
      { thai: 'อย่าโทร___ขับรถ', english: "Don't make calls [while] driving." },
      { thai: 'เขาฟังเพลง___ทำการบ้าน', english: 'He listens to music [while] doing homework.' },
      { thai: '___แม่ทำอาหาร พ่อดูโทรทัศน์', english: '[While] Mom cooks, Dad watches TV.' },
    ],
  },
  {
    word: { id: 'conj-while-during', thai: 'ระหว่างที่', romanization: 'ra waaŋ thii', pronunciation: 'rá wàaŋ thîi', english: 'while / during the time that' },
    group: 'while',
    sentences: [
      { thai: '___คุณไม่อยู่ เพื่อนโทรมา', english: '[While] you were out, a friend called.' },
      { thai: '___ฉันไปเที่ยว พี่สาวดูแมวให้', english: '[While] I travel, my older sister looks after the cat.' },
      { thai: '___นั่งรถเมล์ ฉันฟังเพลง', english: '[While] riding the bus, I listen to music.' },
    ],
  },
  {
    word: { id: 'conj-until', thai: 'จนกว่า', romanization: 'con kwaa', pronunciation: 'con kwàa', english: 'until (something has happened yet)' },
    group: 'until',
    sentences: [
      { thai: 'อยู่ที่นี่___ฉันจะมา', english: 'Stay here [until] I come.' },
      { thai: 'เขาจะไม่กิน___แม่จะมา', english: "He won't eat [until] Mom comes." },
      { thai: 'อย่าเล่นเกม___จะทำการบ้านเสร็จ', english: "Don't play games [until] you finish your homework." },
    ],
  },
  {
    word: { id: 'conj-until-past', thai: 'จนกระทั่ง', romanization: 'con kra thaŋ', pronunciation: 'con krà tháŋ', english: 'until (it reached the point that)' },
    group: 'until',
    sentences: [
      { thai: 'เขาวิ่ง___เหนื่อย', english: 'He ran [until] he was tired.' },
      { thai: 'ฉันกินขนม___ปวดท้อง', english: 'I ate snacks [until] I got a stomachache.' },
      { thai: 'เราเล่นเกม___เช้า', english: 'We played games [until] morning.' },
    ],
  },
  {
    word: { id: 'conj-since', thai: 'ตั้งแต่', romanization: 'taŋ tɛɛ', pronunciation: 'tâŋ tɛ̀ɛ', english: 'since (starting from)' },
    group: 'since',
    sentences: [
      { thai: 'เขาป่วย___เมื่อวาน', english: 'He has been sick [since] yesterday.' },
      { thai: 'ร้านเปิด___เช้า', english: 'The shop has been open [since] the morning.' },
      { thai: 'ฉันเรียนภาษาไทย___ปีที่แล้ว', english: "I've been studying Thai [since] last year." },
    ],
  },
  {
    word: { id: 'conj-as-soon-as', thai: 'ทันทีที่', romanization: 'than thii thii', pronunciation: 'than thii thîi', english: 'as soon as' },
    group: 'as-soon-as',
    sentences: [
      { thai: '___ถึงบ้าน ฉันจะโทรหาคุณ', english: "[As soon as] I get home, I'll call you." },
      { thai: '___ประตูเปิด หมาก็วิ่งออกไป', english: '[As soon as] the door opened, the dog ran out.' },
      { thai: '___เห็นแม่ ลูกก็ยิ้ม', english: 'The child smiled [as soon as] they saw Mom.' },
    ],
  },
  {
    word: { id: 'conj-once', thai: 'พอ', romanization: 'phɔɔ', pronunciation: 'phɔɔ', english: 'once / as soon as (casual)' },
    group: 'as-soon-as',
    sentences: [
      { thai: '___แดดออก เราก็ไปเล่นในสวน', english: '[Once] the sun came out, we went to play in the park.' },
      { thai: '___กินข้าวเสร็จ ฉันก็ง่วง', english: '[Once] I finished eating, I got sleepy.' },
      { thai: '___ถึงบ้าน ฉันก็นอนเลย', english: '[Once] I got home, I went straight to sleep.' },
    ],
  },
  {
    word: { id: 'conj-every-time', thai: 'ทุกครั้งที่', romanization: 'thuk khraŋ thii', pronunciation: 'thúk khráŋ thîi', english: 'every time / whenever' },
    group: 'every-time',
    sentences: [
      { thai: '___ไปทะเล ฉันกินกุ้ง', english: '[Every time] I go to the sea, I eat shrimp.' },
      { thai: 'เขายิ้ม___เห็นลูก', english: 'He smiles [every time] he sees his child.' },
      { thai: '___กินอาหารเผ็ด ฉันปวดท้อง', english: '[Every time] I eat spicy food, I get a stomachache.', alsoOk: ['conj-when',  'conj-when-time'] },
    ],
  },

  // Condition
  {
    word: { id: 'conj-if', thai: 'ถ้า', romanization: 'thaa', pronunciation: 'thâa', english: 'if' },
    group: 'if',
    sentences: [
      { thai: '___ฝนตก เราจะไม่ไปทะเล', english: "[If] it rains, we won't go to the sea." },
      { thai: '___มีเงิน ฉันจะซื้อรถใหม่', english: "[If] I have money, I'll buy a new car." },
      { thai: '___คุณเหนื่อย ไปนอนได้นะ', english: "[If] you're tired, you can go to sleep." },
    ],
  },
  {
    word: { id: 'conj-if-formal', thai: 'หาก', romanization: 'haak', pronunciation: 'hàak', english: 'if (formal)' },
    group: 'if',
    sentences: [
      { thai: '___มีคำถาม กรุณาถามครู', english: '[If] you have questions, please ask the teacher.' },
      { thai: '___ป่วย กรุณาไปโรงพยาบาล', english: "[If] you're sick, please go to the hospital." },
      { thai: '___รถติด เราจะนั่งรถไฟฟ้า', english: "[If] there's traffic, we'll take the skytrain." },
    ],
  },
  {
    word: { id: 'conj-as-long-as', thai: 'ตราบใดที่', romanization: 'traap dai thii', pronunciation: 'tràap dai thîi', english: 'as long as' },
    group: 'as-long-as',
    sentences: [
      { thai: '___ฝนไม่ตก เราจะเล่นในสวน', english: "[As long as] it doesn't rain, we'll play in the park." },
      { thai: 'คุณเล่นเกมได้ ___ทำการบ้านเสร็จแล้ว', english: 'You can play games [as long as] your homework is done.' },
      { thai: 'ฉันจะไปด้วย ___คุณขับรถช้า ๆ', english: "I'll come along [as long as] you drive slowly." },
    ],
  },
  {
    word: { id: 'conj-unless', thai: 'เว้นแต่', romanization: 'ween tɛɛ', pronunciation: 'wén tɛ̀ɛ', english: 'unless / except' },
    group: 'unless',
    sentences: [
      { thai: 'ฉันจะไป ___ฝนตก', english: "I'll go [unless] it rains." },
      { thai: 'ร้านเปิดทุกวัน ___วันจันทร์', english: 'The shop is open every day [except] Monday.' },
      { thai: 'เขาไม่ดื่มกาแฟ ___เหนื่อยมาก', english: "He doesn't drink coffee [unless] he's very tired." },
    ],
  },
  {
    word: { id: 'conj-in-case', thai: 'ในกรณีที่', romanization: 'nai kɔɔ ra nii thii', pronunciation: 'nai kɔɔ rá nii thîi', english: 'in case / in the event that' },
    group: 'in-case',
    sentences: [
      { thai: '___ไฟไหม้ ให้ใช้บันได', english: '[In case of] fire, use the stairs.' },
      { thai: '___ไม่มีเงินสด จ่ายด้วยบัตรเครดิตได้', english: "[In case] you don't have cash, you can pay by credit card." },
      { thai: '___ฉุกเฉิน โทรหาตำรวจ', english: '[In case of] an emergency, call the police.' },
    ],
  },
  {
    word: { id: 'conj-otherwise', thai: 'มิฉะนั้น', romanization: 'mi cha nan', pronunciation: 'mí chà nán', english: 'otherwise / or else' },
    group: 'otherwise',
    sentences: [
      { thai: 'ใส่เสื้อกันหนาว ___จะป่วย', english: "Wear a sweater, [otherwise] you'll get sick." },
      { thai: 'กินข้าวก่อน ___จะปวดท้อง', english: "Eat first, [otherwise] you'll get a stomachache." },
      { thai: 'จองตั๋วก่อน ___จะไม่มีตั๋ว', english: "Book first, [otherwise] there won't be any tickets." },
    ],
  },

  // Cause, result, purpose
  {
    word: { id: 'conj-because', thai: 'เพราะ', romanization: 'phrɔ', pronunciation: 'phrɔ́', english: 'because' },
    group: 'because',
    sentences: [
      { thai: 'วันนี้ฉันไม่ไปทำงาน ___ป่วย', english: "I'm not going to work today [because] I'm sick." },
      { thai: 'ถนนมีน้ำ ___ฝนตก', english: 'There is water on the road [because] it rained.' },
      { thai: 'ฉันไปนอน ___ง่วงมาก', english: "I'm going to bed [because] I'm very sleepy." },
    ],
  },
  {
    word: { id: 'conj-due-to', thai: 'เนื่องจาก', romanization: 'nɯɯaŋ caak', pronunciation: 'nɯ̂ɯaŋ càak', english: 'due to / since (formal)' },
    group: 'because',
    sentences: [
      { thai: '___ฝนตก เที่ยวบินจึงล่าช้า', english: '[Due to] the rain, the flight was delayed.' },
      { thai: 'ร้านปิด ___เป็นวันหยุด', english: 'The shop is closed [since] it is a holiday.' },
      { thai: '___รถติด เขาจึงมาช้า', english: '[Due to] the traffic, he arrived late.' },
    ],
  },
  {
    word: { id: 'conj-so', thai: 'ก็เลย', romanization: 'kɔɔ ləəy', pronunciation: 'kɔ̂ɔ ləəy', english: "so / that's why (casual)" },
    group: 'so',
    sentences: [
      { thai: 'ฉันไม่ได้กินข้าว ___ปวดท้อง', english: "I didn't eat, [so] I have a stomachache." },
      { thai: 'ฝนตก เรา___ไม่ได้ไปทะเล', english: "It rained, [so] we didn't go to the sea." },
      { thai: 'รถติดมาก ฉัน___ไปทำงานช้า', english: 'The traffic was bad, [so] I was late for work.' },
    ],
  },
  {
    word: { id: 'conj-therefore', thai: 'ดังนั้น', romanization: 'daŋ nan', pronunciation: 'daŋ nán', english: 'therefore (starts the clause)' },
    group: 'so',
    sentences: [
      { thai: 'เขาไม่อ่านหนังสือ ___เขาจึงสอบตก', english: "He didn't study; [therefore] he failed the exam." },
      { thai: 'พรุ่งนี้เป็นวันหยุด ___ธนาคารจะปิด', english: 'Tomorrow is a holiday; [therefore] the banks will be closed.' },
      { thai: 'ร้านนี้แพงมาก ___เราไม่ซื้อ', english: "This shop is very expensive; [therefore] we don't buy here." },
    ],
  },
  {
    word: { id: 'conj-thus', thai: 'จึง', romanization: 'cɯŋ', pronunciation: 'cɯŋ', english: 'so / thus (right before the verb)' },
    group: 'so',
    sentences: [
      { thai: 'เขาป่วย ___ไม่ไปโรงเรียน', english: "He is sick, [so] he isn't going to school." },
      { thai: 'ฉันเหนื่อยมาก ___ไปนอนเร็ว', english: 'I was very tired, [so] I went to bed early.' },
      { thai: 'อากาศหนาว ฉัน___ใส่เสื้อกันหนาว', english: "It's cold, [so] I'm wearing a sweater." },
    ],
  },
  {
    word: { id: 'conj-in-order-to', thai: 'เพื่อ', romanization: 'phɯɯa', pronunciation: 'phɯ̂ɯa', english: 'in order to / for' },
    group: 'purpose',
    sentences: [
      { thai: 'เราไปตลาด___ซื้อผลไม้', english: 'We went to the market [to] buy fruit.' },
      { thai: 'เขาทำงานทุกวัน___เก็บเงิน', english: 'He works every day [to] save money.' },
      { thai: 'ฉันไปธนาคาร___แลกเงิน', english: 'I went to the bank [to] exchange money.' },
    ],
  },
  {
    word: { id: 'conj-so-that', thai: 'เพื่อที่จะ', romanization: 'phɯɯa thii ca', pronunciation: 'phɯ̂ɯa thîi cà', english: 'so that / in order to' },
    group: 'purpose',
    sentences: [
      { thai: 'ฉันเรียนภาษาไทย___พูดกับเพื่อนได้', english: "I'm learning Thai [so that] I can talk with my friends." },
      { thai: 'เธอเก็บเงิน___ซื้อบ้าน', english: "She's saving money [in order to] buy a house." },
      { thai: 'เขาวิ่งทุกเช้า___แข็งแรง', english: 'He runs every morning [so that] he stays strong.' },
    ],
  },

  // Contrast
  {
    word: { id: 'conj-but', thai: 'แต่', romanization: 'tɛɛ', pronunciation: 'tɛ̀ɛ', english: 'but' },
    group: 'but',
    sentences: [
      { thai: 'ฉันออกจากบ้านเร็ว ___ก็ยังไปสาย', english: 'I left early, [but] I was still late.' },
      { thai: 'อาหารร้านนี้ดี ___แพงมาก', english: 'The food here is good, [but] very expensive.' },
      { thai: 'เขาพูดภาษาไทยได้ ___อ่านไม่ได้', english: "He can speak Thai, [but] he can't read it." },
    ],
  },
  {
    word: { id: 'conj-although', thai: 'แม้ว่า', romanization: 'mɛɛ waa', pronunciation: 'mɛ́ɛ wâa', english: 'although' },
    group: 'although',
    sentences: [
      { thai: '___ฝนจะตก เขาก็ยังไปวิ่ง', english: '[Although] it was raining, he still went running.' },
      { thai: '___จะเหนื่อย ฉันก็มีความสุข', english: "[Although] I'm tired, I'm happy." },
      { thai: 'เขามาทำงาน ___จะป่วย', english: 'He came to work [although] he was sick.' },
    ],
  },
  {
    word: { id: 'conj-even-though', thai: 'ถึงแม้ว่า', romanization: 'thɯŋ mɛɛ waa', pronunciation: 'thɯ̌ŋ mɛ́ɛ wâa', english: 'even though' },
    group: 'although',
    sentences: [
      { thai: '___จะกินข้าวแล้ว ฉันก็ยังอยากกินขนม', english: 'I still want a snack [even though] I already ate.' },
      { thai: '___เขาจะรวย เขาก็ไม่มีความสุข', english: "[Even though] he's rich, he isn't happy." },
      { thai: '___จะนอนมาก เขาก็ยังง่วง', english: "[Even though] he slept a lot, he's still sleepy." },
    ],
  },
  {
    word: { id: 'conj-despite', thai: 'ทั้งที่', romanization: 'thaŋ thii', pronunciation: 'tháŋ thîi', english: 'even though (despite the fact that)' },
    group: 'although',
    sentences: [
      { thai: 'เขาใส่เสื้อกันหนาว ___อากาศร้อนมาก', english: "He's wearing a sweater [even though] it's very hot." },
      { thai: 'เขาไม่อ่านหนังสือ ___พรุ่งนี้มีสอบ', english: "He isn't studying [even though] there's an exam tomorrow." },
      { thai: 'เธอกินขนม ___ปวดฟัน', english: 'She eats sweets [even though] she has a toothache.' },
    ],
  },
  {
    word: { id: 'conj-whereas', thai: 'ส่วน', romanization: 'suan', pronunciation: 'sùan', english: 'as for / whereas' },
    group: 'whereas',
    sentences: [
      { thai: 'พ่อชอบกาแฟ ___แม่ชอบชา', english: 'Dad likes coffee, [whereas] Mom likes tea.', alsoOk: ['conj-but'] },
      { thai: 'พี่ชายชอบหมา ___น้องสาวชอบแมว', english: 'My older brother likes dogs, [whereas] my younger sister likes cats.', alsoOk: ['conj-but'] },
      { thai: 'ฉันจะไปตลาด ___คุณอยู่บ้านนะ', english: "I'll go to the market; [as for] you, stay home." },
    ],
  },
  {
    word: { id: 'conj-instead', thai: 'แทนที่จะ', romanization: 'thɛɛn thii ca', pronunciation: 'thɛɛn thîi cà', english: 'instead of' },
    group: 'instead',
    sentences: [
      { thai: '___นั่งแท็กซี่ เรานั่งรถไฟฟ้า', english: '[Instead of] taking a taxi, we take the skytrain.' },
      { thai: 'เขาเล่นเกม ___ทำการบ้าน', english: 'He plays games [instead of] doing his homework.' },
      { thai: '___ดื่มกาแฟ ฉันดื่มน้ำ', english: '[Instead of] drinking coffee, I drink water.' },
    ],
  },

  // Extent & comparison
  {
    word: { id: 'conj-as-much-as', thai: 'เท่าที่', romanization: 'thau thii', pronunciation: 'thâu thîi', english: 'as much as / as far as' },
    group: 'as-much-as',
    sentences: [
      { thai: 'กิน___อยากกินเลย', english: 'Eat [as much as] you want.' },
      { thai: 'ฉันจะช่วย___ช่วยได้', english: "I'll help [as much as] I can." },
      { thai: '___ฉันรู้ เขายังไม่มา', english: "[As far as] I know, he hasn't come yet." },
    ],
  },
  {
    word: { id: 'conj-as-if', thai: 'ราวกับว่า', romanization: 'raaw kap waa', pronunciation: 'raaw kàp wâa', english: 'as if / as though' },
    group: 'as-if',
    sentences: [
      { thai: 'เขากินข้าว___ไม่ได้กินมาสามวัน', english: "He eats [as if] he hasn't eaten in three days." },
      { thai: 'ห้องนี้ร้อน___อยู่ในเตาอบ', english: "This room is hot, [as if] we're in an oven." },
      { thai: 'เขาวิ่ง___มีเสือมา', english: 'He runs [as if] a tiger were coming.' },
    ],
  },

  // Joining & choosing
  {
    word: { id: 'conj-and', thai: 'และ', romanization: 'lɛ', pronunciation: 'lɛ́', english: 'and' },
    group: 'and',
    sentences: [
      { thai: 'ฉันชอบไก่___หมู', english: 'I like chicken [and] pork.' },
      { thai: 'ห้องนี้ใหญ่___สะอาด', english: 'This room is big [and] clean.' },
      { thai: 'เขาเปิดประตู___เดินเข้ามา', english: 'He opened the door [and] walked in.' },
    ],
  },
  {
    word: { id: 'conj-or', thai: 'หรือ', romanization: 'rɯɯ', pronunciation: 'rɯ̌ɯ', english: 'or' },
    group: 'or',
    sentences: [
      { thai: 'คุณจะดื่มชา___กาแฟ', english: 'Would you like tea [or] coffee?' },
      { thai: 'เราจะไปวันเสาร์___วันอาทิตย์', english: 'Shall we go on Saturday [or] Sunday?' },
      { thai: 'จ่ายเงินสด___บัตรเครดิตก็ได้', english: 'You can pay by cash [or] credit card.' },
    ],
  },
  {
    word: { id: 'conj-moreover', thai: 'นอกจากนี้', romanization: 'nɔɔk caak nii', pronunciation: 'nɔ̂ɔk càak níi', english: 'besides / moreover' },
    group: 'moreover',
    sentences: [
      { thai: 'โรงแรมนี้ใกล้ทะเล ___ยังถูกด้วย', english: 'This hotel is near the sea. [Besides that], it is cheap too.' },
      { thai: 'บ้านนี้ใหญ่ ___ยังมีสวนด้วย', english: 'This house is big. [On top of that], it has a garden.' },
      { thai: 'เขาพูดภาษาอังกฤษได้ ___ยังพูดภาษาไทยได้ด้วย', english: 'He speaks English. [Moreover], he can speak Thai too.' },
    ],
  },
  {
    word: { id: 'conj-no-matter', thai: 'ไม่ว่า', romanization: 'mai waa', pronunciation: 'mâi wâa', english: 'no matter / whether' },
    group: 'no-matter',
    sentences: [
      { thai: '___ฝนจะตกหรือไม่ เราก็จะไป', english: "[No matter] whether it rains or not, we're going." },
      { thai: '___คุณไปที่ไหน โทรหาแม่นะ', english: '[No matter] where you go, call Mom.' },
      { thai: '___ราคาเท่าไหร่ ฉันก็จะซื้อ', english: "[No matter] how much it costs, I'll buy it." },
    ],
  },
];

export const CONJUNCTIONS_CATEGORY_ID = 'conjunctions';

export const CONJUNCTION_WORDS: Word[] = ENTRIES.map((e) => ({ ...e.word, categoryId: CONJUNCTIONS_CATEGORY_ID }));

export const CONNECTOR_INFO: Record<string, { group: ConnectorGroup; sentences: ClozeSentence[] }> = Object.fromEntries(
  ENTRIES.map((e) => [e.word.id, { group: e.group, sentences: e.sentences }])
);

/** Fills a sentence's blank with the answer. */
export function fillBlank(sentence: ClozeSentence, word: Pick<Word, 'thai'>): string {
  return sentence.thai.replace('___', word.thai);
}
