import React from "react";
import { useState } from 'react';
import { DATA } from '../data/places';
import PlaceCard from './PlaceCard';
import CookieLogo from './CookieLogo';

export default function RecoScreen({ savedIds, onToggleSave }) {
  const [filter, setFilter] = useState('todos');
  const [zoneFilter, setZoneFilter] = useState('todas');

  const filtered = DATA.filter(item => {
    if (filter !== 'todos') {
      if (!item.categorias.includes(filter)) return false;
    }
    if (zoneFilter !== 'todas' && item.zona !== zoneFilter) return false;
    return true;
  });

  const zones = [...new Set(DATA.map(i => i.zona))];

  return (
    <div className="px-5 pt-safe">
      <div className="pt-6 pb-4 flex items-center gap-3">
        <CookieLogo size={32} />
        <div>
          <h2 className="text-2xl font-extrabold text-stone-800">Explorar</h2>
          <p className="text-xs text-stone-400">Todo San Luis para vos</p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
        {['todos', 'gratis', 'comida', 'salidas', 'eventos', 'chicos', 'aire libre'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all active:scale-95 ${filter === f ? 'bg-naranja text-white shadow-md shadow-naranja/20' : 'bg-white text-stone-500 border border-stone-200'}`}>
            {f === 'todos' ? 'Todos' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-3 -mx-5 px-5 scrollbar-hide">
        <button onClick={() => setZoneFilter('todas')} className={`px-3 py-1.5 rounded-full text-[10px] font-semibold whitespace-nowrap transition-all ${zoneFilter === 'todas' ? 'bg-stone-800 text-white' : 'bg-stone-100 text-stone-500'}`}>Todas</button>
        {zones.map(z => (
          <button key={z} onClick={() => setZoneFilter(z)} className={`px-3 py-1.5 rounded-full text-[10px] font-semibold whitespace-nowrap transition-all ${zoneFilter === z ? 'bg-stone-800 text-white' : 'bg-stone-100 text-stone-500'}`}>{z}</button>
        ))}
      </div>

      <div className="text-xs text-stone-400 mt-1 mb-3 font-medium">{filtered.length} resultados</div>
      <div className="flex flex-col gap-3">
        {filtered.map(item => (
          <PlaceCard key={item.id} item={item} saved={savedIds.includes(item.id)} onToggleSave={onToggleSave} />
        ))}
      </div>
    </div>
  );
}
