// src/data/suggestions.js
// Base local/offline de sugerencias para Modo Crocante.

function normalize(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function createItems(prefix, items, defaults) {
  return items.map((item, index) => {
    const data = typeof item === 'string' ? { title: item } : item;

    return {
      id: `${prefix}-${String(index + 1).padStart(3, '0')}`,
      type: defaults.type,
      category: data.category || defaults.category,
      title: data.title,
      description: data.description || defaults.description,
      tags: [...(defaults.tags || []), ...(data.tags || [])],
      cost: data.cost || defaults.cost || 'bajo',
      location: data.location || defaults.location || 'Argentina',
      mood: [...(defaults.mood || []), ...(data.mood || [])],
    };
  });
}

/* =========================
   NUEVAS CATEGORÍAS CLAVE
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
    tags: ['niños', 'familia', 'gratis', 'casa'],
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
    tags: ['juego', 'casa', 'gratis'],
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
    tags: ['fiaca', 'casa'],
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
    tags: ['amigos', 'social'],
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
    tags: ['comida', 'barato'],
    mood: ['sin-plata'],
  }
);

/* =========================
   EXISTENTE (NO TOCADO)
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

export const SUGGESTIONS = [
  ...modoLuchon,
  ...juegos,
  ...altaFiaca,
  ...amigos,
  ...comerBarato,
  ...recetas,
];

export function getRandomSuggestions({
  category,
  mood,
  cost,
  query,
  limit = 5,
} = {}) {
  const normalizedQuery = normalize(query);

  let pool = SUGGESTIONS.filter((item) => {
    const matchCategory = category ? item.category === category || item.type === category : true;
    const matchMood = mood ? item.mood.includes(mood) || item.tags.includes(mood) : true;
    const matchQuery = normalizedQuery
      ? normalize(`${item.title} ${item.description} ${item.tags.join(' ')}`).includes(normalizedQuery)
      : true;

    return matchCategory && matchMood && matchQuery;
  });

  if (pool.length === 0) {
    pool = SUGGESTIONS;
  }

  return [...pool].sort(() => Math.random() - 0.5).slice(0, limit);
}

export function searchSuggestions(query, limit = 10) {
  const normalizedQuery = normalize(query);

  if (!normalizedQuery) {
    return getRandomSuggestions({ limit });
  }

  return SUGGESTIONS.filter((item) =>
    normalize(`${item.title} ${item.description} ${item.tags.join(' ')}`).includes(normalizedQuery)
  ).slice(0, limit);
}

export function getSuggestionById(id) {
  return SUGGESTIONS.find((item) => item.id === id);
}

export default SUGGESTIONS;
