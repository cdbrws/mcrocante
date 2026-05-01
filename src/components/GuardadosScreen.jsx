import { DATA } from '../data/places';
import PlaceCard from './PlaceCard';
import CookieLogo from './CookieLogo';

export default function GuardadosScreen({ savedIds, onToggleSave }) {
  const saved = DATA.filter(item => savedIds.includes(item.id));

  return (
    <div className="px-5 pt-safe">
      <div className="pt-6 pb-4 flex items-center gap-3">
        <CookieLogo size={32} />
        <div>
          <h2 className="text-2xl font-extrabold text-stone-800">Guardados</h2>
          <p className="text-xs text-stone-400">{saved.length} lugares guardados</p>
        </div>
      </div>
      {saved.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-crema rounded-full flex items-center justify-center mx-auto mb-4">
            <CookieLogo size={36} />
          </div>
          <p className="text-stone-400 text-sm font-medium">Todavia no guardaste nada.<br />Toca el corazon en una card.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {saved.map(item => (
            <PlaceCard key={item.id} item={item} saved={true} onToggleSave={onToggleSave} />
          ))}
        </div>
      )}
    </div>
  );
}
