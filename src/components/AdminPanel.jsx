import React from "react";
import { useState, useEffect } from 'react';
import CookieLogo from './CookieLogo';
import {
  getStats, getTopIntents, getBottomIntents, getTopSuggestions,
  getMostViewedPlaces, getMostSavedPlaces, getTopLocalities,
  getRecentChats, getDailyVisits, resetStats
} from '../utils/adminStats';
import { getSolicitudes, updateSolicitud, deleteSolicitud, getSolicitudesCount } from '../utils/solicitudes';
import { DATA } from '../data/places';
import { LOCALIDADES_SL } from '../data/localidades';

function getPlaceName(id) {
  const place = DATA.find(d => d.id === id);
  return place ? place.nombre : `ID ${id}`;
}

function formatTime(ts) {
  const d = new Date(ts);
  return `${d.getDate()}/${d.getMonth() + 1} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function StatCard({ label, value, icon, color = 'naranja' }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${color === 'naranja' ? 'bg-naranja/10' : color === 'green' ? 'bg-green-50' : color === 'blue' ? 'bg-blue-50' : 'bg-purple-50'}`}>
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
  const max = maxVal || Math.max(...data.map(d => d.count || d[1]), 1);
  return (
    <div className="space-y-2">
      {data.map((item, i) => {
        const count = item.count || item[1];
        const label = item.intent || item.suggestion || item.localidad || item[0] || item.nombre;
        const pct = (count / max) * 100;
        return (
          <div key={i} className="flex items-center gap-2">
            <span className="text-xs text-stone-500 w-28 truncate font-medium">{label}</span>
            <div className="flex-1 bg-stone-100 rounded-full h-5 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-naranja to-orange-400 rounded-full transition-all duration-500 flex items-center justify-end pr-2" style={{ width: `${Math.max(pct, 8)}%` }}>
                <span className="text-[10px] text-white font-bold">{count}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function NegociosTab() {
  const [solicitudes, setSolicitudes] = useState(getSolicitudes());
  const [filter, setFilter] = useState('todas');
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => setSolicitudes(getSolicitudes()), 1000);
    return () => clearInterval(interval);
  }, []);

  const counts = getSolicitudesCount();

  const filtered = filter === 'todas' ? solicitudes : solicitudes.filter(s => s.estado === filter);
  const ordenadas = [...filtered].sort((a, b) => {
    if (a.destacado && !b.destacado) return -1;
    if (!a.destacado && b.destacado) return 1;
    return new Date(b.fecha) - new Date(a.fecha);
  });

  const handleAction = (id, action) => {
    if (action === 'delete') {
      deleteSolicitud(id);
    } else if (action === 'save') {
      updateSolicitud(id, editForm);
      setEditId(null);
      setEditForm(null);
    } else {
      updateSolicitud(id, { estado: action });
    }
    setSolicitudes(getSolicitudes());
  };

  const startEdit = (s) => {
    setEditId(s.id);
    setEditForm({ ...s });
  };

  const estadoColors = { pendiente: 'bg-yellow-50 text-yellow-700 border-yellow-200', aprobado: 'bg-green-50 text-green-700 border-green-200', rechazado: 'bg-red-50 text-red-700 border-red-200' };
  const estadoLabels = { pendiente: '⏳ Pendiente', aprobado: '✅ Aprobado', rechazado: '❌ Rechazado' };

  return (
    <div className="space-y-4">
      {/* Counts */}
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-white rounded-xl p-3 text-center border border-stone-100">
          <div className="text-xl font-extrabold text-stone-800">{counts.total}</div>
          <div className="text-[10px] text-stone-400">Total</div>
        </div>
        <div className="bg-yellow-50 rounded-xl p-3 text-center border border-yellow-100">
          <div className="text-xl font-extrabold text-yellow-700">{counts.pendientes}</div>
          <div className="text-[10px] text-yellow-500">Pendientes</div>
        </div>
        <div className="bg-green-50 rounded-xl p-3 text-center border border-green-100">
          <div className="text-xl font-extrabold text-green-700">{counts.aprobados}</div>
          <div className="text-[10px] text-green-500">Aprobados</div>
        </div>
        <div className="bg-red-50 rounded-xl p-3 text-center border border-red-100">
          <div className="text-xl font-extrabold text-red-700">{counts.rechazados}</div>
          <div className="text-[10px] text-red-500">Rechazados</div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-1.5">
        {[['todas', 'Todas'], ['pendiente', 'Pendientes'], ['aprobado', 'Aprobados'], ['rechazado', 'Rechazados']].map(([key, label]) => (
          <button key={key} onClick={() => setFilter(key)} className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all ${filter === key ? 'bg-naranja text-white' : 'bg-white text-stone-500 border border-stone-200'}`}>{label}</button>
        ))}
      </div>

      {/* List */}
      {ordenadas.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-stone-100">
          <div className="text-3xl mb-2">📭</div>
          <p className="text-sm text-stone-400">No hay solicitudes todavia.</p>
        </div>
      ) : (
        ordenadas.map(s => (
          <div key={s.id} className={`bg-white rounded-2xl border overflow-hidden ${s.destacado ? 'border-naranja ring-1 ring-naranja/20' : 'border-stone-100'}`}>
            {editId === s.id ? (
              <div className="p-4 space-y-2">
                <input value={editForm.nombre} onChange={e => setEditForm({...editForm, nombre: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm outline-none" placeholder="Nombre" />
                <input value={editForm.rubro} onChange={e => setEditForm({...editForm, rubro: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm outline-none" placeholder="Rubro" />
                <input value={editForm.zona} onChange={e => setEditForm({...editForm, zona: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm outline-none" placeholder="Zona" />
                <textarea value={editForm.desc} onChange={e => setEditForm({...editForm, desc: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm outline-none resize-none" rows={2} placeholder="Descripcion" />
                <input value={editForm.promo || ''} onChange={e => setEditForm({...editForm, promo: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm outline-none" placeholder="Promo" />
                <div className="flex gap-2">
                  <button onClick={() => handleAction(s.id, 'save')} className="flex-1 bg-naranja text-white rounded-lg py-2 text-xs font-bold">Guardar</button>
                  <button onClick={() => { setEditId(null); setEditForm(null); }} className="px-4 bg-stone-100 rounded-lg py-2 text-xs font-bold">Cancelar</button>
                </div>
              </div>
            ) : (
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-bold text-sm text-stone-800">{s.nombre}</h4>
                    <p className="text-xs text-stone-400">{s.rubro} · {s.zona}</p>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${estadoColors[s.estado || 'pendiente']}`}>{estadoLabels[s.estado || 'pendiente']}</span>
                </div>
                <p className="text-xs text-stone-500 mb-2">{s.desc}</p>
                {s.promo && <p className="text-xs text-naranja font-medium mb-2">🔥 {s.promo}</p>}
                <p className="text-[10px] text-stone-300 mb-3">{formatTime(s.fecha)}</p>

                <div className="flex gap-1.5 flex-wrap">
                  {(s.estado === 'pendiente' || !s.estado) && (
                    <>
                      <button onClick={() => handleAction(s.id, 'aprobado')} className="bg-green-50 text-green-700 rounded-lg px-3 py-1.5 text-[11px] font-bold active:bg-green-100">✅ Aprobar</button>
                      <button onClick={() => handleAction(s.id, 'rechazado')} className="bg-red-50 text-red-700 rounded-lg px-3 py-1.5 text-[11px] font-bold active:bg-red-100">❌ Rechazar</button>
                    </>
                  )}
                  {s.estado === 'aprobado' && (
                    <button onClick={() => handleAction(s.id, 'pendiente')} className="bg-yellow-50 text-yellow-700 rounded-lg px-3 py-1.5 text-[11px] font-bold">↩ Volver a pendiente</button>
                  )}
                  <button onClick={() => handleAction(s.id, s.destacado ? 'quitar' : 'destacar')} className={`rounded-lg px-3 py-1.5 text-[11px] font-bold ${s.destacado ? 'bg-stone-100 text-stone-600' : 'bg-naranja/10 text-naranja'}`}>{s.destacado ? '⭐ Quitar destacado' : '☆ Destacar'}</button>
                  <button onClick={() => startEdit(s)} className="bg-stone-100 text-stone-600 rounded-lg px-3 py-1.5 text-[11px] font-bold">✏️ Editar</button>
                  <button onClick={() => { if (confirm('Eliminar solicitud?')) handleAction(s.id, 'delete'); }} className="bg-red-50 text-red-500 rounded-lg px-3 py-1.5 text-[11px] font-bold">🗑️</button>
                </div>
              </div>
            )}
          </div>
        ))
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

  function NegociosSection() {
    const [sols, setSols] = useState(getSolicitudes());
    useEffect(() => {
      const t = setInterval(() => setSols(getSolicitudes()), 1500);
      return () => clearInterval(t);
    }, []);
    const approve = (id) => updateSolicitud(id, { estado: 'aprobado' });
    const reject = (id) => updateSolicitud(id, { estado: 'rechazado' });
    const toggleDest = (id) => {
      const s = sols.find(x => x.id === id);
      if (!s) return;
      updateSolicitud(id, { destacado: !s.destacado });
      setSols(getSolicitudes());
    };
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100">
          <h3 className="font-bold text-sm text-stone-800 mb-3">Solicitudes de emprendimientos</h3>
          {sols.length === 0 ? (
            <p className="text-xs text-stone-400">Sin solicitudes</p>
          ) : (
            sols.map(s => (
              <div key={s.id} className="flex items-center justify-between py-2 border-b border-stone-50">
                <div className="text-sm text-stone-700">{s.nombre || s.nombreEmp || s.nombreEmpresa || 'Emprendimiento'}</div>
                <div className="flex gap-2">
                  <button onClick={() => approve(s.id)} className="px-2 py-1 text-xs bg-green-50 text-green-700 rounded">Aprobar</button>
                  <button onClick={() => reject(s.id)} className="px-2 py-1 text-xs bg-red-50 text-red-700 rounded">Rechazar</button>
                  <button onClick={() => toggleDest(s.id)} className="px-2 py-1 text-xs bg-yellow-50 text-yellow-700 rounded">{s.destacado ? 'Destacado' : 'Destacar'}</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'negocios', label: 'Negocios', icon: '🏪', badge: solCounts.pendientes },
    { id: 'intents', label: 'Consultas', icon: '🔍' },
    { id: 'lugares', label: 'Lugares', icon: '📍' },
    { id: 'ubicaciones', label: 'Ubicaciones', icon: '🗺️' },
    { id: 'visitas', label: 'Visitas', icon: '👁️' },
    { id: 'chat', label: 'Historial', icon: '💬' },
    { id: 'config', label: 'Config', icon: '⚙️' }
  ];

  return (
    <div className="px-4 pt-safe pb-4">
      <div className="pt-6 pb-4 flex items-center gap-3">
        <CookieLogo size={32} />
        <div>
          <h2 className="text-2xl font-extrabold text-stone-800">Panel Admin</h2>
          <p className="text-xs text-stone-400">Estadisticas y control</p>
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

      {tab === 'negocios' && <NegociosSection />}
      {tab === 'dashboard' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Visitas totales" value={stats.totalVisits} icon="👁️" />
            <StatCard label="Chats" value={stats.totalChats} icon="💬" color="blue" />
            <StatCard label="Busquedas" value={stats.totalSearches} icon="🔍" color="green" />
            <StatCard label="Solicitudes" value={solCounts.total} icon="🏪" color="purple" />
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100">
            <h3 className="font-bold text-sm text-stone-800 mb-3">Top consultas</h3>
            {topIntents.length > 0 ? <BarChart data={topIntents.slice(0, 6)} /> : <p className="text-xs text-stone-400">Sin datos todavia.</p>}
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100">
            <h3 className="font-bold text-sm text-stone-800 mb-3">Ultimas busquedas</h3>
            {recentChats.length > 0 ? (
              <div className="space-y-2">
                {recentChats.slice(0, 5).map((chat, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <span className="text-stone-300 w-24">{formatTime(chat.timestamp)}</span>
                    <span className="text-stone-600 flex-1 truncate">{chat.message}</span>
                    {chat.intent && <span className="bg-naranja-light text-naranja px-2 py-0.5 rounded-full font-medium">{chat.intent}</span>}
                  </div>
                ))}
              </div>
            ) : <p className="text-xs text-stone-400">Sin actividad reciente.</p>}
          </div>
        </div>
      )}

      {tab === 'negocios' && <NegociosTab />}

      {tab === 'intents' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100">
            <h3 className="font-bold text-sm text-stone-800 mb-3">Consultas mas populares</h3>
            {topIntents.length > 0 ? <BarChart data={topIntents} /> : <p className="text-xs text-stone-400">Sin datos.</p>}
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100">
            <h3 className="font-bold text-sm text-stone-800 mb-3">Consultas sin usar</h3>
            {bottomIntents.length > 0 ? (
              <div className="space-y-1">
                {bottomIntents.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-stone-50">
                    <span className="text-stone-400">{item.intent}</span>
                    <span className="text-red-400 font-medium">0 usos</span>
                  </div>
                ))}
              </div>
            ) : <p className="text-xs text-green-500 font-medium">Todas usadas! ✅</p>}
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
            <h3 className="font-bold text-sm text-stone-800 mb-3">Lugares mas vistos</h3>
            {topViewed.length > 0 ? <BarChart data={topViewed.map(v => ({ intent: getPlaceName(v.placeId), count: v.count }))} /> : <p className="text-xs text-stone-400">Sin datos.</p>}
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100">
            <h3 className="font-bold text-sm text-stone-800 mb-3">Lugares mas guardados</h3>
            {topSaved.length > 0 ? <BarChart data={topSaved.map(v => ({ intent: getPlaceName(v.placeId), count: v.count }))} /> : <p className="text-xs text-stone-400">Sin datos.</p>}
          </div>
        </div>
      )}

      {tab === 'ubicaciones' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100">
            <h3 className="font-bold text-sm text-stone-800 mb-3">Localidades mas consultadas</h3>
            {topLocalities.length > 0 ? <BarChart data={topLocalities} /> : <p className="text-xs text-stone-400">Sin datos.</p>}
          </div>
        </div>
      )}

      {tab === 'visitas' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Hoy" value={stats.dailyVisits[new Date().toISOString().split('T')[0]] || 0} icon="📅" />
            <StatCard label="Total" value={stats.totalVisits} icon="📊" />
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100">
            <h3 className="font-bold text-sm text-stone-800 mb-3">Visitas ultimos 14 dias</h3>
            {dailyVisits.length > 0 ? (
              <div className="space-y-2">
                {dailyVisits.map(([date, count], i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-xs text-stone-400 w-20">{date}</span>
                    <div className="flex-1 bg-stone-100 rounded-full h-4 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-naranja to-orange-400 rounded-full flex items-center justify-end pr-2" style={{ width: `${Math.max((count / Math.max(...dailyVisits.map(d => d[1]))) * 100, 10)}%` }}>
                        <span className="text-[9px] text-white font-bold">{count}</span>
                      </div>
                    </div>
                  </div>
                ))}
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
            <button onClick={() => { if (confirmReset) { resetStats(); localStorage.removeItem('mcrocante_solicitudes'); setConfirmReset(false); } else { setConfirmReset(true); setTimeout(() => setConfirmReset(false), 5000); } }} className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${confirmReset ? 'bg-red-500 text-white animate-pulse' : 'bg-red-50 text-red-500'}`}>
              {confirmReset ? 'Confirmar reset? (toca de nuevo)' : 'Resetear todo'}
            </button>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100">
            <h3 className="font-bold text-sm text-stone-800 mb-3">Info</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-1 border-b border-stone-50"><span className="text-stone-500">Version</span><span className="font-medium">1.1.0</span></div>
              <div className="flex justify-between py-1 border-b border-stone-50"><span className="text-stone-500">Stack</span><span className="font-medium">React + Vite + Tailwind</span></div>
              <div className="flex justify-between py-1 border-b border-stone-50"><span className="text-stone-500">Lugares</span><span className="font-medium">{DATA.length}</span></div>
              <div className="flex justify-between py-1 border-b border-stone-50"><span className="text-stone-500">Recetas</span><span className="font-medium">{RECETAS?.length || 12}</span></div>
              <div className="flex justify-between py-1 border-b border-stone-50"><span className="text-stone-500">Localidades</span><span className="font-medium">{Object.keys(LOCALIDADES_SL).length}</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
