import { FOOD_KNOWLEDGE } from './foodKnowledge';
import { GAMES_KNOWLEDGE } from './gamesKnowledge';
import { SAN_LUIS_KNOWLEDGE } from './sanLuisKnowledge';
import { MUSIC_KNOWLEDGE } from './musicKnowledge';
import { HISTORY_KNOWLEDGE } from './historyKnowledge';
import { BOOKS_KNOWLEDGE } from './booksKnowledge';
import { CHALLENGES_KNOWLEDGE } from './challengesKnowledge';
import { UTILITY_KNOWLEDGE } from './utilityKnowledge';
import { FAMILY_KIDS_KNOWLEDGE } from './familyKidsKnowledge';

// BASE TOTAL DE CONOCIMIENTO CRO CANTE
export const CROCANTE_KNOWLEDGE = [
  ...FOOD_KNOWLEDGE,
  ...GAMES_KNOWLEDGE,
  ...SAN_LUIS_KNOWLEDGE,
  ...MUSIC_KNOWLEDGE,
  ...HISTORY_KNOWLEDGE,
  ...BOOKS_KNOWLEDGE,
  ...CHALLENGES_KNOWLEDGE,
  ...UTILITY_KNOWLEDGE,
  ...FAMILY_KIDS_KNOWLEDGE
];
