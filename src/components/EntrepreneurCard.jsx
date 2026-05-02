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

  // 🔥 ahora usamos estado (no etiqueta)
  const estado = item.estado || 'aprobado';

  const estadoColors = {
    aprobado: 'bg-stone-100 text-stone-600',
    pendiente: 'bg-yellow-50 text-yellow-600',
    rechazado: 'bg-red-50 text-red-500'
  };

  const estadoLabel = {
    aprobado: 'Activo',
    pendiente: 'Pendiente',
    rechazado: 'Rechazado'
  };

  return (
    <div
      className={`relative bg-white rounded-2xl overflow-hidden 
      ${featured ? 'ring-2 ring-naranja/30' : ''}`}
      style={{ clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0 100%)' }}
    >

      {/* 🔥 IMAGEN */}
      {item.imagen && (
        <img
          src={item.imagen}
          alt={item.nombre}
          className="w-full h-28 object-cover"
        />
      )}

      {/* Top accent */}
      <div className={`h-1.5 w-full ${
        item.sponsor
          ? 'bg-gradient-to-r from-purple-400 to-pink-400'
          : featured
          ? 'bg-gradient-to-r from-naranja to-amber-400'
          : 'bg-gradient-to-r from-stone-200 to-stone-100'
      }`} />

      <div className="p-4">

        {/* HEADER */}
        <div className="flex items-start gap-3">

          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${
            featured ? 'bg-naranja/10' : 'bg-stone-100'
          }`}>
            {emoji}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <div className="font-bold text-sm text-stone-800 truncate">
                {item.nombre}
              </div>

              {featured && <span className="text-xs">⭐</span>}
              {item.sponsor && <span className="text-xs">🔥</span>}
            </div>

            <div className="text-xs text-stone-400 mt-0.5">
              {item.rubro} · {item.zona}
            </div>
          </div>

          {/* ESTADO */}
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${estadoColors[estado]}`}>
            {estadoLabel[estado]}
          </span>
        </div>

        {/* DESCRIPCIÓN */}
        <p className="text-xs text-stone-500 mt-2 leading-snug line-clamp-2">
          {item.desc}
        </p>

        {/* 🔥 TAGS */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {item.tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="text-[10px] px-2 py-0.5 bg-crema rounded-full text-stone-600 font-semibold"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* CONTACTO */}
        {item.whatsapp && (
          <div className="mt-3 flex items-center gap-2 text-xs text-green-600 font-semibold">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967..." />
            </svg>
            <span>WhatsApp disponible</span>
          </div>
        )}

        {/* 🔥 INSTAGRAM */}
        {item.instagram && (
          <div className="mt-1 text-xs text-pink-500 font-semibold">
            @{item.instagram.replace('@', '')}
          </div>
        )}
      </div>
    </div>
  );
}
