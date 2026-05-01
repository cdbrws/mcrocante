import CookieLogo from './CookieLogo';

export default function MasScreen() {
  return (
    <div className="px-5 pt-safe max-w-md mx-auto">
      <div className="pt-6 pb-4 flex items-center gap-3">
        <CookieLogo size={32} />
        <div>
          <h2 className="text-2xl font-extrabold text-stone-800">Mas</h2>
        </div>
      </div>

      {/* AIA INFO */}
      <div className="bg-white rounded-2xl p-6 mt-2 shadow-sm border border-stone-100">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 bg-naranja/10 rounded-2xl flex items-center justify-center overflow-hidden">
            <CookieLogo size={36} />
          </div>
          <div>
            <h3 className="font-bold text-stone-800">AIA</h3>
            <p className="text-xs text-stone-400">Analisis Inteligente Automatizado</p>
          </div>
        </div>
        <p className="text-[14px] leading-relaxed text-stone-500">Modo Crocante usa AIA para recomendarte opciones locales de San Luis. Todo funciona offline, sin internet, sin trackers. Tus datos se quedan en tu celu.</p>
        <p className="text-[14px] leading-relaxed text-stone-500 mt-3">La AIA piensa, vos disfrutas.</p>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-naranja to-orange-400 rounded-2xl p-5 mt-4 text-white relative overflow-hidden">
        <div className="absolute top-2 right-2 opacity-20">
          <CookieLogo size={50} />
        </div>
        <h3 className="text-base font-bold relative z-10">Tenes un emprendimiento?</h3>
        <p className="text-sm text-white/80 mt-1 leading-relaxed relative z-10">Sumate y aparece cuando alguien busque algo para hacer o comprar en San Luis.</p>
        <button onClick={() => alert('Proximamente!')} className="bg-white text-naranja font-bold px-5 py-3 rounded-xl text-[14px] mt-4 active:bg-white/90 transition-colors relative z-10 w-full">Quiero aparecer</button>
      </div>

      {/* FRASE */}
      <div className="mt-6 mb-8 text-center">
        <div className="inline-block bg-white rounded-2xl px-5 py-4 shadow-sm border border-stone-100">
          <p className="text-sm text-stone-500 italic">"San Luis tambien tiene planes crocantes."</p>
        </div>
        <p className="text-[10px] text-stone-300 mt-4">Hecho con 🍪 en San Luis</p>
      </div>
    </div>
  );
}
