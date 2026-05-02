// src/data/suggestions.js
// Base local/offline de sugerencias para Modo Crocante.
// No usa IA, no usa APIs, no usa fetch.

function normalize(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function createItems(prefix, items, defaults) {
  return items.map((item, index) => {
    const data = typeof item === 'string' ? { title: item } : item;

    return {
      id: `${prefix}-${String(index + 1).padStart(3, '0')}`,
      type: defaults.type,
      category: defaults.category,
      title: data.title,
      description: data.description || defaults.description,
      tags: [...(defaults.tags || []), ...(data.tags || [])],
      cost: data.cost || defaults.cost || 'bajo',
      location: data.location || defaults.location || 'Argentina',
      mood: [...(defaults.mood || []), ...(data.mood || [])],
    };
  });
}

const recetas = createItems(
  'receta',
  [
    'Tortas fritas',
    'Pastelitos criollos',
    'Empanadas criollas',
    'Empanadas puntanas',
    'Locro simple',
    'Guiso carrero',
    'Carbonada',
    'Pastel de papa',
    'Humita en olla',
    'Polenta con tuco',
    'Arroz con pollo',
    'Fideos con manteca y queso',
    'Milanesas caseras',
    'Torrejas de arroz',
    'Buñuelos salados',
    'Pan casero',
    'Semitas caseras',
    'Chanfaina',
    'Chivo al horno',
    'Chivo a la olla',
    'Zapallitos rellenos',
    'Tarta de acelga',
    'Tarta de choclo',
    'Croquetas de papa',
    'Revuelto gramajo simple',
    'Sopa de verduras',
    'Guiso de lentejas',
    'Guiso de fideos',
    'Puchero económico',
    'Pizza casera',
    'Panqueques dulces',
    'Budín de pan',
    'Arroz con leche',
    'Mate cocido con tortas fritas',
    'Ensalada rusa económica',
    'Omelette con lo que haya',
    'Papas al horno',
    'Hamburguesas caseras',
    'Sándwich de milanesa',
    'Picada matera barata',
    'Tarta de jamón y queso',
    'Ñoquis caseros',
  ],
  {
    type: 'receta',
    category: 'comida',
    description: 'Idea simple, barata y conseguible en Argentina.',
    tags: ['receta', 'barato', 'casero', 'argentino'],
    cost: 'bajo',
    location: 'Argentina',
    mood: ['fiaca', 'familia', 'casa'],
  }
);

const planesSanLuis = createItems(
  'plan-sl',
  [
    'Mateada en Parque de las Naciones',
    'Caminata por el centro de San Luis',
    'Vuelta por plazas barriales',
    'Paseo por La Punta',
    'Recorrido por Terrazas del Portezuelo',
    'Caminata por Potrero de los Funes',
    'Vuelta al lago en Potrero',
    'Miradores cercanos a la ciudad',
    'Tarde de fotos urbanas',
    'Salida a caminar sin gastar',
    'Paseo por feria local',
    'Recorrido por espacios verdes',
    'Bici suave por zona tranquila',
    'Mate en una plaza',
    'Picnic económico',
    'Ver atardecer',
    'Caminar con música',
    'Plan de plaza con chicos',
    'Paseo por Juana Koslay',
    'Salida corta a El Volcán',
    'Paseo por El Trapiche',
    'Visita a La Florida',
    'Caminata por zona de sierras',
    'Plan de fotos en lugares lindos',
    'Recorrido histórico básico',
    'Visitar una feria artesanal',
    'Salida de bajo costo con amigos',
    'Tarde de charla al aire libre',
    'Plan express después del laburo',
    'Domingo de paseo familiar',
    'Caminar por avenida tranquila',
    'Buscar mural o rincón lindo',
    'Plan de mate y bizcochos',
    'Paseo corto con mascota',
    'Vuelta en auto sin gastar demasiado',
    'Explorar un barrio distinto',
    'Sentarse a mirar movimiento en plaza',
    'Paseo simple por costanera o zona verde',
    'Caminar temprano para despejar',
    'Plan sin plata con buena charla',
    'Salida improvisada de una hora',
    'Recorrido por puntos conocidos de San Luis',
  ],
  {
    type: 'lugar',
    category: 'san-luis',
    description: 'Plan simple para hacer en San Luis sin depender de eventos ni horarios.',
    tags: ['san luis', 'gratis', 'barato', 'salir'],
    cost: 'bajo',
    location: 'San Luis',
    mood: ['aire', 'familia', 'sin-plata'],
  }
);

const casa = createItems(
  'casa',
  [
    'Noche de cartas',
    'Torneo de truco',
    'Cocinar algo con lo que haya',
    'Ordenar una habitación con música',
    'Armar una playlist familiar',
    'Hacer pochoclos y ver peli',
    'Juegos de mesa improvisados',
    'Karaoke casero',
    'Tarde de mate y charla',
    'Hacer pan casero',
    'Noche de preguntas incómodas suaves',
    'Armar álbum de fotos',
    'Reordenar ropa para donar',
    'Hacer una receta nueva',
    'Crear un ranking de películas',
    'Ver videos viejos familiares',
    'Hacer limpieza express de 20 minutos',
    'Dibujar con chicos',
    'Inventar una historia familiar',
    'Hacer una búsqueda del tesoro casera',
    'Armar picnic en el piso',
    'Tarde sin pantallas',
    'Competencia de cocina barata',
    'Hacer postres simples',
    'Plan mate largo sin gastar',
  ],
  {
    type: 'actividad',
    category: 'casa',
    description: 'Actividad para hacer en casa sin gastar o gastando muy poco.',
    tags: ['casa', 'gratis', 'familia'],
    cost: 'bajo',
    location: 'Casa',
    mood: ['fiaca', 'lluvia', 'familia'],
  }
);

const challenges = createItems(
  'challenge',
  [
    'Challenge de cocinar con 3 ingredientes',
    'Challenge de no tocar el celular por una hora',
    'Challenge de preguntas familiares',
    'Challenge de baile ridículo',
    'Challenge de imitaciones',
    'Challenge de ordenar rápido',
    'Challenge de dibujo con ojos cerrados',
    'Challenge de contar anécdotas',
    'Challenge de películas adivinadas',
    'Challenge de canciones tarareadas',
    'Challenge de fotos antiguas',
    'Challenge de hacer el mejor mate',
    'Challenge de receta económica',
    'Challenge de equilibrio',
    'Challenge de memoria familiar',
    'Challenge de trabalenguas',
    'Challenge de chistes malos',
    'Challenge de mini entrenamiento',
    'Challenge de inventar publicidad',
    'Challenge de actuar escenas',
    'Challenge de sonidos raros',
    'Challenge de preguntas rápidas',
    'Challenge de armar torre con objetos',
    'Challenge de búsqueda en casa',
    'Challenge de “quién conoce más San Luis”',
  ],
  {
    type: 'challenge',
    category: 'challenge',
    description: 'Juego simple para hacer en casa con familia o amigos.',
    tags: ['challenge', 'casa', 'familia', 'gratis'],
    cost: 'bajo',
    location: 'Casa',
    mood: ['familia', 'chicos', 'fiaca'],
  }
);

const peliculas = createItems(
  'pelicula',
  [
    'Volver al Futuro',
    'Jumanji',
    'Mi Pobre Angelito',
    'La Máscara',
    'Mentiroso Mentiroso',
    'Una Noche en el Museo',
    'Rush Hour',
    'Men in Black',
    'Shrek',
    'Kung Fu Panda',
    'Madagascar',
    'Los Increíbles',
    'Toy Story',
    'Guardianes de la Galaxia',
    'Ant-Man',
    'Piratas del Caribe',
    'Indiana Jones',
    'Misión Imposible',
    'Rápidos y Furiosos',
    'Sherlock Holmes',
    'Deadpool',
    'Jumanji: En la selva',
    'Pixels',
    'Escuela de Rock',
    '¿Qué pasó ayer?',
    'Supercool',
    'Entrenando a Papá',
    'Son Como Niños',
    'El Juego del Calamar no, mejor una comedia',
    'Duro de Matar',
    'El Transportador',
    'El Agente de C.I.P.O.L.',
    'Johnny English',
    'Agente 86',
    'Zoolander',
    'Legalmente Rubia',
    'Chicas Pesadas',
    'Scary Movie',
    'Ace Ventura',
    'Un Detective Suelto en Hollywood',
  ],
  {
    type: 'pelicula',
    category: 'pelicula',
    description: 'Película de acción o comedia para ver sin ponerse dramático.',
    tags: ['pelicula', 'accion', 'comedia', 'casa'],
    cost: 'bajo',
    location: 'Casa',
    mood: ['fiaca', 'noche', 'lluvia'],
  }
);

const musica = createItems(
  'musica',
  [
    'La Renga',
    'Los Piojos',
    'Divididos',
    'Soda Stereo',
    'Charly García',
    'Fito Páez',
    'Andrés Calamaro',
    'Patricio Rey y sus Redonditos de Ricota',
    'Babasónicos',
    'Ciro y los Persas',
    'No Te Va Gustar',
    'Cuarteto de Nos',
    'Wos',
    'Trueno',
    'Duki',
    'Nicki Nicole',
    'Bizarrap',
    'Los Cafres',
    'Dread Mar-I',
    'Kapanga',
    'Auténticos Decadentes',
    'Los Fabulosos Cadillacs',
    'Bersuit Vergarabat',
    'Las Pastillas del Abuelo',
    'Airbag',
    'Miranda!',
    'Tan Biónica',
    'Ke Personajes',
  ],
  {
    type: 'musica',
    category: 'musica',
    description: 'Música para levantar clima, matear, limpiar o salir a caminar.',
    tags: ['musica', 'argentino', 'playlist'],
    cost: 'bajo',
    location: 'Argentina',
    mood: ['fiaca', 'casa', 'caminar'],
  }
);

const ejercicios = createItems(
  'ejercicio',
  [
    'Sentadillas en casa',
    'Flexiones contra la pared',
    'Plancha corta',
    'Caminata de 20 minutos',
    'Subir y bajar escalones',
    'Estiramiento de espalda',
    'Movilidad de cuello y hombros',
    'Abdominales suaves',
    'Zancadas cortas',
    'Saltitos suaves',
    'Rutina de 10 minutos',
    'Baile libre en casa',
    'Caminar mientras escuchás música',
    'Estiramiento de piernas',
    'Movilidad de cadera',
    'Sentarse y pararse de una silla',
    'Ejercicio con botella de agua',
    'Respiración y movilidad',
    'Rutina sin impacto',
    'Mini circuito familiar',
    'Caminar por la manzana',
    'Activación express al levantarse',
  ],
  {
    type: 'ejercicio',
    category: 'ejercicio',
    description: 'Movimiento simple, sin gimnasio y sin comprar nada.',
    tags: ['ejercicio', 'casa', 'gratis', 'salud'],
    cost: 'bajo',
    location: 'Casa',
    mood: ['moverme', 'fiaca'],
  }
);

const extras = createItems(
  'extra',
  [
    { title: 'Plan pareja: mate y caminata', category: 'pareja', mood: ['pareja'] },
    { title: 'Plan pareja: cocinar juntos', category: 'pareja', mood: ['pareja', 'casa'] },
    { title: 'Plan chicos: búsqueda del tesoro', category: 'chicos', mood: ['chicos'] },
    { title: 'Plan chicos: plaza cercana', category: 'chicos', mood: ['chicos', 'aire'] },
    { title: 'Plan lluvia: película y tortas fritas', category: 'lluvia', mood: ['lluvia'] },
    { title: 'Plan lluvia: juegos de mesa', category: 'lluvia', mood: ['lluvia', 'familia'] },
    { title: 'Plan sin plata: caminar y sacar fotos', category: 'gratis', mood: ['sin-plata'] },
    { title: 'Plan sin plata: mate en plaza', category: 'gratis', mood: ['sin-plata'] },
    { title: 'Plan noche: peli de comedia', category: 'noche', mood: ['noche'] },
    { title: 'Plan noche: música y charla', category: 'noche', mood: ['noche', 'casa'] },
    { title: 'Plan rápido: 30 minutos al aire libre', category: 'planes', mood: ['aire'] },
    { title: 'Plan rápido: merienda casera', category: 'planes', mood: ['casa'] },
    { title: 'Plan visita: recorrer centro', category: 'san-luis', mood: ['visita'] },
    { title: 'Plan visita: Potrero de los Funes', category: 'san-luis', mood: ['visita'] },
    { title: 'Plan fiaca: algo rico y serie corta', category: 'casa', mood: ['fiaca'] },
    { title: 'Plan fiaca: mate y música tranquila', category: 'casa', mood: ['fiaca'] },
    { title: 'Plan amigos: torneo de truco', category: 'challenge', mood: ['amigos'] },
    { title: 'Plan amigos: challenge de cocina', category: 'challenge', mood: ['amigos'] },
    { title: 'Plan familia: cocinar pan casero', category: 'familia', mood: ['familia'] },
    { title: 'Plan familia: ranking de películas', category: 'familia', mood: ['familia'] },
  ],
  {
    type: 'plan',
    category: 'planes',
    description: 'Idea simple para resolver el “no sé qué hacer”.',
    tags: ['plan', 'barato', 'simple'],
    cost: 'bajo',
    location: 'San Luis',
    mood: ['fiaca'],
  }
);

export const SUGGESTIONS = [
  ...recetas,
  ...planesSanLuis,
  ...casa,
  ...challenges,
  ...peliculas,
  ...musica,
  ...ejercicios,
  ...extras,
];

export function getRandomSuggestions({
  category,
  mood,
  cost,
  query,
  limit = 5,
} = {}) {
  const normalizedQuery = normalize(query);

  let pool = SUGGESTIONS.filter((item) => {
    const matchCategory = category ? item.category === category || item.type === category : true;
    const matchMood = mood ? item.mood.includes(mood) || item.tags.includes(mood) : true;
    const matchCost = cost ? item.cost === cost : true;

    const matchQuery = normalizedQuery
      ? normalize(`${item.title} ${item.description} ${item.tags.join(' ')}`).includes(normalizedQuery)
      : true;

    return matchCategory && matchMood && matchCost && matchQuery;
  });

  if (pool.length === 0) {
    pool = SUGGESTIONS;
  }

  return [...pool].sort(() => Math.random() - 0.5).slice(0, limit);
}

export function searchSuggestions(query, limit = 10) {
  const normalizedQuery = normalize(query);

  if (!normalizedQuery) {
    return getRandomSuggestions({ limit });
  }

  return SUGGESTIONS.filter((item) =>
    normalize(`${item.title} ${item.description} ${item.tags.join(' ')}`).includes(normalizedQuery)
  ).slice(0, limit);
}

export function getSuggestionById(id) {
  return SUGGESTIONS.find((item) => item.id === id);
}

export default SUGGESTIONS;
