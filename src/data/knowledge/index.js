import { FOOD_KNOWLEDGE } from '../foodKnowledge';
import { GAMES_KNOWLEDGE } from '../gamesKnowledge';
import { HISTORY_KNOWLEDGE } from '../historyKnowledge';
import { MUSIC_KNOWLEDGE } from '../musicKnowledge';
import { SAN_LUIS_KNOWLEDGE } from '../sanLuisKnowledge';
import { CHALLENGES_KNOWLEDGE } from './challengesKnowledge';
import { UTILITY_KNOWLEDGE } from './utilityKnowledge';

export const CROCANTE_KNOWLEDGE = [
  ...FOOD_KNOWLEDGE,
  ...GAMES_KNOWLEDGE,
  ...SAN_LUIS_KNOWLEDGE,
  ...MUSIC_KNOWLEDGE,
  ...HISTORY_KNOWLEDGE,
  ...BOOKS_KNOWLEDGE,
  ...CHALLENGES_KNOWLEDGE,
  ...UTILITY_KNOWLEDGE
];
