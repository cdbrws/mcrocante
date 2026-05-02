import React, { useState } from 'react';
import CookieLogo from './CookieLogo';
import iPhoneMockup from './iPhoneMockup';
import EntrepreneurCard from './EntrepreneurCard';

const ALL_CATEGORIES = [
  { id: 'sinmango', label: 'Planes gratis' },
  { id: 'comer', label: 'Comer rico' },
  { id: 'chicos', label: 'Con los pibes' },
  { id: 'eventos', label: 'Quiero salir' },
  { id: 'cerca', label: 'Cerca mio' },
  { id: 'pareja', label: 'En pareja' },
  { id: 'noche', label: 'Salir de noche' },
  { id: 'aire', label: 'Aire libre' },
  { id: 'lluvia', label: 'Llueve' },
  { id: 'fiaca', label: 'Alta fiaca' },
  { id: 'musica', label: 'Musica' },
  { id: 'peli', label: 'Ver peli' },
];

function shuffleArray(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// 🔥 NUEVO: chips dinámicos según hora
function getDynamicChips() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return [
      { label: 'Desayuno barato', key: 'comer' },
      { label: 'Arrancar tranqui', key: 'fiaca' },
      { label: 'Mate en plaza', key: 'aire' },
      { label: 'Algo rápido', key: 'start' },
      { label: 'Sin gastar', key: 'sinmango' },
    ];
  }

  if (hour < 18) {
    return [
      { label: 'Salir a caminar', key: 'aire' },
      { label: 'Plan con chicos', key: 'chicos' },
      { label: 'Comer algo', key: 'comer' },
      { label: 'Cerca mio', key: 'cerca' },
      { label: 'Algo distinto', key: 'start' },
    ];
  }

  return [
    { label: 'Plan noche', key: 'noche' },
    { label: 'Ver peli', key: 'peli' },
    { label: 'Algo tranqui', key: 'fiaca' },
    { label: 'Plan en pareja', key: 'pareja' },
    { label: 'Sin gastar', key: 'sinmango' },
  ];
}

export default function HomeScreen({
  onCategory,
  crocante,
  emprendedores,
  onEmprendedores,
}) {
  const [categories] = useState(() => shuffleArray(ALL_CATEGORIES).slice(0, 8));
  const [quickChips] = useState(() => getDynamicChips());

  return (
    <div className="flex flex-col">
      
      {/* HERO */}
      <div className="relative bg-gradient-to-br from-crema via-white to-naranja-light overflow-hidden">
        
        <div className="px-5 pt-8 pb-4">
          <div className="flex items-center gap-3 mb-5">
            <div className="relative">
              <CookieLogo size={44} />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
            </div>

            <div>
              <h1 className="text-2xl font-extrabold text-stone-800 tracking-tight">
                Modo Crocante
              </h1>
              <div className="text-xs text-stone-500 uppercase tracking-wide mt-1 font-bold">
                AIA 100% Puntana!
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-2">
            <button
              onClick={() => onCategory('start')}
              className="bg-naranja text-white font-bold px-6 py-3 rounded-full shadow-md active:scale-[0.96] transition-all"
            >
              Iniciar Chat
            </button>
          </div>
        </div>

        {/* IPHONE */}
        <div className="flex justify-center mt-2 -mb-3">
          <iPhoneMockup />
        </div>

        {/* CHIPS MEJORADOS */}
        <div className="px-5 mt-5 mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {quickChips.map((item, index) => (
              <button
                key={index}
                onClick={() => onCategory(item.key)}
                className="whitespace-nowrap bg-white/80 backdrop-blur-md border border-white/60 px-3 py-2 rounded-full text-xs font-bold text-stone-700 shadow-sm active:scale-[0.92] transition-all hover:scale-[1.03]"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CROCANTE */}
      {crocante && (
        <div className="px-5 mt-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-naranja/10 rounded-lg flex items-center justify-center text-sm">
              🔥
            </div>
            <h3 className="text-base font-extrabold text-stone-800">
              Plan crocante del dia
            </h3>
          </div>

          <button
            onClick={() => onCategory('cerca')}
            className="w-full bg-white rounded-2xl p-4 shadow-sm text-left active:scale-[0.98] transition-transform border border-stone-100"
          >
            <div className="font-bold text-stone-800">{crocante.titulo}</div>
            <p className="text-xs text-stone-500 mt-1 line-clamp-2">
              {crocante.desc}
            </p>
          </button>
        </div>
      )}

      {/* CATEGORIAS */}
      <div className="px-5 mt-8">
        <h3 className="text-base font-extrabold text-stone-800 mb-3">
          Que queres hacer?
        </h3>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategory(cat.id)}
              className="bg-white rounded-full px-4 py-2 text-xs font-bold text-stone-700 shadow-sm active:scale-[0.95] transition-all border border-stone-100"
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* SAN LUIS */}
      {emprendedores.length > 0 && (
        <div className="px-5 mt-6 mb-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-extrabold text-stone-800">
              Que hay en San Luis?
            </h3>

            <button
              onClick={onEmprendedores}
              className="text-xs font-semibold text-naranja"
            >
              Ver todos →
            </button>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5">
            {shuffleArray(emprendedores).slice(0, 4).map((emp) => (
              <div key={emp.id} className="min-w-[260px]">
                <EntrepreneurCard item={emp} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
