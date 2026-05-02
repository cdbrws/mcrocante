import React, { useState } from 'react';
import CookieLogo from './CookieLogo';
import iPhoneMockup from './iPhoneMockup';
import EntrepreneurCard from './EntrepreneurCard';

const ALL_CATEGORIES = [
  { id: 'sinmango', label: 'Planes gratis' },
  { id: 'comer', label: 'Comer barato' },
  { id: 'amigos', label: 'Plan con amigos/as' },
  { id: 'challenge', label: "Challenge's" },
  { id: 'musica', label: 'Escuchemos música' },
  { id: 'peli', label: 'Miremos una peli' },
  { id: 'eventos', label: 'Salgamos' },
  { id: 'ejercicio', label: 'Algo de ejercicios' },
  { id: 'familia', label: 'Plan con la flia' },
  { id: 'luchon', label: 'Modo luchón/a' },
  { id: 'juegos', label: 'Juegos' },
  { id: 'cerca', label: 'Cerca mío' },
  { id: 'pareja', label: 'En pareja' },
  { id: 'noche', label: 'Salir de noche' },
  { id: 'aire', label: 'Aire libre' },
  { id: 'lluvia', label: 'Llueve' },
  { id: 'fiaca', label: 'Alta fiaca' },
];

const CHIP_POOL = [
  { label: "Challenge's", key: 'challenge' },
  { label: 'Comer barato', key: 'comer' },
  { label: 'Escuchemos música', key: 'musica' },
  { label: 'Miremos una peli', key: 'peli' },
  { label: 'Plan con amigos/as', key: 'amigos' },
  { label: 'Salgamos', key: 'eventos' },
  { label: 'Algo de ejercicios', key: 'ejercicio' },
  { label: 'Plan con la flia', key: 'familia' },
  { label: 'Modo luchón/a', key: 'luchon' },
  { label: 'Juegos', key: 'juegos' },
  { label: 'Sin gastar', key: 'sinmango' },
  { label: 'Algo en casa', key: 'fiaca' },
  { label: 'Cerca mío', key: 'cerca' },
  { label: 'Aire libre', key: 'aire' },
  { label: 'Plan en pareja', key: 'pareja' },
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

function getPlanDetail(crocante) {
  if (!crocante) return null;

  return {
    titulo: crocante.titulo,
    desc: crocante.desc,
    zona: crocante.zona || 'San Luis',
    bullets: [
      'Ideal para resolver el día sin pensar demasiado.',
      'Pensado para hacer algo real, simple y cercano.',
      'Si te gusta, podés pedirle a IA algo parecido.',
    ],
  };
}

export default function HomeScreen({
  onCategory,
  crocante,
  emprendedores,
  onEmprendedores,
}) {
  const [categories] = useState(() => shuffleArray(ALL_CATEGORIES).slice(0, 8));
  const [quickChips] = useState(() => getDynamicChips());
  const [showPlanModal, setShowPlanModal] = useState(false);

  const planDetail = getPlanDetail(crocante);

  return (
    <div className="flex flex-col">
      {/* HERO */}
      <div className="relative bg-gradient-to-br from-crema via-white to-naranja-light overflow-hidden">
        <div className="px-5 pt-6 pb-2">
          <div className="flex items-center gap-3 mb-4">
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

          <div className="rounded-3xl bg-white/70 border border-white/80 shadow-sm p-4 mb-4 backdrop-blur-md">
            <p className="text-[13px] leading-relaxed text-stone-700 font-semibold">
              Ideas para cuando no hay un mango, pero tampoco ganas de aburrirse.
            </p>
            <p className="text-[12px] leading-relaxed text-stone-500 mt-1">
              IAPuntana te ayuda a decidir qué hacer en San Luis: planes, comida, música,
              juegos, desafíos y opciones para moverte sin gastar de más.
            </p>
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => onCategory('start')}
              className="bg-naranja text-white font-bold px-6 py-3 rounded-full shadow-md active:scale-[0.96] transition-all"
            >
              Iniciar Chat
            </button>
          </div>
        </div>

        {/* IPHONE MOCKUP */}
        <div className="flex justify-center mt-1 -mb-1">
          <iPhoneMockup />
        </div>

        {/* CHIPS FLOTANTES ALEATORIOS */}
        <div className="px-5 mt-3 mb-3">
          <div className="relative min-h-[128px] overflow-visible">
            {quickChips.map((item, index) => {
              const styles = [
                'left-0 top-1 bg-orange-100/90 text-orange-700 border-orange-200 rotate-[-4deg]',
                'left-[96px] top-0 bg-emerald-100/90 text-emerald-700 border-emerald-200 rotate-[3deg]',
                'left-[196px] top-5 bg-purple-100/90 text-purple-700 border-purple-200 rotate-[-2deg]',
                'left-[22px] top-[42px] bg-rose-100/90 text-rose-700 border-rose-200 rotate-[2deg]',
                'left-[138px] top-[44px] bg-yellow-100/90 text-yellow-700 border-yellow-200 rotate-[-3deg]',
                'left-[0px] top-[82px] bg-lime-100/90 text-lime-700 border-lime-200 rotate-[3deg]',
                'left-[108px] top-[82px] bg-pink-100/90 text-pink-700 border-pink-200 rotate-[-2deg]',
                'left-[208px] top-[76px] bg-sky-100/90 text-sky-700 border-sky-200 rotate-[4deg]',
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
        <div className="px-5 mt-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 bg-naranja/10 rounded-xl flex items-center justify-center text-sm animate-pulse">
              🔥
            </div>
            <h3 className="text-base font-extrabold text-stone-800">
              Plan crocante del día
            </h3>
          </div>

          <button
            onClick={() => setShowPlanModal(true)}
            className="relative w-full bg-white rounded-3xl p-4 shadow-md text-left active:scale-[0.98] transition-all border border-naranja/10 overflow-hidden group"
          >
            <div className="absolute -right-8 -top-8 w-24 h-24 bg-naranja/10 rounded-full group-active:scale-125 transition-transform" />
            <div className="absolute right-4 top-4 text-[10px] font-black text-naranja bg-naranja/10 border border-naranja/20 rounded-full px-2 py-1">
              Ver detalle
            </div>

            <div className="pr-20">
              <div className="font-extrabold text-stone-800">{crocante.titulo}</div>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed line-clamp-2">
                {crocante.desc}
              </p>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-crema text-stone-600">
                AIA lo recomienda
              </span>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-naranja-light text-naranja">
                Tocar para abrir
              </span>
            </div>
          </button>
        </div>
      )}

      {/* CATEGORIAS */}
      <div className="px-5 mt-6">
        <h3 className="text-base font-extrabold text-stone-800 mb-1">
          Ideas rápidas para activar el modo crocante
        </h3>
        <p className="text-xs text-stone-500 mb-3 leading-relaxed">
          Elegí una opción y la IA Puntana te arma el camino: receta, salida, música, peli,
          desafío o plan local según tu mood.
        </p>

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

      {/* POPUP PLAN DEL DIA */}
      {showPlanModal && planDetail && (
        <div className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center px-4 pb-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-100 overflow-hidden animate-slideUp">
            <div className="bg-gradient-to-br from-naranja-light via-white to-crema p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-[11px] font-black uppercase tracking-wide text-naranja mb-1">
                    Plan crocante del día
                  </div>
                  <h2 className="text-xl font-extrabold text-stone-800 leading-tight">
                    {planDetail.titulo}
                  </h2>
                </div>

                <button
                  onClick={() => setShowPlanModal(false)}
                  className="w-9 h-9 rounded-full bg-white shadow-sm text-stone-500 font-bold active:scale-90 transition-transform"
                >
                  ×
                </button>
              </div>

              <p className="text-sm text-stone-600 mt-3 leading-relaxed">
                {planDetail.desc}
              </p>

              <div className="mt-3 inline-flex text-xs font-bold px-3 py-1.5 rounded-full bg-white border border-naranja/10 text-naranja">
                📍 {planDetail.zona}
              </div>
            </div>

            <div className="p-5">
              <div className="text-sm font-extrabold text-stone-800 mb-3">
                ¿Por qué va?
              </div>

              <div className="flex flex-col gap-2">
                {planDetail.bullets.map((bullet) => (
                  <div
                    key={bullet}
                    className="bg-crema/70 rounded-2xl px-4 py-3 text-xs text-stone-600 font-semibold"
                  >
                    {bullet}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2 mt-5">
                <button
                  onClick={() => {
                    setShowPlanModal(false);
                    onCategory('cerca');
                  }}
                  className="bg-stone-900 text-white rounded-2xl py-3 text-xs font-extrabold active:scale-[0.97] transition-transform"
                >
                  Pedir algo parecido
                </button>

                <button
                  onClick={() => setShowPlanModal(false)}
                  className="bg-naranja text-white rounded-2xl py-3 text-xs font-extrabold active:scale-[0.97] transition-transform"
                >
                  Listo, me sirve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
