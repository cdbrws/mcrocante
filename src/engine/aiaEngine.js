import { DATA, CROCANTE_DEL_DIA, EMPRENDEDORES } from '../data/places';
import { LOCALIDADES_SL } from '../data/localidades';
import { RECETAS } from '../data/recetas';
import { PELICULAS, BANDAS } from '../data/aiaData';
import { getRandomSuggestions } from '../data/suggestions';
import { getNegociosAprobados } from '../utils/solicitudes';
import { trackChat } from '../utils/adminStats';

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

function shuffle(arr) {
  const s = [...(arr || [])];
  for (let i = s.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [s[i], s[j]] = [s[j], s[i]];
  }
  return s;
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

function businessMatchesTags(business, keywords = []) {
  const haystack = normalize([
    business?.nombre,
    business?.rubro,
    business?.zona,
    business?.desc,
    business?.descripcion,
    ...(business?.tags || [])
  ].join(' '));

  return keywords.some((keyword) => haystack.includes(normalize(keyword)));
}

function getApprovedBusinessesForIntent(intentLabel, limit = 3) {
  let negocios = [];

  try {
    negocios = getNegociosAprobados();
  } catch {
    negocios = [];
  }

  if (!Array.isArray(negocios) || negocios.length === 0) return [];

  const map = {
    'comer-barato': ['comida', 'pizza', 'lomo', 'hamburguesa', 'empanada', 'barato', 'promo', 'minuta', 'cafe'],
    comida: ['comida', 'pizza', 'lomo', 'hamburguesa', 'empanada', 'sushi', 'pasta', 'minuta', 'cafe'],
    amigos: ['bar', 'comida', 'pizza', 'hamburguesa', 'lomo', 'cafe', 'helado', 'juntada'],
    'modo-luchon': ['familia', 'niños', 'chicos', 'helado', 'plaza', 'actividad', 'merienda'],
    'san-luis': ['san luis', 'actividad', 'turismo', 'salida', 'local', 'paseo'],
    pareja: ['cafe', 'bar', 'helado', 'comida', 'salida'],
    noche: ['bar', 'comida', 'pizza', 'lomo', 'hamburguesa']
  };

  const keywords = map[intentLabel] || [];

  const sponsors = negocios.filter((n) => n.sponsor || n.destacado);
  const matched = negocios.filter((n) => businessMatchesTags(n, keywords));

  const pool = [
    ...sponsors.filter((n) => businessMatchesTags(n, keywords)),
    ...matched,
    ...sponsors,
    ...negocios
  ];

  const unique = [];
  const seen = new Set();

  pool.forEach((business) => {
    const id = String(business.id || getBusinessName(business));
    if (!seen.has(id)) {
      seen.add(id);
      unique.push(business);
    }
  });

  return shuffle(unique).slice(0, limit);
}

function appendBusinessBlock(text, intentLabel) {
  const businesses = getApprovedBusinessesForIntent(intentLabel, 3);

  if (!businesses.length) return text;

  let next = `${text}\n\nNegocios locales que podrían servirte:\n`;

  businesses.forEach((business, index) => {
    const sponsorTag = business.sponsor ? ' ⭐ sponsor' : business.destacado ? ' destacado' : '';
    next += `${index + 1}. **${getBusinessName(business)}**${sponsorTag} — ${getBusinessDescription(business)}`;
    if (business.zona) next += ` (${business.zona})`;
    next += '\n';
  });

  next += '\nDato crocante: si el negocio tiene promo real, después lo hacemos aparecer mejor. Sin humo.';

  return next;
}

function safeTrackUserChat(input, response) {
  try {
    trackChat(input, response?.intent, response?.results || [], response?.category || response?.intent || null);
  } catch {}
}

// memoria simple anti-repetición
let lastSuggestions = [];

// ---------------- FLUJOS GUIADOS ----------------

function welcomeResponse() {
  return {
    text: "Buenas! Buscando que hacer hoy?\nAcá te dejo algunas opciones:",
    results: [],
    suggestions: ["No tengo un mango", "Plan en pareja", "Algo en casa"],
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
    suggestions: ["Comer", "Salir", "Casa"],
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
  const hasAny = (words) => words.some((word) => normalized.includes(normalize(word)));

  if (
    hasAny([
      'no tengo un mango',
      'sin plata',
      'gratis',
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
    hasAny([
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
    hasAny([
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
    hasAny([
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
    hasAny([
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
    hasAny([
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
    hasAny([
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
    hasAny([
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
    hasAny([
      'ejercicio',
      'entrenar',
      'moverme',
      'caminar',
      'rutina',
      'actividad fisica',
      'actividad física',
    ])
  ) {
    return { category: 'ejercicio', mood: 'moverme', label: 'ejercicio' };
  }

  if (
    hasAny([
      'salir',
      'afuera',
      'aire libre',
      'paseo',
      'plaza',
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
      category = 'casa';
      label = 'casa';
    }
  }

  const intro = buildIntentIntro(label, normalized);
  const raw = getRandomSuggestions({ category, mood, limit: 8 });

  let items = raw
    .filter((item) => !lastSuggestions.includes(item.id))
    .slice(0, 3);

  if (items.length === 0) {
    items = raw.slice(0, 3);
  }

  lastSuggestions = items.map((item) => item.id);

  let textResp = intro + "Mirá esto:\n\n";

  items.forEach((item, idx) => {
    textResp += `${idx + 1}. **${item.title}** — ${item.description}\n`;
  });

  textResp += "\n¿Querés que lo ajuste a casa, calle, chicos/as o cero plata?";

  textResp = appendBusinessBlock(textResp, label);

  return {
    text: textResp,
    results: [],
    suggestions: ["Otra idea", "Comer barato", "Algo en casa", "Juegos", "Modo luchón/a"],
    intent: label || 'fallback-local',
    category,
  };
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

  if (normalized.includes("fiaca")) {
    const raw = getRandomSuggestions({ category: 'alta-fiaca', mood: 'fiaca', limit: 4 });
    const suggestions = raw.slice(0, 3).map((item) => item.title);

    return {
      text: "Alta fiaca. Te dejo opciones de mínimo esfuerzo:",
      results: [],
      suggestions: suggestions.length ? suggestions : ["Buscamos una peli", "Cocinamos algo", "Escuchamos música"],
      intent: 'alta-fiaca',
      category: 'alta-fiaca',
    };
  }

  if (
    normalized.includes("no tengo un mango") ||
    normalized.includes("sin plata") ||
    normalized.includes("gratis") ||
    normalized.includes("no tengo plata") ||
    normalized.includes("estoy seco")
  ) {
    const raw = getRandomSuggestions({ category: 'comer-barato', mood: 'sin-plata', limit: 4 });
    const suggestions = raw.slice(0, 3).map((item) => item.title);

    return {
      text: appendBusinessBlock("Perfecto. Vamos sin gastar de más.", 'comer-barato'),
      results: [],
      suggestions: suggestions.length ? suggestions : ["Salir gratis", "Algo en casa", "Mate en plaza"],
      intent: 'comer-barato',
      category: 'comer-barato',
    };
  }

  if (
    normalized.includes("modo luchon") ||
    normalized.includes("modo luchón") ||
    normalized.includes("con chicos") ||
    normalized.includes("con mis hijos") ||
    normalized.includes("con los chicos") ||
    normalized.includes("niños") ||
    normalized.includes("ninos")
  ) {
    const raw = getRandomSuggestions({ category: 'modo-luchon', mood: 'familia', limit: 4 });
    const suggestions = raw.slice(0, 3).map((item) => item.title);

    return {
      text: appendBusinessBlock("Modo luchón/a activado. Vamos con planes para chicos/as sin gastar:", 'modo-luchon'),
      results: [],
      suggestions: suggestions.length ? suggestions : ["Búsqueda del tesoro casera", "Dibujar con lo que haya", "Ver dibujitos gratis"],
      intent: 'modo-luchon',
      category: 'modo-luchon',
    };
  }

  if (
    normalized.includes("juegos") ||
    normalized.includes("jugar") ||
    normalized.includes("truco") ||
    normalized.includes("generala") ||
    normalized.includes("batalla naval")
  ) {
    const raw = getRandomSuggestions({ category: 'juegos', limit: 4 });
    const suggestions = raw.slice(0, 3).map((item) => item.title);

    return {
      text: "Vamos con juegos simples, baratos y sin vueltas:",
      results: [],
      suggestions: suggestions.length ? suggestions : ["Batalla naval en papel", "Truco", "Dígalo con mímica"],
      intent: 'juegos',
      category: 'juegos',
    };
  }

  if (normalized.includes("plan en pareja") || normalized.includes("pareja")) {
    return {
      text: appendBusinessBlock("Bien. Plan de a dos, sin complicarla.", 'pareja'),
      results: [],
      suggestions: ["Salir barato", "Algo en casa", "Caminata"],
      intent: 'pareja',
      category: 'pareja',
    };
  }

  if (normalized.includes("comer")) {
    return {
      text: appendBusinessBlock("¿Querés cocinar o salir a comer?", 'comida'),
      results: [],
      suggestions: ["Cocinamos algo", "Salir a comer", "Comer barato"],
      intent: 'comer',
      category: 'comida',
    };
  }

  if (normalized.includes("salir")) {
    return {
      text: appendBusinessBlock("Dale. ¿Qué tipo de salida querés?", 'san-luis'),
      results: [],
      suggestions: ["Gratis", "Cerca mio", "Aire libre"],
      intent: 'salir',
      category: 'san-luis',
    };
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
  const response = processMessageInternal(text);
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
