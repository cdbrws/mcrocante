import { useState } from 'react';
import { RECETAS, getRecetasByEtiqueta } from '../data/recetas';
import RecipeCard from './RecipeCard';
import CookieLogo from './CookieLogo';

export default function RecetasScreen() {
  const [filter, setFilter] = useState('todas');

  let recetas = filter !== 'todas' ? getRecetasByEtiqueta(filter) : RECETAS;

  const categorias = ['todas', 'clasica', 'rapida', 'familiar', 'merienda', 'postre', 'masa'];

  return (
    <div className="px-5 pt-safe">
      <div className="pt-6 pb-4 flex items-center gap-3">
        <CookieLogo size={32} />
        <div>
          <h2 className="text-2xl font-extrabold text-stone-800">Recetas</h2>
          <p className="text-xs text-stone-400">Comida argentina casera</p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide -mx-5 px-5">
        {categorias.map(c => (
          <button key={c} onClick={() => setFilter(c)} className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all active:scale-95 ${filter === c ? 'bg-naranja text-white shadow-md shadow-naranja/20' : 'bg-white text-stone-500 border border-stone-200'}`}>
            {c === 'todas' ? 'Todas' : c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>

      <div className="text-xs text-stone-400 mt-1 mb-3 font-medium">{recetas.length} recetas</div>
      <div className="flex flex-col gap-3 pb-4">
        {recetas.map(r => (
          <RecipeCard key={r.id} receta={r} />
        ))}
      </div>
    </div>
  );
}
