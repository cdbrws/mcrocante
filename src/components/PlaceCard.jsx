import React from "react";
export default function PlaceCard({ item, saved, onToggleSave, compact }) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-stone-100 ${compact ? 'p-3' : 'p-4'}`}>
      <div className="flex items-start gap-2">
        <div className={`w-8 h-8 bg-naranja/10 rounded-xl flex items-center justify-center shrink-0 ${compact ? 'text-sm' : 'text-base'}`}>📍</div>
        <div className="flex-1 min-w-0">
          <div className={`font-bold text-stone-800 leading-tight ${compact ? 'text-sm' : 'text-base'}`}>{item.nombre}</div>
          <div className={`text-stone-500 leading-snug ${compact ? 'text-[11px] mt-0.5 mb-1.5 line-clamp-2' : 'text-xs mt-1 mb-2 line-clamp-2'}`}>{item.desc}</div>
          <div className="flex gap-2 items-center flex-wrap">
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-naranja-light text-naranja">{item.zona}</span>
            {item.categorias.includes('gratis') && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-50 text-green-600">Gratis</span>
            )}
            {onToggleSave && (
              <button onClick={() => onToggleSave(item.id)} className="ml-auto text-base p-0.5 active:scale-125 transition-transform">{saved ? '🧡' : '🤍'}</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
