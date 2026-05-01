const ESTADOS_CLIMA = {
  soleado: { emoji: '☀️', desc: 'Dia soleado', color: 'text-yellow-500' },
  parcialmenteNublado: { emoji: '⛅', desc: 'Parcialmente nublado', color: 'text-gray-500' },
  nublado: { emoji: '☁️', desc: 'Dia nublado', color: 'text-gray-400' },
  llovizna: { emoji: '🌦️', desc: 'Llovizna', color: 'text-blue-400' },
  lluvia: { emoji: '🌧️', desc: 'Lluvia', color: 'text-blue-500' },
  tormenta: { emoji: '⛈️', desc: 'Tormenta', color: 'text-purple-500' },
  fresco: { emoji: '🍂', desc: 'Fresco', color: 'text-orange-400' },
  frio: { emoji: '❄️', desc: 'Frio', color: 'text-blue-300' }
};

function getSeason(month) {
  if (month >= 12 || month <= 2) return 'verano';
  if (month >= 3 && month <= 5) return 'otono';
  if (month >= 6 && month <= 8) return 'invierno';
  return 'primavera';
}

function getBaseTemp(season) {
  switch (season) {
    case 'verano': return { min: 22, max: 38 };
    case 'otono': return { min: 12, max: 28 };
    case 'invierno': return { min: 3, max: 16 };
    case 'primavera': return { min: 14, max: 30 };
  }
}

function generateWeather() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const hour = now.getHours();
  const season = getSeason(month);
  const base = getBaseTemp(season);

  const dayVariation = Math.sin(((hour - 6) / 24) * Math.PI * 2) * 8;
  const randomVar = Math.floor(Math.random() * 6) - 3;
  const temp = Math.round(base.min + (base.max - base.min) * 0.5 + dayVariation + randomVar);

  let estado;
  if (season === 'invierno') {
    if (temp <= 5) estado = 'frio';
    else if (Math.random() > 0.6) estado = 'nublado';
    else if (Math.random() > 0.4) estado = 'llovizna';
    else estado = 'parcialmenteNublado';
  } else if (season === 'verano') {
    if (temp >= 35) estado = 'soleado';
    else if (Math.random() > 0.7) estado = 'tormenta';
    else if (Math.random() > 0.5) estado = 'soleado';
    else estado = 'parcialmenteNublado';
  } else if (season === 'otono' || season === 'primavera') {
    const r = Math.random();
    if (r > 0.6) estado = 'soleado';
    else if (r > 0.4) estado = 'parcialmenteNublado';
    else if (r > 0.2) estado = 'nublado';
    else if (r > 0.1) estado = 'llovizna';
    else estado = 'lluvia';
  }

  const humedad = Math.round(30 + Math.random() * 50);
  const viento = Math.round(5 + Math.random() * 25);

  return {
    temperatura: temp,
    estado,
    ...ESTADOS_CLIMA[estado],
    humedad,
    viento,
    estacion: season,
    hora: hour,
    esBuenClima: temp >= 15 && temp <= 32 && !['lluvia', 'tormenta'].includes(estado),
    esLluvia: ['llovizna', 'lluvia', 'tormenta'].includes(estado),
    esCalor: temp >= 30,
    esFrio: temp <= 12
  };
}

export function getClima() {
  const cached = localStorage.getItem('mcrocante_clima');
  if (cached) {
    const data = JSON.parse(cached);
    const hoursAgo = (Date.now() - data.timestamp) / (1000 * 60 * 60);
    if (hoursAgo < 2) return data.data;
  }

  const clima = generateWeather();
  localStorage.setItem('mcrocante_clima', JSON.stringify({
    data: clima,
    timestamp: Date.now()
  }));
  return clima;
}

export function getWeatherAdvice(clima) {
  const consejos = [];

  if (clima.esLluvia) {
    consejos.push("Esta lloviendo, mejor planes bajo techo. ☔");
    consejos.push("Museos, cafe o talleres son buena opcion.");
  }
  if (clima.esCalor) {
    consejos.push("Hace mucho calor! Busca sombra y lleva agua. ☀️");
    consejos.push("El balneario o lugares con pileta son ideales.");
  }
  if (clima.esFrio) {
    consejos.push("Hace frio, abrigate bien. ❄️");
    consejos.push("Un cafe caliente o un locro te viene bien.");
  }
  if (clima.esBuenClima) {
    consejos.push("El clima esta perfecto para salir. 🌤️");
    consejos.push("Aprovecha para hacer actividades al aire libre.");
  }

  return consejos;
}
