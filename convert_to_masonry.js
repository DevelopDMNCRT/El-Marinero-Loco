const fs = require('fs');
let content = fs.readFileSync('client/src/App.vue', 'utf8');

// 1. Add break-inside-avoid to all category blocks and banners
// Categories are identified by: <div class="flex items-center gap-3 mb-2 justify-center lg:justify-start">
content = content.replace(
  /<div>\s*(<!-- [a-zA-Z0-9_\s]+ -->\s*)?<div class="flex items-center gap-3 mb-2 justify-center lg:justify-start">/g,
  '<div class="break-inside-avoid mb-8">\n            $1<div class="flex items-center gap-3 mb-2 justify-center lg:justify-start">'
);

// Banners are: <div class="relative w-full h-32 md:h-40 rounded-xl overflow-hidden mt-10 group/banner">
content = content.replace(
  /<div class="relative w-full h-32 md:h-40 rounded-xl overflow-hidden mt-10 group\/banner">/g,
  '<div class="break-inside-avoid relative w-full h-32 md:h-40 rounded-xl overflow-hidden mb-8 group/banner">'
);

// 2. Change grids to columns
content = content.replace(
  '<div class="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-6">',
  '<div class="columns-1 lg:columns-2 gap-x-16 space-y-6">'
);
content = content.replace(
  '<div class="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6 mt-8">',
  '<div class="columns-1 md:columns-2 gap-x-16 space-y-6 mt-8">'
);
content = content.replace(
  '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-8">',
  '<div class="columns-1 md:columns-2 lg:columns-3 gap-x-12 space-y-8">'
);

// 3. Remove column wrappers
// Part 1: Column 1
content = content.replace(
  /<!-- Column 1: Entradas -->\s*<div>/,
  '<!-- Column 1: Entradas -->'
);
// The closing tag for Column 1 is just before Column 2
content = content.replace(
  /<\/div>\s*<!-- Column 2: Cocteles & Especialidades -->/,
  '<!-- Column 2: Cocteles & Especialidades -->'
);

// Column 2
content = content.replace(
  /<!-- Column 2: Cocteles & Especialidades -->\s*<div class="flex flex-col space-y-6">/,
  '<!-- Column 2: Cocteles & Especialidades -->'
);
// The closing tag for Column 2 is just before <!-- ===== SEGUNDA PARTE DE LA CARTA ===== -->
content = content.replace(
  /<\/div>\s*<\/div>\s*<!-- ===== SEGUNDA PARTE DE LA CARTA ===== -->/,
  '</div>\n\n        <!-- ===== SEGUNDA PARTE DE LA CARTA ===== -->'
);

// Part 2: Col 1
content = content.replace(
  /<!-- Col 1 -->\s*<div class="flex flex-col space-y-6">/,
  '<!-- Col 1 -->'
);
content = content.replace(
  /<\/div>\s*<!-- Col 2 -->/,
  '<!-- Col 2 -->'
);

// Col 2
content = content.replace(
  /<!-- Col 2 -->\s*<div class="flex flex-col space-y-6">/,
  '<!-- Col 2 -->'
);
content = content.replace(
  /<\/div>\s*<\/div>\s*<!-- ===== SECCION BEBIDAS ===== -->/,
  '</div>\n\n        <!-- ===== SECCION BEBIDAS ===== -->'
);

// Part 3: Columna 1
content = content.replace(
  /<!-- Columna 1 -->\s*<div class="flex flex-col space-y-6">/,
  '<!-- Columna 1 -->'
);
content = content.replace(
  /<\/div>\s*<!-- Columna 2 -->/,
  '<!-- Columna 2 -->'
);

// Columna 2
content = content.replace(
  /<!-- Columna 2 -->\s*<div class="flex flex-col space-y-6">/,
  '<!-- Columna 2 -->'
);
content = content.replace(
  /<\/div>\s*<!-- Columna 3 -->/,
  '<!-- Columna 3 -->'
);

// Columna 3
content = content.replace(
  /<!-- Columna 3 -->\s*<div class="flex flex-col space-y-6">/,
  '<!-- Columna 3 -->'
);
content = content.replace(
  /<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/template>/,
  '</div>\n      </div>\n    </div>\n  </div>\n</template>'
);

fs.writeFileSync('client/src/App.vue', content);
console.log('Masonry conversion applied successfully.');
