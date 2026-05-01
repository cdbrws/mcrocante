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

const QUICK_CHIPS = [
  { label: 'No tengo un mango', key: 'sinmango' },
  { label: 'Estoy aburrido', key: 'ideas' },
  { label: 'Comer barato', key: 'comer' },
  { label: 'Algo en casa', key: 'fiaca' },
  { label: 'Quiero moverme', key: 'aire' },
  { label: 'Plan con amigos', key: 'chicos' },
  { label: 'Estoy de visita', key: 'cerca' },
  { label: 'Sorprendeme', key: 'start' },
  { label: 'Plan en pareja', key: 'pareja' },
  { label: 'Algo tranqui', key: 'peli' },
];

function shuffleArray(arr) {
  const shuffled = [...arr];

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

export default function HomeScreen({
  onCategory,
  crocante,
  emprendedores,
  onEmprendedores,
}) {
  const [categories] = useState(() => shuffleArray(ALL_CATEGORIES).slice(0, 8));
  const [quickChips] = useState(() => shuffleArray(QUICK_CHIPS).slice(0, 5));

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
              Iniciar chat
            </button>
          </div>
        </div>

        {/* IPHONE MOCKUP */}
        <div className="flex justify-center mt-2 -mb-3">
          <iPhoneMockup />
        </div>

        {/* CHIPS RAPIDOS */}
        <div className="px-5 mt-5 mb-6">
          <div className="relative min-h-[86px]">
            {quickChips.map((item, index) => {
              const styles = [
                'left-0 top-0 bg-orange-100/80 text-orange-700 border-orange-200 rotate-[-3deg]',
                'left-[118px] top-1 bg-emerald-100/80 text-emerald-700 border-emerald-200 rotate-[2deg]',
                'left-[35px] top-[38px] bg-purple-100/80 text-purple-700 border-purple-200 rotate-[1deg]',
                'left-[165px] top-[42px] bg-rose-100/80 text-rose-700 border-rose-200 rotate-[-2deg]',
                'left-[78px] top-[72px] bg-yellow-100/80 text-yellow-700 border-yellow-200 rotate-[2deg]',
              ];

              return (
                <button
                  key={index}
                  onClick={() => onCategory(item.key)}
                  className={`absolute ${styles[index]} border backdrop-blur-md px-2.5 py-1.5 rounded-full text-[10px] font-extrabold shadow-sm active:scale-[0.92] transition-all animate-float`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* CROCANTE DEL DIA */}
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
            <p className="text-xs text-stone-500 mt-1 leading-relaxed line-clamp-2">
              {crocante.desc}
            </p>
            <div className="flex gap-2 mt-3">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-naranja-light text-naranja">
                📍 {crocante.zona}
              </span>
            </div>
          </button>
        </div>
      )}

      {/* CATEGORIAS FLOTANTES */}
      <div className="px-5 mt-8">
        <h3 className="text-base font-extrabold text-stone-800 mb-3">
          Que queres hacer?
        </h3>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategory(cat.id)}
              className="bg-white rounded-full px-4 py-2.5 flex items-center gap-2 shadow-sm active:scale-[0.95] transition-all border border-stone-100"
            >
              <span className="text-[12px] font-bold text-stone-700">
                {cat.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* QUE HAY EN SAN LUIS */}
      {emprendedores.length > 0 && (
        <div className="px-5 mt-6 mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-naranja/10 rounded-lg flex items-center justify-center text-sm">
                📍
              </div>
              <h3 className="text-base font-extrabold text-stone-800">
                Que hay en San Luis?
              </h3>
            </div>

            <button
              onClick={onEmprendedores}
              className="text-xs font-semibold text-naranja"
            >
              Ver todos →
            </button>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 snap-x">
            {shuffleArray(emprendedores).slice(0, 4).map((emp) => (
              <div key={emp.id} className="min-w-[260px] snap-start">
                <EntrepreneurCard item={emp} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
