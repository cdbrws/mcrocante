import React, { useState } from 'react';
import CookieLogo from './CookieLogo';
import iPhoneMockup from './iPhoneMockup';
import EntrepreneurCard from './EntrepreneurCard';

const ALL_CATEGORIES = [
  { id: 'sinmango', label: 'Planes crocantes' },
  { id: 'comer', label: 'Comer barato' },
  { id: 'amigos', label: 'Plan con amigos/as' },
  { id: 'challenge', label: "Challenge's" },
  { id: 'musica', label: 'Escuchemos música' },
  { id: 'peli', label: 'Miremos una peli' },
  { id: 'eventos', label: 'Salgamos' },
  { id: 'ejercicio', label: 'Algo de ejercicio' },
  { id: 'familia', label: 'Plan con la flia' },
  { id: 'luchon', label: 'Modo luchón/a' },
  { id: 'juegos', label: 'Juegos' },
  { id: 'cerca', label: 'Algo tranqui' },
  { id: 'pareja', label: 'En pareja' },
  { id: 'noche', label: 'Salir de gira' },
  { id: 'aire', label: 'Aire libre' },
  { id: 'lluvia', label: 'Ta fresco!' },
  { id: 'fiaca', label: 'Alta fiaca' },
];

const CHIP_POOL = [
  { label: "Challenge's", key: 'challenge' },
  { label: 'Comer barato', key: 'comer' },
  { label: 'Escuchemos música', key: 'musica' },
  { label: 'Miremos una peli', key: 'peli' },
  { label: 'Plan con amigos/as', key: 'amigos' },
  { label: 'Giremos', key: 'eventos' },
  { label: 'Algo de ejercicios', key: 'ejercicio' },
  { label: 'Plan con la flia', key: 'familia' },
  { label: 'Modo luchón/a', key: 'luchon' },
  { label: 'Juegos', key: 'juegos' },
  { label: 'Sin gastar', key: 'sinmango' },
  { label: 'Algo tranqui', key: 'fiaca' },
  { label: 'Algo cerca', key: 'cerca' },
  { label: 'Aire libre', key: 'aire' },
  { label: 'En pareja', key: 'pareja' },
];

function shuffleArray(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getDynamicChips() {
  return shuffleArray(CHIP_POOL).slice(0, 8);
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
                IA 100% Puntana!
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

        {/* CHIPS FLOTANTES PRO ALEATORIOS */}
        <div className="px-5 mt-5 mb-7">
          <div className="relative min-h-[138px] overflow-visible">
            {quickChips.map((item, index) => {
              const styles = [
                'left-0 top-1 bg-orange-100/90 text-orange-700 border-orange-200 rotate-[-4deg]',
                'left-[104px] top-0 bg-emerald-100/90 text-emerald-700 border-emerald-200 rotate-[3deg]',
                'left-[218px] top-3 bg-purple-100/90 text-purple-700 border-purple-200 rotate-[-2deg]',
                'left-[28px] top-[42px] bg-rose-100/90 text-rose-700 border-rose-200 rotate-[2deg]',
                'left-[148px] top-[45px] bg-yellow-100/90 text-yellow-700 border-yellow-200 rotate-[-3deg]',
                'left-[238px] top-[68px] bg-sky-100/90 text-sky-700 border-sky-200 rotate-[4deg]',
                'left-[8px] top-[88px] bg-lime-100/90 text-lime-700 border-lime-200 rotate-[3deg]',
                'left-[134px] top-[94px] bg-pink-100/90 text-pink-700 border-pink-200 rotate-[-2deg]',
              ];

              return (
                <button
                  key={`${item.key}-${index}`}
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
