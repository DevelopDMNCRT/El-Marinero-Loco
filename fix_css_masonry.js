const fs = require('fs');
const file = '/Users/yaywiin/Desktop/DEVELOP/el-marinero-loco/client/src/App.vue';
let content = fs.readFileSync(file, 'utf8');

// 1. Wrap the food grids
// 395:        <div class="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-6">
content = content.replace('<div class="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-6">', 
  '<div class="menu-masonry-wrapper columns-1 lg:columns-2 gap-x-16 w-full">\n        <div class="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-6">');

// Close the food wrapper before SECCION BEBIDAS
content = content.replace('<!-- ===== SECCION BEBIDAS ===== -->', 
  '</div>\n\n        <!-- ===== SECCION BEBIDAS ===== -->');

// 2. Wrap the bebidas grids
// 983:        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-8">
content = content.replace('<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-8">', 
  '<div class="menu-masonry-wrapper columns-1 md:columns-2 lg:columns-3 gap-x-12 w-full">\n        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-8">');

// Close the bebidas wrapper before the section ends
//       </div>
//     </section>
content = content.replace('      </div>\n    </section>', 
  '      </div>\n        </div>\n    </section>');

// 3. Add the CSS at the bottom of the file
const css = `
<style scoped>
@media (min-width: 1024px) {
  .menu-masonry-wrapper > .grid {
    display: contents;
  }
  .menu-masonry-wrapper > .grid > .flex-col {
    display: contents;
  }
  .menu-masonry-wrapper .grid > div,
  .menu-masonry-wrapper .flex-col > div {
    break-inside: avoid-column;
    display: inline-block;
    width: 100%;
    margin-bottom: 2rem;
  }
}
</style>
`;
content += css;

fs.writeFileSync(file, content);
console.log("Safe CSS Masonry applied.");
