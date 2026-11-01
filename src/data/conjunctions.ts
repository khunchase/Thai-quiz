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
      { thai: '___ฉันยังเด็ก ฉันตัวเตี้ยมาก', english: '[When] I was young, I was very short.' },
      { thai: 'โทรหาฉันด้วยนะ ___ถึงบ้านแล้ว', english: 'Call me [when] you get home.' },
      { thai: '___ฝนตก ถนนจะลื่น', english: '[When] it rains, the roads get slippery.' },
    ],
  },
  {
    word: { id: 'conj-when-time', thai: 'ตอนที่', romanization: 'tɔɔn thii', pronunciation: 'tɔɔn thîi', english: 'when (at the time that)' },
    group: 'when',
    sentences: [
      { thai: '___ฉันมาถึง เขากำลังกินข้าวอยู่', english: '[When] I arrived, he was eating.' },
      { thai: '___อยู่มหาวิทยาลัย ฉันเล่นฟุตบอลทุกวัน', english: '[When] I was at university, I played football every day.' },
      { thai: 'ฉันเจอเขา___ไปเที่ยวเชียงใหม่', english: 'I met him [when] I went to Chiang Mai.' },
    ],
  },
  {
    word: { id: 'conj-before', thai: 'ก่อนที่', romanization: 'kɔɔn thii', pronunciation: 'kɔ̀ɔn thîi', english: 'before (+ clause)' },
    group: 'before',
    sentences: [
      { thai: 'ล้างมือ___จะกินข้าวนะ', english: 'Wash your hands [before] you eat.' },
      { thai: '___จะนอน ฉันชอบอ่านหนังสือ', english: '[Before] going to bed, I like to read.' },
      { thai: 'เราต้องไปถึงสถานี___รถไฟจะออก', english: 'We have to get to the station [before] the train leaves.' },
    ],
  },
  {
    word: { id: 'conj-after', thai: 'หลังจากที่', romanization: 'laŋ caak thii', pronunciation: 'lǎŋ càak thîi', english: 'after (+ clause)' },
    group: 'after',
    sentences: [
      { thai: '___กินข้าวเสร็จ เราไปเดินเล่นกัน', english: '[After] we finished eating, we went for a walk.' },
      { thai: 'เขาย้ายไปกรุงเทพฯ ___เรียนจบ', english: 'He moved to Bangkok [after] he graduated.' },
      { thai: '___ฝนหยุดตก ท้องฟ้าก็สดใส', english: '[After] the rain stopped, the sky was clear.' },
    ],
  },
  {
    word: { id: 'conj-while', thai: 'ขณะที่', romanization: 'kha na thii', pronunciation: 'khà nà thîi', english: 'while (at the same moment)' },
    group: 'while',
    sentences: [
      { thai: 'อย่าใช้โทรศัพท์___ขับรถ', english: "Don't use your phone [while] driving." },
      { thai: '___ฉันกำลังทำอาหาร ไฟก็ดับ', english: '[While] I was cooking, the power went out.' },
      { thai: 'เขาฟังเพลง___ทำการบ้าน', english: 'He listens to music [while] doing homework.' },
    ],
  },
  {
    word: { id: 'conj-while-during', thai: 'ระหว่างที่', romanization: 'ra waaŋ thii', pronunciation: 'rá wàaŋ thîi', english: 'while / during the time that' },
    group: 'while',
    sentences: [
      { thai: '___รอรถเมล์ ฉันอ่านข่าวในโทรศัพท์', english: '[While] waiting for the bus, I read the news on my phone.' },
      { thai: '___คุณไม่อยู่ มีคนมาหาคุณ', english: '[While] you were out, someone came to see you.' },
      { thai: 'ช่วยดูแลแมวให้หน่อย___ฉันไปต่างประเทศ', english: "Please look after my cat [while] I'm abroad." },
    ],
  },
  {
    word: { id: 'conj-until', thai: 'จนกว่า', romanization: 'con kwaa', pronunciation: 'con kwàa', english: 'until (something has happened yet)' },
    group: 'until',
    sentences: [
      { thai: 'รอที่นี่___ฉันจะกลับมา', english: 'Wait here [until] I come back.' },
      { thai: 'ห้ามออกไปเล่น___จะทำการบ้านเสร็จ', english: "You can't go out to play [until] you finish your homework." },
      { thai: 'เขาจะไม่หยุด___จะได้สิ่งที่ต้องการ', english: "He won't stop [until] he gets what he wants." },
    ],
  },
  {
    word: { id: 'conj-until-past', thai: 'จนกระทั่ง', romanization: 'con kra thaŋ', pronunciation: 'con krà tháŋ', english: 'until (it reached the point that)' },
    group: 'until',
    sentences: [
      { thai: 'เราคุยกัน___เที่ยงคืน', english: 'We talked [until] midnight.' },
      { thai: 'เขาทำงานหนักทุกวัน___ล้มป่วย', english: 'He worked hard every day [until] he fell ill.' },
      { thai: 'ฉันไม่รู้เรื่องนี้เลย___เพื่อนบอก', english: "I didn't know about this at all [until] my friend told me." },
    ],
  },
  {
    word: { id: 'conj-since', thai: 'ตั้งแต่', romanization: 'taŋ tɛɛ', pronunciation: 'tâŋ tɛ̀ɛ', english: 'since (starting from)' },
    group: 'since',
    sentences: [
      { thai: 'ฉันอยู่เมืองไทย___ปี 2020', english: "I've lived in Thailand [since] 2020." },
      { thai: '___เขาย้ายไป เราก็ไม่ค่อยได้เจอกัน', english: "[Since] he moved away, we've rarely seen each other." },
      { thai: 'เธอชอบวาดรูป___ยังเด็ก', english: 'She has loved drawing [since] she was little.' },
    ],
  },
  {
    word: { id: 'conj-as-soon-as', thai: 'ทันทีที่', romanization: 'than thii thii', pronunciation: 'than thii thîi', english: 'as soon as' },
    group: 'as-soon-as',
    sentences: [
      { thai: '___ถึงสนามบิน ฉันจะโทรหาคุณ', english: "[As soon as] I get to the airport, I'll call you." },
      { thai: 'เขาหลับ___หัวถึงหมอน', english: 'He fell asleep [as soon as] his head hit the pillow.' },
      { thai: '___ประตูเปิด ทุกคนก็วิ่งเข้าไป', english: '[As soon as] the door opened, everyone ran in.' },
    ],
  },
  {
    word: { id: 'conj-once', thai: 'พอ', romanization: 'phɔɔ', pronunciation: 'phɔɔ', english: 'once / as soon as (casual)' },
    group: 'as-soon-as',
    sentences: [
      { thai: '___ฝนหยุด เด็ก ๆ ก็ออกไปเล่น', english: '[Once] the rain stopped, the kids went out to play.' },
      { thai: '___เห็นหน้าแม่ เด็กก็หยุดร้องไห้', english: '[As soon as] he saw his mom, the child stopped crying.' },
      { thai: '___กลับถึงบ้าน ฉันก็อาบน้ำเลย', english: '[Once] I got home, I took a shower right away.' },
    ],
  },
  {
    word: { id: 'conj-every-time', thai: 'ทุกครั้งที่', romanization: 'thuk khraŋ thii', pronunciation: 'thúk khráŋ thîi', english: 'every time / whenever' },
    group: 'every-time',
    sentences: [
      { thai: '___ไปทะเล ฉันจะกินอาหารทะเล', english: '[Every time] I go to the beach, I eat seafood.' },
      { thai: 'เขายิ้ม___เห็นลูก', english: 'He smiles [every time] he sees his child.' },
      { thai: '___ฟังเพลงนี้ ฉันคิดถึงบ้าน', english: '[Every time] I hear this song, I miss home.', alsoOk: ['conj-when', 'conj-when-time'] },
    ],
  },

  // Condition
  {
    word: { id: 'conj-if', thai: 'ถ้า', romanization: 'thaa', pronunciation: 'thâa', english: 'if' },
    group: 'if',
    sentences: [
      { thai: '___พรุ่งนี้ฝนตก เราจะไม่ไปทะเล', english: "[If] it rains tomorrow, we won't go to the beach." },
      { thai: '___คุณหิว กินขนมนี้ก่อนได้นะ', english: "[If] you're hungry, you can eat this snack first." },
      { thai: 'ฉันจะซื้อบ้าน___มีเงินพอ', english: "I'll buy a house [if] I have enough money." },
    ],
  },
  {
    word: { id: 'conj-if-formal', thai: 'หาก', romanization: 'haak', pronunciation: 'hàak', english: 'if (formal)' },
    group: 'if',
    sentences: [
      { thai: '___มีข้อสงสัย กรุณาติดต่อเจ้าหน้าที่', english: '[If] you have any questions, please contact a staff member.' },
      { thai: '___ไม่ได้รับอีเมล กรุณาตรวจสอบโฟลเดอร์สแปม', english: "[If] you don't receive the email, please check your spam folder." },
      { thai: '___เกิดไฟไหม้ ให้ใช้บันไดหนีไฟ', english: "[If] there's a fire, use the fire escape." },
    ],
  },
  {
    word: { id: 'conj-as-long-as', thai: 'ตราบใดที่', romanization: 'traap dai thii', pronunciation: 'tràap dai thîi', english: 'as long as' },
    group: 'as-long-as',
    sentences: [
      { thai: '___เรายังมีกัน ทุกอย่างจะดีเอง', english: '[As long as] we have each other, everything will be fine.' },
      { thai: 'คุณยืมรถฉันได้ ___คุณขับระวัง', english: 'You can borrow my car [as long as] you drive carefully.' },
      { thai: '___ฝนไม่ตก เราจะเล่นฟุตบอลกันต่อ', english: "[As long as] it doesn't rain, we'll keep playing football." },
    ],
  },
  {
    word: { id: 'conj-unless', thai: 'เว้นแต่', romanization: 'ween tɛɛ', pronunciation: 'wén tɛ̀ɛ', english: 'unless / except' },
    group: 'unless',
    sentences: [
      { thai: 'ฉันจะไปงานเลี้ยง ___จะต้องทำงาน', english: "I'll go to the party [unless] I have to work." },
      { thai: 'ร้านเปิดทุกวัน ___วันหยุดนักขัตฤกษ์', english: 'The shop is open every day [except] public holidays.' },
      { thai: 'ห้ามเข้า ___ได้รับอนุญาต', english: 'No entry [unless] authorized.' },
    ],
  },
  {
    word: { id: 'conj-in-case', thai: 'ในกรณีที่', romanization: 'nai kɔɔ ra nii thii', pronunciation: 'nai kɔɔ rá nii thîi', english: 'in case / in the event that' },
    group: 'in-case',
    sentences: [
      { thai: '___เกิดเหตุฉุกเฉิน ให้โทร 191', english: '[In the event of] an emergency, call 191.' },
      { thai: '___เที่ยวบินล่าช้า สายการบินจะแจ้งให้ทราบ', english: '[In the event that] the flight is delayed, the airline will let you know.' },
      { thai: '___คุณลืมรหัสผ่าน ให้กด "ลืมรหัสผ่าน"', english: '[In case] you forget your password, tap "Forgot password".' },
    ],
  },
  {
    word: { id: 'conj-otherwise', thai: 'มิฉะนั้น', romanization: 'mi cha nan', pronunciation: 'mí chà nán', english: 'otherwise / or else' },
    group: 'otherwise',
    sentences: [
      { thai: 'รีบไปเถอะ ___จะตกรถ', english: "Hurry up, [otherwise] you'll miss the bus." },
      { thai: 'ต้องจองล่วงหน้า ___จะไม่มีที่นั่ง', english: "You need to book ahead, [otherwise] there won't be any seats." },
      { thai: 'ใส่เสื้อกันหนาวด้วย ___จะไม่สบาย', english: "Wear a jacket, [otherwise] you'll get sick." },
    ],
  },

  // Cause, result, purpose
  {
    word: { id: 'conj-because', thai: 'เพราะ', romanization: 'phrɔ', pronunciation: 'phrɔ́', english: 'because' },
    group: 'because',
    sentences: [
      { thai: 'วันนี้ฉันไม่ไปทำงาน ___ไม่สบาย', english: "I'm not going to work today [because] I'm sick." },
      { thai: 'เขาอ้วนขึ้น___กินขนมทุกวัน', english: "He's gained weight [because] he eats sweets every day." },
      { thai: 'ถนนเปียก___เมื่อคืนฝนตก', english: 'The road is wet [because] it rained last night.' },
    ],
  },
  {
    word: { id: 'conj-due-to', thai: 'เนื่องจาก', romanization: 'nɯɯaŋ caak', pronunciation: 'nɯ̂ɯaŋ càak', english: 'due to / since (formal)' },
    group: 'because',
    sentences: [
      { thai: '___ฝนตกหนัก เที่ยวบินจึงล่าช้า', english: '[Due to] heavy rain, the flight was delayed.' },
      { thai: 'ร้านปิดวันนี้ ___เป็นวันหยุด', english: "The shop is closed today [since] it's a holiday." },
      { thai: '___มีผู้สมัครจำนวนมาก การประกาศผลจึงล่าช้า', english: '[Because] there were so many applicants, the results were delayed.' },
    ],
  },
  {
    word: { id: 'conj-so', thai: 'ก็เลย', romanization: 'kɔɔ ləəy', pronunciation: 'kɔ̂ɔ ləəy', english: "so / that's why (casual)" },
    group: 'so',
    sentences: [
      { thai: 'ฉันหิวมาก ___กินข้าวสองจาน', english: 'I was very hungry, [so] I ate two plates of rice.' },
      { thai: 'ฝนตก เรา___ไม่ได้ไปเที่ยว', english: "It rained, [so] we didn't go out." },
      { thai: 'เขาตื่นสาย ___ไปทำงานไม่ทัน', english: "He woke up late, [so] he didn't make it to work on time." },
    ],
  },
  {
    word: { id: 'conj-therefore', thai: 'ดังนั้น', romanization: 'daŋ nan', pronunciation: 'daŋ nán', english: 'therefore (starts the clause)' },
    group: 'so',
    sentences: [
      { thai: 'ราคาน้ำมันสูงขึ้น ___ค่าโดยสารจึงแพงขึ้น', english: 'Fuel prices went up; [therefore] fares got more expensive.' },
      { thai: 'เขาไม่ได้อ่านหนังสือ ___เขาจึงสอบตก', english: "He didn't study; [therefore] he failed the exam." },
      { thai: 'พรุ่งนี้เป็นวันหยุด ___ธนาคารจะปิด', english: 'Tomorrow is a holiday; [therefore] the banks will be closed.' },
    ],
  },
  {
    word: { id: 'conj-thus', thai: 'จึง', romanization: 'cɯŋ', pronunciation: 'cɯŋ', english: 'so / thus (right before the verb)' },
    group: 'so',
    sentences: [
      { thai: 'เขาป่วย ___ไม่ได้มาโรงเรียน', english: "He was sick, [so] he didn't come to school." },
      { thai: 'ร้านนี้อร่อย คน___เยอะมาก', english: "This restaurant is delicious, [so] it's very crowded." },
      { thai: 'ฉันอยากพูดภาษาไทยได้ ___เริ่มเรียนทุกวัน', english: 'I want to be able to speak Thai, [so] I started studying every day.' },
    ],
  },
  {
    word: { id: 'conj-in-order-to', thai: 'เพื่อ', romanization: 'phɯɯa', pronunciation: 'phɯ̂ɯa', english: 'in order to / for' },
    group: 'purpose',
    sentences: [
      { thai: 'ฉันออกกำลังกาย___สุขภาพที่ดี', english: 'I exercise [for] good health.' },
      { thai: 'เขาทำงานหนัก___เก็บเงินซื้อบ้าน', english: 'He works hard [to] save money for a house.' },
      { thai: 'เราตื่นเช้า___ไปดูพระอาทิตย์ขึ้น', english: 'We got up early [in order to] watch the sunrise.' },
    ],
  },
  {
    word: { id: 'conj-so-that', thai: 'เพื่อที่จะ', romanization: 'phɯɯa thii ca', pronunciation: 'phɯ̂ɯa thîi cà', english: 'so that / in order to' },
    group: 'purpose',
    sentences: [
      { thai: 'ฉันเรียนภาษาไทย___คุยกับคนท้องถิ่นได้', english: "I'm learning Thai [so that] I can talk with locals." },
      { thai: 'เขาออกจากบ้านเร็ว___ไปถึงทันเวลา', english: "He left home early [so that] he'd arrive on time." },
      { thai: 'เธอเก็บเงิน___ไปเที่ยวญี่ปุ่น', english: "She's saving money [in order to] travel to Japan." },
    ],
  },

  // Contrast
  {
    word: { id: 'conj-but', thai: 'แต่', romanization: 'tɛɛ', pronunciation: 'tɛ̀ɛ', english: 'but' },
    group: 'but',
    sentences: [
      { thai: 'อาหารร้านนี้อร่อย ___แพงมาก', english: 'The food here is delicious [but] very expensive.' },
      { thai: 'ฉันอยากไป ___ไม่มีเวลา', english: "I want to go, [but] I don't have time." },
      { thai: 'เขาพูดภาษาไทยได้ ___อ่านไม่ได้', english: "He can speak Thai [but] can't read it." },
    ],
  },
  {
    word: { id: 'conj-although', thai: 'แม้ว่า', romanization: 'mɛɛ waa', pronunciation: 'mɛ́ɛ wâa', english: 'although' },
    group: 'although',
    sentences: [
      { thai: '___ฝนจะตก เขาก็ยังไปวิ่ง', english: '[Although] it was raining, he still went running.' },
      { thai: '___จะเหนื่อย ฉันก็มีความสุข', english: "[Although] I'm tired, I'm happy." },
      { thai: 'เขามาทำงาน___จะไม่สบาย', english: 'He came to work [although] he was sick.' },
    ],
  },
  {
    word: { id: 'conj-even-though', thai: 'ถึงแม้ว่า', romanization: 'thɯŋ mɛɛ waa', pronunciation: 'thɯ̌ŋ mɛ́ɛ wâa', english: 'even though' },
    group: 'although',
    sentences: [
      { thai: '___เขาจะรวย เขาก็ไม่มีความสุข', english: "[Even though] he's rich, he isn't happy." },
      { thai: '___ร้านจะไกล เราก็อยากไปกิน', english: '[Even though] the restaurant is far, we still want to eat there.' },
      { thai: 'เธอยิ้ม___จะเสียใจ', english: 'She smiled [even though] she was sad.' },
    ],
  },
  {
    word: { id: 'conj-despite', thai: 'ทั้งที่', romanization: 'thaŋ thii', pronunciation: 'tháŋ thîi', english: 'even though (despite the fact that)' },
    group: 'although',
    sentences: [
      { thai: 'เขาไม่มาเรียน ___พรุ่งนี้มีสอบ', english: "He didn't come to class, [even though] there's an exam tomorrow." },
      { thai: 'เธอยังกินขนม ___บอกว่าจะลดน้ำหนัก', english: "She's still eating sweets [even though] she said she'd lose weight." },
      { thai: 'เขาโกหก___ฉันรู้ความจริงอยู่แล้ว', english: 'He lied [even though] I already knew the truth.' },
    ],
  },
  {
    word: { id: 'conj-whereas', thai: 'ส่วน', romanization: 'suan', pronunciation: 'sùan', english: 'as for / whereas' },
    group: 'whereas',
    sentences: [
      { thai: 'พี่ชายชอบกีฬา ___น้องสาวชอบดนตรี', english: 'My older brother likes sports, [whereas] my younger sister likes music.', alsoOk: ['conj-but'] },
      { thai: 'ฉันจะไปตลาด ___คุณอยู่บ้านนะ', english: "I'll go to the market; [as for] you, stay home." },
      { thai: 'วันจันทร์ฉันว่าง ___วันอังคารไม่ว่าง', english: "I'm free on Monday, [whereas] on Tuesday I'm busy.", alsoOk: ['conj-but'] },
    ],
  },
  {
    word: { id: 'conj-instead', thai: 'แทนที่จะ', romanization: 'thɛɛn thii ca', pronunciation: 'thɛɛn thîi cà', english: 'instead of' },
    group: 'instead',
    sentences: [
      { thai: '___นั่งแท็กซี่ เรานั่งรถไฟฟ้าดีกว่า', english: "[Instead of] taking a taxi, let's take the skytrain." },
      { thai: 'เขาเล่นเกม___ทำการบ้าน', english: 'He plays games [instead of] doing his homework.' },
      { thai: '___บ่น ลองหาทางแก้ดีกว่า', english: '[Instead of] complaining, try to find a solution.' },
    ],
  },

  // Extent & comparison
  {
    word: { id: 'conj-as-much-as', thai: 'เท่าที่', romanization: 'thau thii', pronunciation: 'thâu thîi', english: 'as much as / as far as' },
    group: 'as-much-as',
    sentences: [
      { thai: 'กินได้___อยากกินเลย', english: 'Eat [as much as] you want.' },
      { thai: '___ฉันรู้ เขายังไม่แต่งงาน', english: "[As far as] I know, he isn't married yet." },
      { thai: 'ฉันจะช่วย___ช่วยได้', english: "I'll help [as much as] I can." },
    ],
  },
  {
    word: { id: 'conj-as-if', thai: 'ราวกับว่า', romanization: 'raaw kap waa', pronunciation: 'raaw kàp wâa', english: 'as if / as though' },
    group: 'as-if',
    sentences: [
      { thai: 'เขาทำ___ไม่เคยเจอฉันมาก่อน', english: 'He acted [as if] he had never met me before.' },
      { thai: 'เธอร้องเพลงเพราะ___เป็นนักร้องอาชีพ', english: 'She sings beautifully, [as if] she were a professional singer.' },
      { thai: 'ห้องนี้ร้อน___อยู่ในเตาอบ', english: "This room is so hot, it's [as if] we were in an oven." },
    ],
  },

  // Joining & choosing
  {
    word: { id: 'conj-and', thai: 'และ', romanization: 'lɛ', pronunciation: 'lɛ́', english: 'and' },
    group: 'and',
    sentences: [
      { thai: 'ฉันชอบกินข้าวผัด___ต้มยำ', english: 'I like fried rice [and] tom yum.' },
      { thai: 'เขาเปิดประตู___เดินเข้ามา', english: 'He opened the door [and] walked in.' },
      { thai: 'ห้องนี้กว้าง___สะอาด', english: 'This room is spacious [and] clean.' },
    ],
  },
  {
    word: { id: 'conj-or', thai: 'หรือ', romanization: 'rɯɯ', pronunciation: 'rɯ̌ɯ', english: 'or' },
    group: 'or',
    sentences: [
      { thai: 'คุณจะดื่มชา___กาแฟ', english: 'Would you like tea [or] coffee?' },
      { thai: 'เราจะไปวันเสาร์___วันอาทิตย์ดี', english: 'Should we go on Saturday [or] Sunday?' },
      { thai: 'จ่ายเงินสด___บัตรเครดิตก็ได้', english: 'You can pay by cash [or] credit card.' },
    ],
  },
  {
    word: { id: 'conj-moreover', thai: 'นอกจากนี้', romanization: 'nɔɔk caak nii', pronunciation: 'nɔ̂ɔk càak níi', english: 'besides / moreover' },
    group: 'moreover',
    sentences: [
      { thai: 'โรงแรมนี้ใกล้ทะเล ___ยังมีสระว่ายน้ำด้วย', english: 'This hotel is near the sea. [Besides that], it also has a pool.' },
      { thai: 'เขาพูดภาษาอังกฤษได้ ___ยังพูดภาษาจีนได้ด้วย', english: 'He speaks English. [Moreover], he can speak Chinese too.' },
      { thai: 'ผักมีวิตามินมาก ___ยังช่วยลดน้ำหนักได้', english: 'Vegetables have lots of vitamins. [On top of that], they help you lose weight.' },
    ],
  },
  {
    word: { id: 'conj-no-matter', thai: 'ไม่ว่า', romanization: 'mai waa', pronunciation: 'mâi wâa', english: 'no matter / whether' },
    group: 'no-matter',
    sentences: [
      { thai: '___จะเกิดอะไรขึ้น ฉันจะอยู่ข้างคุณ', english: "[No matter] what happens, I'll be by your side." },
      { thai: '___ฝนจะตกหรือไม่ เราก็จะไป', english: "[Whether] it rains or not, we're going." },
      { thai: '___คุณจะไปที่ไหน อย่าลืมโทรหาแม่', english: "[No matter] where you go, don't forget to call Mom." },
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
