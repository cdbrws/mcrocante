import React from "react";
import { useState } from 'react';

export default function RecipeCard({ receta }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <button onClick={() => setExpanded(!expanded)} className="w-full bg-white rounded-2xl p-4 shadow-sm border border-stone-100 text-left active:scale-[0.98] transition-all">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-lg shrink-0">🍳</div>
        <div className="flex-1">
          <div className="font-bold text-sm text-stone-800">{receta.nombre}</div>
          <div className="flex gap-2 mt-1 flex-wrap">
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-naranja-light text-naranja">{receta.categoria}</span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-500">{receta.tiempo}</span>
          </div>
        </div>
        <span className="text-stone-300 text-xs">{expanded ? '−' : '+'}</span>
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-stone-100 animate-fadeIn">
          <p className="text-xs text-stone-500 mb-2"><strong>Dificultad:</strong> {receta.dificultad}</p>
          <div className="mb-2">
            <p className="text-xs font-semibold text-stone-700 mb-1">Ingredientes:</p>
            <ul className="text-xs text-stone-500 space-y-0.5">
              {receta.ingredientes.map((ing, i) => (
                <li key={i}>• {ing}</li>
              ))}
            </ul>
          </div>
          <div className="mb-3">
            <p className="text-xs font-semibold text-stone-700 mb-1">Pasos:</p>
            <ol className="text-xs text-stone-500 space-y-1">
              {receta.pasos.map((paso, i) => (
                <li key={i}><span className="text-naranja font-medium">{i + 1}.</span> {paso}</li>
              ))}
            </ol>
          </div>
          {receta.tip && (
            <div className="bg-naranja-light rounded-xl px-3 py-2">
              <p className="text-xs text-stone-600"><span className="font-semibold text-naranja">💡 Tip:</span> {receta.tip}</p>
            </div>
          )}
        </div>
      )}
    </button>
  );
}
