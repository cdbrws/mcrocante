import { DATA, CROCANTE_DEL_DIA, EMPRENDEDORES } from '../data/places';
import { LOCALIDADES_SL } from '../data/localidades';
import { RECETAS } from '../data/recetas';
import { PELICULAS, BANDAS, PLANCHILL, ACTIVIDADES_LLUVIA, ACTIVIDADES_NOCHE, ACTIVIDADES_PAREJA } from '../data/aiaData';
import { SUGGESTIONS, getRandomSuggestions } from '../data/suggestions';

function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function normalize(text) { return text.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); }
function shuffle(arr) { const s = [...arr]; for (let i = s.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [s[i], s[j]] = [s[j], s[i]]; } return s; }

const INTENTS = {
  gratis: {
    keywords: [{ word: "gratis", weight: 3 }, { word: "sin un mango", weight: 3 }, { word: "sin plata", weight: 3 }, { word: "no tengo plata", weight: 3 }, { word: "no tengo un mango", weight: 3 }, { word: "barato", weight: 2 }],
    responses: ["Te muestro opciones gratis de San Luis. 🌟", "Aca hay un monton de cosas gratis. 🙌", "San Luis tiene planes que no cuestan nada. 🎯"],
    suggestions: ["Aire libre", "Naturaleza", "Planes gratis"]
  },
  comida: {
    keywords: [{ word: "comida", weight: 3 }, { word: "comer", weight: 3 }, { word: "hambre", weight: 2 }, { word: "rico", weight: 1 }, { word: "restaurante", weight: 2 }, { word: "empanada", weight: 2 }, { word: "parrilla", weight: 2 }, { word: "cafe", weight: 2 }, { word: "helado", weight: 2 }, { word: "almuerzo", weight: 2 }, { word: "cena", weight: 2 }, { word: "merienda", weight: 2 }],
    responses: ["Aca tenes los mejores lugares para comer en San Luis. 😋", "En San Luis se come barbaro. 👀", "Hambre? Aca tenes lugares re buenos. 🤤"],
    suggestions: ["Parrilla", "Cafe", "Heladeria"]
  },
  receta: {
    keywords: [{ word: "receta", weight: 3 }, { word: "cocinar", weight: 3 }, { word: "hacer comida", weight: 3 }, { word: "preparar", weight: 2 }, { word: "cocina", weight: 2 }, { word: "comida casera", weight: 2 }, { word: "cocinar en casa", weight: 3 }, { word: "comer en casa", weight: 3 }],
    responses: ["Si preferis cocinar, aca van opciones re buenas. 🍳", "Cocinar en casa es lo mejor. Mira. 👨‍🍳", "Recetas clasicas que no fallan. 🥘"],
    suggestions: ["Tortas fritas", "Locro", "Pizza casera"]
  },
  chicos: {
    keywords: [{ word: "chicos", weight: 3 }, { word: "ninos", weight: 3 }, { word: "hijos", weight: 2 }, { word: "familia", weight: 2 }, { word: "pibes", weight: 2 }, { word: "juegos", weight: 2 }],
    responses: ["Planes re buenos para disfrutar con los chicos. 👨‍👧‍👦", "Los pibes la van a pasar genial. 🎈", "Perfecto para ir en familia. 🌈"],
    suggestions: ["Aire libre", "Parques", "Museos"]
  },
  eventos: {
    keywords: [{ word: "eventos", weight: 3 }, { word: "fiesta", weight: 2 }, { word: "festival", weight: 2 }, { word: "musica", weight: 2 }, { word: "feria", weight: 2 }, { word: "hacer hoy", weight: 2 }, { word: "que hay", weight: 2 }, { word: "salir", weight: 1 }],
    responses: ["Esto es lo que hay para hacer en San Luis. 🎉", "Siempre hay algo para hacer. 🎊"],
    suggestions: ["Musica", "Teatro", "Ferias"]
  },
  cerca: {
    keywords: [{ word: "cerca", weight: 3 }, { word: "cerca mio", weight: 3 }, { word: "zona", weight: 1 }, { word: "donde", weight: 1 }, { word: "a la vuelta", weight: 2 }],
    responses: ["Opciones cerca tuyo. 📍", "Aca cerca hay un monton. 🗺️", "Todo cerquita. 📌"],
    suggestions: ["Centro", "Capital", "Merlo"]
  },
  naturaleza: {
    keywords: [{ word: "naturaleza", weight: 3 }, { word: "aire libre", weight: 3 }, { word: "parque", weight: 2 }, { word: "caminar", weight: 2 }, { word: "sendero", weight: 2 }, { word: "montana", weight: 2 }, { word: "lago", weight: 2 }],
    responses: ["La naturaleza en San Luis es hermosa. 🌲", "Aca se respira aire puro. 🏔️", "Para desconectar un rato. 🍃"],
    suggestions: ["Parques", "Senderos", "Lagos"]
  },
  noche: {
    keywords: [{ word: "noche", weight: 3 }, { word: "boliche", weight: 2 }, { word: "bar", weight: 2 }, { word: "salir", weight: 2 }],
    responses: ["Para salir de noche en San Luis. 🌙", "La noche puntana tiene onda. 🍻"],
    suggestions: ["Bares", "Musica", "Penas"]
  },
  pareja: {
    keywords: [{ word: "pareja", weight: 3 }, { word: "novia", weight: 2 }, { word: "novio", weight: 2 }, { word: "romantico", weight: 2 }, { word: "cita", weight: 2 }],
    responses: ["Planes lindos para ir en pareja. 😍", "San Luis tiene lugares re lindos de a dos. ✨"],
    suggestions: ["Mirador", "Cafe", "Caminata"]
  },
  lluvia: {
    keywords: [{ word: "lluvia", weight: 3 }, { word: "lloviendo", weight: 3 }, { word: "llueve", weight: 2 }, { word: "interior", weight: 2 }],
    responses: ["Si esta lloviendo, aca tenes planes. ☔", "No te preocupes por la lluvia. 🌧️"],
    suggestions: ["Museos", "Cafe", "Cocinar"]
  },
  emprendimientos: {
    keywords: [{ word: "emprendimiento", weight: 3 }, { word: "artesania", weight: 2 }, { word: "hecho a mano", weight: 2 }, { word: "emprendedor", weight: 2 }],
    responses: ["Emprendimientos locales de San Luis. 🏪", "Lo mejor del comercio local. 🛍️"],
    suggestions: ["Artesanias", "Comida", "Ceramica"]
  },
  fiaca: {
    keywords: [{ word: "fiaca", weight: 3 }, { word: "flojo", weight: 2 }, { word: "vago", weight: 2 }, { word: "holgazan", weight: 2 }, { word: "no quiero salir", weight: 3 }, { word: "quedarme en casa", weight: 3 }],
    responses: [],
    suggestions: ["Recetas faciles", "Ver peli", "Escuchar musica"]
  },
  peli: {
    keywords: [{ word: "peli", weight: 3 }, { word: "pelicula", weight: 3 }, { word: "movie", weight: 2 }, { word: "ver algo", weight: 2 }, { word: "cine", weight: 2 }, { word: "recomienda peli", weight: 3 }, { word: "que miro", weight: 2 }],
    responses: [],
    suggestions: ["Otra peli", "Thriller", "Comedia"]
  },
  musica: {
    keywords: [{ word: "musica", weight: 3 }, { word: "banda", weight: 2 }, { word: "rock", weight: 2 }, { word: "escuchar", weight: 2 }, { word: "recomienda", weight: 2 }, { word: "cancion", weight: 2 }],
    responses: [],
    suggestions: ["Rock clasico", "Rock actual", "Otra banda"]
  },
  mas: {
    keywords: [{ word: "mas opciones", weight: 3 }, { word: "mas", weight: 2 }, { word: "otras opciones", weight: 3 }, { word: "dame mas", weight: 3 }, { word: "otra", weight: 2 }, { word: "mas lugares", weight: 3 }, { word: "no me gustan", weight: 3 }],
    responses: ["Dale, te tiro mas opciones. 👀", "Aca van otras que pueden pintarte. 🎯"],
    suggestions: ["Mas", "Otra categoria"]
  },
  elijo: {
    keywords: [{ word: "me gusta", weight: 3 }, { word: "quiero ir", weight: 3 }, { word: "voy a", weight: 3 }, { word: "elijo", weight: 3 }, { word: "prefiero", weight: 3 }, { word: "vamos a", weight: 3 }, { word: "me interesa", weight: 3 }],
    responses: [],
    suggestions: []
  }
};

const SPECIAL_RESPONSES = {
  greeting: {
    keywords: ["hola", "buenas", "hey", "que tal", "buen dia", "buenas tardes", "buenas noches"],
    responses: [
      "Hola! 👋 Soy la AIA de San Luis. Decime que queres hacer y te tiro opciones.",
      "Buenas! 😄 Que queres hacer hoy? Puedo ayudarte con planes, comida, pelis, musica, lo que sea."
    ],
    suggestions: ["Sin un mango", "Quiero comer", "Alta fiaca"]
  },
  locality: {
    keywords: ["soy de", "vivo en", "estoy en"],
    responses: ["Genial! Te tiro opciones de tu zona. 📍"],
    suggestions: ["Cerca mio", "Gratis", "Comer"]
  }
};

const FALLBACKS = [
  { text: "Mmm, no encontre algo exacto pero proba con estas. 🤔", suggestions: ["Sin un mango", "Comer rico", "Alta fiaca"] },
  { text: "No estoy seguro, pero aca hay opciones. 🧐", suggestions: ["Gratis", "Naturaleza", "Ver peli"] }
];

let context = { lastIntent: null, lastZone: null, conversationCount: 0, lastResults: [] };

function extractZone(text) {
  const normalized = normalize(text);
  for (const [key, loc] of Object.entries(LOCALIDADES_SL)) {
    if (normalized.includes(normalize(loc.nombre)) || normalized.includes(key.replace(/_/g, ' '))) return { key, nombre: loc.nombre };
    for (const barrio of loc.barrios) { if (normalized.includes(normalize(barrio))) return { key, nombre: loc.nombre }; }
  }
  return null;
}

function detectIntent(text) {
  const normalized = normalize(text);
  let bestScore = 0, bestIntent = null;
  for (const [key, intent] of Object.entries(INTENTS)) {
    let score = 0;
    for (const { word, weight } of intent.keywords) {
      const kwNorm = normalize(word);
      if (normalized === kwNorm) score += weight * 2;
      else if (normalized.includes(kwNorm)) score += weight;
    }
    if (score > bestScore) { bestScore = score; bestIntent = key; }
  }
  for (const [key, spec] of Object.entries(SPECIAL_RESPONSES)) {
    for (const kw of spec.keywords) { if (normalized.includes(normalize(kw))) return { intent: key, score: 100, type: "special" }; }
  }
  if (bestIntent && bestScore >= 1) return { intent: bestIntent, score: bestScore, type: "normal" };
  return { intent: null, score: 0, type: "fallback" };
}

function scoreItems(text, intentKey, zone) {
  const normalized = normalize(text);
  const scored = DATA.map(item => {
    let score = 0;
    if (zone) { if (normalize(item.zona).includes(normalize(zone))) score += 8; }
    if (intentKey && INTENTS[intentKey]) {
      for (const { word, weight } of INTENTS[intentKey].keywords) {
        if (normalized.includes(normalize(word))) score += weight;
      }
    }
    for (const tag of item.tags) {
      const tagNorm = normalize(tag);
      if (normalized.includes(tagNorm)) score += 2;
      if (tagNorm === normalized) score += 4;
    }
    if (intentKey === "gratis" && item.precio === 0) score += 3;
    if (intentKey === "comida" && item.categorias.includes("comida")) score += 2;
    if (intentKey === "chicos" && item.categorias.includes("chicos")) score += 2;
    if (intentKey === "eventos" && item.categorias.includes("eventos")) score += 2;
    if (intentKey === "naturaleza" && item.categorias.includes("aire libre")) score += 2;
    if (intentKey === "pareja" && item.categorias.includes("pareja")) score += 2;
    if (intentKey === "noche" && item.categorias.includes("salidas")) score += 1;
    if (intentKey === "lluvia" && !item.categorias.includes("aire libre")) score += 3;
    return { item, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.filter(s => s.score > 0).map(s => s.item);
}

function getWeatherAdvice(weather) {
  if (!weather) return "";
  if (weather.esLluvia) return " Esta lloviendo, te filtro opciones bajo techo.";
  if (weather.esCalor) return " Hace calor, te tiro opciones con sombra.";
  if (weather.esFrio) return " Hace frio, mejor algo abrigado.";
  return "";
}

function getItemDetail(item) {
  const detalles = {
    1: "Entrada libre, ideal para ir de manana o al atardecer. Tiene mesas de picnic y mucha sombra. Llevate un mate.",
    2: "El lago es espectacular. Quedate hasta el atardecer, la vista es increible.",
    5: "Las empanadas son cortadas a cuchillo, no molidas. Eso las hace mas jugosas. Pedilas con limon.",
    8: "Puesto de comida tipica con locro, tamales y empanadas a precio de barrio.",
    11: "Helados artesanales con gustos regionales. El dulce de leche con nuez es el mas pedido.",
    12: "Plaza central con juegos para chicos y ferias los domingos.",
    14: "Caminatas guiadas por senderos naturales. Reserva gratuita, llevar agua.",
    16: "Musica en vivo todos los sabados. Entrada barata, empanadas y buen clima.",
    18: "Pileta natural en el rio. Fresco y divertido en verano.",
    19: "Cafe con tortas caseras y wifi. Ideal para laburar o merendar.",
    20: "Vista panoramica de toda la ciudad. Subi al atardecer, es gratis.",
    24: "Carnes a la parrilla con guarnicion. Porciones generosas.",
    25: "El parque mas grande de la ciudad. Ideal para mate, bici y caminar."
  };
  return detalles[item.id] || `${item.nombre} esta en ${item.zona}. Vale la pena.`;
}

function handleFiaca() {
  const pelis = shuffle(PELICULAS).slice(0, 2);
  const bandas = shuffle(BANDAS).slice(0, 2);
  const recetas = shuffle(RECETAS).slice(0, 2);
  const plan = pickRandom(PLANCHILL);
  let text = `Alta fiaca? Tranqui, aca van opciones para no moverte mucho. 🛋️\n\n`;
  text += `🎬 **Peli:** ${pelis[0].titulo} (${pelis[0].genero}) - ${pelis[0].desc}\n`;
  text += `🎸 **Musica:** ${bandas[0].nombre} - ${bandas[0].desc}\n`;
  text += `🍳 **Receta:** ${recetas[0].nombre} (${recetas[0].tiempo}) - ${recetas[0].tip?.substring(0, 60)}...\n`;
  text += `\nO podes: ${plan.titulo}. ${plan.desc}`;
  return { text, results: [], suggestions: ["Otra peli", "Otra banda", "Receta"] };
}

function handlePeli(text) {
  const normalized = normalize(text);
  let filtered = PELICULAS;
  for (const genero of ['thriller', 'comedia', 'drama', 'crimen', 'documental', 'sci-fi', 'rock']) {
    if (normalized.includes(genero)) { filtered = PELICULAS.filter(p => normalize(p.genero).includes(genero)); break; }
  }
  const picks = shuffle(filtered).slice(0, 3);
  let resp = picks.length === 1 ? "Esta peli es buenísima:" : "Aca van unas buenas opciones:";
  resp += "\n\n";
  for (const p of picks) resp += `🎬 **${p.titulo}** (${p.genero}, ${p.año})\n${p.desc}\n\n`;
  resp += "Si queres otra, decime que genero te gusta.";
  return { text: resp, results: [], suggestions: ["Otra peli", "Thriller", "Comedia"] };
}

function handleMusica(text) {
  const normalized = normalize(text);
  let filtered = BANDAS;
  if (normalized.includes("clasico") || normalized.includes("viejo")) filtered = BANDAS.slice(0, 6);
  else if (normalized.includes("actual") || normalized.includes("nuevo") || normalized.includes("indie")) filtered = BANDAS.filter(b => ['Indie', 'Rock/Pop'].includes(b.genero) || ['Conociendo Rusia', 'Marilina Bertoldi'].includes(b.nombre));
  const picks = shuffle(filtered).slice(0, 3);
  let resp = "Rock argentino para poner de fondo. 🎸\n\n";
  for (const b of picks) resp += `🎵 **${b.nombre}**\n${b.desc}\n\n`;
  resp += "Preguntame por otra banda o genero.";
  return { text: resp, results: [], suggestions: ["Rock clasico", "Indie", "Otra banda"] };
}

function handleRecetas(text, recipes) {
  let picks = recipes;
  const normalized = normalize(text);
  const recetaKw = Object.values(RECETAS).find(r => normalized.includes(normalize(r.nombre.split(' ')[0])));
  if (recetaKw) {
    return { text: `🍳 **${recetaKw.nombre}**\n⏱️ ${recetaKw.tiempo} · ${recetaKw.dificultad}\n📝 Ingredientes: ${recetaKw.ingredientes.slice(0, 5).join(', ')}...\n\n💡 ${recetaKw.tip}`, results: [], suggestions: ["Otra receta", "Mas recetas"] };
  }
  picks = shuffle(RECETAS).slice(0, 3);
  let resp = pickRandom(INTENTS.receta.responses) + "\n\n";
  for (const r of picks) resp += `🍳 **${r.nombre}** (${r.tiempo}) - ${r.tip?.substring(0, 50)}...\n`;
  resp += "\nDecime una receta en particular si queres los pasos.";
  return { text: resp, results: [], suggestions: ["Tortas fritas", "Locro", "Pizza"] };
}

function handleLluvia() {
  const acts = shuffle(ACTIVIDADES_LLUVIA).slice(0, 3);
  const lugares = DATA.filter(i => !i.categorias.includes('aire libre')).slice(0, 2);
  let text = "Esta lloviendo? Aca van opciones para no mojarte. ☔\n\n";
  for (const a of acts) text += `📍 **${a.titulo}** - ${a.desc}\n`;
  return { text, results: lugares, suggestions: ["Museos", "Cafe", "Cocinar"] };
}

function handleNoche() {
  const acts = shuffle(ACTIVIDADES_NOCHE).slice(0, 3);
  let text = "Para salir de noche en San Luis. 🌙\n\n";
  for (const a of acts) text += `🌃 **${a.titulo}** - ${a.desc}\n`;
  return { text, results: [], suggestions: ["Bares", "Musica", "Penas"] };
}

function handlePareja() {
  const acts = shuffle(ACTIVIDADES_PAREJA).slice(0, 3);
  let text = "Planes lindos para ir en pareja. 😍\n\n";
  for (const a of acts) text += `💕 **${a.titulo}** - ${a.desc}\n`;
  return { text, results: [], suggestions: ["Mirador", "Cafe", "Caminata"] };
}

function handleMas() {
  if (context.lastIntent === 'comida') {
    const items = shuffle(DATA.filter(i => i.categorias.includes('comida'))).slice(0, 3);
    return { text: pickRandom(INTENTS.mas.responses), results: items, suggestions: ["Mas", "Otra categoria"] };
  }
  if (context.lastIntent === 'peli') return handlePeli('');
  if (context.lastIntent === 'musica') return handleMusica('');
  if (context.lastIntent === 'receta') return handleRecetas('', RECETAS);
  const items = shuffle(DATA).slice(0, 3);
  return { text: pickRandom(INTENTS.mas.responses), results: items, suggestions: ["Mas", "Otra categoria"] };
}

function handleElijo() {
  if (context.lastResults.length > 0) {
    const item = context.lastResults[0];
    return { text: `Gran eleccion! ${item.nombre}.\n\n${getItemDetail(item)}`, results: [], suggestions: ["Mas opciones", "Otro lugar"] };
  }
  return { text: "Buenisimo! Si queres otra opcion decime. 😊", results: [], suggestions: ["Mas opciones", "Otra cosa"] };
}

export function processMessage(text, weather) {
  context.conversationCount++;
  const detection = detectIntent(text);
  const intentKey = detection.intent;
  const zone = extractZone(text);
  if (zone) context.lastZone = zone.key;

  if (detection.type === "special" && detection.intent === "greeting") {
    const spec = SPECIAL_RESPONSES.greeting;
    return { text: pickRandom(spec.responses), results: [], suggestions: spec.suggestions, intent: null };
  }
  if (detection.type === "special" && detection.intent === "locality") {
    return { text: pickRandom(SPECIAL_RESPONSES.locality.responses), results: [], suggestions: SPECIAL_RESPONSES.locality.suggestions, intent: 'cerca' };
  }
  if (intentKey === 'fiaca') return handleFiaca();
  if (intentKey === 'peli') return handlePeli(text);
  if (intentKey === 'musica') return handleMusica(text);
  if (intentKey === 'lluvia') return handleLluvia();
  if (intentKey === 'noche') return handleNoche();
  if (intentKey === 'pareja') return handlePareja();
  if (intentKey === 'mas') return handleMas();
  if (intentKey === 'elijo') return handleElijo();

  if (intentKey === 'receta') return handleRecetas(text, RECETAS);

  if (intentKey === 'comida') {
    const items = shuffle(DATA.filter(i => i.categorias.includes('comida'))).slice(0, 3);
    context.lastResults = items;
    let t = pickRandom(INTENTS.comida.responses);
    if (weather) t += getWeatherAdvice(weather);
    t += "\n\nTambien podes cocinar en casa. Preguntame por recetas.";
    return { text: t, results: items, suggestions: INTENTS.comida.suggestions, intent: 'comida' };
  }

  if (intentKey && INTENTS[intentKey]) {
    const items = scoreItems(text, intentKey, context.lastZone).slice(0, 3);
    context.lastResults = items;
    if (items.length === 0) {
      const fb = pickRandom(FALLBACKS);
      return { text: fb.text, results: DATA.slice(0, 3), suggestions: fb.suggestions, intent: null };
    }
    let t = pickRandom(INTENTS[intentKey].responses);
    if (weather) t += getWeatherAdvice(weather);
    return { text: t, results: items, suggestions: INTENTS[intentKey].suggestions, intent: intentKey };
  }

  // Fallback: uso de sugerencias locales cuando no hay coincidencias
  const picks = getRandomSuggestions({ limit: 5 });
  const lines = picks.map((s, idx) => `${idx + 1}. ${s.title} — ${s.description}`).join('\n');
  const mapped = picks.map(s => ({
    id: s.id,
    nombre: s.title,
    desc: s.description,
    zona: s.location,
    categorias: [],
    precio: 0,
    tags: s.tags
  }));
  const text = `Te tiro algunas ideas crocantes:\n${lines}`;
  return {
    text,
    results: mapped,
    suggestions: picks.map(p => p.title),
    rotatingSuggestions: getRotatingSuggestions(),
    intent: null,
    followUp: null,
    askLocality: false,
    localityPrompt: null
  };
}

export function getCrocanteDelDia() {
  const idx = new Date().getDay() % CROCANTE_DEL_DIA.length;
  return CROCANTE_DEL_DIA[idx];
}

export function getFeaturedEmprendedores() {
  return EMPRENDEDORES.slice(0, 3);
}

export { DATA, RECETAS, LOCALIDADES_SL, INTENTS };
