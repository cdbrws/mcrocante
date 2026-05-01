import React from "react";
const RUBRO_EMOJI = {
  Comida: '🍽️',
  Artesania: '🎨',
  Ropa: '👕',
  Servicios: '🔧',
  Tecnologia: '💻',
  Otro: '🏪'
};

export default function EntrepreneurCard({ item, featured }) {
  const emoji = RUBRO_EMOJI[item.rubro] || '🏪';
  const etiquetaColors = {
    destacado: 'bg-naranja-light text-naranja',
    pendiente: 'bg-yellow-50 text-yellow-600',
    normal: 'bg-stone-100 text-stone-600'
  };
  const etiqueta = featured ? 'destacado' : (item.etiqueta || 'normal');
  const etiquetaLabel = featured ? '✨ Destacado' : (item.etiqueta || 'Nuevo');

  return (
    <div className={`relative bg-white rounded-2xl overflow-hidden ${featured ? 'ring-2 ring-naranja/30' : ''}`} style={{ clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0 100%)' }}>
      {/* Top colored accent */}
      <div className={`h-1.5 w-full ${featured ? 'bg-gradient-to-r from-naranja to-amber-400' : 'bg-gradient-to-r from-stone-200 to-stone-100'}`} />

      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${featured ? 'bg-naranja/10' : 'bg-stone-100'}`}>
            {emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <div className="font-bold text-sm text-stone-800 truncate">{item.nombre}</div>
              {featured && <span className="text-xs">⭐</span>}
            </div>
            <div className="text-xs text-stone-400 mt-0.5">{item.rubro} · {item.zona}</div>
          </div>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${etiquetaColors[etiqueta]}`}>{etiquetaLabel}</span>
        </div>
        <p className="text-xs text-stone-500 mt-2 leading-snug line-clamp-2">{item.desc}</p>
        {/* Promo removed: avoid showing monetary values */}
        {item.whatsapp && (
          <div className="mt-2 flex items-center gap-1.5 text-xs text-green-600 font-medium">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.094.539 4.063 1.483 5.785L.055 23.572a.5.5 0 00.61.609l5.72-1.462A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a10 10 0 01-5.278-1.498l-.378-.224-3.386.864.903-3.306-.244-.39A9.958 9.958 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
            <span>WhatsApp disponible</span>
          </div>
        )}
      </div>
    </div>
  );
}
