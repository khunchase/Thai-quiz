import type { Phrase, Scenario } from '../types/phrase';
import { phrases as airport } from './scenarios/airport';
import { phrases as train } from './scenarios/train';
import { phrases as taxi } from './scenarios/taxi';
import { phrases as hotel } from './scenarios/hotel';
import { phrases as restaurant } from './scenarios/restaurant';
import { phrases as konbini } from './scenarios/konbini';
import { phrases as shopping } from './scenarios/shopping';
import { phrases as sightseeing } from './scenarios/sightseeing';
import { phrases as directions } from './scenarios/directions';
import { phrases as emergency } from './scenarios/emergency';

export const scenarios: Scenario[] = [
  { id: 'airport', name: 'Airport', jp: '空港', icon: '✈️' },
  { id: 'train', name: 'Trains', jp: '電車', icon: '🚄' },
  { id: 'taxi', name: 'Taxi & Bus', jp: 'タクシー', icon: '🚕' },
  { id: 'hotel', name: 'Hotel & Ryokan', jp: '宿', icon: '🏨' },
  { id: 'restaurant', name: 'Restaurant', jp: '飲食店', icon: '🍜' },
  { id: 'konbini', name: 'Konbini', jp: 'コンビニ', icon: '🏪' },
  { id: 'shopping', name: 'Shopping', jp: '買い物', icon: '🛍️' },
  { id: 'sightseeing', name: 'Sightseeing', jp: '観光', icon: '⛩️' },
  { id: 'directions', name: 'Directions', jp: '道案内', icon: '🧭' },
  { id: 'emergency', name: 'Trouble & Health', jp: '緊急', icon: '🆘' },
];

export const allPhrases: Phrase[] = [
  ...airport,
  ...train,
  ...taxi,
  ...hotel,
  ...restaurant,
  ...konbini,
  ...shopping,
  ...sightseeing,
  ...directions,
  ...emergency,
];

export const scenarioById = Object.fromEntries(scenarios.map((s) => [s.id, s])) as Record<string, Scenario>;
