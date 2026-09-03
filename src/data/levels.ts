export interface LevelInfo {
  level: number;
  name: string;
}

export const LEVELS: LevelInfo[] = [
  { level: 1, name: 'Basic' },
  { level: 2, name: 'Elementary' },
  { level: 3, name: 'Intermediate' },
  { level: 4, name: 'Upper-Intermediate' },
  { level: 5, name: 'Advanced' },
];

/**
 * Assigns every category to a difficulty tier. Individually rating ~1000
 * words wasn't practical, so level is derived from category — a reasonable
 * proxy for real-world frequency/complexity.
 */
export const CATEGORY_LEVEL: Record<string, number> = {
  greetings: 1,
  numbers: 1,
  numerals: 1,
  family: 1,
  colors: 1,
  pronouns: 1,

  food: 2,
  animals: 2,
  time: 2,
  verbs: 2,
  adjectives: 2,
  body: 2,
  stories: 2,

  places: 3,
  clothing: 3,
  weather: 3,
  household: 3,
  school: 3,
  directions: 3,

  transport: 4,
  tech: 4,
  shopping: 4,
  work: 4,
  emotions: 4,
  health: 4,

  cutep: 5,
};

export function levelForCategory(categoryId: string): number {
  return CATEGORY_LEVEL[categoryId] ?? 1;
}
