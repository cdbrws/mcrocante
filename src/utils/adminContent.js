const STORAGE_KEY = 'mcrocante_content';

function getInitial() {
  return [];
}

export function getContent() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || getInitial();
  } catch {
    return getInitial();
  }
}

export function saveContent(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function addContent(item) {
  const content = getContent();

  const newItem = {
    id: 'content_' + Date.now(),
    title: item.title || '',
    description: item.description || '',
    category: item.category || '',
    tags: item.tags || [],
    location: item.location || '',
    imageUrl: item.imageUrl || '',
    sponsor: item.sponsor || false,
    featured: item.featured || false,
    active: true,
    createdAt: new Date().toISOString(),
  };

  content.unshift(newItem);
  saveContent(content);
}

export function updateContent(id, updates) {
  const content = getContent();
  const idx = content.findIndex(c => c.id === id);

  if (idx !== -1) {
    content[idx] = { ...content[idx], ...updates };
    saveContent(content);
  }
}

export function deleteContent(id) {
  const content = getContent().filter(c => c.id !== id);
  saveContent(content);
}
