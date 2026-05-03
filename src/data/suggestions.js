// src/data/suggestions.js
// Base local/offline de sugerencias para Modo Crocante.
// Combina contenido fijo + knowledge + contenido cargado desde el admin en src/utils/adminContent.js

import { getActiveContent } from '../utils/adminContent';
import { CROCANTE_KNOWLEDGE } from './knowledge';

function normalize(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function normalizeTags(tags) {
  if (Array.isArray(tags)) {
    return tags.map(t => normalize(t)).filter(Boolean);
  }

  return String(tags || '')
    .split(',')
    .map(t => normalize(t))
    .filter(Boolean);
}

function normalizeMood(mood) {
  if (Array.isArray(mood)) {
    return mood.map(m => normalize(m)).filter(Boolean);
  }

  if (!mood) return [];

  return String(mood)
    .split(',')
    .map(m => normalize(m))
    .filter(Boolean);
}

function createItems(prefix, items, defaults) {
  return items.map((item, index) => {
    const data = typeof item === 'string' ? { title: item } : item;

    return {
      id: `${prefix}-${String(index + 1).padStart(3, '0')}`,
      type: data.type || defaults.type || 'plan',
      category: data.category || defaults.category || 'general',
      title: data.title || '',
      description: data.description || defaults.description || '',
      tags: normalizeTags([...(defaults.tags || []), ...(data.tags || [])]),
      cost: data.cost || defaults.cost || 'bajo',
      location: data.location || defaults.location || 'Argentina',
      mood: normalizeMood([...(defaults.mood || []), ...(data.mood || [])]),
      source: 'base',
      featured: Boolean(data.featured),
      active: true,
    };
  });
}

function mapAdminContentToSuggestion(item) {
  return {
    id: item.id,
    type: item.type || 'actividad',
    category: item.category || 'general',
    title: item.title || '',
    description: item.description || '',
    tags: normalizeTags(item.tags),
    cost: item.cost || 'bajo',
    location: item.location || 'San Luis',
    mood: normalizeMood(item.mood),
    imageUrl: item.imageUrl || '',
    sponsor: Boolean(item.sponsor),
    featured: Boolean(item.featured),
    active: item.active !== false,
    startsAt: item.startsAt || '',
    endsAt: item.endsAt || '',
    source: item.source || 'admin',
    priority: item.priority || 'normal',

    // Campos extra para que la AIA pueda usar contenido más inteligente si existe.
    ingredients: Array.isArray(item.ingredients) ? item.ingredients.map(i => normalize(i)).filter(Boolean) : [],
    steps: Array.isArray(item.steps) ? item.steps : [],
    tips: Array.isArray(item.tips) ? item.tips : [],
    materials: Array.isArray(item.materials) ? item.materials : [],
    duration: item.duration || '',
    difficulty: item.difficulty || '',
  };
}

function mapKnowledgeToSuggestion(item) {
  const safeType = item.type || 'actividad';

  return {
    ...item,
    id: item.id,
    type: safeType,
    category: item.category || safeType || 'general',
    title: item.title || '',
    description: item.description || '',
    tags: normalizeTags(item.tags),
    cost: item.cost || 'gratis',
    location: item.location || 'San Luis',
    mood: normalizeMood(item.mood),
    source: 'knowledge',
    featured: Boolean(item.featured),
    active: item.active !== false,
    priority: item.priority || 'normal',

    // Normalizados útiles para búsquedas/match futuro.
    ingredients: Array.isArray(item.ingredients) ? item.ingredients.map(i => normalize(i)).filter(Boolean) : [],
    steps: Array.isArray(item.steps) ? item.steps : [],
    tips: Array.isArray(item.tips) ? item.tips : [],
    materials: Array.isArray(item.materials) ? item.materials : [],
    duration: item.duration || '',
    difficulty: item.difficulty || '',
  };
}

function getAdminSuggestions() {
  try {
    return getActiveContent()
      .filter(item => item?.title)
      .map(mapAdminContentToSuggestion);
  } catch {
    return [];
  }
}

function getKnowledgeSuggestions() {
  try {
    return CROCANTE_KNOWLEDGE
      .filter(item => item?.id && item?.title)
      .map(mapKnowledgeToSuggestion);
  } catch {
    return [];
  }
}

function uniqueById(items) {
  const seen = new Set();

  return items.filter(item => {
    if (!item?.id || seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function scoreSuggestion(item, { category, mood, cost, normalizedQuery }) {
  let score = 0;

  const itemCategory = normalize(item.category);
  const itemType = normalize(item.type);
  const itemTags = normalizeTags(item.tags);
  const itemMood = normalizeMood(item.mood);
  const itemCost = normalize(item.cost);
  const haystack = normalize([
    item.title,
    item.description,
    item.category,
    item.type,
    item.location,
    item.duration,
    item.difficulty,
    ...(item.tags || []),
    ...(item.mood || []),
    ...(item.ingredients || []),
    ...(item.materials || []),
  ].join(' '));

  if (item.source === 'admin') score += 8;
  if (item.source === 'knowledge') score += 5;
  if (item.featured) score += 6;
  if (item.sponsor) score += 4;
  if (item.priority === 'premium') score += 4;
  if (item.priority === 'alta') score += 2;

  if (category) {
    const c = normalize(category);
    if (itemCategory === c) score += 12;
    if (itemType === c) score += 8;
    if (itemTags.includes(c)) score += 5;
    if (haystack.includes(c)) score += 2;
  }

  if (mood) {
    const m = normalize(mood);
    if (itemMood.includes(m)) score += 8;
    if (itemTags.includes(m)) score += 5;
    if (haystack.includes(m)) score += 2;
  }

  if (cost) {
    const c = normalize(cost);
    if (itemCost === c) score += 5;
    if (itemTags.includes(c)) score += 3;
  }

  if (normalizedQuery) {
    if (haystack.includes(normalizedQuery)) score += 10;

    const words = normalizedQuery
      .split(' ')
      .map(w => w.trim())
      .filter(w => w.length >= 3);

    words.forEach(word => {
      if (haystack.includes(word)) score += 2;
    });
  }

  return score;
}

function sortByPriority(items, filters = {}) {
  const normalizedQuery = normalize(filters.query);

  return shuffle(items)
    .map(item => ({
      item,
      score: scoreSuggestion(item, {
        ...filters,
        normalizedQuery,
      }),
    }))
    .sort((a, b) => b.score - a.score)
    .map(row => row.item);
}

function getAllSuggestions() {
  return uniqueById([
    ...getAdminSuggestions(),
    ...getKnowledgeSuggestions(),
    ...SUGGESTIONS_BASE,
  ]);
}

/* =========================
   CATEGORÍAS CLAVE
========================= */

const modoLuchon = createItems(
  'luchon',
  [
    'Dibujar con lo que haya en casa',
    'Inventar un juego con hojas y lápiz',
    'Ver dibujitos gratis en YouTube',
    'Cocinar algo simple con los chicos',
    'Hacer competencia de quién ordena más rápido',
    'Armar una casita con sábanas',
    'Contar historias inventadas',
    'Hacer títeres con medias',
    'Búsqueda del tesoro casera',
    'Competencia de chistes',
  ],
  {
    type: 'plan',
    category: 'modo-luchon',
    description: 'Ideas para entretener a los chicos sin gastar un peso.',
    tags: ['niños', 'familia', 'gratis', 'casa', 'chicos'],
    mood: ['familia', 'chicos'],
  }
);

const juegos = createItems(
  'juego',
  [
    'Batalla naval en papel',
    'Generala con lápiz',
    'Truco',
    'Casita robada',
    'Piedra papel o tijera torneo',
    'Juego de memoria con objetos',
    'Verdad o reto tranqui',
    'Adivinar palabras',
    'Dígalo con mímica',
    'Carrera de soplar papel',
  ],
  {
    type: 'juego',
    category: 'juegos',
    description: 'Juegos simples sin gastar plata.',
    tags: ['juego', 'casa', 'gratis', 'amigos', 'familia'],
    mood: ['fiaca', 'familia', 'amigos'],
  }
);

const altaFiaca = createItems(
  'fiaca',
  [
    'Tirarte a ver una peli',
    'Mate largo con música',
    'Playlist + cama',
    'Serie corta sin pensar mucho',
    'Dormir siesta sin culpa',
    'Ver videos random',
    'Comer algo rico y descansar',
    'Escuchar música sin hacer nada',
  ],
  {
    type: 'plan',
    category: 'alta-fiaca',
    description: 'Plan nivel mínimo esfuerzo.',
    tags: ['fiaca', 'casa', 'tranqui'],
    mood: ['fiaca'],
  }
);

const amigos = createItems(
  'amigos',
  [
    'Juntada con mate',
    'Torneo de truco',
    'Challenge de cocina',
    'Salir a caminar y charlar',
    'Ver peli grupal',
    'Playlist compartida',
    'Picada barata',
  ],
  {
    type: 'plan',
    category: 'amigos',
    description: 'Plan simple con amigos.',
    tags: ['amigos', 'social', 'barato'],
    mood: ['amigos'],
  }
);

const comerBarato = createItems(
  'barato',
  [
    'Fideos con manteca',
    'Arroz con huevo',
    'Tortas fritas',
    'Mate con pan casero',
    'Guiso económico',
    'Polenta',
    'Omelette con lo que haya',
  ],
  {
    type: 'comida',
    category: 'comer-barato',
    description: 'Opciones para comer sin plata.',
    tags: ['comida', 'barato', 'gratis', 'sin-plata'],
    mood: ['sin-plata'],
  }
);

const sanLuis = createItems(
  'sanluis',
  [
    {
      title: 'Mate en una plaza',
      description: 'Plan simple, barato y útil para cortar la rutina sin gastar.',
      tags: ['aire libre', 'gratis', 'plaza', 'mate', 'salir'],
      mood: ['aire', 'amigos', 'pareja', 'familia'],
      location: 'San Luis',
    },
    {
      title: 'Caminata tranqui por zona segura',
      description: 'Ideal para moverse un poco, charlar y no gastar nada.',
      tags: ['aire libre', 'gratis', 'caminar', 'salud', 'salir'],
      mood: ['aire', 'moverme', 'fiaca'],
      location: 'San Luis',
    },
    {
      title: 'Recorrer una feria o paseo local',
      description: 'Sirve para mirar, caminar y encontrar algo distinto sin obligación de comprar.',
      tags: ['feria', 'paseo', 'local', 'salir', 'emprendedores'],
      mood: ['aire', 'amigos', 'familia'],
      location: 'San Luis',
    },
    {
      title: 'Tarde de fotos por la ciudad',
      description: 'Elegí un lugar lindo, sacá fotos y armá plan sin gastar.',
      tags: ['aire libre', 'fotos', 'gratis', 'salir', 'ciudad'],
      mood: ['aire', 'pareja', 'amigos'],
      location: 'San Luis',
    },
    {
      title: 'Salida corta a tomar aire',
      description: 'Cuando no hay plata ni ganas de producirse, salir 30 minutos ya cambia el día.',
      tags: ['aire libre', 'gratis', 'salir', 'tranqui'],
      mood: ['aire', 'fiaca'],
      location: 'San Luis',
    },
  ],
  {
    type: 'actividad',
    category: 'san-luis',
    description: 'Planes simples para hacer en San Luis sin gastar de más.',
    tags: ['san luis', 'salir', 'gratis', 'barato', 'aire libre'],
    mood: ['aire'],
    location: 'San Luis',
  }
);

const aireLibre = createItems(
  'aire',
  [
    {
      title: 'Mate y caminata al aire libre',
      description: 'Plan básico, barato y efectivo. Mate, zapatillas y listo.',
      tags: ['mate', 'caminar', 'gratis', 'salir', 'san luis'],
      mood: ['aire', 'amigos', 'pareja'],
      location: 'San Luis',
    },
    {
      title: 'Plaza + charla sin gastar',
      description: 'Ideal para amigos, pareja o familia. La billetera no participa.',
      tags: ['plaza', 'gratis', 'familia', 'amigos', 'pareja'],
      mood: ['aire', 'familia', 'amigos', 'pareja'],
      location: 'San Luis',
    },
    {
      title: 'Buscar un evento gratuito cercano',
      description: 'Revisá redes municipales, centros culturales o ferias. Si lo cargás en Base AIA, después aparece acá.',
      tags: ['evento', 'gratis', 'cultura', 'salir'],
      mood: ['aire', 'amigos', 'familia'],
      location: 'San Luis',
    },
  ],
  {
    type: 'actividad',
    category: 'aire-libre',
    description: 'Planes al aire libre, baratos o gratis.',
    tags: ['aire libre', 'salir', 'gratis', 'san luis'],
    mood: ['aire'],
    location: 'San Luis',
  }
);

/* =========================
   EXISTENTE
========================= */

const recetas = createItems(
  'receta',
  [
    'Tortas fritas',
    'Pastelitos criollos',
    'Empanadas criollas',
    'Empanadas puntanas',
    'Locro simple',
    'Guiso carrero',
    'Carbonada',
    'Pastel de papa',
    'Humita en olla',
    'Polenta con tuco',
  ],
  {
    type: 'receta',
    category: 'comida',
    description: 'Idea simple, barata y conseguible en Argentina.',
    tags: ['receta', 'barato', 'casero', 'argentino'],
    mood: ['fiaca', 'familia', 'casa'],
  }
);

/* =========================
   EXPORT FINAL
========================= */

export const SUGGESTIONS_BASE = [
  ...modoLuchon,
  ...juegos,
  ...altaFiaca,
  ...amigos,
  ...comerBarato,
  ...sanLuis,
  ...aireLibre,
  ...recetas,
];

// Export compatible: deja funcionando imports existentes.
// Ojo: esto es la base fija vieja. Para traer admin + knowledge + base usar getAllSuggestions().
export const SUGGESTIONS = SUGGESTIONS_BASE;

export function getRandomSuggestions({
  category,
  mood,
  cost,
  query,
  limit = 5,
} = {}) {
  const allSuggestions = getAllSuggestions();
  const normalizedQuery = normalize(query);
  const normalizedCategory = normalize(category);
  const normalizedMood = normalize(mood);
  const normalizedCost = normalize(cost);

  let pool = allSuggestions.filter((item) => {
    const itemCategory = normalize(item.category);
    const itemType = normalize(item.type);
    const itemTags = normalizeTags(item.tags);
    const itemMood = normalizeMood(item.mood);
    const itemCost = normalize(item.cost);
    const haystack = normalize([
      item.title,
      item.description,
      item.category,
      item.type,
      item.location,
      item.duration,
      item.difficulty,
      ...(item.tags || []),
      ...(item.mood || []),
      ...(item.ingredients || []),
      ...(item.materials || []),
    ].join(' '));

    const matchCategory = normalizedCategory
      ? itemCategory === normalizedCategory ||
        itemType === normalizedCategory ||
        itemTags.includes(normalizedCategory) ||
        haystack.includes(normalizedCategory)
      : true;

    const matchMood = normalizedMood
      ? itemMood.includes(normalizedMood) ||
        itemTags.includes(normalizedMood) ||
        haystack.includes(normalizedMood)
      : true;

    const matchCost = normalizedCost
      ? itemCost === normalizedCost ||
        itemTags.includes(normalizedCost)
      : true;

    const matchQuery = normalizedQuery
      ? haystack.includes(normalizedQuery) ||
        normalizedQuery.split(' ').some(word => word.length >= 3 && haystack.includes(word))
      : true;

    return matchCategory && matchMood && matchCost && matchQuery;
  });

  if (pool.length === 0 && normalizedCategory) {
    pool = allSuggestions.filter((item) => {
      const haystack = normalize([
        item.title,
        item.description,
        item.category,
        item.type,
        item.location,
        ...(item.tags || []),
        ...(item.mood || []),
        ...(item.ingredients || []),
        ...(item.materials || []),
      ].join(' '));

      return haystack.includes(normalizedCategory);
    });
  }

  if (pool.length === 0 && normalizedMood) {
    pool = allSuggestions.filter((item) => {
      const haystack = normalize([
        item.title,
        item.description,
        item.category,
        item.type,
        item.location,
        ...(item.tags || []),
        ...(item.mood || []),
        ...(item.ingredients || []),
        ...(item.materials || []),
      ].join(' '));

      return haystack.includes(normalizedMood);
    });
  }

  if (pool.length === 0 && normalizedQuery) {
    pool = allSuggestions.filter((item) => {
      const haystack = normalize([
        item.title,
        item.description,
        item.category,
        item.type,
        item.location,
        ...(item.tags || []),
        ...(item.mood || []),
        ...(item.ingredients || []),
        ...(item.materials || []),
      ].join(' '));

      return normalizedQuery
        .split(' ')
        .filter(word => word.length >= 3)
        .some(word => haystack.includes(word));
    });
  }

  if (pool.length === 0) {
    pool = allSuggestions.filter(item =>
      ['san-luis', 'aire-libre', 'comer-barato', 'juegos', 'modo-luchon', 'alta-fiaca', 'comida', 'receta', 'plan', 'juego', 'familia'].includes(normalize(item.category)) ||
      ['san-luis', 'aire-libre', 'comer-barato', 'juegos', 'modo-luchon', 'alta-fiaca', 'comida', 'receta', 'plan', 'juego', 'familia'].includes(normalize(item.type))
    );
  }

  return sortByPriority(pool, {
    category,
    mood,
    cost,
    query,
  }).slice(0, limit);
}

export function searchSuggestions(query, limit = 10) {
  const allSuggestions = getAllSuggestions();
  const normalizedQuery = normalize(query);

  if (!normalizedQuery) {
    return getRandomSuggestions({ limit });
  }

  return sortByPriority(
    allSuggestions.filter((item) => {
      const haystack = normalize([
        item.title,
        item.description,
        item.category,
        item.type,
        item.location,
        item.duration,
        item.difficulty,
        ...(item.tags || []),
        ...(item.mood || []),
        ...(item.ingredients || []),
        ...(item.materials || []),
      ].join(' '));

      return haystack.includes(normalizedQuery) ||
        normalizedQuery
          .split(' ')
          .filter(word => word.length >= 3)
          .some(word => haystack.includes(word));
    }),
    { query }
  ).slice(0, limit);
}

export function getSuggestionById(id) {
  return getAllSuggestions().find((item) => item.id === id);
}

export function getSuggestionsByCategory(category, limit = 20) {
  return getRandomSuggestions({ category, limit });
}

export function getFeaturedSuggestions(limit = 6) {
  return sortByPriority(
    getAllSuggestions().filter(item => item.featured),
    {}
  ).slice(0, limit);
}

export default SUGGESTIONS_BASE;
