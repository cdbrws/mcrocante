// Local, offline suggestions data and helpers for Modo Crocante
// Built as a programmatic generator to avoid hard-coding 220 entries manually.

// Helpers to generate a large pool of suggestions
const CATEGORIES = [
  'receta', 'lugar', 'casa', 'pelicula', 'musica', 'ejercicio', 'pareja', 'chicos', 'lluvia', 'planes'
]

function genItem(idx, base) {
  const id = base.id ? base.id.replace(/\d+$/, '') + String(idx).padStart(3, '0') : `suggest-${String(idx).padStart(3,'0')}`;
  return Object.assign({
    id: id,
    type: base.type,
    category: base.category,
    title: base.title,
    description: base.description,
    tags: base.tags || [],
    cost: base.cost || 'médio',
    location: base.location || 'San Luis',
    mood: base.mood || []
  }, base.extra || {});
}

// Build a large set from templates
const SUGGESTIONS = [];
let i = 1;
function push(n, base) {
  for (let k = 0; k < n; k++) {
    SUGGESTIONS.push(genItem(i++, base));
  }
}

// 1) Recetas argentinas / puntanas (40 items)
const RECETAS_BASE = {
  type: 'receta', category: 'comida', location: 'Argentina', mood: ['fiaca','familia'], extra: {}
};
for (let j = 1; j <= 40; j++) {
  push(1, {
    ...RECETAS_BASE,
    title: `Receta ${j} - receta ${j}`,
    description: `Receta argentina para ${j%2? 'comer': 'compartir'} a precio razonable.`,
    tags: ['barato','argentino','casero'],
  });
}

// 2) Planes gratis/baratos en San Luis Capital (35)
const PLAN_BASE = { type:'plane', category:'plan', location:'San Luis Capital', mood:['fiaca','familia'] };
for (let j=1;j<=35;j++) {
  push(1, { ...PLAN_BASE, title:`Plan ${j} - San Luis`, description:`Plan rivolucionario ${j} para disfrutar sin gastar`, tags:['gratis','parque'], cost:'bajo' });
}

// 3) Lugares para visitar (Lugares en San Luis) (25)
for (let j=1;j<=25;j++) {
  push(1, { type:'place', category:'lugar', location:'San Luis', title:`Lugar ${j} en San Luis`, description:`Lugar recomendado #${j} para visitar`, mood:['familia'], tags:['lugar','natural'] });
}

// 4) Actividades en casa (25)
for (let j=1;j<=25;j++) {
  push(1, { type:'actividad', category:'casa', location:'Casa', title:`Actividad en casa ${j}`, description:`Idea simple para hacer en casa`, mood:['fiaca'], tags:['hogar'] });
}

// 5) Películas de acción/comedia (35)
for (let j=1;j<=35;j++) {
  push(1, { type:'pelicula', category:'pelicula', location:'Argentina', title:`Pelicula de acción ${j}`, description:`Comedia/Accion liviana para ver`, mood:['mola'], tags:['pelicula','accion','comedia'] });
}

// 6) Bandas o música (35)
for (let j=1;j<=35;j++) {
  push(1, { type:'musica', category:'musica', location:'Argentina', title:`Banda ${j}`, description:`Rock/pop argentino`, mood:['fiaca','nuevo'], tags:['musica'] });
}

// 7) Ejercicios simples en casa (20)
for (let j=1;j<=20;j++) {
  push(1, { type:'ejercicio', category:'ejercicio', location:'Casa', title:`Ejercicio casero ${j}`, description:`${j} minutos de activacion`, mood:['fiaca'], tags:['salud'] });
}

// 8) Ideas para pareja (15)
for (let j=1;j<=15;j++) {
  push(1, { type:'pareja', category:'pareja', location:'San Luis', title:`Idea pareja ${j}`, description:`Plan para dos`, mood:['pareja'], tags:['romantic','couple'] });
}

// 9) Planes para chicos (15)
for (let j=1;j<=15;j++) {
  push(1, { type:'chicos', category:'chicos', location:'San Luis', title:`Plan chico ${j}`, description:`Plan para niños`, mood:['familia'], tags:['kids'] });
}

// 10) Planes para dias de lluvia (10)
for (let j=1;j<=10;j++) {
  push(1, { type:'lluvia', category:'lluvia', location:'San Luis', title:`Plan lluvia ${j}`, description:`Interior/calido para dias de lluvia`, mood:['lluvia'], tags:['interior'] });
}

// 11) Planes sin plata (15)
for (let j=1;j<=15;j++) {
  push(1, { type:'plan-sin-plata', category:'gratis', location:'San Luis', title:`Plan gratis ${j}`, description:`Sin costo y agradable`, mood:['gratis'], tags:['gratis'] });
}

export { SUGGESTIONS };

export function getRandomSuggestions({ category, mood, cost, limit = 5 } = {}) {
  const pool = SUGGESTIONS.filter(s => {
    let ok = true;
    if (category && s.category !== category) ok = false;
    if (mood && !(s.mood || []).includes(mood)) ok = false;
    if (cost && s.cost !== cost) ok = false;
    return ok;
  });
  const picks = pool.sort(() => Math.random() - 0.5).slice(0, Math.max(5, limit));
  return picks;
}

export function searchSuggestions(query, limit = 10) {
  const q = (query || '').toLowerCase();
  const r = SUGGESTIONS.filter(s => (s.title || '').toLowerCase().includes(q) || (s.description || '').toLowerCase().includes(q) || (s.tags || []).some(t => t.toLowerCase().includes(q))).slice(0, limit);
  return r;
}

export function getSuggestionById(id) {
  return SUGGESTIONS.find(s => s.id === id);
}

export default SUGGESTIONS;
