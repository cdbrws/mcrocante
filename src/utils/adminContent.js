const STORAGE_KEY = 'mcrocante_content';

const DEFAULT_CONTENT = [
  {
    id: 'base_aire_001',
    title: 'Mate en Parque de las Naciones',
    description: 'Plan gratis para salir, caminar, tomar mate y cortar la rutina sin gastar.',
    category: 'aire-libre',
    type: 'actividad',
    mood: 'aire',
    tags: ['gratis', 'aire libre', 'mate', 'familia', 'amigos', 'san luis'],
    location: 'San Luis Capital',
    imageUrl: '',
    sponsorId: '',
    sponsor: false,
    featured: true,
    active: true,
    source: 'base',
    priority: 'alta',
    startsAt: '',
    endsAt: '',
    notes: 'Plan base precargado.',
  },
  {
    id: 'base_aire_002',
    title: 'Caminata tranqui por una plaza',
    description: 'Ideal para despejarse, charlar o moverse un poco sin pagar nada.',
    category: 'aire-libre',
    type: 'actividad',
    mood: 'aire',
    tags: ['gratis', 'aire libre', 'plaza', 'caminar', 'pareja', 'amigos'],
    location: 'San Luis',
    imageUrl: '',
    sponsorId: '',
    sponsor: false,
    featured: false,
    active: true,
    source: 'base',
    priority: 'normal',
    startsAt: '',
    endsAt: '',
    notes: 'Plan base precargado.',
  },
  {
    id: 'base_sanluis_001',
    title: 'Buscar feria o evento gratuito',
    description: 'Plan ideal para finde: feria, música, paseo o actividad local sin gastar.',
    category: 'san-luis',
    type: 'evento',
    mood: 'aire',
    tags: ['evento', 'gratis', 'feria', 'cultura', 'salir', 'san luis'],
    location: 'San Luis',
    imageUrl: '',
    sponsorId: '',
    sponsor: false,
    featured: true,
    active: true,
    source: 'base',
    priority: 'alta',
    startsAt: '',
    endsAt: '',
    notes: 'Cargar eventos reales desde admin cuando aparezcan.',
  },
  {
    id: 'base_sanluis_002',
    title: 'Salida corta a tomar aire',
    description: 'Cuando no hay plata ni ganas de producirse, salir 30 minutos ya cambia el día.',
    category: 'san-luis',
    type: 'actividad',
    mood: 'aire',
    tags: ['gratis', 'salir', 'aire libre', 'tranqui', 'san luis'],
    location: 'San Luis',
    imageUrl: '',
    sponsorId: '',
    sponsor: false,
    featured: false,
    active: true,
    source: 'base',
    priority: 'normal',
    startsAt: '',
    endsAt: '',
    notes: 'Plan base precargado.',
  },
  {
    id: 'base_comer_001',
    title: 'Tortas fritas crocantes',
    description: 'Harina, grasa o aceite, sal y agua. Barato, rendidor y bien argentino.',
    category: 'comer-barato',
    type: 'receta',
    mood: 'sin-plata',
    tags: ['comida', 'barato', 'receta', 'casa', 'mate'],
    location: 'Casa',
    imageUrl: '',
    sponsorId: '',
    sponsor: false,
    featured: true,
    active: true,
    source: 'base',
    priority: 'alta',
    startsAt: '',
    endsAt: '',
    notes: 'Receta base precargada.',
  },
  {
    id: 'base_comer_002',
    title: 'Arroz con huevo salvador',
    description: 'Comida barata, rápida y rendidora para resolver sin hacer drama.',
    category: 'comer-barato',
    type: 'receta',
    mood: 'sin-plata',
    tags: ['comida', 'barato', 'receta', 'casa', 'rapido'],
    location: 'Casa',
    imageUrl: '',
    sponsorId: '',
    sponsor: false,
    featured: false,
    active: true,
    source: 'base',
    priority: 'normal',
    startsAt: '',
    endsAt: '',
    notes: 'Receta base precargada.',
  },
  {
    id: 'base_juegos_001',
    title: 'Batalla naval en papel',
    description: 'Solo necesitás hoja y lápiz. Sirve para chicos, amigos o matar la fiaca.',
    category: 'juegos',
    type: 'juego',
    mood: 'familia',
    tags: ['juego', 'gratis', 'casa', 'chicos', 'amigos'],
    location: 'Casa',
    imageUrl: '',
    sponsorId: '',
    sponsor: false,
    featured: true,
    active: true,
    source: 'base',
    priority: 'alta',
    startsAt: '',
    endsAt: '',
    notes: 'Juego base precargado.',
  },
  {
    id: 'base_juegos_002',
    title: 'Dígalo con mímica',
    description: 'Juego simple para grupo, familia o juntada sin gastar un peso.',
    category: 'juegos',
    type: 'juego',
    mood: 'amigos',
    tags: ['juego', 'gratis', 'amigos', 'familia', 'casa'],
    location: 'Casa',
    imageUrl: '',
    sponsorId: '',
    sponsor: false,
    featured: false,
    active: true,
    source: 'base',
    priority: 'normal',
    startsAt: '',
    endsAt: '',
    notes: 'Juego base precargado.',
  },
  {
    id: 'base_luchon_001',
    title: 'Búsqueda del tesoro casera',
    description: 'Escondé pistas simples en casa. Plan barato para entretener chicos sin pantalla.',
    category: 'modo-luchon',
    type: 'actividad',
    mood: 'familia',
    tags: ['chicos', 'familia', 'gratis', 'casa', 'juego'],
    location: 'Casa',
    imageUrl: '',
    sponsorId: '',
    sponsor: false,
    featured: true,
    active: true,
    source: 'base',
    priority: 'alta',
    startsAt: '',
    endsAt: '',
    notes: 'Actividad base precargada.',
  },
  {
    id: 'base_fiaca_001',
    title: 'Peli + mate + cero culpa',
    description: 'Plan de mínimo esfuerzo para cortar el día sin salir ni gastar.',
    category: 'alta-fiaca',
    type: 'plan',
    mood: 'fiaca',
    tags: ['fiaca', 'casa', 'peli', 'gratis', 'tranqui'],
    location: 'Casa',
    imageUrl: '',
    sponsorId: '',
    sponsor: false,
    featured: false,
    active: true,
    source: 'base',
    priority: 'normal',
    startsAt: '',
    endsAt: '',
    notes: 'Plan base precargado.',
  },
  {
    id: 'base_amigos_001',
    title: 'Juntada con mate y truco',
    description: 'Plan clásico, barato y efectivo para juntarse sin gastar de más.',
    category: 'amigos',
    type: 'plan',
    mood: 'amigos',
    tags: ['amigos', 'gratis', 'truco', 'mate', 'casa'],
    location: 'Casa',
    imageUrl: '',
    sponsorId: '',
    sponsor: false,
    featured: false,
    active: true,
    source: 'base',
    priority: 'normal',
    startsAt: '',
    endsAt: '',
    notes: 'Plan base precargado.',
  },
];

function nowISO() {
  return new Date().toISOString();
}

function safeParse(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function normalizeTags(tags) {
  if (Array.isArray(tags)) {
    return tags.map(t => String(t).trim().toLowerCase()).filter(Boolean);
  }

  return String(tags || '')
    .split(',')
    .map(t => t.trim().toLowerCase())
    .filter(Boolean);
}

function normalizeContent(item = {}) {
  return {
    id: item.id || `content_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    title: item.title || '',
    description: item.description || '',
    category: item.category || 'general',
    type: item.type || 'actividad',
    mood: item.mood || '',
    tags: normalizeTags(item.tags),
    location: item.location || '',
    imageUrl: item.imageUrl || '',
    sponsorId: item.sponsorId || '',
    sponsor: Boolean(item.sponsor),
    featured: Boolean(item.featured),
    active: item.active !== false,
    source: item.source || 'admin',
    priority: item.priority || 'normal',
    startsAt: item.startsAt || '',
    endsAt: item.endsAt || '',
    notes: item.notes || '',
    createdAt: item.createdAt || nowISO(),
    updatedAt: item.updatedAt || nowISO(),
  };
}

function mergeWithDefaultContent(content = []) {
  const normalizedCurrent = Array.isArray(content) ? content.map(normalizeContent) : [];
  const currentIds = new Set(normalizedCurrent.map(item => item.id));

  const missingDefaults = DEFAULT_CONTENT
    .filter(item => !currentIds.has(item.id))
    .map(item => normalizeContent({
      ...item,
      createdAt: item.createdAt || nowISO(),
      updatedAt: item.updatedAt || nowISO(),
    }));

  return [...missingDefaults, ...normalizedCurrent];
}

export function getContent() {
  const raw = localStorage.getItem(STORAGE_KEY);
  const parsed = safeParse(raw, null);

  // Primera vez: si no hay nada guardado, siembra los planes base.
  if (!parsed) {
    const seeded = mergeWithDefaultContent([]);
    saveContent(seeded);
    return seeded;
  }

  if (!Array.isArray(parsed)) {
    const seeded = mergeWithDefaultContent([]);
    saveContent(seeded);
    return seeded;
  }

  // Si ya había contenido manual, suma defaults faltantes sin duplicar.
  const merged = mergeWithDefaultContent(parsed);

  // Guarda solo si detectó defaults faltantes.
  if (merged.length !== parsed.length) {
    saveContent(merged);
  }

  return merged;
}

export function saveContent(data) {
  const clean = Array.isArray(data) ? data.map(normalizeContent) : mergeWithDefaultContent([]);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
  return clean;
}

export function addContent(item) {
  const content = getContent();

  const newItem = normalizeContent({
    ...item,
    id: `content_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    source: item?.source || 'admin',
    active: item?.active !== false,
    createdAt: nowISO(),
    updatedAt: nowISO(),
  });

  const next = [newItem, ...content];
  saveContent(next);

  return newItem;
}

export function updateContent(id, updates) {
  const content = getContent();

  const next = content.map(item =>
    item.id === id
      ? normalizeContent({
          ...item,
          ...updates,
          updatedAt: nowISO(),
        })
      : item
  );

  saveContent(next);

  return next.find(item => item.id === id) || null;
}

export function deleteContent(id) {
  const next = getContent().filter(item => item.id !== id);
  saveContent(next);
  return next;
}

export function toggleContentActive(id) {
  const item = getContent().find(c => c.id === id);
  if (!item) return null;

  return updateContent(id, {
    active: !item.active,
  });
}

export function toggleContentFeatured(id) {
  const item = getContent().find(c => c.id === id);
  if (!item) return null;

  return updateContent(id, {
    featured: !item.featured,
  });
}

export function getActiveContent() {
  return getContent().filter(item => item.active !== false);
}

export function getFeaturedContent(limit = 6) {
  return getActiveContent()
    .filter(item => item.featured)
    .slice(0, limit);
}

export function getContentByCategory(category, limit = 20) {
  return getActiveContent()
    .filter(item => item.category === category)
    .slice(0, limit);
}

export function searchContent(query, limit = 20) {
  const q = String(query || '').toLowerCase().trim();
  if (!q) return getActiveContent().slice(0, limit);

  return getActiveContent()
    .filter(item => {
      const haystack = [
        item.title,
        item.description,
        item.category,
        item.type,
        item.mood,
        item.location,
        ...(item.tags || []),
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(q);
    })
    .slice(0, limit);
}

export function seedDefaultContent() {
  const currentRaw = safeParse(localStorage.getItem(STORAGE_KEY), []);
  const current = Array.isArray(currentRaw) ? currentRaw : [];
  const seeded = mergeWithDefaultContent(current);
  saveContent(seeded);
  return seeded;
}

export function resetContent() {
  const seeded = mergeWithDefaultContent([]);
  saveContent(seeded);
  return seeded;
}
