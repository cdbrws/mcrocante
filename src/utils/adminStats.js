const STORAGE_KEY = 'mcrocante_admin_stats';
const SESSION_KEY = 'mcrocante_session_id';
const SESSION_START_KEY = 'mcrocante_session_start';

const MAX_CHAT_HISTORY = 300;
const MAX_EVENTS = 1000;
const MAX_KEYWORDS = 500;

function nowISO() {
  return new Date().toISOString();
}

function todayKey() {
  return new Date().toISOString().split('T')[0];
}

function safeParse(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function normalizeText(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\sñáéíóúü]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getWords(text) {
  const stopwords = new Set([
    'que', 'como', 'para', 'con', 'sin', 'una', 'uno', 'unos', 'unas',
    'los', 'las', 'del', 'por', 'me', 'mi', 'yo', 'vos', 'algo',
    'quiero', 'necesito', 'hacer', 'hay', 'dame', 'decime', 'recomenda',
    'recomendame', 'modo', 'crocante', 'san', 'luis'
  ]);

  return normalizeText(text)
    .split(' ')
    .filter(word => word.length >= 3 && !stopwords.has(word));
}

function getInitialState() {
  return {
    version: 2,

    totalVisits: 0,
    totalChats: 0,
    totalSearches: 0,
    totalEvents: 0,
    totalSessions: 0,
    totalUsageMs: 0,

    chatHistory: [],
    events: [],

    intentCounts: {},
    categoryCounts: {},
    suggestionClicks: {},
    businessClicks: {},
    placeViews: {},
    saveCounts: {},
    localityRequests: {},
    keywordCounts: {},
    dailyVisits: {},
    dailyChats: {},
    dailyUsageMs: {},

    sessions: {},
    lastReset: nowISO(),
    updatedAt: nowISO()
  };
}

function migrateStats(data) {
  const base = getInitialState();
  const migrated = {
    ...base,
    ...data,
    version: 2,
    chatHistory: Array.isArray(data.chatHistory) ? data.chatHistory : [],
    events: Array.isArray(data.events) ? data.events : [],
    intentCounts: data.intentCounts || {},
    categoryCounts: data.categoryCounts || {},
    suggestionClicks: data.suggestionClicks || {},
    businessClicks: data.businessClicks || {},
    placeViews: data.placeViews || {},
    saveCounts: data.saveCounts || {},
    localityRequests: data.localityRequests || {},
    keywordCounts: data.keywordCounts || {},
    dailyVisits: data.dailyVisits || {},
    dailyChats: data.dailyChats || {},
    dailyUsageMs: data.dailyUsageMs || {},
    sessions: data.sessions || {},
    updatedAt: data.updatedAt || nowISO()
  };

  return migrated;
}

export function getStats() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getInitialState();

    const data = migrateStats(safeParse(raw, getInitialState()));

    if (data.lastReset) {
      const daysSince =
        (Date.now() - new Date(data.lastReset).getTime()) /
        (1000 * 60 * 60 * 24);

      if (daysSince > 30) return getInitialState();
    }

    return data;
  } catch {
    return getInitialState();
  }
}

function saveStats(stats) {
  try {
    const cleanStats = {
      ...stats,
      updatedAt: nowISO(),
      chatHistory: (stats.chatHistory || []).slice(0, MAX_CHAT_HISTORY),
      events: (stats.events || []).slice(0, MAX_EVENTS)
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanStats));
  } catch {}
}

function incrementMap(map, key, amount = 1) {
  if (!key) return;
  map[key] = (map[key] || 0) + amount;
}

export function getSessionId() {
  try {
    let sessionId = localStorage.getItem(SESSION_KEY);

    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem(SESSION_KEY, sessionId);
      localStorage.setItem(SESSION_START_KEY, String(Date.now()));
    }

    return sessionId;
  } catch {
    return `session_${Date.now()}`;
  }
}

export function startSession() {
  const stats = getStats();
  const sessionId = getSessionId();

  if (!stats.sessions[sessionId]) {
    stats.totalSessions++;
    stats.sessions[sessionId] = {
      id: sessionId,
      startedAt: nowISO(),
      lastActivityAt: nowISO(),
      messages: 0,
      clicks: 0,
      usageMs: 0
    };
  }

  saveStats(stats);
  return sessionId;
}

export function trackEvent(type, payload = {}) {
  const stats = getStats();
  const sessionId = getSessionId();

  const event = {
    id: `event_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    type,
    sessionId,
    payload,
    timestamp: Date.now(),
    createdAt: nowISO()
  };

  stats.totalEvents++;
  stats.events.unshift(event);

  if (!stats.sessions[sessionId]) {
    stats.totalSessions++;
    stats.sessions[sessionId] = {
      id: sessionId,
      startedAt: nowISO(),
      lastActivityAt: nowISO(),
      messages: 0,
      clicks: 0,
      usageMs: 0
    };
  }

  stats.sessions[sessionId].lastActivityAt = nowISO();

  saveStats(stats);
  return event;
}

export function trackVisit() {
  const stats = getStats();
  const day = todayKey();
  const sessionId = startSession();

  stats.totalVisits++;
  incrementMap(stats.dailyVisits, day);

  saveStats(stats);

  trackEvent('visit', { day });

  return sessionId;
}

export function trackUsageTime(durationMs) {
  const ms = Number(durationMs || 0);
  if (!ms || ms < 0) return;

  const stats = getStats();
  const day = todayKey();
  const sessionId = getSessionId();

  stats.totalUsageMs += ms;
  incrementMap(stats.dailyUsageMs, day, ms);

  if (!stats.sessions[sessionId]) {
    stats.totalSessions++;
    stats.sessions[sessionId] = {
      id: sessionId,
      startedAt: nowISO(),
      lastActivityAt: nowISO(),
      messages: 0,
      clicks: 0,
      usageMs: 0
    };
  }

  stats.sessions[sessionId].usageMs += ms;
  stats.sessions[sessionId].lastActivityAt = nowISO();

  saveStats(stats);
}

export function trackChat(message, intent, results, category = null) {
  const stats = getStats();
  const sessionId = getSessionId();
  const day = todayKey();

  const detectedCategory = category || intent || 'sin-categoria';
  const resultsCount = Array.isArray(results) ? results.length : 0;
  const words = getWords(message);

  stats.totalChats++;
  stats.totalSearches++;

  incrementMap(stats.dailyChats, day);

  if (intent) incrementMap(stats.intentCounts, intent);
  if (detectedCategory) incrementMap(stats.categoryCounts, detectedCategory);

  words.forEach(word => incrementMap(stats.keywordCounts, word));

  const chatItem = {
    message,
    intent: intent || 'sin-intencion',
    category: detectedCategory,
    resultsCount,
    keywords: words.slice(0, 10),
    sessionId,
    timestamp: Date.now(),
    createdAt: nowISO()
  };

  stats.chatHistory.unshift(chatItem);

  if (!stats.sessions[sessionId]) {
    stats.totalSessions++;
    stats.sessions[sessionId] = {
      id: sessionId,
      startedAt: nowISO(),
      lastActivityAt: nowISO(),
      messages: 0,
      clicks: 0,
      usageMs: 0
    };
  }

  stats.sessions[sessionId].messages++;
  stats.sessions[sessionId].lastActivityAt = nowISO();

  saveStats(stats);

  trackEvent('chat', {
    message,
    intent,
    category: detectedCategory,
    resultsCount,
    keywords: words.slice(0, 10)
  });
}

export function trackSuggestionClick(suggestion, extra = {}) {
  const stats = getStats();
  const key =
    typeof suggestion === 'string'
      ? suggestion
      : suggestion?.id || suggestion?.title || 'sugerencia-sin-id';

  incrementMap(stats.suggestionClicks, key);

  const sessionId = getSessionId();

  if (stats.sessions[sessionId]) {
    stats.sessions[sessionId].clicks++;
  }

  saveStats(stats);

  trackEvent('suggestion_click', {
    suggestion: key,
    category: suggestion?.category || extra.category || null,
    title: suggestion?.title || null,
    ...extra
  });
}

export function trackBusinessClick(business, extra = {}) {
  const stats = getStats();
  const key =
    typeof business === 'string' || typeof business === 'number'
      ? String(business)
      : business?.id || business?.name || business?.title || 'negocio-sin-id';

  incrementMap(stats.businessClicks, key);

  const sessionId = getSessionId();

  if (stats.sessions[sessionId]) {
    stats.sessions[sessionId].clicks++;
  }

  saveStats(stats);

  trackEvent('business_click', {
    business: key,
    name: business?.name || business?.title || null,
    category: business?.category || business?.rubro || null,
    sponsor: Boolean(business?.sponsor),
    destacado: Boolean(business?.destacado),
    ...extra
  });
}

export function trackPlaceView(placeId) {
  const stats = getStats();
  incrementMap(stats.placeViews, String(placeId));
  saveStats(stats);

  trackEvent('place_view', { placeId });
}

export function trackBusinessView(business) {
  const key =
    typeof business === 'string' || typeof business === 'number'
      ? String(business)
      : business?.id || business?.name || business?.title || 'negocio-sin-id';

  trackPlaceView(key);
}

export function trackSave(placeId) {
  const stats = getStats();
  incrementMap(stats.saveCounts, String(placeId));
  saveStats(stats);

  trackEvent('save', { placeId });
}

export function trackLocality(localidad) {
  const stats = getStats();
  incrementMap(stats.localityRequests, localidad || 'sin-localidad');
  saveStats(stats);

  trackEvent('locality', { localidad });
}

export function getTopIntents(limit = 10) {
  const stats = getStats();

  return Object.entries(stats.intentCounts || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([intent, count]) => ({ intent, count }));
}

export function getTopCategories(limit = 10) {
  const stats = getStats();

  return Object.entries(stats.categoryCounts || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([category, count]) => ({ category, count }));
}

export function getTopKeywords(limit = 20) {
  const stats = getStats();

  return Object.entries(stats.keywordCounts || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([keyword, count]) => ({ keyword, count }));
}

export function getBottomIntents() {
  const stats = getStats();

  const allIntents = [
    'gratis',
    'comida',
    'comer-barato',
    'modo-luchon',
    'juegos',
    'alta-fiaca',
    'amigos',
    'chicos',
    'eventos',
    'emprendimientos',
    'cerca',
    'naturaleza',
    'noche',
    'pareja',
    'lluvia',
    'pelicula',
    'musica',
    'ejercicio',
    'san-luis'
  ];

  return allIntents
    .filter(intent => !stats.intentCounts?.[intent] && !stats.categoryCounts?.[intent])
    .map(intent => ({ intent, count: 0 }));
}

export function getTopSuggestions(limit = 10) {
  const stats = getStats();

  return Object.entries(stats.suggestionClicks || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([suggestion, count]) => ({ suggestion, count }));
}

export function getTopBusinesses(limit = 10) {
  const stats = getStats();

  return Object.entries(stats.businessClicks || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([business, count]) => ({ business, count }));
}

export function getMostViewedPlaces(limit = 10) {
  const stats = getStats();

  return Object.entries(stats.placeViews || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([placeId, count]) => ({
      placeId: Number.isNaN(Number(placeId)) ? placeId : parseInt(placeId, 10),
      count
    }));
}

export function getMostSavedPlaces(limit = 10) {
  const stats = getStats();

  return Object.entries(stats.saveCounts || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([placeId, count]) => ({
      placeId: Number.isNaN(Number(placeId)) ? placeId : parseInt(placeId, 10),
      count
    }));
}

export function getTopLocalities(limit = 10) {
  const stats = getStats();

  return Object.entries(stats.localityRequests || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([localidad, count]) => ({ localidad, count }));
}

export function getRecentChats(limit = 20) {
  const stats = getStats();
  return (stats.chatHistory || []).slice(0, limit);
}

export function getRecentEvents(limit = 50) {
  const stats = getStats();
  return (stats.events || []).slice(0, limit);
}

export function getDailyVisits() {
  const stats = getStats();

  const entries = Object.entries(stats.dailyVisits || {})
    .sort((a, b) => a[0].localeCompare(b[0]));

  return entries.slice(-14);
}

export function getDailyChats() {
  const stats = getStats();

  const entries = Object.entries(stats.dailyChats || {})
    .sort((a, b) => a[0].localeCompare(b[0]));

  return entries.slice(-14);
}

export function getAverageSessionTime() {
  const stats = getStats();
  const sessions = Object.values(stats.sessions || {});

  if (!sessions.length) return 0;

  const total = sessions.reduce((sum, session) => sum + Number(session.usageMs || 0), 0);
  return Math.round(total / sessions.length);
}

export function getDashboardInsights() {
  const stats = getStats();

  return {
    totalVisits: stats.totalVisits || 0,
    totalChats: stats.totalChats || 0,
    totalSearches: stats.totalSearches || 0,
    totalSessions: stats.totalSessions || 0,
    totalUsageMs: stats.totalUsageMs || 0,
    averageSessionTimeMs: getAverageSessionTime(),

    topIntents: getTopIntents(5),
    topCategories: getTopCategories(5),
    topKeywords: getTopKeywords(10),
    topSuggestions: getTopSuggestions(5),
    topBusinesses: getTopBusinesses(5),
    topLocalities: getTopLocalities(5),
    recentChats: getRecentChats(10),
    dailyVisits: getDailyVisits(),
    dailyChats: getDailyChats()
  };
}

export function resetStats() {
  const newState = getInitialState();
  saveStats(newState);
  return newState;
}
