import { DATA, CROCANTE_DEL_DIA, EMPRENDEDORES } from '../data/places';
import { LOCALIDADES_SL } from '../data/localidades';
import { RECETAS } from '../data/recetas';
import { PELICULAS, BANDAS } from '../data/aiaData';
import { getRandomSuggestions } from '../data/suggestions';

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
  const s = [...arr];
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

// memoria simple anti-repetición
let lastSuggestions = [];

// ---------------- FLUJOS GUIADOS ----------------
function welcomeResponse() {
  return {
    text: "Buenas! Buscando que hacer hoy?\nAcá te dejo algunas opciones:",
    results: [],
    suggestions: ["No tengo un mango", "Plan en pareja", "Algo en casa"],
    intent: 'welcome',
  };
}

function homeOptionsResponse() {
  return {
    text: "Crocante. ¿Por dónde vamos?",
    results: [],
    suggestions: ["Cocinamos algo", "Buscamos una peli", "Escuchamos música"],
    intent: 'casa',
  };
}

function shortClarifierResponse() {
  return {
    text: "No te sigo del todo. ¿Querés algo para comer, salir o quedarte en casa?",
    results: [],
    suggestions: ["Comer", "Salir", "Casa"],
    intent: 'clarifier',
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
  };
}

function movieDetailResponse(movie) {
  const title = getMovieTitle(movie);

  return {
    text: `Buena elección: **${title}**.\nPlan ideal: algo para picar, sillón y cero esfuerzo.`,
    results: [],
    suggestions: ["Otra peli", "Algo tranqui", "Algo en casa"],
    intent: 'peli-detalle',
  };
}

function musicDetailResponse(band) {
  const name = getBandName(band);

  return {
    text: `Mandale **${name}**. Ideal para levantar el clima sin pensar demasiado.`,
    results: [],
    suggestions: ["Otra banda", "Ver peli", "Algo en casa"],
    intent: 'musica-detalle',
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

// ---------------- FALLBACK INTELIGENTE FINAL ----------------
function buildLocalSuggestions(text) {
  const normalized = normalize(text);

  let category = null;
  let mood = null;

  if (normalized.includes('mango') || normalized.includes('gratis') || normalized.includes('plata')) category = 'gratis';
  if (normalized.includes('comer') || normalized.includes('receta') || normalized.includes('hambre')) category = 'comida';
  if (normalized.includes('lluvia') || normalized.includes('llueve')) mood = 'lluvia';
  if (normalized.includes('pareja')) category = 'pareja';
  if (normalized.includes('peli') || normalized.includes('pelicula')) category = 'pelicula';
  if (normalized.includes('musica') || normalized.includes('banda')) category = 'musica';
  if (normalized.includes('ejercicio') || normalized.includes('mover') || normalized.includes('caminar')) category = 'ejercicio';
  if (normalized.includes('chicos') || normalized.includes('pibes') || normalized.includes('familia')) category = 'chicos';
  if (normalized.includes('san luis') || normalized.includes('salir') || normalized.includes('lugar')) category = 'san-luis';

  const hour = new Date().getHours();

  if (!category) {
    if (hour >= 20) category = 'pelicula';
    else if (hour >= 18) category = 'comida';
    else if (hour < 12) category = 'comida';
  }

  let intro = "";

  if (normalized.includes("no se") || normalized.includes("que hago")) {
    intro = "Tranqui, nos pasa a todos.\n\n";
  }

  if (normalized.includes("aburrido")) {
    intro = "Ese es el peor estado 😅\n\n";
  }

  const raw = getRandomSuggestions({ category, mood, limit: 6 });

  let items = raw
    .filter((item) => !lastSuggestions.includes(item.id))
    .slice(0, 3);

  if (items.length === 0) {
    items = raw.slice(0, 3);
  }

  lastSuggestions = items.map((item) => item.id);

  let textResp = intro + "Mirá esto 👇 capaz te salva el rato:\n\n";

  items.forEach((item, idx) => {
    textResp += `${idx + 1}. **${item.title}** — ${item.description}\n`;
  });

  textResp += "\n¿Querés que lo adapte más a vos?";

  return {
    text: textResp,
    results: [],
    suggestions: ["Otra idea", "Comer", "Casa"],
    intent: 'fallback-local',
  };
}

// ---------------- ENGINE ----------------
export function processMessage(text) {
  const normalized = normalize(text);

  const selectedRecipe = findRecipeByText(text);
  if (selectedRecipe) {
    return recipeDetailResponse(selectedRecipe);
  }

  const selectedMovie = findMovieByText(text);
  if (selectedMovie) {
    return movieDetailResponse(selectedMovie);
  }

  const selectedBand = findBandByText(text);
  if (selectedBand) {
    return musicDetailResponse(selectedBand);
  }

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
    return {
      text: "Alta fiaca. ¿Querés resolverlo desde el sillón?",
      results: [],
      suggestions: ["Buscamos una peli", "Cocinamos algo", "Escuchamos música"],
      intent: 'fiaca',
    };
  }

  if (normalized.includes("no tengo un mango") || normalized.includes("sin plata") || normalized.includes("gratis")) {
    return {
      text: "Perfecto. Vamos sin gastar.",
      results: [],
      suggestions: ["Salir gratis", "Algo en casa", "Mate en plaza"],
      intent: 'gratis',
    };
  }

  if (normalized.includes("plan en pareja") || normalized.includes("pareja")) {
    return {
      text: "Bien. Plan de a dos, sin complicarla.",
      results: [],
      suggestions: ["Salir barato", "Algo en casa", "Caminata"],
      intent: 'pareja',
    };
  }

  if (normalized.includes("comer")) {
    return {
      text: "¿Querés cocinar o salir a comer?",
      results: [],
      suggestions: ["Cocinamos algo", "Salir a comer", "Comer barato"],
      intent: 'comer',
    };
  }

  if (normalized.includes("salir")) {
    return {
      text: "Dale. ¿Qué tipo de salida querés?",
      results: [],
      suggestions: ["Gratis", "Cerca mio", "Aire libre"],
      intent: 'salir',
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

// ---------------- OTROS ----------------
export function getCrocanteDelDia() {
  const idx = new Date().getDay() % CROCANTE_DEL_DIA.length;
  return CROCANTE_DEL_DIA[idx];
}

export function getFeaturedEmprendedores() {
  return EMPRENDEDORES.slice(0, 3);
}

export { DATA, RECETAS, LOCALIDADES_SL };
