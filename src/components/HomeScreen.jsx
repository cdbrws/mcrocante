import React, { useState } from 'react';
import CookieLogo from './CookieLogo';
import AiaIcon from './AiaIcon';
import iPhoneMockup from './iPhoneMockup';
import EntrepreneurCard from './EntrepreneurCard';

const ALL_CATEGORIES = [
  { id: 'sinmango', emoji: '🆓', label: 'Planes gratis', msg: 'No tengo un mango, busco planes gratis' },
  { id: 'comer', emoji: '🍔', label: 'Comer rico', msg: 'Quiero comer algo rico' },
  { id: 'chicos', emoji: '🎈', label: 'Con los pibes', msg: 'Busco planes para hacer con los pibes' },
  { id: 'eventos', emoji: '🎉', label: 'Quiero salir', msg: 'Quiero salir, que hay hoy?' },
  { id: 'cerca', emoji: '📍', label: 'Cerca mio', msg: 'Quiero opciones cerca mio' },
  { id: 'pareja', emoji: '💑', label: 'En pareja', msg: 'Busco un plan para ir en pareja' },
  { id: 'noche', emoji: '🌙', label: 'Salir de noche', msg: 'Que hay para hacer de noche?' },
  { id: 'aire', emoji: '🏔️', label: 'Aire libre', msg: 'Quiero algo en aire libre' },
  { id: 'lluvia', emoji: '🌧️', label: 'Llueve', msg: 'Esta lloviendo, que puedo hacer?' },
  { id: 'fiaca', emoji: '🛋️', label: 'Alta fiaca', msg: 'Alta fiaca de moverme, que hago?' },
  { id: 'musica', emoji: '🎸', label: 'Musica', msg: 'Recomendame musica para escuchar' },
  { id: 'peli', emoji: '🎬', label: 'Ver peli', msg: 'Recomendame una peli para ver' },
];

function shuffleArray(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function HomeScreen({ onCategory, crocante, emprendedores, onEmprendedores }) {
  const [categories] = useState(() => shuffleArray(ALL_CATEGORIES).slice(0, 8));

  return (
    <div className="flex flex-col">
      {/* HERO SECTION */}
      <div className="relative bg-gradient-to-br from-crema via-white to-naranja-light overflow-hidden">
        <div className="px-5 pt-8 pb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="relative">
              <CookieLogo size={44} />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-stone-800 tracking-tight">Modo Crocante</h1>
              <p className="text-xs text-stone-400 font-medium">Tu guia local de San Luis</p>
              <div className="text-xs text-stone-500 uppercase tracking-wide mt-1">AIA PUNTANA</div>
            </div>
          </div>

          {/* Inicio simulado con iPhone (ver iPhoneMockup) */}
          <div className="mb-2" />

        <div className="flex justify-center mt-2">
          <button onClick={() => onCategory('start')} className="bg-naranja text-white font-bold px-6 py-3 rounded-full shadow-md">Iniciar Conversación</button>
        </div>
        </div>

        {/* Ejemplos - tarjetas rápidas para empezar (rotativas) */}
    {/* CHIPS RAPIDOS */}
<div className="px-5 mt-6 mb-6">
  <div className="flex flex-wrap gap-3">
    {[
      { label: "😴 Estoy aburrido", key: "ideas", color: "bg-orange-100 text-orange-700" },
      { label: "🆓 No tengo un mango", key: "sinmango", color: "bg-green-100 text-green-700" },
      { label: "🍝 Quiero comer barato", key: "comer", color: "bg-yellow-100 text-yellow-700" },
      { label: "🏠 Algo en casa", key: "fiaca", color: "bg-purple-100 text-purple-700" },
      { label: "🚶 Quiero moverme", key: "aire", color: "bg-emerald-100 text-emerald-700" },
      { label: "👥 Plan con amigos", key: "chicos", color: "bg-rose-100 text-rose-700" },
      { label: "🧉 Estoy de visita", key: "cerca", color: "bg-indigo-100 text-indigo-700" },
      { label: "🎲 Sorprendeme", key: "ideas", color: "bg-pink-100 text-pink-700" },
    ].map((item, i) => (
      <button
        key={i}
        onClick={() => onCategory(item.key)}
        className={`${item.color} px-4 py-3 rounded-full text-sm font-bold shadow-sm active:scale-[0.96] transition-all`}
      >
        {item.label}
      </button>
    ))}
  </div>
</div>
            ))}
          </div>
        </div>

        <div className="flex justify-center -mt-2 -mb-4">
          <iPhoneMockup />
        </div>
      </div>

      {/* CROCANTE DEL DIA */}
      {crocante && (
        <div className="px-5 mt-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-naranja/10 rounded-lg flex items-center justify-center text-sm">🔥</div>
            <h3 className="text-base font-extrabold text-stone-800">Plan crocante del dia</h3>
          </div>
          <button
            onClick={() => onCategory('cerca')}
            className="w-full bg-white rounded-2xl p-4 shadow-sm text-left active:scale-[0.98] transition-transform border border-stone-100"
          >
            <div className="font-bold text-stone-800">{crocante.titulo}</div>
            <p className="text-xs text-stone-500 mt-1 leading-relaxed line-clamp-2">{crocante.desc}</p>
            <div className="flex gap-2 mt-3">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-naranja-light text-naranja">📍 {crocante.zona}</span>
            </div>
          </button>
        </div>
      )}

      {/* CATEGORIAS FLOTANTES */}
      <div className="px-5 mt-8">
        <h3 className="text-base font-extrabold text-stone-800 mb-3">Que queres hacer?</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => onCategory(cat.id)}
              className="bg-white rounded-full px-4 py-2.5 flex items-center gap-2 shadow-sm active:scale-[0.95] transition-all border border-stone-100"
            >
              <span className="text-lg">{cat.emoji}</span>
              <span className="text-[12px] font-bold text-stone-700">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* EMPRENDEDORES (rotan aleatorio) */}
      {emprendedores.length > 0 && (
        <div className="px-5 mt-6 mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-naranja/10 rounded-lg flex items-center justify-center text-sm">🏪</div>
              <h3 className="text-base font-extrabold text-stone-800">Emprendimientos</h3>
            </div>
            <button onClick={onEmprendedores} className="text-xs font-semibold text-naranja">Ver todos →</button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 snap-x">
            {shuffleArray(emprendedores).slice(0, 4).map(emp => (
              <div key={emp.id} className="min-w-[260px] snap-start">
                <EntrepreneurCard item={emp} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Espacio Emprendedores y CTA de aparecer removidos para simplificar inicio según diseño */}
    </div>
  );
}
