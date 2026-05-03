const STORAGE_KEY = 'mcrocante_brain_context';

const DEFAULT_CONTEXT = {
  lastIntent: null,
  lastCategory: null,
  lastAction: null,
  lastOptions: [],
  unknownInputs: [],
  interactions: 0,
  updatedAt: null
};

const INTENT_PATTERNS = {
  SALUDO: ['hola', 'buenas', 'buen dia', 'buenas tardes', 'buenas noches'],
  COMER: ['comer', 'hambre', 'morfar', 'almorzar', 'cenar', 'desayunar', 'merendar', 'comida'],
  COCINAR: ['cocinar', 'receta', 'hacer algo', 'preparar', 'casero'],
  COMPRAR: ['comprar', 'pedir', 'delivery', 'encargar', 'negocio', 'local', 'comercio'],
  CASA: ['casa', 'adentro', 'quedarme', 'tranqui', 'sillon', 'sofa', 'cama'],
  SALIR: ['salir', 'afuera', 'pasear', 'caminar', 'plaza', 'evento'],
  LLUVIA: ['llueve', 'lloviendo', 'lluvia', 'tormenta', 'frio', 'frío'],
  SIN_PLATA: ['sin plata', 'no tengo plata', 'no tengo un mango', 'sin un mango', 'barato', 'gratis', 'crocante'],
  ABURRIDO: ['aburrido', 'embole', 'no se que hacer', 'no sé qué hacer', 'algo para hacer'],
  PELI: ['peli', 'pelicula', 'película', 'serie', 'netflix', 'ver algo'],
  MUSICA: ['musica', 'música', 'tema', 'playlist', 'escuchar algo'],
  JUEGO: ['juego', 'jugar', 'challenge', 'reto', 'desafio', 'desafío']
};

const SENTIMENT_WORDS = {
  positive: ['bien', 'genial', 'joya', 'excelente', 'buenisimo', 'buenísimo', 'me gusta', 'perfecto', 'dale'],
  negative: ['mal', 'triste', 'horrible', 'problema', 'no puedo', 'no tengo', 'cansado', 'bajon', 'bajón', 'odio']
};

const RESPONSE_VARIANTS = {
  SIN_PLATA: [
    'Modo crocante activado 😅',
    'Cero drama, resolvemos barato.',
    'Economía de guerra crocante, pero con dignidad.'
  ],
  LLUVIA: [
    'Lluvia modo techo ☔',
    'Plan bajo techo, sin inventar épica.',
    'Con lluvia, el sillón cotiza en bolsa.'
  ],
  COMER: [
    'Vamos al punto: comida.',
    'Hambre detectada. Decisión clave:',
    'Ok, resolvamos el tema comida.'
  ],
  ABURRIDO: [
    'Ese aburrimiento hay que matarlo.',
    'Te salvo del embole.',
    'Plan anti-aburrimiento en marcha.'
  ],
  CASA: [
    'Plan casa detectado.',
    'Modo sillón activado.',
    'Sin salir también se puede resolver.'
  ],
  SALIR: [
    'Plan salir detectado.',
    'Ok, buscamos algo afuera.',
    'Aire libre o plan tranqui, veamos.'
  ],
  DEFAULT: [
    'Te sigo.',
    'A ver.',
    'Vamos por partes.'
  ]
};

function safeParse(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export function getContext() {
  if (typeof localStorage === 'undefined') return { ...DEFAULT_CONTEXT };
  return safeParse(localStorage.getItem(STORAGE_KEY), { ...DEFAULT_CONTEXT });
}

function saveContext(context) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(context));
}

export function resetContext() {
  saveContext({ ...DEFAULT_CONTEXT });
}

export function normalizeText(text = '') {
  return String(text)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[¿?¡!.,;:()"'`´]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(text = '') {
  return normalizeText(text).split(' ').filter(Boolean);
}

export function levenshteinSimilarity(a = '', b = '') {
  const s1 = normalizeText(a);
  const s2 = normalizeText(b);

  if (!s1 && !s2) return 1;
  if (!s1 || !s2) return 0;

  const rows = s2.length + 1;
  const cols = s1.length + 1;
  const matrix = Array.from({ length: rows }, () => Array(cols).fill(0));

  for (let i = 0; i < cols; i++) matrix[0][i] = i;
  for (let j = 0; j < rows; j++) matrix[j][0] = j;

  for (let j = 1; j < rows; j++) {
    for (let i = 1; i < cols; i++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j - 1][i] + 1,
        matrix[j][i - 1] + 1,
        matrix[j - 1][i - 1] + cost
      );
    }
  }

  const distance = matrix[s2.length][s1.length];
  return 1 - distance / Math.max(s1.length, s2.length);
}

export function fuzzyIncludes(input = '', patterns = [], tolerance = 0.74) {
  const cleanInput = normalizeText(input);
  const words = tokenize(cleanInput);

  return patterns.some(pattern => {
    const cleanPattern = normalizeText(pattern);

    if (!cleanPattern) return false;
    if (cleanInput.includes(cleanPattern)) return true;

    const patternWords = tokenize(cleanPattern);

    if (patternWords.length === 1) {
      return words.some(word => levenshteinSimilarity(word, cleanPattern) >= tolerance);
    }

    return levenshteinSimilarity(cleanInput, cleanPattern) >= tolerance;
  });
}

function detectIntent(message = '') {
  const text = normalizeText(message);

  for (const [intent, patterns] of Object.entries(INTENT_PATTERNS)) {
    if (fuzzyIncludes(text, patterns)) return intent;
  }

  return null;
}

function detectSentiment(message = '') {
  const text = normalizeText(message);

  let score = 0;

  SENTIMENT_WORDS.positive.forEach(word => {
    if (text.includes(normalizeText(word))) score += 1;
  });

  SENTIMENT_WORDS.negative.forEach(word => {
    if (text.includes(normalizeText(word))) score -= 1;
  });

  if (score > 0) return 'positive';
  if (score < 0) return 'negative';
  return 'neutral';
}

export function analyzeMessage(message = '') {
  const text = normalizeText(message);
  const intent = detectIntent(text);
  const sentiment = detectSentiment(text);

  return {
    raw: message,
    text,
    intent,
    sentiment,
    tokens: tokenize(text),
    isShort: text.length <= 14
  };
}

export function inferIntentFromContext(currentIntent = null, message = '') {
  if (currentIntent) return currentIntent;

  const ctx = getContext();
  const text = normalizeText(message);

  if (ctx.lastIntent === 'COMER') {
    if (fuzzyIncludes(text, ['comprar', 'pedir', 'delivery', 'algo hecho'])) return 'COMPRAR';
    if (fuzzyIncludes(text, ['cocinar', 'receta', 'hacer en casa'])) return 'COCINAR';
  }

  if (ctx.lastIntent === 'SIN_PLATA') {
    if (fuzzyIncludes(text, ['salir', 'afuera', 'gratis'])) return 'SALIR';
    if (fuzzyIncludes(text, ['casa', 'adentro', 'sillon'])) return 'CASA';
    if (fuzzyIncludes(text, ['comer', 'barato'])) return 'COMER';
  }

  if (ctx.lastIntent === 'LLUVIA') {
    if (fuzzyIncludes(text, ['peli', 'pelicula', 'ver algo'])) return 'PELI';
    if (fuzzyIncludes(text, ['musica', 'playlist'])) return 'MUSICA';
    if (fuzzyIncludes(text, ['cocinar', 'receta'])) return 'COCINAR';
    if (fuzzyIncludes(text, ['juego', 'challenge'])) return 'JUEGO';
  }

  return ctx.lastIntent || null;
}

export function updateContext({ intent = null, category = null, action = null, options = null } = {}) {
  const ctx = getContext();

  const next = {
    ...ctx,
    lastIntent: intent || ctx.lastIntent,
    lastCategory: category || ctx.lastCategory,
    lastAction: action || ctx.lastAction,
    lastOptions: Array.isArray(options) ? options : ctx.lastOptions,
    interactions: Number(ctx.interactions || 0) + 1,
    updatedAt: new Date().toISOString()
  };

  saveContext(next);
  return next;
}

export function rememberUnknownInput(message = '') {
  const ctx = getContext();
  const unknownInputs = Array.isArray(ctx.unknownInputs) ? ctx.unknownInputs : [];

  const next = {
    ...ctx,
    unknownInputs: [
      ...unknownInputs.slice(-9),
      {
        text: String(message || '').trim(),
        date: new Date().toISOString()
      }
    ],
    updatedAt: new Date().toISOString()
  };

  saveContext(next);
  return next;
}

export function getSmartOptions(intent = null) {
  const optionsByIntent = {
    SALUDO: ['Tengo hambre', 'Estoy aburrido', 'No tengo un mango', 'Quiero salir'],
    COMER: ['Cocinar algo', 'Comprar comida', 'Comer barato en casa'],
    COCINAR: ['Receta barata', 'Algo rápido', 'Con lo que hay'],
    COMPRAR: ['Pizza', 'Lomo', 'Empanadas', 'Hamburguesa'],
    SIN_PLATA: ['Salir gratis', 'Algo en casa', 'Comer barato', 'Con amigos'],
    LLUVIA: ['Peli', 'Música', 'Cocinar', 'Juego'],
    ABURRIDO: ['Salir', 'Casa', 'Juego rápido', 'Peli'],
    CASA: ['Peli', 'Juego', 'Cocinar', 'Música'],
    SALIR: ['Plan gratis', 'Aire libre', 'Evento', 'Con amigos'],
    PELI: ['Acción', 'Comedia', 'Algo liviano'],
    MUSICA: ['Playlist tranqui', 'Algo arriba', 'Mate y música'],
    JUEGO: ['Challenge', 'Juego familiar', 'Algo rápido']
  };

  return (optionsByIntent[intent] || ['Salir', 'Quedarme', 'Comer', 'Ver algo']).slice(0, 5);
}

/* 🔥 FIX CLAVE */
export function shouldAsk(intent = null, message = '') {
  const text = normalizeText(message);

  if (!intent) return true;

  const directExecutionWords = [
    'dame',
    'mostrame',
    'tirame',
    'pasame',
    'decime',
    'quiero opciones',
    'recomendame',
    'elegi vos',
    'resolve',
    'resolver',
    'ya fue',
    'sin vueltas'
  ];

  const wantsDirect = directExecutionWords.some(word => text.includes(word));

  if (wantsDirect) return false;

  const ctx = getContext();

  if (!ctx.lastAction) return true;

  const alwaysClarifyIntents = [
    'COMER',
    'SIN_PLATA',
    'ABURRIDO',
    'CASA',
    'SALIR'
  ];

  if (alwaysClarifyIntents.includes(intent)) return true;

  if (text.length <= 18) return true;

  return true;
}

export function getVariantResponse(intent = null, sentiment = 'neutral') {
  const pool = RESPONSE_VARIANTS[intent] || RESPONSE_VARIANTS.DEFAULT;
  let response = pool[Math.floor(Math.random() * pool.length)];

  if (sentiment === 'negative' && intent !== 'SIN_PLATA') {
    response = `Tranqui. ${response}`;
  }

  if (sentiment === 'positive') {
    response = `${response} Vamos bien.`;
  }

  return response;
}

export function mapIntentToCategory(intent = null) {
  const map = {
    CASA: 'casa',
    SALIR: 'aire-libre',
    SIN_PLATA: 'gratis',
    COMER: 'comer-barato',
    COCINAR: 'recetas',
    COMPRAR: 'negocios',
    LLUVIA: 'casa',
    ABURRIDO: 'casa',
    PELI: 'peliculas',
    MUSICA: 'musica',
    JUEGO: 'juegos'
  };

  return map[intent] || null;
}

export function buildDecisionPayload(message = '') {
  const analysis = analyzeMessage(message);
  const inferredIntent = inferIntentFromContext(analysis.intent, message);
  const options = getSmartOptions(inferredIntent);
  const category = mapIntentToCategory(inferredIntent);

  updateContext({
    intent: inferredIntent,
    category,
    action: 'decision',
    options
  });

  if (!inferredIntent) {
    rememberUnknownInput(message);
  }

  return {
    type: 'decision',
    intent: inferredIntent,
    category,
    sentiment: analysis.sentiment,
    intro: getVariantResponse(inferredIntent, analysis.sentiment),
    question: getQuestionForIntent(inferredIntent),
    options,
    analysis
  };
}

export function getQuestionForIntent(intent = null) {
  const questions = {
    SALUDO: '¿Qué querés resolver?',
    COMER: '¿Cocinamos algo o compramos?',
    SIN_PLATA: '¿Qué querés resolver?',
    LLUVIA: '¿Qué te pinta?',
    ABURRIDO: '¿Para dónde vamos?',
    CASA: '¿Qué tipo de plan querés?',
    SALIR: '¿Qué salida buscamos?',
    DEFAULT: '¿Lo pensamos como plan, comida o salida?'
  };

  return questions[intent] || questions.DEFAULT;
}

export function resolveUserChoice(choice = '') {
  const text = normalizeText(choice);
  const ctx = getContext();

  if (fuzzyIncludes(text, ['comprar comida', 'comprar', 'delivery', 'pedir'])) {
    return {
      intent: 'COMPRAR',
      category: ctx.lastIntent === 'COMER' ? 'comer-barato' : 'negocios',
      action: 'execute'
    };
  }

  if (fuzzyIncludes(text, ['cocinar algo', 'cocinar', 'receta', 'hacer algo'])) {
    return {
      intent: 'COCINAR',
      category: 'recetas',
      action: 'execute'
    };
  }

  if (fuzzyIncludes(text, ['salir gratis', 'plan gratis', 'salir', 'afuera'])) {
    return {
      intent: 'SALIR',
      category: 'aire-libre',
      action: 'execute'
    };
  }

  if (fuzzyIncludes(text, ['algo en casa', 'casa', 'quedarme', 'sillon', 'sofa'])) {
    return {
      intent: 'CASA',
      category: 'casa',
      action: 'execute'
    };
  }

  if (fuzzyIncludes(text, ['peli', 'pelicula', 'ver algo'])) {
    return {
      intent: 'PELI',
      category: 'peliculas',
      action: 'execute'
    };
  }

  if (fuzzyIncludes(text, ['musica', 'playlist'])) {
    return {
      intent: 'MUSICA',
      category: 'musica',
      action: 'execute'
    };
  }

  if (fuzzyIncludes(text, ['juego', 'challenge', 'reto'])) {
    return {
      intent: 'JUEGO',
      category: 'juegos',
      action: 'execute'
    };
  }

  return {
    intent: inferIntentFromContext(null, choice),
    category: mapIntentToCategory(inferIntentFromContext(null, choice)),
    action: 'decision'
  };
}

export function shouldShowBusiness(intent = null, choice = '') {
  const text = normalizeText(choice);

  return (
    intent === 'COMPRAR' ||
    fuzzyIncludes(text, ['comprar', 'pedir', 'delivery', 'negocio', 'local', 'comercio'])
  );
}

export default {
  analyzeMessage,
  inferIntentFromContext,
  getSmartOptions,
  shouldAsk,
  getVariantResponse,
  getContext,
  updateContext,
  resetContext,
  rememberUnknownInput,
  mapIntentToCategory,
  buildDecisionPayload,
  resolveUserChoice,
  shouldShowBusiness,
  normalizeText,
  fuzzyIncludes,
  levenshteinSimilarity
};
