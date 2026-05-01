export const RECETAS = [
  {
    id: 1,
    nombre: "Tortas Fritas",
    categoria: "Merienda",
    dificultad: "Facil",
    tiempo: "20 min",
    costo: 800,
    etiquetas: ["clasica", "barata", "merienda"],
    ingredientes: [
      "500g harina",
      "1 vaso de agua tibia",
      "1 cdita de sal",
      "Grasa para freir"
    ],
    pasos: [
      "Mezclar harina con sal en un bol",
      "Agregar agua tibia de a poco y amasar hasta que no se pegue",
      "Dejar descansar 15 min tapada",
      "Estirar y cortar circulos",
      "Freir en grasa caliente hasta que esten doradas",
      "Escurrir y espolvorear con azucar"
    ],
    tip: "Si tenes grasa de pella quedan mejores que con aceite. El secreto es la grasa bien caliente."
  },
  {
    id: 2,
    nombre: "Locro Criollo",
    categoria: "Plato Principal",
    dificultad: "Media",
    tiempo: "3 horas",
    costo: 3500,
    etiquetas: ["clasica", "familiar", "domingo"],
    ingredientes: [
      "500g maiz blanco pisado",
      "500g porotos pallares",
      "1kg zapallo",
      "2 chorizos criollos",
      "500g carne de cerdo",
      "1 cebolla",
      "Pimenton, comino, sal"
    ],
    pasos: [
      "Remojar maiz y porotos desde la noche anterior",
      "Cocinar maiz y porotos en olla con agua (1 hora)",
      "Agregar zapallo cortado en cubos",
      "Sofreir cebolla con pimenton y agregar",
      "Incorporar carnes y chorizos",
      "Cocinar a fuego bajo 1 hora mas removiendo",
      "Preparar quiquirimuchi: aceite, pimenton, ají"
    ],
    tip: "El quiquirimuchi es clave: aceite caliente con pimenton y ají molido. Se sirve aparte."
  },
  {
    id: 3,
    nombre: "Empanadas Tucas",
    categoria: "Entrada",
    dificultad: "Media",
    tiempo: "1.5 horas",
    costo: 2500,
    etiquetas: ["clasica", "para juntada", "carne"],
    ingredientes: [
      "1kg harina",
      "150g grasa",
      "500g carne cortada a cuchillo",
      "2 cebollas",
      "Comino, pimenton, ají molido, sal",
      "Huevo duro, aceitunas"
    ],
    pasos: [
      "Hacer masa: harina, grasa derretida, agua tibia, sal",
      "Preparar relleno: carne con cebolla, especias",
      "Dejar enfriar relleno, agregar huevo y aceitunas",
      "Estirar masa, cortar discos",
      "Rellenar, cerrar repulgando",
      "Hornear a 200°C por 25 min o freir en grasa"
    ],
    tip: "El repulgue es lo que define la empanada tucumana. 12 pliegues es lo tradicional."
  },
  {
    id: 4,
    nombre: "Humita en Chala",
    categoria: "Entrada",
    dificultad: "Media",
    tiempo: "1.5 horas",
    costo: 1500,
    etiquetas: ["clasica", "maiz", "vegetariana"],
    ingredientes: [
      "6 choclos tiernos",
      "1 cebolla",
      "50g manteca",
      "Queso rallado",
      "Sal, azúcar",
      "Chalas remojadas"
    ],
    pasos: [
      "Rallar los choclos o procesar",
      "Sofreir cebolla en manteca",
      "Agregar choclo rallado, cocinar 15 min",
      "Agregar queso, sal y un toque de azucar",
      "Rellenar chalas, cerrar con tiras",
      "Hervir 40 min o hornear 30 min"
    ],
    tip: "Las chalas se remojan en agua tibia 20 min para que no se rompan."
  },
  {
    id: 5,
    nombre: "Revuelto Gramajo",
    categoria: "Plato Principal",
    dificultad: "Facil",
    tiempo: "15 min",
    costo: 2000,
    etiquetas: ["rapida", "barata", "con amigos"],
    ingredientes: [
      "4 huevos",
      "2 papas medianas",
      "2 chorizos o salchichas",
      "1 cucharada de ketchup",
      "Sal, pimienta",
      "Aceite para freir"
    ],
    pasos: [
      "Cortar papas en bastones y freir hasta dorar",
      "Freir chorizos cortados en rodajas",
      "Batir huevos con sal y pimienta",
      "Revolver todo junto en la sarten",
      "Agregar ketchup al final",
      "Servir caliente"
    ],
    tip: "Clasico de madrugada argentino. Ideal cuando juntaste amigos y todos tienen hambre."
  },
  {
    id: 6,
    nombre: "Mate con algo dulce",
    categoria: "Merienda",
    dificultad: "Facil",
    tiempo: "10 min",
    costo: 500,
    etiquetas: ["clasica", "barata", "diario"],
    ingredientes: [
      "Yerba (50g por persona)",
      "Agua a 80°C",
      "Azucar o edulcorante",
      "Dulce de leche o galletitas"
    ],
    pasos: [
      "Calentar agua sin hervir (80°C)",
      "Llenar mate 3/4 con yerba",
      "Tapar y sacudir para sacar polvo",
      "Inclinar yerba, agregar agua tibia al fondo",
      "Insertar bombilla, completar con agua caliente",
      "Preparar dulce de leche o sacar galletitas"
    ],
    tip: "El mate es ritual argentino. No se apura, se comparte. Si no tenes plata, con mate y galletitas ya comiste."
  },
  {
    id: 7,
    nombre: "Polenta con Tuco",
    categoria: "Plato Principal",
    dificultad: "Facil",
    tiempo: "45 min",
    costo: 1200,
    etiquetas: ["barata", "clasica", "familiar"],
    ingredientes: [
      "500g polenta",
      "1 lata de tomate triturado",
      "1 cebolla",
      "2 dientes de ajo",
      "Aceite, sal, oregano",
      "Queso rallado (opcional)"
    ],
    pasos: [
      "Hervir 2 litros de agua con sal",
      "Agregar polenta en lluvia, revolver",
      "Cocinar 30 min removiendo",
      "Sofreir cebolla y ajo en aceite",
      "Agregar tomate, oregano, sal",
      "Cocinar salsa 15 min",
      "Servir polenta con tuco y queso"
    ],
    tip: "Con $1200 haces polenta para 4 personas. Si sobra, cortala fria y freila al dia siguiente."
  },
  {
    id: 8,
    nombre: "Ensalada de Arroz",
    categoria: "Plato Principal",
    dificultad: "Facil",
    tiempo: "30 min",
    costo: 1000,
    etiquetas: ["barata", "verano", "fresca"],
    ingredientes: [
      "2 tazas de arroz",
      "1 zanahoria",
      "1 morron",
      "Aceitunas",
      "Aceite, limon, sal",
      "Huevo duro (opcional)"
    ],
    pasos: [
      "Cocinar arroz y dejar enfriar",
      "Cortar zanahoria y morron en cubos pequenos",
      "Picar aceitunas",
      "Mezclar todo con el arroz frio",
      "Aliñar con aceite, limon y sal",
      "Agregar huevo duro cortado si tenes"
    ],
    tip: "Ideal para el verano puntano. Se hace con lo que tengas en la heladera."
  },
  {
    id: 9,
    nombre: "Tamales Saltenos",
    categoria: "Entrada",
    dificultad: "Dificil",
    tiempo: "2.5 horas",
    costo: 3000,
    etiquetas: ["clasica", "para juntada", "norte"],
    ingredientes: [
      "1kg harina de maiz",
      "500g carne desmenuzada",
      "2 papas",
      "Chalas",
      "Comino, pimenton, ají",
      "Grasa o manteca"
    ],
    pasos: [
      "Hervir harina de maiz con agua y grasa",
      "Cocinar carne desmenuzada con especias",
      "Cocinar papas, cortar en cubos",
      "Remojar chalas 30 min",
      "Rellenar chalas con masa, carne y papa",
      "Cerrar bien con tiras de chala",
      "Hervir 1 hora en olla grande"
    ],
    tip: "Si tenes sobras de locro o carbonada, usalas de relleno. Es una forma de aprovechar todo."
  },
  {
    id: 10,
    nombre: "Milanesa Napolitana",
    categoria: "Plato Principal",
    dificultad: "Media",
    tiempo: "40 min",
    costo: 2500,
    etiquetas: ["clasica", "familiar", "sabado"],
    ingredientes: [
      "4 milanesas de carne",
      "4 fetas de jamon",
      "4 fetas de queso",
      "Salsa de tomate",
      "Huevo, pan rallado",
      "Aceite para freir"
    ],
    pasos: [
      "Empanar milanesas: huevo y pan rallado",
      "Freir en aceite caliente hasta dorar",
      "Escurrir sobre papel absorbente",
      "Colocar sobre fuente de horno",
      "Poner jamon, salsa y queso arriba",
      "Gratinar en horno fuerte 10 min",
      "Servir con papas fritas o pure"
    ],
    tip: "El clasico del domingo argentino. Con pure de papas queda espectacular."
  },
  {
    id: 11,
    nombre: "Arroz con Leche",
    categoria: "Postre",
    dificultad: "Facil",
    tiempo: "45 min",
    costo: 800,
    etiquetas: ["clasica", "barata", "postre", "dulce"],
    ingredientes: [
      "1 taza de arroz",
      "1 litro de leche",
      "1 taza de azucar",
      "Canela en rama",
      "Cascara de limon",
      "Dulce de leche (opcional)"
    ],
    pasos: [
      "Hervir leche con canela y cascara de limon",
      "Agregar arroz, bajar fuego",
      "Cocinar 30 min removiendo seguido",
      "Agregar azucar",
      "Dejar espesar",
      "Servir frio con canela en polvo o dulce de leche"
    ],
    tip: "Con dulce de leche arriba es otro nivel. Y con $800 haces postre para toda la familia."
  },
  {
    id: 12,
    nombre: "Pizza Casera",
    categoria: "Plato Principal",
    dificultad: "Facil",
    tiempo: "1 hora",
    costo: 1500,
    etiquetas: ["barata", "clasica", "masa"],
    ingredientes: [
      "500g harina",
      "1 sobre de levadura",
      "300ml agua tibia",
      "Salsa de tomate",
      "Queso mozzarella",
      "Aceitunas, morron (opcional)"
    ],
    pasos: [
      "Mezclar harina, levadura, agua tibia, sal",
      "Amasar 10 min, dejar leudar 30 min",
      "Estirar masa en asadera",
      "Agregar salsa, queso y toppings",
      "Hornear a 220°C por 20 min",
      "Listo, pizza casera"
    ],
    tip: "Con $1500 haces 2 pizzas familiares. Mejor que pedir delivery y mas divertido."
  }
];

export function getRecetasByCosto(maxCosto) {
  return RECETAS.filter(r => r.costo <= maxCosto).sort((a, b) => a.costo - b.costo);
}

export function getRecetasByEtiqueta(etiqueta) {
  return RECETAS.filter(r => r.etiquetas.includes(etiqueta));
}

export function getRecetasByCategoria(categoria) {
  return RECETAS.filter(r => r.categoria === categoria);
}
