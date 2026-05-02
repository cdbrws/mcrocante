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
  if (normalized.includes('comer') || normalized.includes('receta')) {
    category = 'comida';
  }
  if (normalized.includes('lluvia')) {
    mood = 'lluvia';
  }
  if (normalized.includes('pareja')) {
    category = 'pareja';
  }
  if (normalized.includes('peli')) {
    category = 'pelicula';
  }
  if (normalized.includes('musica')) {
    category = 'musica';
  }
  if (normalized.includes('ejercicio') || normalized.includes('mover')) {
    category = 'ejercicio';
  }

  const items = getRandomSuggestions({ category, mood, limit: 4 });

  let textResp = "Te tiro algunas ideas crocantes:\n\n";

  items.forEach((i, idx) => {
    textResp += `${idx + 1}. ${i.title} — ${i.description}\n`;
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

  // ---------------- EXISTENTE (NO TOCAR LOGICA PRINCIPAL) ----------------

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

  // ---------------- NUEVO FALLBACK INTELIGENTE ----------------

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
