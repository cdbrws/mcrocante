import { DATA, CROCANTE_DEL_DIA, EMPRENDEDORES } from '../data/places';
import { LOCALIDADES_SL } from '../data/localidades';
import { RECETAS } from '../data/recetas';
import { PELICULAS, BANDAS, PLANCHILL, ACTIVIDADES_LLUVIA, ACTIVIDADES_NOCHE, ACTIVIDADES_PAREJA } from '../data/aiaData';
import { getRandomSuggestions } from '../data/suggestions';

// ---------------- UTIL ----------------
function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function normalize(text) { return text.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); }
function shuffle(arr) { const s = [...arr]; for (let i = s.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [s[i], s[j]] = [s[j], s[i]]; } return s; }

// ---------------- NUEVO FALLBACK ----------------
function buildLocalSuggestions(text) {
  const normalized = normalize(text);

  let category = null;
  let mood = null;

  if (normalized.includes('mango') || normalized.includes('gratis') || normalized.includes('plata')) {
    category = 'gratis';
  }
  if (normalized.includes('comer') || normalized.includes('receta') || normalized.includes('hambre')) {
    category = 'comida';
  }
  if (normalized.includes('lluvia') || normalized.includes('llueve')) {
    mood = 'lluvia';
  }
  if (normalized.includes('pareja')) {
    category = 'pareja';
  }
  if (normalized.includes('peli') || normalized.includes('pelicula')) {
    category = 'pelicula';
  }
  if (normalized.includes('musica') || normalized.includes('banda')) {
    category = 'musica';
  }
  if (normalized.includes('ejercicio') || normalized.includes('mover') || normalized.includes('caminar')) {
    category = 'ejercicio';
  }
  if (normalized.includes('chicos') || normalized.includes('pibes') || normalized.includes('familia')) {
    category = 'chicos';
  }
  if (normalized.includes('san luis') || normalized.includes('salir') || normalized.includes('lugar')) {
    category = 'san-luis';
  }

  const hour = new Date().getHours();

  if (hour >= 20 && !category) {
    category = 'pelicula';
  }

  if (hour >= 18 && hour < 20 && !category) {
    category = 'comida';
  }

  if (hour < 12 && !category) {
    category = 'comida';
  }

  const items = getRandomSuggestions({ category, mood, limit: 4 });

  let textResp = "Mirá esto 👇 capaz te salva el rato:\n\n";

  items.forEach((item, idx) => {
    textResp += `${idx + 1}. **${item.title}** — ${item.description}\n`;
  });

  return {
    text: textResp,
    results: [],
    suggestions: ["Otra idea", "Algo distinto", "Más opciones"],
    intent: 'fallback-local'
  };
}

// ---------------- ENGINE ----------------
export function processMessage(text, weather) {
  const normalized = normalize(text);

  if (normalized.includes("hola") || normalized.includes("buenas")) {
    return {
      text: "Hola! 👋 Soy la AIA de San Luis. Decime que queres hacer.",
      results: [],
      suggestions: ["Sin un mango", "Comer", "Alta fiaca"]
    };
  }

  if (normalized.includes("fiaca")) {
    return {
      text: "Alta fiaca? quedate tranqui y mira algo o cocina algo rico.",
      results: [],
      suggestions: ["Ver peli", "Receta", "Musica"]
    };
  }

  if (normalized.includes("peli")) {
    const picks = shuffle(PELICULAS).slice(0, 3);
    return {
      text: picks.map(p => `🎬 ${p.titulo}`).join("\n"),
      results: [],
      suggestions: ["Otra peli"]
    };
  }

  if (normalized.includes("musica")) {
    const picks = shuffle(BANDAS).slice(0, 3);
    return {
      text: picks.map(b => `🎵 ${b.nombre}`).join("\n"),
      results: [],
      suggestions: ["Otra banda"]
    };
  }

  if (normalized.includes("receta") || normalized.includes("comer")) {
    const picks = shuffle(RECETAS).slice(0, 2);
    return {
      text: picks.map(r => `🍳 ${r.nombre}`).join("\n"),
      results: [],
      suggestions: ["Otra receta"]
    };
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
