const STORAGE_KEY = 'mcrocante_admin_stats';

function getInitialState() {
  return {
    totalVisits: 0,
    totalChats: 0,
    totalSearches: 0,
    chatHistory: [],
    intentCounts: {},
    suggestionClicks: {},
    placeViews: {},
    saveCounts: {},
    localityRequests: {},
    dailyVisits: {},
    lastReset: new Date().toISOString()
  };
}

export function getStats() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getInitialState();
    const data = JSON.parse(raw);
    if (data.lastReset) {
      const daysSince = (Date.now() - new Date(data.lastReset).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSince > 30) return getInitialState();
    }
    return data;
  } catch {
    return getInitialState();
  }
}

function saveStats(stats) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch {}
}

export function trackVisit() {
  const stats = getStats();
  stats.totalVisits++;
  const today = new Date().toISOString().split('T')[0];
  stats.dailyVisits[today] = (stats.dailyVisits[today] || 0) + 1;
  saveStats(stats);
}

export function trackChat(message, intent, results) {
  const stats = getStats();
  stats.totalChats++;
  stats.totalSearches++;

  if (intent) {
    stats.intentCounts[intent] = (stats.intentCounts[intent] || 0) + 1;
  }

  stats.chatHistory.unshift({
    message,
    intent,
    resultsCount: results?.length || 0,
    timestamp: Date.now()
  });

  if (stats.chatHistory.length > 200) {
    stats.chatHistory = stats.chatHistory.slice(0, 200);
  }

  saveStats(stats);
}

export function trackSuggestionClick(suggestion) {
  const stats = getStats();
  stats.suggestionClicks[suggestion] = (stats.suggestionClicks[suggestion] || 0) + 1;
  saveStats(stats);
}

export function trackPlaceView(placeId) {
  const stats = getStats();
  stats.placeViews[placeId] = (stats.placeViews[placeId] || 0) + 1;
  saveStats(stats);
}

export function trackSave(placeId) {
  const stats = getStats();
  stats.saveCounts[placeId] = (stats.saveCounts[placeId] || 0) + 1;
  saveStats(stats);
}

export function trackLocality(localidad) {
  const stats = getStats();
  stats.localityRequests[localidad] = (stats.localityRequests[localidad] || 0) + 1;
  saveStats(stats);
}

export function getTopIntents(limit = 10) {
  const stats = getStats();
  return Object.entries(stats.intentCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([intent, count]) => ({ intent, count }));
}

export function getBottomIntents() {
  const stats = getStats();
  const allIntents = ['gratis', 'comida', 'chicos', 'eventos', 'emprendimientos', 'cerca', 'naturaleza', 'noche', 'pareja', 'lluvia'];
  return allIntents
    .filter(i => !stats.intentCounts[i])
    .map(intent => ({ intent, count: 0 }));
}

export function getTopSuggestions(limit = 10) {
  const stats = getStats();
  return Object.entries(stats.suggestionClicks)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([suggestion, count]) => ({ suggestion, count }));
}

export function getMostViewedPlaces(limit = 10) {
  const stats = getStats();
  return Object.entries(stats.placeViews)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([placeId, count]) => ({ placeId: parseInt(placeId), count }));
}

export function getMostSavedPlaces(limit = 10) {
  const stats = getStats();
  return Object.entries(stats.saveCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([placeId, count]) => ({ placeId: parseInt(placeId), count }));
}

export function getTopLocalities(limit = 10) {
  const stats = getStats();
  return Object.entries(stats.localityRequests)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([localidad, count]) => ({ localidad, count }));
}

export function getRecentChats(limit = 20) {
  const stats = getStats();
  return stats.chatHistory.slice(0, limit);
}

export function getDailyVisits() {
  const stats = getStats();
  const entries = Object.entries(stats.dailyVisits).sort((a, b) => b[0].localeCompare(a[0]));
  return entries.slice(-14);
}

export function resetStats() {
  const newState = getInitialState();
  saveStats(newState);
  return newState;
}
