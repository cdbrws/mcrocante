// src/engine/localBrain.js

const STORAGE_KEY = 'mcrocante_brain_context';

function safeParse(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function saveContext(ctx) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ctx));
}

function getContext() {
  return safeParse(localStorage.getItem(STORAGE_KEY), {
    lastIntent: null,
    lastCategory: null,
    lastOptions: null
  });
}

function normalize(text = '') {
  return String(text).toLowerCase().trim();
}

// --- INTENT DETECTION (simple pero efectivo) ---

const INTENTS = {
  COMER: ['comer', 'hambre', 'cena', 'almuerzo', 'desayuno'],
  COMPRAR: ['comprar', 'pedir', 'delivery', 'encargar'],
  CASA: ['casa', 'quedarme', 'tranqui', 'adentro'],
  SALIR: ['salir', 'afuera', 'hacer algo', 'plan'],
  ABURRIDO: ['aburrido', 'no se que hacer'],
  LLUVIA: ['llueve', 'lloviendo', 'lluvia'],
  SIN_PLATA: ['sin plata', 'no tengo plata', 'no tengo un mango', 'pobre'],
};

// fuzzy match básico
function includesFuzzy(input, words) {
  return words.some(w => input.includes(w));
}

export function analyzeMessage(message = '') {
  const text = normalize(message);

  let intent = null;

  for (const key in INTENTS) {
    if (includesFuzzy(text, INTENTS[key])) {
      intent = key;
      break;
    }
  }

  // sentimiento simple
  let sentiment = 'neutral';
  if (text.includes('no') || text.includes('nada') || text.includes('aburrido')) {
    sentiment = 'negative';
  }
  if (text.includes('genial') || text.includes('buen') || text.includes('joya')) {
    sentiment = 'positive';
  }

  return {
    intent,
    sentiment,
    text
  };
}

// --- CONTEXTO ---

export function inferIntentFromContext(currentIntent) {
  const ctx = getContext();

  if (currentIntent) return currentIntent;

  return ctx.lastIntent || null;
}

export function updateContext({ intent = null, category = null, options = null } = {}) {
  const ctx = getContext();

  const newCtx = {
    lastIntent: intent || ctx.lastIntent,
    lastCategory: category || ctx.lastCategory,
    lastOptions: options || ctx.lastOptions
  };

  saveContext(newCtx);
}

// --- OPCIONES DINÁMICAS (CLAVE UX) ---

export function getSmartOptions(intent) {
  switch (intent) {
    case 'COMER':
      return ['Cocinar algo', 'Comprar comida'];

    case 'SIN_PLATA':
      return ['Salir gratis', 'Algo en casa', 'Comer barato'];

    case 'LLUVIA':
      return ['Peli', 'Música', 'Cocinar', 'Juego'];

    case 'ABURRIDO':
      return ['Salir', 'Casa', 'Algo rápido'];

    case 'CASA':
      return ['Peli', 'Juego', 'Cocinar'];

    case 'SALIR':
      return ['Plan tranqui', 'Con amigos', 'Algo gratis'];

    default:
      return ['Salir', 'Quedarme', 'Comer', 'Ver algo'];
  }
}

// --- DECISIÓN: ¿PREGUNTAR O EJECUTAR? ---

export function shouldAsk(intent, message) {
  const text = normalize(message);

  // si el mensaje es corto o ambiguo → preguntar
  if (!intent) return true;

  if (text.length < 12) return true;

  // casos donde SIEMPRE preguntar primero
  if (intent === 'SIN_PLATA') return true;
  if (intent === 'LLUVIA') return true;
  if (intent === 'ABURRIDO') return true;

  return false;
}

// --- RESPUESTAS BASE (tono dinámico) ---

export function getToneResponse(intent, sentiment) {
  if (intent === 'SIN_PLATA') {
    return 'Modo crocante activado 😅';
  }

  if (intent === 'LLUVIA') {
    return 'Lluvia modo techo ☔';
  }

  if (intent === 'ABURRIDO') {
    return 'Ese aburrimiento hay que matarlo 😴';
  }

  if (sentiment === 'negative') {
    return 'A ver qué resolvemos 👇';
  }

  return null;
}
