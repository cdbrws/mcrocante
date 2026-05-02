import React, { useState } from 'react';
import CookieLogo from './CookieLogo';
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
      'Si te gusta, podés pedirle a la IAPuntana algo parecido.',
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
                IA 100% Puntana!
              </div>
            </div>
          </div>
        </div>

        {/* CELULAR SIMULADO */}
        <div className="flex justify-center mt-1">
          <div className="relative">
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[210px] h-8 bg-black/20 blur-xl rounded-full" />
            <div className="absolute -inset-2 rounded-[44px] bg-gradient-to-br from-naranja/20 via-purple-300/10 to-emerald-300/20 blur-md" />

            <div className="relative w-[236px] h-[452px] bg-gradient-to-b from-stone-950 via-black to-stone-800 rounded-[42px] p-[7px] shadow-[0_18px_40px_rgba(0,0,0,0.36)]">
              {/* botones laterales */}
              <div className="absolute -left-[3px] top-[76px] w-[3px] h-10 bg-stone-700 rounded-l-full" />
              <div className="absolute -left-[3px] top-[128px] w-[3px] h-14 bg-stone-700 rounded-l-full" />
              <div className="absolute -right-[3px] top-[112px] w-[3px] h-20 bg-stone-700 rounded-r-full" />

              {/* reflejos */}
              <div className="absolute left-[6px] top-10 w-[2px] h-24 bg-white/20 rounded-full" />
              <div className="absolute right-[6px] top-24 w-[2px] h-28 bg-white/10 rounded-full" />

              <div className="w-full h-full bg-white rounded-[34px] overflow-hidden flex flex-col border border-white/10">
                <div className="absolute top-[13px] left-1/2 -translate-x-1/2 w-20 h-4 bg-black rounded-full z-20" />

                {/* HEADER CHAT */}
                <div className="bg-crema px-3 pt-7 pb-2 text-xs font-bold text-stone-700 flex items-center gap-2 border-b border-stone-100">
                  <div className="relative w-7 h-7 bg-naranja rounded-full flex items-center justify-center overflow-hidden shadow-sm">
                    <CookieLogo size={24} />
                  </div>

                  <div className="leading-tight">
                    <div className="text-[12px] font-extrabold text-stone-800">IA Crocante</div>
                    <div className="text-[9px] text-green-500 font-bold">● en línea</div>
                  </div>

                  <div className="ml-auto text-[10px] bg-white rounded-full px-2 py-1 text-stone-500 shadow-sm">
                    12°
                  </div>
                </div>

                {/* CHAT */}
                <div className="flex-1 px-3 py-3 flex flex-col gap-2 text-[11px] bg-gradient-to-b from-white to-crema/40">
                  <div className="bg-stone-100 rounded-2xl rounded-bl-md px-3 py-2 w-fit max-w-[84%] leading-snug shadow-sm">
                    Buenas! Buscando qué hacer hoy?
                  </div>

                  <div className="bg-naranja text-white rounded-2xl rounded-br-md px-3 py-2 w-fit self-end max-w-[84%] leading-snug shadow-sm">
                    No tengo un mango, crocante!
                  </div>

                  <div className="bg-stone-100 rounded-2xl rounded-bl-md px-3 py-2 w-fit max-w-[86%] leading-snug shadow-sm">
                    Estamos todo iguales tranqui, elegi alguna de estas opciones y te guio..
                  </div>

                  {/* CHIPS DENTRO DEL CELULAR */}
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {quickChips.map((item, index) => {
                      const chipStyles = [
                        'bg-orange-100 text-orange-700 border-orange-200',
                        'bg-emerald-100 text-emerald-700 border-emerald-200',
                        'bg-purple-100 text-purple-700 border-purple-200',
                        'bg-rose-100 text-rose-700 border-rose-200',
                        'bg-yellow-100 text-yellow-700 border-yellow-200',
                        'bg-lime-100 text-lime-700 border-lime-200',
                        'bg-pink-100 text-pink-700 border-pink-200',
                        'bg-sky-100 text-sky-700 border-sky-200',
                      ];

                      return (
                        <button
                          key={`${item.key}-${index}`}
                          onClick={() => onCategory(item.key)}
                          className={`${chipStyles[index]} border px-2 py-1 rounded-full text-[9px] font-extrabold shadow-sm active:scale-[0.94] transition-transform`}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* INPUT */}
                <div className="px-2 py-2 border-t border-stone-100 flex items-center gap-2 bg-white">
                  <div className="flex-1 bg-stone-100 rounded-full px-3 py-2 text-[10px] text-stone-400">
                    Decime que queres hacer...
                  </div>
                  <div className="w-7 h-7 bg-naranja rounded-full flex items-center justify-center shadow-md shadow-naranja/20">
                    <span className="text-white text-[12px] font-black">›</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTON INICIAR CHAT */}

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
                IA Puntana lo recomienda
              </span>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-naranja-light text-naranja">
                Tocar para abrir
              </span>
            </div>
          </button>
        </div>
      )}

   {/* QUE ES MODO CROCANTE - VERSION PRO */}
<div className="px-5 mt-6">
  <div className="relative overflow-hidden rounded-3xl p-5 bg-gradient-to-br from-white via-crema to-naranja-light border border-naranja/10 shadow-md">

    {/* glow suave */}
    <div className="absolute -top-10 -right-10 w-32 h-32 bg-naranja/20 rounded-full blur-2xl" />
    <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-200/20 rounded-full blur-2xl" />

    {/* header */}
    <div className="flex items-center gap-2 mb-3">
      <div className="w-8 h-8 bg-naranja rounded-full flex items-center justify-center text-white font-black text-sm shadow-sm">
        🍪
      </div>
      <span className="text-sm font-extrabold text-stone-800">
        Modo Crocante
      </span>
    </div>

    {/* mensaje principal */}
    <p className="text-[14px] font-extrabold text-stone-800 leading-snug">
      Sin un mango, pero con ideas.
    </p>

    <p className="text-[12px] text-stone-600 mt-2 leading-relaxed">
      Una AIA 100% puntana que analiza tu situación y te tira planes reales en San Luis:
      comer, salir, quedarte en casa o activar algo sin gastar de más.
    </p>

    {/* badges */}
    <div className="flex flex-wrap gap-2 mt-4">
      <span className="text-[10px] font-bold px-2 py-1 bg-white rounded-full border border-stone-200 shadow-sm">
        +500 ideas
      </span>
      <span className="text-[10px] font-bold px-2 py-1 bg-white rounded-full border border-stone-200 shadow-sm">
        Local real
      </span>
      <span className="text-[10px] font-bold px-2 py-1 bg-white rounded-full border border-stone-200 shadow-sm">
        AIA + IA
      </span>
    </div>

  </div>
</div>

      {/* CATEGORIAS */}
      <div className="px-5 mt-6">
        <h3 className="text-base font-extrabold text-stone-800 mb-1">
          Ideas rápidas para activar el modo crocante
        </h3>
        <p className="text-xs text-stone-500 mb-3 leading-relaxed">
          Elegí una opción y AIA te arma el camino: receta, salida, música, peli,
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
