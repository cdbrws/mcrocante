import { DATA, CROCANTE_DEL_DIA, EMPRENDEDORES } from '../data/places';
import { LOCALIDADES_SL } from '../data/localidades';
import { RECETAS } from '../data/recetas';
import { PELICULAS, BANDAS } from '../data/aiaData';
import { getRandomSuggestions } from '../data/suggestions';
import { getNegociosAprobados } from '../utils/solicitudes';
import { trackChat } from '../utils/adminStats';

import {
  analyzeMessage,
  inferIntentFromContext,
  getSmartOptions,
  shouldAsk,
  getVariantResponse,
  updateContext,
  getContext,
  mapIntentToCategory,
  resolveUserChoice,
  shouldShowBusiness,
} from './localBrain';

// ---------------- UTIL ----------------

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function normalize(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function hasAny(text, words = []) {
  const normalized = normalize(text);
  return words.some((word) => normalized.includes(normalize(word)));
}

function shuffle(arr) {
  const s = [...(arr || [])];
  for (let i = s.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [s[i], s[j]] = [s[j], s[i]];
  }
  return s;
}

function uniqueByKey(items, getKey) {
  const seen = new Set();
  const out = [];

  (items || []).forEach((item) => {
    const key = String(getKey(item) || '');
    if (!key || seen.has(key)) return;
    seen.add(key);
    out.push(item);
  });

  return out;
}

function getRecetasArray() {
  return Array.isArray(RECETAS) ? RECETAS : Object.values(RECETAS || {});
}

function getRecipeName(recipe) {
  return recipe?.nombre || recipe?.title || recipe?.titulo || 'Receta';
}

function getRecipeTip(recipe) {
  return recipe?.tip || recipe?.description || recipe?.desc || 'Simple, casera y sin complicarse.';
}

function getMovieTitle(movie) {
  return movie?.titulo || movie?.title || 'Película';
}

function getBandName(band) {
  return band?.nombre || band?.name || 'Banda';
}

function getBusinessName(business) {
  return business?.nombre || business?.name || business?.title || 'Negocio local';
}

function getBusinessDescription(business) {
  return business?.desc || business?.descripcion || business?.description || business?.rubro || 'Opción local cargada en Modo Crocante.';
}

function getBusinessZone(business) {
  return business?.zona || business?.location || business?.localidad || '';
}

function getSuggestionText(item, index) {
  const featured = item?.featured ? ' ⭐' : '';
  const sponsor = item?.sponsor ? ' sponsor' : '';
  const location = item?.location ? ` (${item.location})` : '';

  return `${index + 1}. **${item.title}**${featured}${sponsor} — ${item.description}${location}`;
}

function businessMatchesTags(business, keywords = []) {
  const haystack = normalize([
    business?.nombre,
    business?.name,
    business?.title,
    business?.rubro,
    business?.zona,
    business?.location,
    business?.desc,
    business?.descripcion,
    business?.description,
    ...(business?.tags || []),
  ].join(' '));

  return keywords.some((keyword) => haystack.includes(normalize(keyword)));
}

function getBusinessKeywordsByIntent(intentLabel) {
  const map = {
    'comer-barato': ['comida', 'pizza', 'lomo', 'hamburguesa', 'empanada', 'barato', 'promo', 'minuta', 'cafe', 'merienda'],
    comida: ['comida', 'pizza', 'lomo', 'hamburguesa', 'empanada', 'sushi', 'pasta', 'minuta', 'cafe', 'merienda', 'helado'],
    comer: ['comida', 'pizza', 'lomo', 'hamburguesa', 'empanada', 'sushi', 'pasta', 'minuta', 'cafe'],
    amigos: ['bar', 'comida', 'pizza', 'hamburguesa', 'lomo', 'cafe', 'helado', 'juntada', 'amigos'],
    'modo-luchon': ['familia', 'niños', 'ninos', 'chicos', 'helado', 'plaza', 'actividad', 'merienda'],
    familia: ['familia', 'niños', 'ninos', 'chicos', 'helado', 'plaza', 'actividad', 'merienda'],
    'san-luis': ['san luis', 'actividad', 'turismo', 'salida', 'local', 'paseo', 'aire libre', 'evento'],
    'aire-libre': ['aire libre', 'plaza', 'paseo', 'actividad', 'evento', 'salida', 'san luis'],
    salir: ['salida', 'comida', 'bar', 'cafe', 'helado', 'actividad', 'evento', 'paseo'],
    pareja: ['cafe', 'bar', 'helado', 'comida', 'salida', 'pareja'],
    noche: ['bar', 'comida', 'pizza', 'lomo', 'hamburguesa', 'noche'],
    negocios: ['comida', 'pizza', 'lomo', 'hamburguesa', 'empanada', 'local', 'comercio', 'promo'],
  };

  return map[intentLabel] || [];
}

function scoreBusinessForIntent(business, intentLabel) {
  const keywords = getBusinessKeywordsByIntent(intentLabel);
  let score = 0;

  if (business?.sponsor) score += 20;
  if (business?.destacado) score += 10;
  if (business?.prioridad === 'premium') score += 8;
  if (business?.prioridad === 'alta') score += 4;

  if (businessMatchesTags(business, keywords)) score += 12;

  const haystack = normalize([
    business?.nombre,
    business?.rubro,
    business?.zona,
    business?.desc,
    ...(business?.tags || []),
  ].join(' '));

  keywords.forEach((keyword) => {
    if (haystack.includes(normalize(keyword))) score += 2;
  });

  return score;
}

function getApprovedBusinessesForIntent(intentLabel, limit = 3) {
  let negocios = [];

  try {
    negocios = getNegociosAprobados();
  } catch {
    negocios = [];
  }

  if (!Array.isArray(negocios) || negocios.length === 0) return [];

  const scored = negocios
    .filter(Boolean)
    .map((business) => ({
      business,
      score: scoreBusinessForIntent(business, intentLabel),
    }))
    .sort((a, b) => b.score - a.score)
    .map((row) => row.business);

  const unique = uniqueByKey(scored, (business) => business.id || getBusinessName(business));

  return unique.slice(0, limit);
}

function appendBusinessBlock(text, intentLabel) {
  const businesses = getApprovedBusinessesForIntent(intentLabel, 3);

  if (!businesses.length) {
    return `${text}\n\nNo tengo negocios cargados para eso todavía.`;
  }

  let next = `${text}\n\nNegocios locales que podrían servirte:\n`;

  businesses.forEach((business, index) => {
    const sponsorTag = business.sponsor ? ' ⭐ sponsor' : business.destacado ? ' destacado' : '';
    next += `${index + 1}. **${getBusinessName(business)}**${sponsorTag} — ${getBusinessDescription(business)}`;
    const zone = getBusinessZone(business);
    if (zone) next += ` (${zone})`;
    next += '\n';
  });

  return next;
}

function safeTrackUserChat(input, response) {
  try {
    trackChat(input, response?.intent, response?.results || [], response?.category || response?.intent || null);
  } catch {}
}

// memoria simple anti-repetición
let lastSuggestions = [];

// ---------------- LOCAL BRAIN BRIDGE ----------------

function isDecisionOpen() {
  const ctx = getContext();
  return ctx?.lastAction === 'decision' && Array.isArray(ctx?.lastOptions) && ctx.lastOptions.length > 0;
}

function makeDecisionResponse(text, intent, analysis) {
  const options = getSmartOptions(intent);
  const category = mapIntentToCategory(intent);

  updateContext({
    intent,
    category,
    action: 'decision',
    options,
  });

  const intro = getVariantResponse(intent, analysis?.sentiment);
  const questionMap = {
    SALUDO: '¿Qué querés resolver?',
    COMER: '¿Cocinamos algo o compramos?',
    SIN_PLATA: '¿Qué querés resolver?',
    LLUVIA: '¿Qué te pinta?',
    ABURRIDO: '¿Para dónde vamos?',
    CASA: '¿Qué tipo de plan querés?',
    SALIR: '¿Qué salida buscamos?',
  };

  return {
    text: `${intro}\n${questionMap[intent] || '¿Lo pensamos como plan, comida o salida?'}`,
    results: [],
    suggestions: options,
    intent: intent || 'decision',
    category: category || 'decision',
  };
}

function resolveExecutionTarget(text, inferredIntent) {
  const normalized = normalize(text);

  if (
    normalized.includes('algo en casa') ||
    normalized === 'casa' ||
    normalized.includes('plan casa') ||
    normalized.includes('quedarme en casa') ||
    normalized.includes('no quiero salir')
  ) {
    return {
      intent: 'CASA',
      category: 'casa',
      label: 'casa',
      action: 'decision',
    };
  }

  const choice = resolveUserChoice(text);

  if (choice?.action === 'execute' && choice?.intent) {
    return choice;
  }

  if (hasAny(normalized, ['comer barato', 'barato', 'algo barato', 'morfar barato'])) {
    return {
      intent: 'COMER_BARATO',
      category: 'comer-barato',
      label: 'comer-barato',
      mood: 'sin-plata',
      action: 'execute',
    };
  }

  if (hasAny(normalized, ['con amigos', 'amigos', 'juntada'])) {
    return {
      intent: 'AMIGOS',
      category: 'amigos',
      label: 'amigos',
      mood: 'amigos',
      action: 'execute',
    };
  }

  if (hasAny(normalized, ['con chicos', 'chicos', 'familia', 'niños', 'ninos'])) {
    return {
      intent: 'FAMILIA',
      category: 'modo-luchon',
      label: 'modo-luchon',
      mood: 'familia',
      action: 'execute',
    };
  }

  if (hasAny(normalized, ['gratis', 'salir gratis', 'plan gratis', 'aire libre', 'plaza'])) {
    return {
      intent: 'SALIR',
      category: 'aire-libre',
      label: 'aire-libre',
      mood: 'aire',
      action: 'execute',
    };
  }

  if (inferredIntent === 'COCINAR') {
    return {
      intent: 'COCINAR',
      category: 'comida',
      label: 'comida',
      action: 'execute',
    };
  }

  if (inferredIntent === 'COMPRAR') {
    return {
      intent: 'COMPRAR',
      category: 'comer-barato',
      label: 'comer-barato',
      mood: 'sin-plata',
      action: 'execute',
    };
  }

  if (inferredIntent === 'PELI') {
    return {
      intent: 'PELI',
      category: 'pelicula',
      label: 'pelicula',
      action: 'execute',
    };
  }

  if (inferredIntent === 'MUSICA') {
    return {
      intent: 'MUSICA',
      category: 'musica',
      label: 'musica',
      action: 'execute',
    };
  }

  if (inferredIntent === 'JUEGO') {
    return {
      intent: 'JUEGO',
      category: 'juegos',
      label: 'juegos',
      action: 'execute',
    };
  }

  return {
    intent: inferredIntent,
    category: mapIntentToCategory(inferredIntent),
    label: null,
    action: 'decision',
  };
}

function executeWithBrain(text, target) {
  const normalized = normalize(text);

  updateContext({
    intent: target?.intent,
    category: target?.category,
    action: 'execute',
    options: [],
  });

  if (target?.intent === 'COMPRAR' || shouldShowBusiness(target?.intent, text)) {
    return buildResponseFromSuggestions({
      input: text,
      category: target?.category || 'comer-barato',
      mood: target?.mood || 'sin-plata',
      label: target?.label || 'comer-barato',
      intro: 'Listo. Si la idea es comprar, acá sí miro negocios locales:\n\n',
      appendBusinesses: true,
      suggestions: ['Otra opción', 'Cocinar algo', 'Algo gratis', 'Algo en casa'],
    });
  }

  if (target?.intent === 'COCINAR') {
    updateContext({
      intent: 'COCINAR',
      category: 'comida',
      action: 'clarifying',
      options: ['Arroz', 'Fideos', 'Harina', 'Papa', 'Escribo lo que tengo'],
    });

    return {
      text: 'Bien. ¿Qué tenés en casa? Podés escribirlo.',
      results: [],
      suggestions: ['Arroz', 'Fideos', 'Harina', 'Papa', 'Escribo lo que tengo'],
      intent: 'cocinar-clarify',
      category: 'comida',
    };
  }

  if (target?.intent === 'PELI') {
    return movieOptionsResponse();
  }

  if (target?.intent === 'MUSICA') {
    return musicOptionsResponse();
  }

  if (target?.intent === 'JUEGO') {
    return buildResponseFromSuggestions({
      input: text,
      category: 'juegos',
      mood: null,
      label: 'juegos',
      intro: 'Vamos con juegos simples, baratos y sin vueltas:\n\n',
      appendBusinesses: false,
      suggestions: ['Otro juego', 'Modo luchón/a', 'Algo en casa', 'Con amigos'],
    });
  }

  if (target?.category) {
    return buildResponseFromSuggestions({
      input: text,
      category: target.category,
      mood: target.mood || null,
      label: target.label || target.category,
      intro: buildIntentIntro(target.label || target.category, normalized),
      appendBusinesses: false,
      suggestions: ['Otra idea', 'Algo en casa', 'Comer barato', 'Aire libre'],
    });
  }

  // 🔴 ESTE ES EL ÚNICO RETURN FINAL
  return processMessageInternal(text);
}

function recipeFromIngredientsResponse(text) {
  const normalized = normalize(text || '');
  const ingredients = normalized.split(' ').filter(Boolean);

  const recipes = (getRecetasArray() || []).filter(Boolean);

  if (!recipes.length) {
    return {
      text: 'Todavía no tengo recetas cargadas para eso. Probá con algo como arroz, harina o huevo.',
      results: [],
      suggestions: ['Arroz', 'Harina', 'Huevo', 'Otra idea'],
      intent: 'cocinar-clarify',
      category: 'comida',
    };
  }

  const scored = recipes
    .map((recipe) => {
      const haystack = normalize([
        getRecipeName(recipe),
        recipe?.descripcion,
        recipe?.description,
        recipe?.tip,
        ...(Array.isArray(recipe?.ingredientes) ? recipe.ingredientes : []),
        ...(Array.isArray(recipe?.tags) ? recipe.tags : []),
      ].join(' '));

      const score = ingredients.reduce((acc, ing) => {
        return haystack.includes(ing) ? acc + 1 : acc;
      }, 0);

      return { recipe, score };
    })
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (!scored.length) {
    return {
      text: 'Con eso no encontré una receta clara. Probá con algo como arroz, huevo, papa o harina.',
      results: [],
      suggestions: ['Arroz', 'Fideos', 'Harina', 'Papa'],
      intent: 'cocinar-clarify',
      category: 'comida',
    };
  }

  let textResp = 'Con eso, podés hacer:\n\n';

  scored.forEach(({ recipe }, index) => {
    textResp += `${index + 1}. **${getRecipeName(recipe)}** — ${getRecipeTip(recipe)}\n`;
  });

  textResp += '\n¿Querés que te diga cómo hacer una?';

  updateContext({
    intent: 'COCINAR',
    category: 'comida',
    action: 'execute',
    options: scored.map(r => getRecipeName(r.recipe)),
  });

  return {
    text: textResp,
    results: [],
    suggestions: scored.map(r => getRecipeName(r.recipe)),
    intent: 'receta-por-ingredientes',
    category: 'comida',
  };
}

function processMessageWithBrain(text) {
  const analysis = analyzeMessage(text);
  const inferredIntent = inferIntentFromContext(analysis.intent, text);
  const target = resolveExecutionTarget(text, inferredIntent);

  const directSelectedDetail =
    findRecipeByText(text) ||
    findMovieByText(text) ||
    findBandByText(text);

  if (directSelectedDetail) {
    return processMessageInternal(text);
  }
const ctx = getContext();

if (ctx.lastAction === 'clarifying' && ctx.lastIntent === 'COCINAR') {
  return recipeFromIngredientsResponse(text);
}
  
  const isFirstInteraction = !ctx.lastAction;

  // 🧠 1. PRIMER MENSAJE → SIEMPRE PREGUNTA
  if (isFirstInteraction) {
    return makeDecisionResponse(text, inferredIntent, analysis);
  }

  // 🧠 2. SI HAY DECISIÓN ABIERTA → EJECUTAR
  if (isDecisionOpen() && target?.action === 'execute') {
    return executeWithBrain(text, target);
  }

  // 🧠 3. SI NO ESTÁ CLARO → SEGUIR PREGUNTANDO
  if (shouldAsk(inferredIntent, text)) {
    return makeDecisionResponse(text, inferredIntent, analysis);
  }

  // 🧠 4. SOLO EJECUTAR SI VIENE DE DECISIÓN
  if (target?.action === 'execute' && ctx.lastAction === 'decision') {
    return executeWithBrain(text, target);
  }

  return processMessageInternal(text);
}
// ---------------- FLUJOS GUIADOS ----------------

function welcomeResponse() {
  return {
    text: "Buenas! Buscando que hacer hoy?\nAcá te dejo algunas opciones:",
    results: [],
    suggestions: ["No tengo un mango", "Plan en pareja", "Algo en casa", "Aire libre"],
    intent: 'welcome',
    category: 'inicio',
  };
}

function homeOptionsResponse() {
  return {
    text: "Crocante.\n¿Por dónde vamos?",
    results: [],
    suggestions: ["Cocinamos algo", "Buscamos una peli", "Escuchamos música"],
    intent: 'casa',
    category: 'casa',
  };
}

function shortClarifierResponse() {
  return {
    text: "No te sigo del todo.\n¿Querés algo para comer, salir o quedarte en casa?",
    results: [],
    suggestions: ["Comer", "Salir", "Casa", "Aire libre"],
    intent: 'clarifier',
    category: 'clarifier',
  };
}

function recipeOptionsResponse() {
  const recipes = shuffle(getRecetasArray()).slice(0, 3);
  const suggestions = recipes.map(getRecipeName);

  return {
    text: "Te tiro 3 recetas simples:",
    results: [],
    suggestions,
    intent: 'receta-opciones',
    category: 'comida',
  };
}

function movieOptionsResponse() {
  const movies = shuffle(PELICULAS).slice(0, 3);
  const suggestions = movies.map(getMovieTitle);

  return {
    text: "Van 3 para ver sin ponerse dramático:",
    results: [],
    suggestions,
    intent: 'peli-opciones',
    category: 'pelicula',
  };
}

function musicOptionsResponse() {
  const bands = shuffle(BANDAS).slice(0, 3);
  const suggestions = bands.map(getBandName);

  return {
    text: "Te tiro 3 opciones para poner de fondo:",
    results: [],
    suggestions,
    intent: 'musica-opciones',
    category: 'musica',
  };
}

function recipeDetailResponse(recipe) {
  const name = getRecipeName(recipe);
  const ingredients = recipe?.ingredientes?.slice?.(0, 6)?.join(', ');

  let text = `Para hacer **${name}**:\n\n`;

  if (ingredients) {
    text += `Ingredientes principales: ${ingredients}.\n\n`;
  }

  if (recipe?.pasos && Array.isArray(recipe.pasos)) {
    recipe.pasos.slice(0, 5).forEach((step, index) => {
      text += `${index + 1}. ${step}\n`;
    });
  } else {
    text += `1. Prepará los ingredientes básicos.\n`;
    text += `2. Mezclá y cociná a fuego medio o según corresponda.\n`;
    text += `3. Probá, ajustá sal y serví simple.\n`;
  }

  text += `\nTip: ${getRecipeTip(recipe)}`;

  return {
    text,
    results: [],
    suggestions: ["Otra receta", "Buscamos una peli", "Algo en casa"],
    intent: 'receta-detalle',
    category: 'comida',
  };
}

function movieDetailResponse(movie) {
  const title = getMovieTitle(movie);

  return {
    text: `Buena elección: **${title}**.\nPlan ideal: algo para picar, sillón y cero esfuerzo.`,
    results: [],
    suggestions: ["Otra peli", "Algo tranqui", "Algo en casa"],
    intent: 'peli-detalle',
    category: 'pelicula',
  };
}

function musicDetailResponse(band) {
  const name = getBandName(band);

  return {
    text: `Mandale **${name}**.\nIdeal para levantar el clima sin pensar demasiado.`,
    results: [],
    suggestions: ["Otra banda", "Ver peli", "Algo en casa"],
    intent: 'musica-detalle',
    category: 'musica',
  };
}

function findRecipeByText(text) {
  const normalized = normalize(text);

  return getRecetasArray().find((recipe) => {
    const name = normalize(getRecipeName(recipe));
    return normalized.includes(name) || name.includes(normalized);
  });
}

function findMovieByText(text) {
  const normalized = normalize(text);

  return PELICULAS.find((movie) => {
    const title = normalize(getMovieTitle(movie));
    return normalized.includes(title) || title.includes(normalized);
  });
}

function findBandByText(text) {
  const normalized = normalize(text);

  return BANDAS.find((band) => {
    const name = normalize(getBandName(band));
    return normalized.includes(name) || name.includes(normalized);
  });
}

// ---------------- INTENCIÓN CROCANTE ----------------

function detectLocalIntent(text) {
  const normalized = normalize(text);

  // Orden importante: "comer barato" antes de "salir" o "comer".
  if (
    hasAny(normalized, [
      'no tengo un mango',
      'sin plata',
      'barato',
      'barata',
      'no tengo plata',
      'estoy seco',
      'ando seco',
      'poca plata',
      'economico',
      'económico',
      'comer barato',
      'morfar barato',
    ])
  ) {
    return { category: 'comer-barato', mood: 'sin-plata', label: 'comer-barato' };
  }

  if (
    hasAny(normalized, [
      'aire libre',
      'afuera',
      'salida aire libre',
      'plaza',
      'caminar afuera',
      'caminar',
      'paseo',
      'parque',
      'mate afuera',
    ])
  ) {
    return { category: 'aire-libre', mood: 'aire', label: 'aire-libre' };
  }

  if (
    hasAny(normalized, [
      'evento',
      'eventos',
      'feria',
      'festival',
      'recital',
      'actividad',
      'actividades',
      'finde',
      'fin de semana',
      'hoy a la noche',
    ])
  ) {
    return { category: 'san-luis', mood: 'aire', label: 'san-luis' };
  }

  if (
    hasAny(normalized, [
      'fiaca',
      'paja',
      'cansado',
      'cansada',
      'aburrido',
      'aburrida',
      'tirado',
      'tirada',
      'no quiero hacer nada',
      'tranqui',
      'algo tranquilo',
    ])
  ) {
    return { category: 'alta-fiaca', mood: 'fiaca', label: 'alta-fiaca' };
  }

  if (
    hasAny(normalized, [
      'hijos',
      'hijas',
      'niños',
      'ninos',
      'chicos',
      'chicas',
      'pibes',
      'pibas',
      'nenes',
      'nenas',
      'criaturas',
      'familia',
    ])
  ) {
    return { category: 'modo-luchon', mood: 'familia', label: 'modo-luchon' };
  }

  if (
    hasAny(normalized, [
      'amigos',
      'amigas',
      'juntada',
      'juntarnos',
      'previa',
      'grupo',
      'banda',
      'compas',
    ])
  ) {
    return { category: 'amigos', mood: 'amigos', label: 'amigos' };
  }

  if (
    hasAny(normalized, [
      'juego',
      'jugar',
      'cartas',
      'truco',
      'generala',
      'batalla naval',
      'challenge',
      'desafio',
      'desafío',
      'reto',
    ])
  ) {
    return {
      category:
        normalized.includes('challenge') ||
        normalized.includes('desafio') ||
        normalized.includes('desafío') ||
        normalized.includes('reto')
          ? 'challenge'
          : 'juegos',
      mood: null,
      label: 'juegos',
    };
  }

  if (
    hasAny(normalized, [
      'comer',
      'hambre',
      'cocinar',
      'receta',
      'cena',
      'almuerzo',
      'merienda',
      'algo rico',
      'salir a comer',
    ])
  ) {
    return { category: 'comida', mood: null, label: 'comida' };
  }

  if (
    hasAny(normalized, [
      'peli',
      'pelicula',
      'película',
      'netflix',
      'youtube',
      'mirar algo',
      'cine',
    ])
  ) {
    return { category: 'pelicula', mood: null, label: 'pelicula' };
  }

  if (
    hasAny(normalized, [
      'musica',
      'música',
      'cancion',
      'canción',
      'playlist',
      'escuchar',
      'banda',
    ])
  ) {
    return { category: 'musica', mood: null, label: 'musica' };
  }

  if (
    hasAny(normalized, [
      'ejercicio',
      'entrenar',
      'moverme',
      'rutina',
      'actividad fisica',
      'actividad física',
    ])
  ) {
    return { category: 'ejercicio', mood: 'moverme', label: 'ejercicio' };
  }

  if (
    hasAny(normalized, [
      'salir',
      'san luis',
      'potrero',
      'la punta',
      'juana koslay',
      'volcan',
      'volcán',
      'trapiche',
    ])
  ) {
    return { category: 'san-luis', mood: 'aire', label: 'san-luis' };
  }

  return { category: null, mood: null, label: null };
}

function buildIntentIntro(intentLabel, normalized) {
  if (intentLabel === 'comer-barato') {
    return "Modo crocante activado. Vamos a resolver sin gastar de más.\n\n";
  }

  if (intentLabel === 'aire-libre') {
    return "Salida al aire libre detectada. Nada de encerrarse mirando el techo.\n\n";
  }

  if (intentLabel === 'alta-fiaca') {
    return "Nivel fiaca detectado. No te voy a exigir heroísmo, apenas sobrevivir con dignidad.\n\n";
  }

  if (intentLabel === 'modo-luchon') {
    return "Modo luchón/a activado. Ideas para entretener a los chicos sin vaciar la billetera.\n\n";
  }

  if (intentLabel === 'amigos') {
    return "Plan con amigos/as, versión simple y sin vender un riñón.\n\n";
  }

  if (intentLabel === 'juegos') {
    return "Vamos con juegos simples, de esos que no necesitan producción de Netflix.\n\n";
  }

  if (intentLabel === 'comida') {
    return "Vamos por algo para comer, simple y crocante.\n\n";
  }

  if (intentLabel === 'pelicula') {
    return "Plan sillón detectado. Van opciones para mirar sin ponerse profundo.\n\n";
  }

  if (intentLabel === 'musica') {
    return "Vamos con música para levantar el clima.\n\n";
  }

  if (intentLabel === 'ejercicio') {
    return "Vamos a mover un poco el cuerpo sin pagar gimnasio.\n\n";
  }

  if (intentLabel === 'san-luis') {
    return "Vamos con algo para hacer en San Luis sin complicarla.\n\n";
  }

  if (normalized.includes("no se") || normalized.includes("que hago")) {
    return "Tranqui, nos pasa a todos. Te tiro opciones crocantes.\n\n";
  }

  if (normalized.includes("aburrido") || normalized.includes("aburrida")) {
    return "Ese estado es peligroso: terminás scrolleando dos horas. Mejor esto.\n\n";
  }

  return "";
}

function getIntentSuggestions({ category, mood, query, limit = 8 }) {
  let raw = getRandomSuggestions({ category, mood, query, limit });

  // Si pide aire libre y no hay suficiente, mezclamos san-luis.
  if (category === 'aire-libre' && raw.length < 3) {
    raw = [
      ...raw,
      ...getRandomSuggestions({ category: 'san-luis', mood: 'aire', query, limit }),
    ];
  }

  // Si pide san-luis y no hay suficiente, mezclamos aire-libre.
  if (category === 'san-luis' && raw.length < 3) {
    raw = [
      ...raw,
      ...getRandomSuggestions({ category: 'aire-libre', mood: 'aire', query, limit }),
    ];
  }

  return uniqueByKey(raw, (item) => item.id).slice(0, limit);
}

function buildResponseFromSuggestions({
  input,
  category,
  mood,
  label,
  intro,
  limit = 3,
  appendBusinesses = false,
  suggestions = ["Otra idea", "Comer barato", "Algo en casa", "Juegos", "Modo luchón/a", "Aire libre"],
}) {
let raw = getIntentSuggestions({
  category,
  mood,
  query: input,
  limit: 8,
});

const normalizedInput = normalize(input);

function itemHas(item, words = []) {
  const haystack = normalize([
    item?.title,
    item?.description,
    item?.category,
    item?.mood,
    item?.location,
    ...(item?.tags || []),
  ].join(' '));

  return words.some(word => haystack.includes(normalize(word)));
}

// Comer / cocinar → solo comida o recetas
if (
  normalizedInput.includes('comer') ||
  normalizedInput.includes('cocinar') ||
  normalizedInput.includes('hambre') ||
  normalizedInput.includes('receta')
) {
  raw = raw.filter(item =>
    itemHas(item, ['comida', 'receta', 'cocina', 'comer', 'almuerzo', 'cena', 'merienda'])
  );
}

// Casa → solo planes de casa
if (
  normalizedInput.includes('casa') ||
  normalizedInput.includes('adentro') ||
  normalizedInput.includes('quedarme')
) {
  raw = raw.filter(item =>
    itemHas(item, ['casa', 'adentro', 'sillon', 'sillón', 'hogar'])
  );
}

// Aire libre / salir → solo planes afuera
if (
  normalizedInput.includes('salir') ||
  normalizedInput.includes('calle') ||
  normalizedInput.includes('afuera') ||
  normalizedInput.includes('aire libre') ||
  normalizedInput.includes('plaza')
) {
  raw = raw.filter(item =>
    itemHas(item, ['aire libre', 'afuera', 'plaza', 'salida', 'caminar', 'paseo'])
  );
}

// Chicos / familia
if (
  normalizedInput.includes('chicos') ||
  normalizedInput.includes('niños') ||
  normalizedInput.includes('ninos') ||
  normalizedInput.includes('familia')
) {
  raw = raw.filter(item =>
    itemHas(item, ['chicos', 'niños', 'ninos', 'familia', 'infantil'])
  );
}

// Amigos
if (
  normalizedInput.includes('amigos') ||
  normalizedInput.includes('juntada') ||
  normalizedInput.includes('grupo')
) {
  raw = raw.filter(item =>
    itemHas(item, ['amigos', 'juntada', 'grupo'])
  );
}

// Pareja
if (
  normalizedInput.includes('pareja') ||
  normalizedInput.includes('de a dos')
) {
  raw = raw.filter(item =>
    itemHas(item, ['pareja', 'de a dos', 'cita'])
  );
}

// Si el filtro dejó todo vacío, volvemos al resultado original
if (!raw.length) {
  raw = getIntentSuggestions({
    category,
    mood,
    query: input,
    limit: 8,
  });
}
  let items = raw
    .filter((item) => !lastSuggestions.includes(item.id))
    .slice(0, limit);

  if (items.length === 0) {
    items = raw.slice(0, limit);
  }

  lastSuggestions = items.map((item) => item.id);

  let textResp = intro || buildIntentIntro(label, normalize(input));

  if (items.length > 0) {
    textResp += "Mirá esto:\n\n";

    items.forEach((item, idx) => {
      textResp += `${getSuggestionText(item, idx)}\n`;
    });
  } else {
    textResp += "No tengo buenas opciones cargadas para eso todavía.\n\n";
    textResp += "Cargá contenido desde Admin → Base AIA con tags claros y empieza a aparecer acá.\n";
  }

  textResp += "\n¿Querés que lo ajuste a casa, calle, chicos/as, amigos o cero plata?";

  if (appendBusinesses) {
    textResp = appendBusinessBlock(textResp, label || category);
  }

  return {
    text: textResp,
    results: [],
    suggestions,
    intent: label || category || 'fallback-local',
    category,
  };
}

// ---------------- FALLBACK INTELIGENTE FINAL ----------------

function buildLocalSuggestions(text) {
  const normalized = normalize(text);
  let { category, mood, label } = detectLocalIntent(text);
  const hour = new Date().getHours();

  if (!category) {
    if (hour >= 20) {
      category = 'pelicula';
      label = 'pelicula';
    } else if (hour >= 18) {
      category = 'comida';
      label = 'comida';
    } else if (hour < 12) {
      category = 'comida';
      label = 'comida';
    } else {
      category = 'san-luis';
      mood = 'aire';
      label = 'san-luis';
    }
  }

  return buildResponseFromSuggestions({
    input: text,
    category,
    mood,
    label,
    intro: buildIntentIntro(label, normalized),
    appendBusinesses: false,
  });
}

// ---------------- ENGINE INTERNO ----------------

function processMessageInternal(text) {
  const normalized = normalize(text);

  const selectedRecipe = findRecipeByText(text);
  if (selectedRecipe) return recipeDetailResponse(selectedRecipe);

  const selectedMovie = findMovieByText(text);
  if (selectedMovie) return movieDetailResponse(selectedMovie);

  const selectedBand = findBandByText(text);
  if (selectedBand) return musicDetailResponse(selectedBand);

  if (
    normalized.includes("hola") ||
    normalized.includes("buenas") ||
    normalized.includes("inicio") ||
    normalized.includes("empezar")
  ) {
    return welcomeResponse();
  }

  if (
    normalized.includes("algo en casa") ||
    normalized === "casa" ||
    normalized.includes("quedarme en casa") ||
    normalized.includes("no quiero salir")
  ) {
    return homeOptionsResponse();
  }

  if (
    normalized.includes("cocinamos") ||
    normalized.includes("cocinar") ||
    normalized.includes("receta") ||
    normalized.includes("comer en casa")
  ) {
    return recipeOptionsResponse();
  }

  if (
    normalized.includes("buscamos una peli") ||
    normalized.includes("ver peli") ||
    normalized.includes("peli") ||
    normalized.includes("pelicula")
  ) {
    return movieOptionsResponse();
  }

  if (
    normalized.includes("escuchamos musica") ||
    normalized.includes("musica") ||
    normalized.includes("banda")
  ) {
    return musicOptionsResponse();
  }

  const detected = detectLocalIntent(text);

if (detected.label === 'aire-libre') {
  return makeDecisionResponse(text, 'SALIR', analyzeMessage(text));
}

if (detected.label === 'san-luis') {
  return makeDecisionResponse(text, 'SALIR', analyzeMessage(text));
}

if (detected.label === 'alta-fiaca') {
  return makeDecisionResponse(text, 'ABURRIDO', analyzeMessage(text));
}
if (detected.label === 'comer-barato') {
  return makeDecisionResponse(text, 'COMER', analyzeMessage(text));
}

if (detected.label === 'modo-luchon') {
  return makeDecisionResponse(text, 'CASA', analyzeMessage(text));
}

  if (detected.label === 'juegos') {
    return buildResponseFromSuggestions({
      input: text,
      category: 'juegos',
      mood: null,
      label: 'juegos',
      intro: "Vamos con juegos simples, baratos y sin vueltas:\n\n",
      appendBusinesses: false,
      suggestions: ["Otro juego", "Modo luchón/a", "Algo en casa", "Con amigos"],
    });
  }

  if (detected.label === 'amigos') {
    return buildResponseFromSuggestions({
      input: text,
      category: 'amigos',
      mood: 'amigos',
      label: 'amigos',
      intro: buildIntentIntro('amigos', normalized),
      appendBusinesses: false,
      suggestions: ["Aire libre", "Comer barato", "Juegos", "Otra idea"],
    });
  }

  if (detected.label === 'comida') {
    return buildResponseFromSuggestions({
      input: text,
      category: 'comida',
      mood: null,
      label: 'comida',
      intro: "¿Querés cocinar o comprar algo hecho?\n\n",
      appendBusinesses: false,
      suggestions: ["Cocinamos algo", "Comprar comida", "Comer barato", "Otra receta"],
    });
  }

  if (detected.label === 'pelicula') {
    return movieOptionsResponse();
  }

  if (detected.label === 'musica') {
    return musicOptionsResponse();
  }

  if (detected.label === 'ejercicio') {
    return buildResponseFromSuggestions({
      input: text,
      category: 'ejercicio',
      mood: 'moverme',
      label: 'ejercicio',
      intro: buildIntentIntro('ejercicio', normalized),
      appendBusinesses: false,
      suggestions: ["Aire libre", "Algo en casa", "Caminar", "Otra idea"],
    });
  }

  if (normalized.includes("plan en pareja") || normalized.includes("pareja")) {
    return buildResponseFromSuggestions({
      input: text,
      category: 'san-luis',
      mood: 'aire',
      label: 'pareja',
      intro: "Bien. Plan de a dos, sin complicarla.\n\n",
      appendBusinesses: false,
      suggestions: ["Aire libre", "Comer barato", "Algo en casa", "Otra idea"],
    });
  }

  if (
    normalized.includes("no entiendo") ||
    normalized.includes("no se") ||
    normalized.includes("que hago") ||
    normalized.length < 3
  ) {
    return shortClarifierResponse();
  }

  return buildLocalSuggestions(text);
}

// ---------------- ENGINE PÚBLICO ----------------

export function processMessage(text) {
  const response = processMessageWithBrain(text);
  safeTrackUserChat(text, response);
  return response;
}

// ---------------- OTROS ----------------

export function getCrocanteDelDia() {
  const idx = new Date().getDay() % CROCANTE_DEL_DIA.length;
  return CROCANTE_DEL_DIA[idx];
}

export function getFeaturedEmprendedores() {
  const aprobados = getApprovedBusinessesForIntent('comida', 3);

  if (aprobados.length) {
    return aprobados;
  }

  return EMPRENDEDORES.slice(0, 3);
}

export { DATA, RECETAS, LOCALIDADES_SL };
