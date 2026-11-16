import type { Word } from '../types/word';

/**
 * Thai classifiers (ลักษณนาม): the counting word that follows a number
 * after a noun — หมา สอง ตัว "two dogs" (dog, two, ตัว). Every countable
 * noun has one, picked by the kind of thing it is.
 */
export interface Classifier {
  thai: string;
  romanization: string;
  pronunciation: string;
  /** What it counts. */
  usedFor: string;
  /** "noun + number + classifier" example. */
  example: { thai: string; romanization: string; english: string };
}

export const CLASSIFIERS: Record<string, Classifier> = {
  ตัว: { thai: 'ตัว', romanization: 'tuua', pronunciation: 'tuua', usedFor: 'animals, clothes, tables & chairs, letters', example: { thai: 'หมา สอง ตัว', romanization: 'maa sɔɔŋ tuua', english: 'two dogs' } },
  คน: { thai: 'คน', romanization: 'khon', pronunciation: 'khon', usedFor: 'people', example: { thai: 'นักเรียน สาม คน', romanization: 'nak riian saam khon', english: 'three students' } },
  อัน: { thai: 'อัน', romanization: 'an', pronunciation: 'an', usedFor: 'small things in general (the catch-all)', example: { thai: 'ไม้บรรทัด หนึ่ง อัน', romanization: 'mai ban that nɯŋ an', english: 'one ruler' } },
  ชิ้น: { thai: 'ชิ้น', romanization: 'chin', pronunciation: 'chín', usedFor: 'pieces and items: cake, gifts, products', example: { thai: 'ขนม สอง ชิ้น', romanization: 'kha nom sɔɔŋ chin', english: 'two pieces of cake' } },
  ใบ: { thai: 'ใบ', romanization: 'bai', pronunciation: 'bai', usedFor: 'leaves, sheets & tickets, bags, hats, dishes & containers', example: { thai: 'ตั๋ว สอง ใบ', romanization: 'tuua sɔɔŋ bai', english: 'two tickets' } },
  ลูก: { thai: 'ลูก', romanization: 'luuk', pronunciation: 'lûuk', usedFor: 'round things: fruit, balls, mountains, storms', example: { thai: 'มะม่วง สาม ลูก', romanization: 'ma muuaŋ saam luuk', english: 'three mangoes' } },
  คัน: { thai: 'คัน', romanization: 'khan', pronunciation: 'khan', usedFor: 'vehicles, umbrellas, spoons & forks', example: { thai: 'รถ หนึ่ง คัน', romanization: 'rot nɯŋ khan', english: 'one car' } },
  เล่ม: { thai: 'เล่ม', romanization: 'lem', pronunciation: 'lêm', usedFor: 'books, notebooks, knives, scissors', example: { thai: 'หนังสือ สอง เล่ม', romanization: 'naŋ sɯɯ sɔɔŋ lem', english: 'two books' } },
  ด้าม: { thai: 'ด้าม', romanization: 'daam', pronunciation: 'dâam', usedFor: 'pens and pencils (things with a handle)', example: { thai: 'ปากกา สาม ด้าม', romanization: 'paak kaa saam daam', english: 'three pens' } },
  หลัง: { thai: 'หลัง', romanization: 'laŋ', pronunciation: 'lǎŋ', usedFor: 'houses, buildings, beds, big cabinets', example: { thai: 'บ้าน หนึ่ง หลัง', romanization: 'baan nɯŋ laŋ', english: 'one house' } },
  ห้อง: { thai: 'ห้อง', romanization: 'hɔɔŋ', pronunciation: 'hɔ̂ɔŋ', usedFor: 'rooms', example: { thai: 'ห้องนอน สอง ห้อง', romanization: 'hɔɔŋ nɔɔn sɔɔŋ hɔɔŋ', english: 'two bedrooms' } },
  แห่ง: { thai: 'แห่ง', romanization: 'hɛŋ', pronunciation: 'hɛ̀ŋ', usedFor: 'places', example: { thai: 'วัด สาม แห่ง', romanization: 'wat saam hɛŋ', english: 'three temples' } },
  เครื่อง: { thai: 'เครื่อง', romanization: 'khrɯɯaŋ', pronunciation: 'khrɯ̂ɯaŋ', usedFor: 'machines, appliances, electronics', example: { thai: 'โทรศัพท์ สอง เครื่อง', romanization: 'thoo ra sap sɔɔŋ khrɯɯaŋ', english: 'two phones' } },
  ลำ: { thai: 'ลำ', romanization: 'lam', pronunciation: 'lam', usedFor: 'boats and airplanes', example: { thai: 'เรือ หนึ่ง ลำ', romanization: 'rɯɯa nɯŋ lam', english: 'one boat' } },
  ขบวน: { thai: 'ขบวน', romanization: 'kha buuan', pronunciation: 'khà buuan', usedFor: 'trains, processions', example: { thai: 'รถไฟ สอง ขบวน', romanization: 'rot fai sɔɔŋ kha buuan', english: 'two trains' } },
  ต้น: { thai: 'ต้น', romanization: 'ton', pronunciation: 'tôn', usedFor: 'trees and plants', example: { thai: 'ต้นไม้ ห้า ต้น', romanization: 'ton mai haa ton', english: 'five trees' } },
  ดอก: { thai: 'ดอก', romanization: 'dɔɔk', pronunciation: 'dɔ̀ɔk', usedFor: 'flowers, keys', example: { thai: 'กุญแจ สอง ดอก', romanization: 'kun cɛɛ sɔɔŋ dɔɔk', english: 'two keys' } },
  ดวง: { thai: 'ดวง', romanization: 'duuaŋ', pronunciation: 'duuaŋ', usedFor: 'sun, moon, stars, hearts, lamps', example: { thai: 'ดาว สาม ดวง', romanization: 'daau saam duuaŋ', english: 'three stars' } },
  คู่: { thai: 'คู่', romanization: 'khuu', pronunciation: 'khûu', usedFor: 'pairs: shoes, socks, earrings, chopsticks', example: { thai: 'รองเท้า หนึ่ง คู่', romanization: 'rɔɔŋ thaau nɯŋ khuu', english: 'one pair of shoes' } },
  ข้าง: { thai: 'ข้าง', romanization: 'khaaŋ', pronunciation: 'khâaŋ', usedFor: 'one side of a pair: eyes, ears, arms, legs', example: { thai: 'ตา สอง ข้าง', romanization: 'taa sɔɔŋ khaaŋ', english: 'two eyes' } },
  เส้น: { thai: 'เส้น', romanization: 'sen', pronunciation: 'sên', usedFor: 'long thin things: hair, belts, necklaces, cables', example: { thai: 'เข็มขัด หนึ่ง เส้น', romanization: 'khem khat nɯŋ sen', english: 'one belt' } },
  สาย: { thai: 'สาย', romanization: 'saai', pronunciation: 'sǎai', usedFor: 'roads, rivers, routes', example: { thai: 'ถนน สอง สาย', romanization: 'tha non sɔɔŋ saai', english: 'two roads' } },
  แผ่น: { thai: 'แผ่น', romanization: 'phɛn', pronunciation: 'phɛ̀n', usedFor: 'flat sheets: paper, maps', example: { thai: 'กระดาษ สิบ แผ่น', romanization: 'kra daat sip phɛn', english: 'ten sheets of paper' } },
  ผืน: { thai: 'ผืน', romanization: 'phɯɯn', pronunciation: 'phɯ̌ɯn', usedFor: 'cloth: blankets, towels, rugs, scarves', example: { thai: 'ผ้าห่ม สอง ผืน', romanization: 'phaa hom sɔɔŋ phɯɯn', english: 'two blankets' } },
  ชุด: { thai: 'ชุด', romanization: 'chut', pronunciation: 'chút', usedFor: 'sets and outfits', example: { thai: 'ชุดนอน หนึ่ง ชุด', romanization: 'chut nɔɔn nɯŋ chut', english: 'one pair of pajamas' } },
  วง: { thai: 'วง', romanization: 'woŋ', pronunciation: 'woŋ', usedFor: 'rings, bracelets, circles, bands', example: { thai: 'แหวน หนึ่ง วง', romanization: 'wɛɛn nɯŋ woŋ', english: 'one ring' } },
  บาน: { thai: 'บาน', romanization: 'baan', pronunciation: 'baan', usedFor: 'doors, windows, mirrors (things that swing or frame)', example: { thai: 'หน้าต่าง สี่ บาน', romanization: 'naa taaŋ sii baan', english: 'four windows' } },
  ก้อน: { thai: 'ก้อน', romanization: 'kɔɔn', pronunciation: 'kɔ̂ɔn', usedFor: 'lumps: rocks, soap, ice, clouds, batteries', example: { thai: 'สบู่ หนึ่ง ก้อน', romanization: 'sa buu nɯŋ kɔɔn', english: 'one bar of soap' } },
  เม็ด: { thai: 'เม็ด', romanization: 'met', pronunciation: 'mét', usedFor: 'pills, seeds, buttons, small grains', example: { thai: 'ยา สอง เม็ด', romanization: 'yaa sɔɔŋ met', english: 'two pills' } },
  ฟอง: { thai: 'ฟอง', romanization: 'fɔɔŋ', pronunciation: 'fɔɔŋ', usedFor: 'eggs', example: { thai: 'ไข่ สาม ฟอง', romanization: 'khai saam fɔɔŋ', english: 'three eggs' } },
  ซี่: { thai: 'ซี่', romanization: 'sii', pronunciation: 'sîi', usedFor: 'teeth, ribs, spokes', example: { thai: 'ฟัน หนึ่ง ซี่', romanization: 'fan nɯŋ sii', english: 'one tooth' } },
  ข้อ: { thai: 'ข้อ', romanization: 'khɔɔ', pronunciation: 'khɔ̂ɔ', usedFor: 'questions, items, points in a list', example: { thai: 'คำถาม ห้า ข้อ', romanization: 'kham thaam haa khɔɔ', english: 'five questions' } },
  ฉบับ: { thai: 'ฉบับ', romanization: 'cha bap', pronunciation: 'chà bàp', usedFor: 'documents, letters, contracts, newspapers', example: { thai: 'สัญญา หนึ่ง ฉบับ', romanization: 'san yaa nɯŋ cha bap', english: 'one contract' } },
  แก้ว: { thai: 'แก้ว', romanization: 'kɛɛw', pronunciation: 'kɛ̂ɛw', usedFor: 'a glass of a drink', example: { thai: 'กาแฟ สอง แก้ว', romanization: 'kaa fɛɛ sɔɔŋ kɛɛw', english: 'two (glasses of) coffee' } },
  ขวด: { thai: 'ขวด', romanization: 'khuuat', pronunciation: 'khùuat', usedFor: 'a bottle of something', example: { thai: 'เบียร์ สาม ขวด', romanization: 'biia saam khuuat', english: 'three bottles of beer' } },
  จาน: { thai: 'จาน', romanization: 'caan', pronunciation: 'caan', usedFor: 'a plate of food', example: { thai: 'ข้าวผัด หนึ่ง จาน', romanization: 'khaau phat nɯŋ caan', english: 'one plate of fried rice' } },
  ชาม: { thai: 'ชาม', romanization: 'chaam', pronunciation: 'chaam', usedFor: 'a bowl of food', example: { thai: 'ก๋วยเตี๋ยว สอง ชาม', romanization: 'kuay tiaw sɔɔŋ chaam', english: 'two bowls of noodle soup' } },
  รูป: { thai: 'รูป', romanization: 'ruup', pronunciation: 'rûup', usedFor: 'monks', example: { thai: 'พระ สาม รูป', romanization: 'phra saam ruup', english: 'three monks' } },
};

const by = (classifier: string, ids: string[]) => ids.map((id) => [id, classifier] as const);

/** Built-in word id → the classifier (key of CLASSIFIERS) used to count it. */
const WORD_CLASSIFIERS: Record<string, string> = Object.fromEntries([
  ...by('คน', [
    'fam-mother', 'fam-father', 'fam-olderbro', 'fam-youngersis', 'fam-child', 'fam-husband', 'fam-wife', 'fam-grandpa',
    'fam-grandma', 'family-younger-brother', 'family-older-sister', 'family-grandmother', 'fam-man', 'fam-woman', 'fam-kid',
    'fam-partner', 'fam-son', 'fam-daughter', 'fam-uncle-older', 'fam-aunt-older', 'fam-grandchild', 'fam-cousin',
    'fam-father-younger-sib', 'fam-mother-younger-sib', 'fam-relative', 'fam-baby', 'fam-neighbor',
    'work-engineer', 'work-lawyer', 'work-businessperson', 'work-farmer', 'work-chef', 'work-pilot', 'work-journalist',
    'work-electrician', 'work-carpenter', 'work-accountant', 'work-architect', 'work-actor', 'work-musician', 'work-soldier',
    'work-athlete', 'work-barber', 'work-driver', 'work-cook', 'work-housekeeper', 'work-entrepreneur', 'work-employee',
    'work-secretary', 'work-manager', 'work-boss', 'work-chief', 'work-colleague', 'work-owner', 'work-waiter',
    'work-mechanic', 'work-guide', 'work-office-worker', 'work-civil-servant',
    'health-doctor', 'health-nurse', 'health-patient', 'health-dentist', 'health-police',
    'school-student', 'school-university-student', 'school-teacher', 'school-professor', 'school-principal', 'school-classmate',
    'shopping-cashier', 'shopping-salesperson', 'shopping-customer', 'shopping-shop-owner', 'shopping-merchant-male',
    'shopping-merchant-female', 'transport-passenger', 'transport-driver', 'transport-tourist', 'tech-user',
  ]),
  ...by('รูป', ['work-monk']),
  ...by('ตัว', [
    'animal-dog', 'animal-cat', 'animal-elephant', 'animal-bird', 'animal-snake', 'animal-tiger', 'animal-cow', 'animal-monkey',
    'animals-horse', 'animals-mouse', 'animals-frog', 'animals-turtle', 'animals-bee', 'animals-animal', 'animals-duck',
    'animals-mosquito', 'animals-buffalo', 'animals-ant', 'animals-fly', 'animals-lizard', 'animals-gecko', 'animals-crocodile',
    'animals-bear', 'animals-rabbit', 'animals-butterfly', 'animals-cockroach', 'animals-pet',
    'food-chicken', 'food-fish', 'food-shrimp', 'food-crab', 'food-squid',
    'clothing-shirt', 'clothing-pants', 'clothing-skirt', 'clothing-coat', 'clothing-sweater', 'clothing-tshirt',
    'clothing-tank-top', 'clothing-jacket', 'clothing-shorts', 'clothing-jeans', 'clothing-raincoat', 'clothing-robe',
    'household-table', 'household-chair', 'household-sofa', 'work-desk', 'school-alphabet', 'tech-mouse',
  ]),
  ...by('ชุด', ['clothing-outfit', 'clothing-pajamas', 'clothing-swimsuit', 'clothing-suit']),
  ...by('คู่', [
    'clothing-shoes', 'clothing-socks', 'clothing-gloves', 'clothing-sandals', 'clothing-boots', 'clothing-sneakers',
    'clothing-high-heels', 'clothing-earrings', 'clothing-stockings', 'household-chopsticks',
  ]),
  ...by('ใบ', [
    'clothing-hat', 'clothing-beanie', 'clothing-helmet', 'clothing-bag', 'clothing-backpack', 'clothing-handbag',
    'clothing-wallet', 'school-bag', 'shopping-bag', 'shopping-plastic-bag', 'transport-suitcase',
    'household-plate', 'household-bowl', 'household-glass', 'household-cup', 'household-pot', 'household-pan',
    'household-kettle', 'household-bucket', 'household-trash-can', 'household-thermos', 'household-pillow',
    'transport-ticket', 'transport-plane-ticket', 'transport-drivers-license', 'shopping-banknote', 'shopping-credit-card',
    'shopping-receipt', 'shopping-bill', 'health-prescription', 'work-business-card', 'weather-leaf', 'tech-picture',
  ]),
  ...by('อัน', [
    'clothing-glasses', 'clothing-mask', 'clothing-brooch', 'household-cutting-board', 'household-toothbrush',
    'household-hanger', 'household-light-switch', 'school-ruler', 'tech-headphones', 'tech-keyboard', 'tech-plug',
    'health-thermometer',
  ]),
  ...by('ชิ้น', ['food-snack', 'food-bread', 'body-bone', 'shopping-gift', 'shopping-souvenir', 'shopping-product']),
  ...by('เส้น', [
    'body-hair', 'clothing-belt', 'clothing-necklace', 'clothing-necktie', 'tech-charger',
  ]),
  ...by('ผืน', [
    'clothing-scarf', 'clothing-handkerchief', 'clothing-shawl', 'clothing-fabric', 'household-blanket', 'household-towel',
    'household-rug', 'household-curtain',
  ]),
  ...by('วง', ['clothing-ring', 'clothing-bracelet']),
  ...by('เม็ด', ['clothing-button', 'health-pill', 'food-chili', 'weather-seed']),
  ...by('คัน', [
    'clothing-umbrella', 'household-spoon', 'household-fork', 'transport-vehicle', 'transport-car', 'transport-bus',
    'transport-coach', 'transport-taxi', 'transport-tuktuk', 'transport-motorcycle', 'transport-bicycle', 'transport-truck',
    'transport-songthaew', 'health-ambulance',
  ]),
  ...by('ขบวน', ['transport-train', 'transport-skytrain', 'transport-subway']),
  ...by('ลำ', ['transport-boat', 'transport-airplane']),
  ...by('เล่ม', ['school-book', 'school-notebook', 'school-textbook', 'transport-passport', 'household-knife', 'school-scissors']),
  ...by('ด้าม', ['school-pen', 'school-pencil']),
  ...by('แผ่น', ['school-paper', 'school-map']),
  ...by('ฉบับ', ['work-document', 'work-contract', 'work-resume', 'school-test-paper']),
  ...by('ข้อ', ['school-question']),
  ...by('เครื่อง', [
    'household-fridge', 'household-tv', 'household-washing-machine', 'household-aircon', 'household-fan',
    'household-microwave', 'household-oven', 'household-rice-cooker', 'household-vacuum', 'household-toaster',
    'household-phone', 'school-computer', 'school-calculator', 'tech-laptop', 'tech-tablet', 'tech-smartphone',
    'tech-camera', 'tech-printer', 'tech-speaker', 'shopping-atm',
  ]),
  ...by('หลัง', ['place-house', 'household-bed', 'household-cabinet', 'household-wardrobe']),
  ...by('ห้อง', [
    'place-bathroom', 'place-room', 'household-bedroom', 'household-kitchen', 'household-living-room',
    'household-reception-room', 'household-dining-room', 'household-study-room', 'school-classroom',
    'health-emergency-room',
  ]),
  ...by('แห่ง', [
    'place-school', 'place-market', 'place-hospital', 'place-restaurant', 'place-airport', 'place-temple', 'places-bank',
    'places-post-office', 'places-garden', 'place-mall', 'place-cinema', 'place-village', 'place-police-station',
    'place-zoo', 'place-museum', 'place-embassy', 'transport-hotel', 'transport-beach', 'transport-pier',
    'transport-train-station', 'transport-bus-station', 'transport-gas-station', 'transport-parking-lot',
    'transport-bridge', 'school-university', 'school-library', 'health-clinic', 'shopping-department-store',
    'work-company', 'work-office', 'work-factory', 'weather-waterfall', 'weather-lake', 'weather-cave',
  ]),
  ...by('สาย', ['places-road', 'transport-highway', 'weather-river', 'weather-stream']),
  ...by('ต้น', ['weather-tree', 'weather-pine-tree', 'weather-plant']),
  ...by('ดอก', ['weather-flower', 'weather-rose', 'household-key']),
  ...by('ดวง', ['weather-sun', 'weather-moon', 'weather-star', 'weather-shooting-star', 'body-heart', 'household-lamp']),
  ...by('ลูก', [
    'food-fruit', 'food-mango', 'food-banana', 'food-coconut', 'food-pineapple', 'food-watermelon', 'food-lime',
    'weather-mountain', 'weather-hill', 'weather-volcano', 'weather-wave', 'weather-storm', 'body-eyeball',
  ]),
  ...by('ก้อน', ['weather-rock', 'weather-ice', 'weather-cloud', 'household-soap', 'school-eraser', 'tech-battery']),
  ...by('ข้าง', ['body-eye', 'body-ear', 'body-arm', 'body-hand', 'body-leg', 'body-foot']),
  ...by('ซี่', ['body-tooth']),
  ...by('ฟอง', ['food-egg']),
  ...by('แก้ว', ['food-coffee', 'food-tea', 'food-water', 'food-juice', 'food-milk']),
  ...by('ขวด', ['food-beer', 'food-liquor', 'household-shampoo']),
  ...by('จาน', ['food-fried-rice', 'food-papaya-salad', 'food-pork-basil']),
  ...by('ชาม', ['food-noodles']),
]);

/** The classifier used to count this word, when it's a countable noun we know one for. */
export function classifierFor(word: Word): Classifier | undefined {
  const key = WORD_CLASSIFIERS[word.id];
  return key ? CLASSIFIERS[key] : undefined;
}

/** Ids of every word mapped to a classifier (for checks). */
export const CLASSIFIED_WORD_IDS = Object.keys(WORD_CLASSIFIERS);

const LEVEL_1 = new Set(['ตัว', 'คน', 'อัน']);
const LEVEL_3 = new Set(['ขบวน', 'ดวง', 'ข้าง', 'สาย', 'ผืน', 'วง', 'บาน', 'ก้อน', 'เม็ด', 'ฟอง', 'ซี่', 'ข้อ', 'ฉบับ', 'รูป', 'ด้าม', 'ลำ']);
/** Already in the deck (shopping words ชิ้น and อัน, moved to this category with their ids kept). */
const ALREADY_IN_DECK = new Set(['ชิ้น', 'อัน']);

/** The classifiers themselves as study words, most common first, for the Classifiers category. */
export const CLASSIFIER_WORDS: Word[] = Object.values(CLASSIFIERS)
  .filter((c) => !ALREADY_IN_DECK.has(c.thai))
  .map((c) => ({
    id: `clf-${c.romanization.replace(/\s+/g, '-')}`,
    thai: c.thai,
    romanization: c.romanization,
    pronunciation: c.pronunciation,
    english: `classifier: ${c.usedFor}`,
    categoryId: 'classifiers',
    level: LEVEL_1.has(c.thai) ? 1 : LEVEL_3.has(c.thai) ? 3 : 2,
    exampleSentence: { thai: c.example.thai.replace(/ /g, ''), romanization: c.example.romanization, english: c.example.english },
  }));
