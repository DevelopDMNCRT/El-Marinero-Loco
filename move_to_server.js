const fs = require('fs');

// 1. Read the server's menu.json
const serverFile = '/Users/yaywiin/Desktop/DEVELOP/el-marinero-loco/server/src/data/menu.json';
let serverData = {};
try {
  serverData = JSON.parse(fs.readFileSync(serverFile, 'utf8'));
} catch (e) {
  console.log('No existing menu.json found or error reading it.');
}

// 2. Define the new categories (hardcoded)
const newCategories = {
  torres: { title: 'Torres', items: [
    { nombre: 'Torre Coral', precio: 260 },
    { nombre: 'Torre Isla', precio: 280 }
  ]},
  camarones: { title: 'Camarones', items: [
    { nombre: 'Camarones ½ Diabla', precio: 205 },
    { nombre: 'Camarones 4 Quesos', precio: 250 },
    { nombre: 'Camarones a la Diabla', precio: 205 },
    { nombre: 'Camarones a la Oliva', precio: 250 },
    { nombre: 'Camarones al Ajillo', precio: 205 },
    { nombre: 'Camarones al Cocolizo', precio: 250 },
    { nombre: 'Camarones al Gusto', precio: 205 },
    { nombre: 'Camarones al Marinero', precio: 250 },
    { nombre: 'Camarones al Popeye', precio: 250 },
    { nombre: 'Camarones al Zamorano', precio: 250 },
    { nombre: 'Camarones Empanizados', precio: 205 },
    { nombre: 'Camarones Mantequilla', precio: 205 },
    { nombre: 'Camarones Zarandeados', precio: 250 }
  ]},
  caldos: { title: 'Caldos', items: [
    { nombre: 'Caldo de Camarón y Pulpo', precio: 225 },
    { nombre: 'Caldo de Bagre', precio: 190 },
    { nombre: 'Caldo de Camarón', precio: 205 },
    { nombre: 'Caldo de Mariscos', precio: 250 },
    { nombre: 'Caldo de Rana', precio: 205 }
  ]},
  filetes: { title: 'Filetes', items: [
    { nombre: 'Filete a la Diabla', precio: 185 },
    { nombre: 'Filete a la Mantequilla', precio: 185 },
    { nombre: 'Filete al Ajillo', precio: 185 },
    { nombre: 'Filete Empanizado', precio: 185 },
    { nombre: 'Filete Empapelado', precio: 240 },
    { nombre: 'Filete de Pescado al Gusto', precio: 185 },
    { nombre: 'Filete Zarandeado', precio: 205 },
    { nombre: 'Filete de Pollo Zarandeado', precio: 205 },
    { nombre: 'Filete de Pollo a la Plancha', precio: 185 },
    { nombre: 'Filete de Pollo Empanizado', precio: 185 }
  ]},
  tostadas: { title: 'Tostadas', items: [
    { nombre: 'Aguachile Chiltepin', precio: 85 },
    { nombre: 'Aguachile Verde, Negro y Rojo', precio: 75 },
    { nombre: 'Ceviche de Camarón', precio: 60 },
    { nombre: 'Ceviche de Pescado', precio: 40 },
    { nombre: 'Camarón Cocido', precio: 75 },
    { nombre: 'Marlin', precio: 45 },
    { nombre: 'Huevera', precio: 35 },
    { nombre: 'Pulpo', precio: 85 },
    { nombre: 'Pulpo a la Diabla', precio: 95 }
  ]},
  cortes: { title: 'Cortes', items: [
    { nombre: 'Corte Arrachera', precio: 235 },
    { nombre: 'Corte New York', precio: 275 },
    { nombre: 'Corte Picaña', precio: 295 },
    { nombre: 'Corte Rib Eye', precio: 305 },
    { nombre: 'Corte T-Bone', precio: 265 },
    { nombre: 'Corte Tomahawk 1.200 K', precio: 950 }
  ]},
  marineritos: { title: 'Marineritos', items: [
    { nombre: 'Camarón Empanizado Niño', precio: 115 },
    { nombre: 'Dedos de Queso', precio: 115 },
    { nombre: 'Filete Empanizado Niño', precio: 115 },
    { nombre: 'Hamburguesa con Papas', precio: 115 },
    { nombre: 'Nuggets con Papas', precio: 115 }
  ]},
  cerveza: { title: 'Cerveza', items: [
    { nombre: 'Bohemia Ambar', precio: 38 },
    { nombre: 'Bohemia Clara', precio: 38 },
    { nombre: 'Caguama', precio: 90 },
    { nombre: 'Chelada', precio: 55 },
    { nombre: 'Clamato Preparado', precio: 40 },
    { nombre: 'Corona Clara', precio: 35 },
    { nombre: 'Corona Oscura', precio: 35 },
    { nombre: 'Cubana', precio: 55 },
    { nombre: 'Cubeta Corona 10 Pzas', precio: 350 },
    { nombre: 'Cubeta Coronita 10 Pzas', precio: 250 },
    { nombre: 'Cubeta Modelo Especial', precio: 450 },
    { nombre: 'Cubeta Negra Modelo', precio: 450 },
    { nombre: 'Cubeta Ultra', precio: 450 },
    { nombre: 'Indio', precio: 30 },
    { nombre: 'Michelada', precio: 65 },
    { nombre: 'Modelo Negra', precio: 45 },
    { nombre: 'Modelo Ultra', precio: 45 },
    { nombre: 'Pacifico', precio: 35 },
    { nombre: 'Tecate Light', precio: 30 },
    { nombre: 'Tecate XX Ambar', precio: 30 },
    { nombre: 'Tecate XX Lager', precio: 30 },
    { nombre: 'Victoria', precio: 35 }
  ]},
  refrescos: { title: 'Refrescos', items: [
    { nombre: 'Boost', precio: 50 },
    { nombre: 'Coca Cola Lata', precio: 35 },
    { nombre: 'Coca Cola Light Lata', precio: 35 },
    { nombre: 'Coca Cola Vidrio', precio: 28 },
    { nombre: 'Coca Cola Zero Lata', precio: 35 },
    { nombre: 'Fanta Vidrio', precio: 28 },
    { nombre: 'Red Bull', precio: 70 },
    { nombre: 'Sidral Vidrio', precio: 28 },
    { nombre: 'Sprite Vidrio', precio: 28 },
    { nombre: 'Squirt', precio: 28 },
    { nombre: 'Zuba', precio: 28 }
  ]},
  sinalcohol: { title: 'Sin Alcohol', items: [
    { nombre: 'Canica', precio: 50 },
    { nombre: 'Conga', precio: 60 },
    { nombre: 'Pantera Rosa', precio: 60 },
    { nombre: 'Piñada', precio: 60 }
  ]},
  mezcales: { title: 'Mezcales', items: [
    { nombre: 'Botella 400 Conejos', precio: 950 },
    { nombre: 'Botella Union', precio: 950 },
    { nombre: 'Copa 400 Conejos', precio: 85 },
    { nombre: 'Copa Union', precio: 85 }
  ]},
  ron: { title: 'Ron', items: [
    { nombre: 'Botella Bacardi Añejo', precio: 850 },
    { nombre: 'Botella Bacardi Blanco', precio: 700 },
    { nombre: 'Botella Bacardi Zacapa', precio: 1600 },
    { nombre: 'Copa Barcadi Añejo', precio: 80 },
    { nombre: 'Copa Bacardi Blanco', precio: 60 },
    { nombre: 'Copa Bacardi Zacapa', precio: 140 }
  ]},
  brandy: { title: 'Brandy', items: [
    { nombre: 'Botella Torres 10', precio: 950 },
    { nombre: 'Botella Torres 20', precio: 1600 },
    { nombre: 'Botella Torres 5', precio: 700 },
    { nombre: 'Copa Torres 10', precio: 90 },
    { nombre: 'Copa Torres 20', precio: 140 },
    { nombre: 'Copa Torres 5', precio: 65 }
  ]},
  bebidas: { title: 'Bebidas', items: [
    { nombre: 'Agua Horchata Jarra', precio: 110 },
    { nombre: 'Agua Horchata Vaso', precio: 40 },
    { nombre: 'Agua Jamaica Jarra', precio: 110 },
    { nombre: 'Agua Jamaica Vaso', precio: 40 },
    { nombre: 'Agua Natural Botella', precio: 20 },
    { nombre: 'Agua Tamarindo Jarra', precio: 110 },
    { nombre: 'Agua Tamarindo Vaso', precio: 40 },
    { nombre: 'Limonada Jarra', precio: 120 },
    { nombre: 'Limonada Vaso', precio: 50 },
    { nombre: 'Limonada Natural Jarra', precio: 110 },
    { nombre: 'Limonada Natural Vaso', precio: 40 },
    { nombre: 'Naranjada Jarra', precio: 120 },
    { nombre: 'Naranjada Vaso', precio: 50 },
    { nombre: 'Naranjada Natural Jarra', precio: 110 },
    { nombre: 'Naranjada Natural Vaso', precio: 40 },
    { nombre: 'Naranjada Maracuya Jarra', precio: 145 },
    { nombre: 'Naranjada Maracuya Litro', precio: 95 },
    { nombre: 'Naranjada Maracuya Vaso', precio: 65 },
    { nombre: 'Limonada Frutos Rojos Jarra', precio: 145 },
    { nombre: 'Limonada Frutos Rojos Litro', precio: 95 },
    { nombre: 'Limonada Frutos Rojos Vaso', precio: 65 }
  ]},
  tequilas: { title: 'Tequilas', items: [
    { nombre: 'Botella 1800 Bco', precio: 1150 },
    { nombre: 'Botella 1800 Cristalino', precio: 1450 },
    { nombre: 'Botella 1800 Reposado', precio: 1200 },
    { nombre: 'Botella 7 Leguas Blanco', precio: 1250 },
    { nombre: 'Botella Centenario Añejo', precio: 1250 },
    { nombre: 'Botella Centenario Plata', precio: 950 },
    { nombre: 'Botella Centenario Reposado', precio: 950 },
    { nombre: 'Botella Don Julio 70', precio: 1650 },
    { nombre: 'Botella Don Julio Blanco', precio: 1250 },
    { nombre: 'Botella Dos Oros', precio: 950 },
    { nombre: 'Botella Herradura Ultra', precio: 1600 },
    { nombre: 'Botella Maestro Dobel', precio: 1450 },
    { nombre: 'Botella San Matias Cristalino', precio: 1250 },
    { nombre: 'Copa 1800 Bco', precio: 110 },
    { nombre: 'Copa 1800 Cristalino', precio: 145 },
    { nombre: 'Copa 1800 Reposado', precio: 115 },
    { nombre: 'Copa 7 Leguas Blanco', precio: 125 },
    { nombre: 'Copa Centenario Plata', precio: 95 },
    { nombre: 'Copa Centenario Añejo', precio: 125 },
    { nombre: 'Copa Centenario Reposado', precio: 95 },
    { nombre: 'Copa Don Julio 70', precio: 165 },
    { nombre: 'Copa Don Julio Blanco', precio: 125 },
    { nombre: 'Copa Dos Oros', precio: 90 },
    { nombre: 'Copa Herradura Ultra', precio: 160 },
    { nombre: 'Copa Maestro Dobel', precio: 150 },
    { nombre: 'Copa San Matias Cristalino', precio: 90 }
  ]},
  whisky: { title: 'Whisky', items: [
    { nombre: 'Botella Old Parr', precio: 1450 },
    { nombre: 'Botella Black Label', precio: 1550 },
    { nombre: 'Botella Buchanans 12', precio: 1350 },
    { nombre: 'Botella Buchanans 18', precio: 2650 },
    { nombre: 'Botella Martel VSOP', precio: 1750 },
    { nombre: 'Botella Red Label', precio: 950 },
    { nombre: 'Botella Remmy Marti VSOP', precio: 1600 },
    { nombre: 'Copa Black Label', precio: 155 },
    { nombre: 'Copa Buchanans 12', precio: 135 },
    { nombre: 'Copa Buchanans 18', precio: 260 },
    { nombre: 'Copa Martel VSOP', precio: 170 },
    { nombre: 'Copa Red Label', precio: 90 },
    { nombre: 'Copa Remmy Marti VSOP', precio: 140 }
  ]},
  vodka: { title: 'Vodka', items: [
    { nombre: 'Botella Absolute Azul', precio: 850 },
    { nombre: 'Botella Smirnoff', precio: 750 },
    { nombre: 'Botella Smirnoff Tamarindo', precio: 750 },
    { nombre: 'Copa Absolute Azul', precio: 80 },
    { nombre: 'Copa Smirnoff', precio: 60 },
    { nombre: 'Copa Smirnoff Tamarindo', precio: 60 }
  ]},
  vinos: { title: 'Vinos', items: [
    { nombre: 'Botella Lambrusco Blanco', precio: 500 },
    { nombre: 'Botella Lambrusco Rosa', precio: 500 },
    { nombre: 'Botella Lambrusco Tinto', precio: 500 },
    { nombre: 'Botella Tinto Las Moras', precio: 550 },
    { nombre: 'Copa Lambrusco Blanco', precio: 95 },
    { nombre: 'Copa Lambrusco Rosa', precio: 95 },
    { nombre: 'Copa Lambrusco Tinto', precio: 95 },
    { nombre: 'Copa Tinto Las Moras', precio: 120 }
  ]},
  cocteleria: { title: 'Cocteleria', items: [
    { nombre: 'Dragon Loco', precio: 130 },
    { nombre: 'Margarita al Gusto', variacion: 'Limon, Mango, Maracuya, Tamarindo', precio: 85 },
    { nombre: 'Margarita Frutos Rojos', precio: 95 },
    { nombre: 'Mojito al Gusto', variacion: 'Clasico, Fresa, Maracuya', precio: 85 },
    { nombre: 'Mojito Frutos Rojos', precio: 95 },
    { nombre: 'Embrocada', precio: 105 },
    { nombre: 'Medias de Seda', precio: 95 },
    { nombre: 'Mezcalita al Gusto', variacion: 'Limon, Mango, Maracuya, Tamarindo', precio: 85 },
    { nombre: 'Mezcalita Frutos', precio: 95 },
    { nombre: 'Oso Blanco', precio: 85 },
    { nombre: 'Paloma', precio: 85 },
    { nombre: 'Piña Colada', precio: 85 },
    { nombre: 'Piñada', precio: 75 },
    { nombre: 'Gin Tonic Maracuya', precio: 90 },
    { nombre: 'Clericot', precio: 160 },
    { nombre: 'Cazuela Doble Shot', precio: 95 },
    { nombre: 'Carajillo', precio: 95 },
    { nombre: 'Aiduky', precio: 95 }
  ]},
  postres: { title: 'Postres', items: [
    { nombre: 'Helado Capuchino', precio: 65 },
    { nombre: 'Helado Choco Chips', precio: 65 },
    { nombre: 'Helado Chocolate', precio: 65 },
    { nombre: 'Helado Elote', precio: 65 },
    { nombre: 'Helado Frutos Rojos', precio: 65 },
    { nombre: 'Helado Galleta', precio: 65 },
    { nombre: "Helado M&M's", precio: 65 },
    { nombre: 'Helado Mazapan', precio: 65 },
    { nombre: 'Helado Nuez', precio: 65 },
    { nombre: 'Helado Nutella', precio: 65 },
    { nombre: 'Helado Pie de Limon', precio: 65 },
    { nombre: 'Flan', precio: 65 }
  ]}
};

// 3. Merge them
Object.keys(newCategories).forEach(cat => {
  serverData[cat] = newCategories[cat];
});

// 4. Save back to menu.json
fs.writeFileSync(serverFile, JSON.stringify(serverData, null, 2));

console.log('Merged into menu.json successfully');

// 5. Clean up App.vue
const appFile = '/Users/yaywiin/Desktop/DEVELOP/el-marinero-loco/client/src/App.vue';
let appContent = fs.readFileSync(appFile, 'utf8');

// Replace the API constant to be dynamic!
appContent = appContent.replace(
  "const API = 'http://localhost:3000'",
  "const API = `http://${window.location.hostname}:3000`"
);

// We should replace the massive hardcoded menuData with a version that only has empty arrays
const cleanedData = {
  entradas: { title: 'Entradas', items: [] },
  cocteles: { title: 'Cocteles', items: [] },
  especialidades: { title: 'Especialidades', items: [] }
};
Object.keys(newCategories).forEach(cat => {
  cleanedData[cat] = { title: newCategories[cat].title, items: [] };
});

const cleanedDataStr = "const menuData = ref(" + JSON.stringify(cleanedData, null, 2).replace(/"/g, "'") + ")";

// Replace the massive object in App.vue
// We will use regex to capture the whole const menuData = ref({ ... }) block
// because it spans many lines.
const regex = /const menuData = ref\(\{[\s\S]*?\}\)\nconst menuLoading/;
appContent = appContent.replace(regex, cleanedDataStr + "\nconst menuLoading");

fs.writeFileSync(appFile, appContent);
console.log('Cleaned App.vue successfully');
