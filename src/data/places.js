export const ZONES = [
  'Capital', 'Juana Koslay', 'La Punta', 'Potrero de los Funes',
  'Villa Mercedes', 'Merlo', 'El Trapiche', 'Norte', 'La Pedrera', 'Centro'
];

export const CATEGORIES = [
  'comida', 'salidas', 'eventos', 'gratis', 'emprendimientos',
  'chicos', 'pareja', 'amigos', 'lluvia', 'aire libre'
];

export const DATA = [
  { id: 1, nombre: "Parque de los Venados", desc: "Parque ideal para caminar, hacer picnic y sacar fotos. Entrada libre, sombra y espacio de sobra.", zona: "Capital", precio: 0, categorias: ["gratis", "aire libre", "chicos", "amigos", "pareja"], tags: ["parque", "gratis", "chicos", "naturaleza", "caminar", "plaza", "familia", "aire libre"] },
  { id: 2, nombre: "Potrero de los Funes", desc: "Lago con vista increible. Caminata, kayak, comer algo rico. Plan de dia completo.", zona: "Potrero de los Funes", precio: 0, categorias: ["gratis", "aire libre", "pareja", "amigos"], tags: ["lago", "gratis", "naturaleza", "caminar", "familia", "aire libre", "outdoor"] },
  { id: 3, nombre: "Feria de La Pedrera", desc: "Artesanias, comida casera y musica en vivo los fines de semana. Ideal para pasear tranqui.", zona: "La Pedrera", precio: 0, categorias: ["gratis", "eventos", "emprendimientos"], tags: ["eventos", "gratis", "comida", "emprendimientos", "feria", "musica", "cultura", "artesania"] },
  { id: 4, nombre: "Pileta Municipal", desc: "Pileta publica con precios accesibles. Abre en verano. Buenisima para los pibes.", zona: "Capital", precio: 1500, categorias: ["chicos", "salidas"], tags: ["chicos", "barato", "verano", "pileta", "familia", "divertido"] },
  { id: 5, nombre: "Empanadas de Dona Rosa", desc: "Las mejores empanadas de la ciudad. Carne cortada a cuchillo, jugosas y baratas.", zona: "Centro", precio: 800, categorias: ["comida"], tags: ["comida", "barato", "empanada", "almuerzo", "cena", "rico"] },
  { id: 6, nombre: "Museo del Fosil", desc: "Museo con fosiles de la zona. Entrada gratis. Ideal para ir con los chicos y aprender.", zona: "Capital", precio: 0, categorias: ["gratis", "chicos", "cultura"], tags: ["chicos", "gratis", "cultura", "familia", "museo", "educativo"] },
  { id: 7, nombre: "Circuito de Parapente", desc: "Vuelo en parapente sobre el valle. Una experiencia unica, sale caro pero vale la pena.", zona: "Merlo", precio: 8000, categorias: ["salidas", "pareja", "amigos"], tags: ["aventura", "naturaleza", "aire libre", "outdoor", "montana"] },
  { id: 8, nombre: "Mercado Norte", desc: "Puesto de comida tipica. Locro, tamales y empanadas a precio de barrio.", zona: "Norte", precio: 1200, categorias: ["comida"], tags: ["comida", "barato", "empanada", "almuerzo", "comida tipica", "rico"] },
  { id: 9, nombre: "Quebrada del Condorito", desc: "Sendero con vista al canon. Lleva agua, protector solar y ganas de caminar.", zona: "Merlo", precio: 0, categorias: ["gratis", "aire libre", "amigos"], tags: ["aire libre", "gratis", "naturaleza", "aventura", "sendero", "caminar", "montana", "outdoor"] },
  { id: 10, nombre: "Teatro del Norte", desc: "Funciones de teatro y danza. Entradas baratas y buen nivel artistico.", zona: "Norte", precio: 2000, categorias: ["eventos", "salidas", "pareja"], tags: ["eventos", "barato", "cultura", "teatro", "noche", "show"] },
  { id: 11, nombre: "Heladeria El Paisano", desc: "Helados artesanales con gustos regionales. Dulce de leche con nuez, un clasico.", zona: "Centro", precio: 1500, categorias: ["comida", "chicos"], tags: ["comida", "barato", "chicos", "helado", "merienda", "rico"] },
  { id: 12, nombre: "Plaza Pringles", desc: "Plaza central con juegos para chicos y ferias los domingos. Punto de encuentro.", zona: "Centro", precio: 0, categorias: ["gratis", "chicos", "eventos"], tags: ["gratis", "chicos", "eventos", "plaza", "familia", "juegos", "feria"] },
  { id: 13, nombre: "Cerveceria San Luis", desc: "Cerveza artesanal con picadas. Buen ambiente, ideal para salir con amigos.", zona: "Centro", precio: 4000, categorias: ["salidas", "amigos"], tags: ["comida", "eventos", "cerveceria", "noche", "bar", "picada", "salir"] },
  { id: 14, nombre: "Reserva de Flora y Fauna", desc: "Caminatas guiadas por senderos naturales. Reserva gratuita, llevar agua.", zona: "Merlo", precio: 0, categorias: ["gratis", "aire libre", "chicos"], tags: ["aire libre", "gratis", "naturaleza", "chicos", "sendero", "caminar", "familia"] },
  { id: 15, nombre: "Taller de Ceramica - Ana Ruiz", desc: "Clases de ceramica artesanal. Emprendimiento local, accesible y re copado.", zona: "Centro", precio: 2500, categorias: ["emprendimientos", "chicos"], tags: ["emprendimientos", "barato", "cultura", "chicos", "artesania", "hecho a mano", "taller"] },
  { id: 16, nombre: "Pena Folclorica El Rancho", desc: "Musica en vivo, empanadas y buen clima. Todos los sabados, entrada barata.", zona: "Norte", precio: 1500, categorias: ["eventos", "comida", "amigos"], tags: ["eventos", "barato", "comida", "cultura", "pena", "musica", "noche", "empanada", "show"] },
  { id: 17, nombre: "Joyeria Artesanal - Luz Piedra", desc: "Accesorios hechos a mano con piedras de la zona. Regalos unicos.", zona: "Centro", precio: 3500, categorias: ["emprendimientos"], tags: ["emprendimientos", "cultura", "artesania", "hecho a mano", "comprar", "producto"] },
  { id: 18, nombre: "Balneario de la Quebrada", desc: "Pileta natural en el rio. Fresco y divertido en verano. Lleva tu mate.", zona: "Merlo", precio: 0, categorias: ["gratis", "aire libre", "chicos", "amigos"], tags: ["aire libre", "gratis", "chicos", "naturaleza", "verano", "rio", "pileta", "divertido", "familia"] },
  { id: 19, nombre: "Cafe del Angel", desc: "Cafe con tortas caseras y wifi. Ideal para laburar o merendar tranqui.", zona: "Centro", precio: 1800, categorias: ["comida"], tags: ["comida", "barato", "cafe", "merienda", "rico"] },
  { id: 20, nombre: "Mirador del Sol", desc: "Vista panoramica de toda la ciudad. Ideal para atardecer, gratis y espectacular.", zona: "Capital", precio: 0, categorias: ["gratis", "aire libre", "pareja"], tags: ["aire libre", "gratis", "naturaleza", "montana", "outdoor", "caminar"] },
  { id: 21, nombre: "Tienda EcoSerrana", desc: "Productos naturales y artesanias sustentables. Emprendimiento puntano.", zona: "Centro", precio: 2000, categorias: ["emprendimientos"], tags: ["emprendimientos", "cultura", "artesania", "natural", "comprar", "producto"] },
  { id: 22, nombre: "Festival de la Montana", desc: "Festival anual con musica, danza y comida tipica. Enero, entrada libre.", zona: "Merlo", precio: 0, categorias: ["eventos", "gratis"], tags: ["eventos", "gratis", "cultura", "comida", "festival", "musica", "comida tipica"] },
  { id: 23, nombre: "Biblioteca Popular", desc: "Talleres de lectura y actividades para chicos. Todo gratis y todo el ano.", zona: "Centro", precio: 0, categorias: ["gratis", "chicos"], tags: ["gratis", "chicos", "cultura", "familia", "educativo", "taller"] },
  { id: 24, nombre: "Parrilla Don Lucho", desc: "Carnes a la parrilla con guarnicion. Porciones generosas, precio justo.", zona: "Norte", precio: 5000, categorias: ["comida", "amigos"], tags: ["comida", "parrilla", "almuerzo", "cena", "rico", "gastronomia"] },
  { id: 25, nombre: "Parque de las Naciones", desc: "El parque mas grande de la ciudad. Ideal para mate, bici y salir a caminar.", zona: "Capital", precio: 0, categorias: ["gratis", "aire libre", "chicos", "amigos", "pareja"], tags: ["parque", "gratis", "chicos", "naturaleza", "caminar", "plaza", "familia", "aire libre"] },
  { id: 26, nombre: "Minas de La Carolina", desc: "Visita a las minas historicas. Entrada accesible, experiencia unica.", zona: "La Carolina", precio: 1000, categorias: ["salidas", "aire libre"], tags: ["gratis", "barato", "naturaleza", "aventura", "cultura", "historia"] },
  { id: 27, nombre: "Dique de Potrerillo", desc: "Paisaje lindo para ir a pasar la tarde. Pesca, caminata, relax.", zona: "Potrero de los Funes", precio: 0, categorias: ["gratis", "aire libre", "pareja"], tags: ["gratis", "naturaleza", "caminar", "familia", "aire libre", "lago"] },
  { id: 28, nombre: "Ruta del Adobe - La Punta", desc: "Recorrido por construcciones de adobe. Cultura y arquitectura puntana.", zona: "La Punta", precio: 0, categorias: ["gratis", "salidas"], tags: ["gratis", "cultura", "historia", "barato"] },
  { id: 29, nombre: "Balde de las Tosquitas", desc: "Aguas termales naturales. Ideal para relajarse. Entrada economica.", zona: "Villa Mercedes", precio: 2000, categorias: ["salidas", "pareja"], tags: ["barato", "naturaleza", "relax", "aire libre"] },
  { id: 30, nombre: "Circuito de mountain bike - Juana Koslay", desc: "Senderos para bici de montana. Varias dificultades, todo gratis.", zona: "Juana Koslay", precio: 0, categorias: ["gratis", "aire libre", "amigos"], tags: ["gratis", "aventura", "naturaleza", "aire libre", "outdoor", "montana"] },
];

export const EMPRENDEDORES = [
  { id: 1, nombre: "Tortas Fritas de La Abuela", rubro: "Comida", zona: "Juana Koslay", etiqueta: "barato", whatsapp: "", instagram: "", desc: "Tortas fritas caseras con grasa de primera. Las venden los fines de semana.", promo: "Docena por $8.000" },
  { id: 2, nombre: "Pulseras Serranas", rubro: "Artesania", zona: "La Punta", etiqueta: "promo", whatsapp: "", instagram: "", desc: "Pulseras tejidas a mano con hilos de colores. Diseños unicos.", promo: "2x$3.500" },
  { id: 3, nombre: "Cafe de Monte", rubro: "Comida", zona: "Merlo", etiqueta: "recomendado", whatsapp: "", instagram: "", desc: "Cafe de especialidad tostado en la sierra. Se vende online y en feria.", promo: "Pack x3 bolsas $6.000" },
  { id: 4, nombre: "Velas de Cera Natural", rubro: "Artesania", zona: "Capital", etiqueta: "barato", whatsapp: "", instagram: "", desc: "Velas artesanales de cera de soja. Aromas naturales.", promo: "" },
  { id: 5, nombre: "Mermeladas de la Sierra", rubro: "Comida", zona: "El Trapiche", etiqueta: "recomendado", whatsapp: "", instagram: "", desc: "Mermeladas artesanales de frutas de la zona. Sin conservantes.", promo: "Pack x3 por $5.500" },
];

export const CROCANTE_DEL_DIA = [
  { titulo: "Mate + plaza + tortas fritas", desc: "Prepara el mate, acercate al Parque de las Naciones y compra tortas fritas a algun emprendimiento de la zona. Plan completo.", zona: "Capital / Juana Koslay" },
  { titulo: "Caminata al Mirador del Sol", desc: "Subi tranqui al atardecer, llevalo un termo y disfruta la vista de toda la ciudad. Hermoso.", zona: "Capital" },
  { titulo: "Feria de La Pedrera + empanadas", desc: "Sabado de feria, recorre los puestos, compra algo artesanal y cena empanadas por ahi.", zona: "La Pedrera" },
  { titulo: "Potrero de dia completo", desc: "Lago, caminata, picnic. Llevate algo rico para comer y pasa el dia afuera.", zona: "Potrero de los Funes" },
  { titulo: "Balneario + mate en el rio", desc: "Pileta natural en el rio. Fresco, divertido. Ideal para el verano.", zona: "Merlo" },
  { titulo: "Circuito en bici por Juana Koslay", desc: "Senderos para mountain bike, varios niveles. Todo con paisaje.", zona: "Juana Koslay" },
  { titulo: "Pena folclorica El Rancho", desc: "Sabado de musica en vivo, empanadas y buen clima. Ambiente re copado.", zona: "Norte" },
];
