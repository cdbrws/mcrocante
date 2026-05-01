export const LOCALIDADES_SL = {
  capital: {
    nombre: "San Luis Capital",
    barrios: ["Centro", "La Dormida", "Chacras", "El Chorrillo", "San Jeronimo", "La Estacion", "Villa Estela", "Los Molles", "Barrio Norte", "Barrio Sur", "Las Acacias", "San Martin", "Cortaderas", "La Florida", "Puerto de Palos"],
    zona: "urbana",
    lat: -33.2968,
    lon: -66.3367
  },
  juana_koslay: {
    nombre: "Juana Koslay",
    barrios: ["Centro", "La Cuesta", "El Volcan", "Potrerillo"],
    zona: "suburbana",
    lat: -33.3667,
    lon: -66.3167
  },
  la_punta: {
    nombre: "La Punta",
    barrios: ["Centro", "La Cuesta", "Balde"],
    zona: "suburbana",
    lat: -33.3500,
    lon: -66.3167
  },
  potrero_funes: {
    nombre: "Potrero de los Funes",
    barrios: ["Villa del Lago", "La Escondida", "El Morro"],
    zona: "turistica",
    lat: -33.1333,
    lon: -66.2333
  },
  merlo: {
    nombre: "Merlo",
    barrios: ["Centro", "Inti Huasi", "Candelaria", "Talita", "El Transito", "Cortaderas"],
    zona: "sierras",
    lat: -32.2667,
    lon: -65.0167
  },
  villa_mercedes: {
    nombre: "Villa Mercedes",
    barrios: ["Centro", "La Pedrera", "Los Comechingones", "Sarmiento", "Alberdi"],
    zona: "urbana",
    lat: -33.6762,
    lon: -65.4587
  },
  el_trapiche: {
    nombre: "El Trapiche",
    barrios: ["Dique", "Costa"],
    zona: "turistica",
    lat: -33.1167,
    lon: -66.0500
  },
  la_pedrera: {
    nombre: "La Pedrera",
    barrios: ["Feria", "Dique"],
    zona: "suburbana",
    lat: -33.2167,
    lon: -66.2833
  },
  la_carolina: {
    nombre: "La Carolina",
    barrios: ["Minas", "Pueblo"],
    zona: "sierras",
    lat: -33.1500,
    lon: -66.5667
  },
  quines: {
    nombre: "Quines",
    barrios: ["Centro", "Balde"],
    zona: "rural",
    lat: -32.3667,
    lon: -65.3667
  },
  naschel: {
    nombre: "Naschel",
    barrios: ["Centro", "La Huerta"],
    zona: "rural",
    lat: -32.1833,
    lon: -65.4000
  },
  justiniano_posse: {
    nombre: "Justiniano Posse",
    barrios: ["Centro"],
    zona: "rural",
    lat: -32.8833,
    lon: -65.2167
  }
};

export const PROVINCIAS_CERCANAS = [
  { nombre: "Cordoba", distancia_km: 420 },
  { nombre: "Mendoza", distancia_km: 350 },
  { nombre: "San Juan", distancia_km: 280 },
  { nombre: "La Rioja", distancia_km: 310 },
  { nombre: "Catamarca", distancia_km: 500 }
];

export function getLocalidadByCoords(lat, lon) {
  let closest = null;
  let minDist = Infinity;

  for (const [key, loc] of Object.entries(LOCALIDADES_SL)) {
    const dist = Math.sqrt(Math.pow(lat - loc.lat, 2) + Math.pow(lon - loc.lon, 2));
    if (dist < minDist) {
      minDist = dist;
      closest = { key, ...loc };
    }
  }

  return closest;
}
