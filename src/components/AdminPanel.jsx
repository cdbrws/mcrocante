import React from "react";
import { useState, useEffect } from 'react';
import CookieLogo from './CookieLogo';
import {
  getStats,
  getTopIntents,
  getBottomIntents,
  getTopSuggestions,
  getMostViewedPlaces,
  getMostSavedPlaces,
  getTopLocalities,
  getRecentChats,
  getDailyVisits,
  resetStats
} from '../utils/adminStats';
import {
  getSolicitudes,
  addSolicitud,
  updateSolicitud,
  deleteSolicitud,
  getSolicitudesCount,
  approveSolicitud,
  rejectSolicitud,
  toggleDestacado,
  toggleSponsor
} from '../utils/solicitudes';
import {
  getContent,
  addContent,
  updateContent,
  deleteContent as deleteAdminContent,
  toggleContentActive,
  toggleContentFeatured
} from '../utils/adminContent';
import { DATA } from '../data/places';
import { LOCALIDADES_SL } from '../data/localidades';
import { RECETAS } from '../data/recetas';

const EMPTY_NEGOCIO = {
  nombre: '',
  rubro: '',
  zona: '',
  whatsapp: '',
  instagram: '',
  desc: '',
  imagen: '',
  tags: '',
  estado: 'aprobado',
  destacado: false,
  sponsor: false,
  prioridad: 'normal',
  notasAdmin: '',
};

const RUBROS = [
  'Comida',
  'Café / Merienda',
  'Helado',
  'Ropa',
  'Artesania',
  'Servicios',
  'Tecnologia',
  'Belleza',
  'Eventos',
  'Otro',
];

function getPlaceName(id) {
  const place = DATA.find(d => d.id === id);
  return place ? place.nombre : `ID ${id}`;
}

function formatTime(ts) {
  if (!ts) return 'Sin fecha';
  const d = new Date(ts);
  return `${d.getDate()}/${d.getMonth() + 1} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function normalizeTags(tags) {
  if (Array.isArray(tags)) return tags.join(', ');
  return tags || '';
}

function parseTags(tagsText) {
  return String(tagsText || '')
    .split(',')
    .map(t => t.trim().toLowerCase())
    .filter(Boolean);
}

function inferOpportunity(topIntents, topSuggestions, topLocalities) {
  const intent = topIntents[0]?.intent || 'sin datos';
  const suggestion = topSuggestions[0]?.suggestion || 'sin datos';
  const locality = topLocalities[0]?.localidad || 'San Luis';

  if (intent.includes('comer') || intent.includes('receta') || suggestion.includes('comer')) {
    return `Buscar sponsor de comida barata en ${locality}.`;
  }

  if (intent.includes('peli') || intent.includes('fiaca') || intent.includes('casa')) {
    return 'Cargar más planes de casa, pelis, juegos y challenges tranquilos.';
  }

  if (intent.includes('familia') || intent.includes('chicos') || intent.includes('luchon')) {
    return 'Sumar contenido para modo luchón/a: juegos, cocina con niños y salidas sin gastar.';
  }

  if (intent.includes('salir') || intent.includes('cerca')) {
    return `Reforzar negocios y lugares recomendados en ${locality}.`;
  }

  return 'Cargar más contenido en la categoría más consultada y probar nuevos chips.';
}

function StatCard({ label, value, icon, color = 'naranja' }) {
  const colorClass = color === 'naranja'
    ? 'bg-naranja/10'
    : color === 'green'
    ? 'bg-green-50'
    : color === 'blue'
    ? 'bg-blue-50'
    : color === 'red'
    ? 'bg-red-50'
    : 'bg-purple-50';

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${colorClass}`}>
          {icon}
        </div>
        <div>
          <div className="text-2xl font-extrabold text-stone-800">{value}</div>
          <div className="text-xs text-stone-400 font-medium">{label}</div>
        </div>
      </div>
    </div>
  );
}

function BarChart({ data, maxVal }) {
  const safeData = Array.isArray(data) ? data : [];
  const max = maxVal || Math.max(...safeData.map(d => d.count || d[1] || 0), 1);

  return (
    <div className="space-y-2">
      {safeData.map((item, i) => {
        const count = item.count || item[1] || 0;
        const label = item.intent || item.suggestion || item.localidad || item[0] || item.nombre || 'Dato';
        const pct = (count / max) * 100;

        return (
          <div key={i} className="flex items-center gap-2">
            <span className="text-xs text-stone-500 w-28 truncate font-medium">{label}</span>
            <div className="flex-1 bg-stone-100 rounded-full h-5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-naranja to-orange-400 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                style={{ width: `${Math.max(pct, 8)}%` }}
              >
                <span className="text-[10px] text-white font-bold">{count}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function NegocioForm({ form, setForm, onSave, onCancel, mode = 'edit' }) {
  return (
    <div className="p-4 space-y-2">
      <input value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm outline-none" placeholder="Nombre" />
      <select value={form.rubro} onChange={e => setForm({ ...form, rubro: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm outline-none bg-white">
        <option value="">Rubro</option>
        {RUBROS.map(r => <option key={r}>{r}</option>)}
      </select>
      <input value={form.zona} onChange={e => setForm({ ...form, zona: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm outline-none" placeholder="Zona / localidad" />
      <input value={form.whatsapp || ''} onChange={e => setForm({ ...form, whatsapp: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm outline-none" placeholder="WhatsApp" />
      <input value={form.instagram || ''} onChange={e => setForm({ ...form, instagram: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm outline-none" placeholder="Instagram" />
      <input value={form.imagen || ''} onChange={e => setForm({ ...form, imagen: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm outline-none" placeholder="URL imagen" />
      <textarea value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm outline-none resize-none" rows={3} placeholder="Descripción" />
      <input value={normalizeTags(form.tags)} onChange={e => setForm({ ...form, tags: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm outline-none" placeholder="Tags: comida, barato, familia" />
      <textarea value={form.notasAdmin || ''} onChange={e => setForm({ ...form, notasAdmin: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm outline-none resize-none" rows={2} placeholder="Notas internas admin" />

      <div className="grid grid-cols-3 gap-2">
        <select value={form.estado || 'pendiente'} onChange={e => setForm({ ...form, estado: e.target.value })} className="border rounded-lg px-2 py-2 text-xs outline-none bg-white">
          <option value="pendiente">Pendiente</option>
          <option value="aprobado">Aprobado</option>
          <option value="rechazado">Rechazado</option>
        </select>

        <select value={form.prioridad || 'normal'} onChange={e => setForm({ ...form, prioridad: e.target.value })} className="border rounded-lg px-2 py-2 text-xs outline-none bg-white">
          <option value="normal">Normal</option>
          <option value="alta">Alta</option>
          <option value="premium">Premium</option>
        </select>

        <button type="button" onClick={() => setForm({ ...form, sponsor: !form.sponsor })} className={`rounded-lg px-2 py-2 text-xs font-bold ${form.sponsor ? 'bg-purple-100 text-purple-700' : 'bg-stone-100 text-stone-500'}`}>
          {form.sponsor ? 'Sponsor' : 'No sponsor'}
        </button>
      </div>

      <button type="button" onClick={() => setForm({ ...form, destacado: !form.destacado })} className={`w-full rounded-lg px-3 py-2 text-xs font-bold ${form.destacado ? 'bg-naranja/10 text-naranja' : 'bg-stone-100 text-stone-500'}`}>
        {form.destacado ? '⭐ Destacado activo' : '☆ Marcar destacado'}
      </button>

      <div className="flex gap-2">
        <button onClick={onSave} className="flex-1 bg-naranja text-white rounded-lg py-2 text-xs font-bold">
          {mode === 'create' ? 'Cargar negocio' : 'Guardar'}
        </button>
        <button onClick={onCancel} className="px-4 bg-stone-100 rounded-lg py-2 text-xs font-bold">Cancelar</button>
      </div>
    </div>
  );
}

function NegociosTab() {
  const [solicitudes, setSolicitudes] = useState(getSolicitudes());
  const [filter, setFilter] = useState('todas');
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState(EMPTY_NEGOCIO);

  const refresh = () => setSolicitudes(getSolicitudes());

  useEffect(() => {
    const interval = setInterval(refresh, 1000);
    return () => clearInterval(interval);
  }, []);

  const counts = getSolicitudesCount();

  const filtered = filter === 'todas'
    ? solicitudes
    : filter === 'sponsors'
    ? solicitudes.filter(s => s.sponsor)
    : filter === 'destacados'
    ? solicitudes.filter(s => s.destacado)
    : solicitudes.filter(s => s.estado === filter);

  const ordenadas = [...filtered].sort((a, b) => {
    if (a.sponsor && !b.sponsor) return -1;
    if (!a.sponsor && b.sponsor) return 1;
    if (a.destacado && !b.destacado) return -1;
    if (!a.destacado && b.destacado) return 1;
    return new Date(b.fecha) - new Date(a.fecha);
  });

  const saveEdit = () => {
    updateSolicitud(editId, { ...editForm, tags: parseTags(editForm.tags) });
    setEditId(null);
    setEditForm(null);
    refresh();
  };

  const createNegocio = () => {
    addSolicitud({
      ...createForm,
      tags: parseTags(createForm.tags),
      estado: createForm.estado || 'aprobado',
      origen: 'carga-admin',
      fecha: new Date().toISOString(),
    });
    setCreateForm(EMPTY_NEGOCIO);
    setShowCreate(false);
    refresh();
  };

  const startEdit = (s) => {
    setEditId(s.id);
    setEditForm({ ...s, tags: normalizeTags(s.tags) });
  };

  const estadoColors = {
    pendiente: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    aprobado: 'bg-green-50 text-green-700 border-green-200',
    rechazado: 'bg-red-50 text-red-700 border-red-200',
  };

  const estadoLabels = {
    pendiente: '⏳ Pendiente',
    aprobado: '✅ Aprobado',
    rechazado: '❌ Rechazado',
  };

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-naranja to-orange-400 text-white rounded-2xl p-4 shadow-md">
        <h3 className="text-sm font-bold mb-1">💰 Centro comercial crocante</h3>
        <p className="text-xs opacity-90">Aprobá emprendimientos, marcá sponsors y usá tags para que la AIA los pueda recomendar mejor.</p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white rounded-xl p-3 text-center border border-stone-100">
          <div className="text-xl font-extrabold text-stone-800">{counts.total}</div>
          <div className="text-[10px] text-stone-400">Total</div>
        </div>
        <div className="bg-yellow-50 rounded-xl p-3 text-center border border-yellow-100">
          <div className="text-xl font-extrabold text-yellow-700">{counts.pendientes}</div>
          <div className="text-[10px] text-yellow-500">Pendientes</div>
        </div>
        <div className="bg-purple-50 rounded-xl p-3 text-center border border-purple-100">
          <div className="text-xl font-extrabold text-purple-700">{counts.sponsors || 0}</div>
          <div className="text-[10px] text-purple-500">Sponsors</div>
        </div>
      </div>

      <button onClick={() => setShowCreate(!showCreate)} className="w-full bg-stone-900 text-white rounded-2xl py-3 text-xs font-extrabold active:scale-[0.98] transition-transform">
        {showCreate ? 'Cerrar carga manual' : '+ Cargar negocio manualmente'}
      </button>

      {showCreate && (
        <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
          <NegocioForm
            form={createForm}
            setForm={setCreateForm}
            onSave={createNegocio}
            onCancel={() => {
              setShowCreate(false);
              setCreateForm(EMPTY_NEGOCIO);
            }}
            mode="create"
          />
        </div>
      )}

      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
        {[['todas', 'Todas'], ['pendiente', 'Pendientes'], ['aprobado', 'Aprobados'], ['rechazado', 'Rechazados'], ['destacados', 'Destacados'], ['sponsors', 'Sponsors']].map(([key, label]) => (
          <button key={key} onClick={() => setFilter(key)} className={`px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all ${filter === key ? 'bg-naranja text-white' : 'bg-white text-stone-500 border border-stone-200'}`}>
            {label}
          </button>
        ))}
      </div>

      {ordenadas.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-stone-100">
          <div className="text-3xl mb-2">📭</div>
          <p className="text-sm text-stone-400">No hay negocios en este filtro.</p>
        </div>
      ) : (
        ordenadas.map(s => (
          <div key={s.id} className={`bg-white rounded-2xl border overflow-hidden ${s.sponsor ? 'border-purple-300 ring-1 ring-purple-200' : s.destacado ? 'border-naranja ring-1 ring-naranja/20' : 'border-stone-100'}`}>
            {editId === s.id ? (
              <NegocioForm
                form={editForm}
                setForm={setEditForm}
                onSave={saveEdit}
                onCancel={() => {
                  setEditId(null);
                  setEditForm(null);
                }}
              />
            ) : (
              <div>
                {s.imagen && <img src={s.imagen} alt={s.nombre} className="w-full h-32 object-cover bg-stone-100" />}

                <div className="p-4">
                  <div className="flex items-start justify-between mb-2 gap-3">
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm text-stone-800 truncate">{s.nombre}</h4>
                      <p className="text-xs text-stone-400">{s.rubro} · {s.zona}</p>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${estadoColors[s.estado || 'pendiente']}`}>
                      {estadoLabels[s.estado || 'pendiente']}
                    </span>
                  </div>

                  <p className="text-xs text-stone-500 mb-2 line-clamp-2">{s.desc}</p>

                  {s.tags && s.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {s.tags.slice(0, 5).map(tag => (
                        <span key={tag} className="text-[10px] bg-crema rounded-full px-2 py-0.5 text-stone-600 font-semibold">{tag}</span>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-1.5 flex-wrap mb-3">
                    {s.sponsor && <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-bold">🔥 Sponsor</span>}
                    {s.destacado && <span className="text-[10px] px-2 py-0.5 rounded-full bg-naranja/10 text-naranja font-bold">⭐ Destacado</span>}
                    <span className="text-[10px] text-stone-300">{formatTime(s.fecha)}</span>
                  </div>

                  <div className="flex gap-1.5 flex-wrap">
                    {(s.estado === 'pendiente' || !s.estado) && (
                      <>
                        <button onClick={() => { approveSolicitud(s.id); refresh(); }} className="bg-green-50 text-green-700 rounded-lg px-3 py-1.5 text-[11px] font-bold active:bg-green-100">✅ Aprobar</button>
                        <button onClick={() => { rejectSolicitud(s.id); refresh(); }} className="bg-red-50 text-red-700 rounded-lg px-3 py-1.5 text-[11px] font-bold active:bg-red-100">❌ Rechazar</button>
                      </>
                    )}

                    {s.estado === 'aprobado' && (
                      <button onClick={() => { updateSolicitud(s.id, { estado: 'pendiente' }); refresh(); }} className="bg-yellow-50 text-yellow-700 rounded-lg px-3 py-1.5 text-[11px] font-bold">↩ Pendiente</button>
                    )}

                    {s.estado === 'rechazado' && (
                      <button onClick={() => { updateSolicitud(s.id, { estado: 'pendiente' }); refresh(); }} className="bg-yellow-50 text-yellow-700 rounded-lg px-3 py-1.5 text-[11px] font-bold">↩ Revisar</button>
                    )}

                    <button onClick={() => { toggleDestacado(s.id); refresh(); }} className={`rounded-lg px-3 py-1.5 text-[11px] font-bold ${s.destacado ? 'bg-stone-100 text-stone-600' : 'bg-naranja/10 text-naranja'}`}>
                      {s.destacado ? 'Quitar destacado' : 'Destacar'}
                    </button>

                    <button onClick={() => { toggleSponsor(s.id); refresh(); }} className={`rounded-lg px-3 py-1.5 text-[11px] font-bold ${s.sponsor ? 'bg-purple-100 text-purple-700' : 'bg-purple-50 text-purple-500'}`}>
                      {s.sponsor ? 'Quitar sponsor' : 'Sponsor'}
                    </button>

                    <button onClick={() => startEdit(s)} className="bg-stone-100 text-stone-600 rounded-lg px-3 py-1.5 text-[11px] font-bold">✏️ Editar</button>
                    <button onClick={() => { if (confirm('¿Eliminar negocio?')) { deleteSolicitud(s.id); refresh(); } }} className="bg-red-50 text-red-500 rounded-lg px-3 py-1.5 text-[11px] font-bold">🗑️</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}


function ContenidoTab() {
  const EMPTY_CONTENT = {
    title: '',
    description: '',
    category: 'san-luis',
    type: 'actividad',
    mood: '',
    tags: '',
    location: 'San Luis',
    imageUrl: '',
    sponsorId: '',
    sponsor: false,
    featured: false,
    active: true,
    priority: 'normal',
    startsAt: '',
    endsAt: '',
    notes: '',
  };

  const CATEGORIES = [
    'san-luis',
    'aire-libre',
    'comer-barato',
    'modo-luchon',
    'juegos',
    'alta-fiaca',
    'amigos',
    'comida',
    'pelicula',
    'musica',
    'ejercicio',
    'general',
  ];

  const TYPES = [
    'actividad',
    'evento',
    'juego',
    'receta',
    'plan',
    'challenge',
    'lugar',
    'promo',
  ];

  const [data, setData] = useState(getContent());
  const [form, setForm] = useState(EMPTY_CONTENT);
  const [filter, setFilter] = useState('todos');
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');

  const refresh = () => setData(getContent());

  useEffect(() => {
    refresh();
  }, []);

  const resetForm = () => {
    setForm(EMPTY_CONTENT);
    setEditId(null);
  };

  const save = () => {
    if (!form.title.trim()) return;

    const payload = {
      ...form,
      tags: parseTags(form.tags),
      active: form.active !== false,
      featured: Boolean(form.featured),
      sponsor: Boolean(form.sponsor),
    };

    if (editId) {
      updateContent(editId, payload);
    } else {
      addContent(payload);
    }

    resetForm();
    refresh();
  };

  const startEdit = (item) => {
    setEditId(item.id);
    setForm({
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
      priority: item.priority || 'normal',
      startsAt: item.startsAt || '',
      endsAt: item.endsAt || '',
      notes: item.notes || '',
    });
  };

  const filtered = data.filter(item => {
    const matchesFilter = filter === 'todos'
      ? true
      : filter === 'activos'
      ? item.active !== false
      : filter === 'inactivos'
      ? item.active === false
      : filter === 'destacados'
      ? item.featured
      : filter === 'sponsors'
      ? item.sponsor
      : item.category === filter;

    const q = search.trim().toLowerCase();
    const matchesSearch = !q || [
      item.title,
      item.description,
      item.category,
      item.type,
      item.mood,
      item.location,
      ...(item.tags || []),
    ].join(' ').toLowerCase().includes(q);

    return matchesFilter && matchesSearch;
  });

  const counts = {
    total: data.length,
    activos: data.filter(item => item.active !== false).length,
    destacados: data.filter(item => item.featured).length,
  };

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-naranja to-orange-400 text-white rounded-2xl p-4 shadow-md">
        <h3 className="text-sm font-bold mb-1">📦 Base AIA</h3>
        <p className="text-xs opacity-90">Cargá planes, eventos, juegos, recetas y actividades. La AIA los usa desde suggestions.js.</p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white rounded-xl p-3 text-center border border-stone-100">
          <div className="text-xl font-extrabold text-stone-800">{counts.total}</div>
          <div className="text-[10px] text-stone-400">Total</div>
        </div>
        <div className="bg-green-50 rounded-xl p-3 text-center border border-green-100">
          <div className="text-xl font-extrabold text-green-700">{counts.activos}</div>
          <div className="text-[10px] text-green-500">Activos</div>
        </div>
        <div className="bg-naranja/10 rounded-xl p-3 text-center border border-naranja/20">
          <div className="text-xl font-extrabold text-naranja">{counts.destacados}</div>
          <div className="text-[10px] text-naranja">Destacados</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-stone-100 shadow-sm space-y-2">
        <h3 className="font-bold text-sm text-stone-800">{editId ? 'Editar contenido' : 'Nuevo contenido AIA'}</h3>

        <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm outline-none" placeholder="Título: Mate en el Parque de las Naciones" />

        <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm outline-none resize-none" rows={3} placeholder="Descripción útil y corta" />

        <div className="grid grid-cols-2 gap-2">
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="border rounded-lg px-2 py-2 text-xs outline-none bg-white">
            {CATEGORIES.map(category => <option key={category} value={category}>{category}</option>)}
          </select>

          <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="border rounded-lg px-2 py-2 text-xs outline-none bg-white">
            {TYPES.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>

        <input value={form.mood} onChange={e => setForm({ ...form, mood: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm outline-none" placeholder="Mood: aire, familia, amigos, fiaca, sin-plata" />
        <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm outline-none" placeholder="Tags: gratis, aire libre, amigos, evento" />
        <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm outline-none" placeholder="Ubicación / zona" />
        <input value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm outline-none" placeholder="URL imagen opcional" />

        <div className="grid grid-cols-2 gap-2">
          <input value={form.startsAt} onChange={e => setForm({ ...form, startsAt: e.target.value })} className="border rounded-lg px-3 py-2 text-xs outline-none" placeholder="Inicio evento opcional" />
          <input value={form.endsAt} onChange={e => setForm({ ...form, endsAt: e.target.value })} className="border rounded-lg px-3 py-2 text-xs outline-none" placeholder="Fin evento opcional" />
        </div>

        <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-xs outline-none bg-white">
          <option value="normal">Prioridad normal</option>
          <option value="alta">Prioridad alta</option>
          <option value="premium">Prioridad premium</option>
        </select>

        <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm outline-none resize-none" rows={2} placeholder="Notas internas" />

        <div className="grid grid-cols-3 gap-2">
          <button type="button" onClick={() => setForm({ ...form, active: !form.active })} className={`rounded-lg px-2 py-2 text-xs font-bold ${form.active ? 'bg-green-50 text-green-700' : 'bg-stone-100 text-stone-500'}`}>
            {form.active ? 'Activo' : 'Inactivo'}
          </button>

          <button type="button" onClick={() => setForm({ ...form, featured: !form.featured })} className={`rounded-lg px-2 py-2 text-xs font-bold ${form.featured ? 'bg-naranja/10 text-naranja' : 'bg-stone-100 text-stone-500'}`}>
            {form.featured ? 'Destacado' : 'No destacado'}
          </button>

          <button type="button" onClick={() => setForm({ ...form, sponsor: !form.sponsor })} className={`rounded-lg px-2 py-2 text-xs font-bold ${form.sponsor ? 'bg-purple-100 text-purple-700' : 'bg-stone-100 text-stone-500'}`}>
            {form.sponsor ? 'Sponsor' : 'No sponsor'}
          </button>
        </div>

        <div className="flex gap-2">
          <button onClick={save} className="flex-1 bg-naranja text-white rounded-lg py-2 text-xs font-bold">
            {editId ? 'Guardar cambios' : 'Cargar contenido'}
          </button>
          <button onClick={resetForm} className="px-4 bg-stone-100 rounded-lg py-2 text-xs font-bold">Cancelar</button>
        </div>
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
        {['todos', 'activos', 'inactivos', 'destacados', 'sponsors', ...CATEGORIES].map(key => (
          <button key={key} onClick={() => setFilter(key)} className={`px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all ${filter === key ? 'bg-naranja text-white' : 'bg-white text-stone-500 border border-stone-200'}`}>
            {key}
          </button>
        ))}
      </div>

      <input value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-white border border-stone-100 rounded-xl px-3 py-2 text-sm outline-none" placeholder="Buscar en Base AIA..." />

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-stone-100">
          <div className="text-3xl mb-2">📭</div>
          <p className="text-sm text-stone-400">No hay contenido en este filtro.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(item => (
            <div key={item.id} className={`bg-white rounded-2xl border overflow-hidden ${item.featured ? 'border-naranja ring-1 ring-naranja/20' : 'border-stone-100'}`}>
              {item.imageUrl && <img src={item.imageUrl} alt={item.title} className="w-full h-32 object-cover bg-stone-100" />}

              <div className="p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="min-w-0">
                    <h4 className="font-bold text-sm text-stone-800 truncate">{item.title}</h4>
                    <p className="text-xs text-stone-400">{item.category} · {item.type} · {item.location || 'sin ubicación'}</p>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${item.active !== false ? 'bg-green-50 text-green-700 border-green-200' : 'bg-stone-100 text-stone-500 border-stone-200'}`}>
                    {item.active !== false ? 'Activo' : 'Inactivo'}
                  </span>
                </div>

                <p className="text-xs text-stone-500 mb-2 line-clamp-3">{item.description}</p>

                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {item.tags.slice(0, 8).map(tag => (
                      <span key={tag} className="text-[10px] bg-crema rounded-full px-2 py-0.5 text-stone-600 font-semibold">{tag}</span>
                    ))}
                  </div>
                )}

                <div className="flex gap-1.5 flex-wrap mb-3">
                  {item.sponsor && <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-bold">🔥 Sponsor</span>}
                  {item.featured && <span className="text-[10px] px-2 py-0.5 rounded-full bg-naranja/10 text-naranja font-bold">⭐ Destacado</span>}
                  {item.mood && <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-bold">{item.mood}</span>}
                  <span className="text-[10px] text-stone-300">{formatTime(item.createdAt)}</span>
                </div>

                <div className="flex gap-1.5 flex-wrap">
                  <button onClick={() => { toggleContentActive(item.id); refresh(); }} className={`rounded-lg px-3 py-1.5 text-[11px] font-bold ${item.active !== false ? 'bg-stone-100 text-stone-600' : 'bg-green-50 text-green-700'}`}>
                    {item.active !== false ? 'Desactivar' : 'Activar'}
                  </button>

                  <button onClick={() => { toggleContentFeatured(item.id); refresh(); }} className={`rounded-lg px-3 py-1.5 text-[11px] font-bold ${item.featured ? 'bg-stone-100 text-stone-600' : 'bg-naranja/10 text-naranja'}`}>
                    {item.featured ? 'Quitar destacado' : 'Destacar'}
                  </button>

                  <button onClick={() => startEdit(item)} className="bg-stone-100 text-stone-600 rounded-lg px-3 py-1.5 text-[11px] font-bold">✏️ Editar</button>

                  <button onClick={() => { if (confirm('¿Eliminar contenido de Base AIA?')) { deleteAdminContent(item.id); refresh(); if (editId === item.id) resetForm(); } }} className="bg-red-50 text-red-500 rounded-lg px-3 py-1.5 text-[11px] font-bold">🗑️</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminPanel() {
  const [tab, setTab] = useState('dashboard');
  const [stats, setStats] = useState(getStats());
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setStats(getStats()), 2000);
    return () => clearInterval(interval);
  }, []);

  const topIntents = getTopIntents();
  const bottomIntents = getBottomIntents();
  const topSuggestions = getTopSuggestions();
  const topViewed = getMostViewedPlaces();
  const topSaved = getMostSavedPlaces();
  const topLocalities = getTopLocalities();
  const recentChats = getRecentChats();
  const dailyVisits = getDailyVisits();
  const solCounts = getSolicitudesCount();

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'negocios', label: 'Negocios', icon: '🏪', badge: solCounts.pendientes },
    { id: 'contenido', label: 'Base AIA', icon: '📦' },
    { id: 'aia', label: 'AIA', icon: '🧠' },
    { id: 'intents', label: 'Consultas', icon: '🔍' },
    { id: 'lugares', label: 'Lugares', icon: '📍' },
    { id: 'ubicaciones', label: 'Ubicaciones', icon: '🗺️' },
    { id: 'visitas', label: 'Visitas', icon: '👁️' },
    { id: 'chat', label: 'Historial', icon: '💬' },
    { id: 'config', label: 'Config', icon: '⚙️' },
  ];

  return (
    <div className="px-4 pt-safe pb-4">
      <div className="pt-6 pb-4 flex items-center gap-3">
        <CookieLogo size={32} />
        <div>
          <h2 className="text-2xl font-extrabold text-stone-800">Panel Admin</h2>
          <p className="text-xs text-stone-400">Estadísticas, AIA y control comercial</p>
        </div>
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-3 scrollbar-hide -mx-4 px-4">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`relative px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${tab === t.id ? 'bg-naranja text-white shadow-md shadow-naranja/20' : 'bg-white text-stone-500 border border-stone-200'}`}>
            {t.icon} {t.label}
            {t.badge > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold">{t.badge}</span>}
          </button>
        ))}
      </div>

      {tab === 'dashboard' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-naranja to-orange-400 text-white rounded-2xl p-4 shadow-md">
            <h3 className="text-sm font-bold mb-2">🔥 Qué está pasando ahora</h3>
            <div className="text-xs space-y-1 opacity-95">
              <div>👉 La gente busca: <b>{topIntents[0]?.intent || 'sin datos'}</b></div>
              <div>👉 Zona activa: <b>{topLocalities[0]?.localidad || 'sin datos'}</b></div>
              <div>👉 Sugerencia fuerte: <b>{topSuggestions[0]?.suggestion || 'sin datos'}</b></div>
              <div>👉 Acción recomendada: <b>{inferOpportunity(topIntents, topSuggestions, topLocalities)}</b></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Visitas totales" value={stats.totalVisits || 0} icon="👁️" />
            <StatCard label="Chats" value={stats.totalChats || 0} icon="💬" color="blue" />
            <StatCard label="Búsquedas" value={stats.totalSearches || 0} icon="🔍" color="green" />
            <StatCard label="Solicitudes" value={solCounts.total || 0} icon="🏪" color="purple" />
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100">
            <h3 className="font-bold text-sm text-stone-800 mb-3">Top consultas</h3>
            {topIntents.length > 0 ? <BarChart data={topIntents.slice(0, 6)} /> : <p className="text-xs text-stone-400">Sin datos todavía.</p>}
          </div>
        </div>
      )}

      {tab === 'negocios' && <NegociosTab />}

      {tab === 'contenido' && <ContenidoTab />}

      {tab === 'aia' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100">
            <h3 className="font-bold text-sm text-stone-800 mb-2">🧠 Lectura automática</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              La AIA debería reforzar contenido sobre <b>{topIntents[0]?.intent || 'las consultas más repetidas'}</b>.
              Si hay frases sin entender, conviene crear nuevas reglas, tags o categorías.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100">
            <h3 className="font-bold text-sm text-stone-800 mb-3">Categorías con oportunidad</h3>
            {topIntents.length > 0 ? <BarChart data={topIntents.slice(0, 8)} /> : <p className="text-xs text-stone-400">Todavía no hay consultas.</p>}
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100">
            <h3 className="font-bold text-sm text-stone-800 mb-3">Consultas sin uso / mejorar</h3>
            {bottomIntents.length > 0 ? (
              <div className="space-y-1">
                {bottomIntents.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-stone-50">
                    <span className="text-stone-400">{item.intent}</span>
                    <span className="text-red-400 font-medium">revisar</span>
                  </div>
                ))}
              </div>
            ) : <p className="text-xs text-green-500 font-medium">No hay alertas fuertes por ahora.</p>}
          </div>
        </div>
      )}

      {tab === 'intents' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100">
            <h3 className="font-bold text-sm text-stone-800 mb-3">Consultas más populares</h3>
            {topIntents.length > 0 ? <BarChart data={topIntents} /> : <p className="text-xs text-stone-400">Sin datos.</p>}
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100">
            <h3 className="font-bold text-sm text-stone-800 mb-3">Sugerencias clickeadas</h3>
            {topSuggestions.length > 0 ? <BarChart data={topSuggestions} /> : <p className="text-xs text-stone-400">Sin datos.</p>}
          </div>
        </div>
      )}

      {tab === 'lugares' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100">
            <h3 className="font-bold text-sm text-stone-800 mb-3">Lugares más vistos</h3>
            {topViewed.length > 0 ? <BarChart data={topViewed.map(v => ({ intent: getPlaceName(v.placeId), count: v.count }))} /> : <p className="text-xs text-stone-400">Sin datos.</p>}
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100">
            <h3 className="font-bold text-sm text-stone-800 mb-3">Lugares más guardados</h3>
            {topSaved.length > 0 ? <BarChart data={topSaved.map(v => ({ intent: getPlaceName(v.placeId), count: v.count }))} /> : <p className="text-xs text-stone-400">Sin datos.</p>}
          </div>
        </div>
      )}

      {tab === 'ubicaciones' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100">
            <h3 className="font-bold text-sm text-stone-800 mb-3">Localidades más consultadas</h3>
            {topLocalities.length > 0 ? <BarChart data={topLocalities} /> : <p className="text-xs text-stone-400">Sin datos.</p>}
          </div>
        </div>
      )}

      {tab === 'visitas' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Hoy" value={stats.dailyVisits?.[new Date().toISOString().split('T')[0]] || 0} icon="📅" />
            <StatCard label="Total" value={stats.totalVisits || 0} icon="📊" />
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100">
            <h3 className="font-bold text-sm text-stone-800 mb-3">Visitas últimos 14 días</h3>
            {dailyVisits.length > 0 ? (
              <div className="space-y-2">
                {dailyVisits.map(([date, count], i) => {
                  const max = Math.max(...dailyVisits.map(d => d[1]), 1);
                  return (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-xs text-stone-400 w-20">{date}</span>
                      <div className="flex-1 bg-stone-100 rounded-full h-4 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-naranja to-orange-400 rounded-full flex items-center justify-end pr-2" style={{ width: `${Math.max((count / max) * 100, 10)}%` }}>
                          <span className="text-[9px] text-white font-bold">{count}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : <p className="text-xs text-stone-400">Sin datos.</p>}
          </div>
        </div>
      )}

      {tab === 'chat' && (
        <div className="space-y-3">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100">
            <h3 className="font-bold text-sm text-stone-800 mb-3">Historial ({recentChats.length})</h3>
            {recentChats.length > 0 ? (
              <div className="space-y-3">
                {recentChats.map((chat, i) => (
                  <div key={i} className="bg-crema/50 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-stone-400">{formatTime(chat.timestamp)}</span>
                      {chat.intent && <span className="text-[10px] font-semibold bg-naranja-light text-naranja px-2 py-0.5 rounded-full">{chat.intent}</span>}
                    </div>
                    <p className="text-sm text-stone-700">{chat.message}</p>
                  </div>
                ))}
              </div>
            ) : <p className="text-xs text-stone-400">Sin historial.</p>}
          </div>
        </div>
      )}

      {tab === 'config' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100">
            <h3 className="font-bold text-sm text-stone-800 mb-3">Datos</h3>
            <button onClick={() => {
              if (confirmReset) {
                resetStats();
                localStorage.removeItem('mcrocante_solicitudes');
                setConfirmReset(false);
              } else {
                setConfirmReset(true);
                setTimeout(() => setConfirmReset(false), 5000);
              }
            }} className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${confirmReset ? 'bg-red-500 text-white animate-pulse' : 'bg-red-50 text-red-500'}`}>
              {confirmReset ? 'Confirmar reset? (toca de nuevo)' : 'Resetear todo'}
            </button>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100">
            <h3 className="font-bold text-sm text-stone-800 mb-3">Info</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-1 border-b border-stone-50"><span className="text-stone-500">Versión</span><span className="font-medium">1.2.0</span></div>
              <div className="flex justify-between py-1 border-b border-stone-50"><span className="text-stone-500">Stack</span><span className="font-medium">React + Vite + Tailwind</span></div>
              <div className="flex justify-between py-1 border-b border-stone-50"><span className="text-stone-500">Lugares</span><span className="font-medium">{DATA.length}</span></div>
              <div className="flex justify-between py-1 border-b border-stone-50"><span className="text-stone-500">Recetas</span><span className="font-medium">{Array.isArray(RECETAS) ? RECETAS.length : Object.keys(RECETAS || {}).length}</span></div>
              <div className="flex justify-between py-1 border-b border-stone-50"><span className="text-stone-500">Localidades</span><span className="font-medium">{Object.keys(LOCALIDADES_SL).length}</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
