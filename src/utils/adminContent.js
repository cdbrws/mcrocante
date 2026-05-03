const STORAGE_KEY = 'mcrocante_content';

const DEFAULT_CONTENT = [];

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

export function getContent() {
  const raw = localStorage.getItem(STORAGE_KEY);
  const parsed = safeParse(raw, DEFAULT_CONTENT);

  if (!Array.isArray(parsed)) return DEFAULT_CONTENT;

  return parsed.map(normalizeContent);
}

export function saveContent(data) {
  const clean = Array.isArray(data) ? data.map(normalizeContent) : DEFAULT_CONTENT;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
  return clean;
}

export function addContent(item) {
  const content = getContent();

  const newItem = normalizeContent({
    ...item,
    id: `content_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
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

export function resetContent() {
  saveContent(DEFAULT_CONTENT);
  return DEFAULT_CONTENT;
}
